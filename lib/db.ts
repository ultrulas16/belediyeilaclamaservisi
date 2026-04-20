import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Standart istemci (Ziyaretçiler için - RLS'ye takılır)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Admin istemcisi (Sadece Server tarafında çalışır - RLS'yi baypas eder)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export interface Lead {
  id: string;
  name: string;
  phone: string;
  service: string;
  location: string;
  message: string;
  date: string;
  status: 'Yeni' | 'Beklemede' | 'Arayacak' | 'Tamamlandı' | 'Acil';
}

export interface Visit {
  id: number;
  ip: string;
  referer: string;
  path: string;
  user_agent: string;
  created_at: string;
}

export interface VisitStats {
  totalVisits: number;
  uniqueIPs: number;
  googleReferrals: number;
  pageViews: { path: string, count: number }[];
  recentVisits: Visit[];
}

export interface ChatRoom {
  id: string;
  visitor_id: string;
  visitor_name?: string;
  visitor_phone?: string;
  last_message: string;
  updated_at: string;
  created_at: string;
}

export interface Message {
  id: number;
  room_id: string;
  content: string;
  sender: 'visitor' | 'admin';
  created_at: string;
}

export async function getLeads(): Promise<Lead[]> {
  if (!supabaseAdmin) {
    console.error('Admin Supabase client is not initialized. Check your SUPABASE_SERVICE_ROLE_KEY.');
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getLeads:', error);
    return [];
  }
}

export async function addLead(lead: Omit<Lead, 'id' | 'date' | 'status'>): Promise<Lead | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          ...lead,
          status: 'Yeni'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding lead:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addLead:', error);
    return null;
  }
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating lead status:', error);
    }
  } catch (error) {
    console.error('Error in updateLeadStatus:', error);
  }
}

export async function logVisit(visit: Omit<Visit, 'id' | 'created_at'>): Promise<void> {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('visits')
      .insert([visit]);

    if (error) {
      console.error('Error logging visit:', error);
    }
  } catch (error) {
    console.error('Error in logVisit:', error);
  }
}

export async function getVisitStats(): Promise<VisitStats | null> {
  if (!supabaseAdmin) return null;

  try {
    // Toplam ziyaretler
    const { count: totalVisits, error: totalError } = await supabaseAdmin
      .from('visits')
      .select('*', { count: 'exact', head: true });

    // Tekil IPler
    const { data: uniqueData, error: uniqueError } = await supabaseAdmin
      .from('visits')
      .select('ip');
    
    const uniqueIPs = new Set(uniqueData?.map(v => v.ip)).size;

    // Google referansları
    const { count: googleReferrals, error: googleError } = await supabaseAdmin
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .ilike('referer', '%google%');

    // Sayfa görüntüleme dağılımı
    const { data: pathData, error: pathError } = await supabaseAdmin
      .from('visits')
      .select('path');
    
    const pathCounts: Record<string, number> = {};
    pathData?.forEach(v => {
      pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;
    });
    
    const pageViews = Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);

    // Son ziyaretler
    const { data: recentVisits, error: recentError } = await supabaseAdmin
      .from('visits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (totalError || uniqueError || googleError || pathError || recentError) {
      console.error('Error fetching visit stats:', { 
        total: totalError?.message, 
        unique: uniqueError?.message, 
        google: googleError?.message, 
        path: pathError?.message, 
        recent: recentError?.message 
      });
      return {
        totalVisits: 0,
        uniqueIPs: 0,
        googleReferrals: 0,
        pageViews: [],
        recentVisits: []
      };
    }

    return {
      totalVisits: totalVisits || 0,
      uniqueIPs,
      googleReferrals: googleReferrals || 0,
      pageViews,
      recentVisits: (recentVisits as any) || []
    };
  } catch (error) {
    console.error('Error in getVisitStats:', error);
    return null;
  }
}

// CHAT FUNCTIONS
export async function getOrCreateChatRoom(visitorId: string, name?: string, phone?: string): Promise<ChatRoom | null> {
  if (!supabaseAdmin) return null;

  try {
    // Önce odayı ara
    const { data: existingRoom, error: fetchError } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .eq('visitor_id', visitorId)
      .single();

    if (existingRoom) {
      // Eğer isim/telefon değiştiyse veya yeni girildiyse odayı güncelle
      if (name || phone) {
        const { data: updated } = await supabaseAdmin
          .from('chat_sessions')
          .update({ 
            visitor_name: name || existingRoom.visitor_name, 
            visitor_phone: phone || existingRoom.visitor_phone 
          })
          .eq('id', existingRoom.id)
          .select()
          .single();
        return updated;
      }
      return existingRoom;
    }

    // Yoksa oluştur
    const { data: newRoom, error: createError } = await supabaseAdmin
      .from('chat_sessions')
      .insert([{ 
        visitor_id: visitorId, 
        visitor_name: name || 'Anonim',
        visitor_phone: phone || 'Belirtilmedi',
        last_message: 'Sohbet Başlatıldı' 
      }])
      .select()
      .single();

    if (createError) {
      console.error('Error creating chat room:', createError.message);
      return null;
    }

    return newRoom;
  } catch (error) {
    console.error('Error in getOrCreateChatRoom:', error);
    return null;
  }
}

export async function sendMessage(roomId: string, content: string, sender: 'visitor' | 'admin'): Promise<Message | null> {
  if (!supabaseAdmin) return null;

  try {
    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .insert([{ room_id: roomId, content, sender }])
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    // Odayı güncelle (last_message ve updated_at)
    await supabaseAdmin
      .from('chat_sessions')
      .update({ last_message: content, updated_at: new Date().toISOString() })
      .eq('id', roomId);

    return message;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return null;
  }
}

export async function getChatMessages(roomId: string): Promise<Message[]> {
  if (!supabaseAdmin) return [];

  try {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getChatMessages:', error);
    return [];
  }
}

export async function getActiveChatRooms(): Promise<ChatRoom[]> {
  if (!supabaseAdmin) return [];

  try {
    const { data, error } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat rooms:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getActiveChatRooms:', error);
    return [];
  }
}


