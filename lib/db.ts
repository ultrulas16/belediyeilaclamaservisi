import { createClient } from '@supabase/supabase-js';
import { notifyAdmin } from '@/lib/notifications';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client only if URL and Key are provided to prevent build errors
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const supabaseAdmin = supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
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

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'admin';
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface AnalyticEvent {
  id: string;
  ip: string;
  path: string;
  referrer: string;
  user_agent: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  session_id: string;
  full_name: string;
  phone: string;
  created_at: string;
}

export async function getLeads(): Promise<Lead[]> {
  if (!supabase) {
    console.warn('Supabase client is not initialized. Using mock data.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      ...item,
      id: item.id.toString(), // Ensure ID is string for consistency
    }));
  } catch (error) {
    console.error('Error in getLeads:', error);
    return [];
  }
}

export async function addLead(lead: Omit<Lead, 'id' | 'date' | 'status' | 'location'>): Promise<Lead | null> {
  if (!supabase) {
    console.error('Supabase client missing.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          ...lead,
          location: 'Bursa Portal', // Default source
          status: 'Yeni',
          date: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding lead:', error);
      return null;
    }

    // Notify Admin (Non-blocking)
    try {
      notifyAdmin(`<b>🚨 YENİ BAŞVURU!</b>\n\n📌 İsim: ${lead.name}\n📞 Tel: ${lead.phone}\n🛠 Hizmet: ${lead.service}\n💬 Mesaj: ${lead.message}`);
    } catch (e) {
      console.error('Notification error:', e);
    }

    return data;
  } catch (error) {
    console.error('Error in addLead:', error);
    return null;
  }
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating lead status:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in updateLeadStatus:', error);
    return false;
  }
}

export async function deleteLead(id: string): Promise<boolean> {
    if (!supabase) return false;
    
    try {
        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', id);
            
        if (error) {
            console.error('Error deleting lead:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error in deleteLead:', error);
        return false;
    }
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
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

export async function sendMessage(message: Omit<ChatMessage, 'id' | 'created_at' | 'is_read'>): Promise<ChatMessage | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          ...message,
          is_read: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error.message, error.code);
      return null;
    }

    // Notify Admin if it's from user (Non-blocking)
    if (message.sender === 'user' && !message.content.includes('[SİSTEM]')) {
      try {
        notifyAdmin(`<b>💬 YENİ MESAJ!</b>\n\n🆔 Oturum: #${message.session_id.substring(0, 4)}\n✉️ Mesaj: ${message.content}`);
      } catch (e) {
        console.error('Notification error:', e);
      }
    }

    return data;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return null;
  }
}

// Geriye dönük uyumluluk için takma isimler (Alias)
export const sendChatMessage = sendMessage;

export async function getOrCreateChatRoom(session_id: string, full_name?: string, phone?: string): Promise<ChatSession | null> {
  if (!supabase) return null;

  try {
    // Önce odayı arayalım
    const { data: existingRoom } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_id', session_id)
      .single();

    if (existingRoom) return existingRoom;

    // Eğer yoksa ve isim/tel geldiyse oluşturalım (Lead Capture)
    if (full_name && phone) {
      const { data: newRoom, error } = await supabase
        .from('chat_sessions')
        .insert([
          {
            session_id,
            full_name,
            phone,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return newRoom;
    }
    
    return null;
  } catch (error) {
    console.error('Error in getOrCreateChatRoom:', error);
    return null;
  }
}

export async function upsertChatSession(session: Omit<ChatSession, 'id' | 'created_at'>): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('chat_sessions')
      .upsert([
        {
          ...session,
          created_at: new Date().toISOString()
        }
      ], { onConflict: 'session_id' });

    if (error) {
      console.error('Error upserting chat session:', error);
      return false;
    }

    // Notify Admin of new connection (Non-blocking)
    try {
      notifyAdmin(`<b>⚡ YENİ CANLI DESTEK BAĞLANTISI!</b>\n\n👤 İsim: ${session.full_name}\n📞 Tel: ${session.phone}\n🆔 ID: #${session.session_id.substring(0, 4)}`);
    } catch (e) {
      console.error('Notification error:', e);
    }

    return true;
  } catch (error) {
    console.error('Error in upsertChatSession:', error);
    return false;
  }
}

export async function getActiveChatRooms(): Promise<{ session_id: string, last_message: string, created_at: string, user?: ChatSession }[]> {
    if (!supabase) return [];
    
    try {
        // Fetch sessions first
        const { data: messages, error: mError } = await supabase
            .from('messages')
            .select('session_id, content, created_at')
            .order('created_at', { ascending: false });
            
        if (mError) return [];

        // Fetch user metadata
        const { data: userData, error: uError } = await supabase
            .from('chat_sessions')
            .select('*');
            
        const userMap = new Map();
        if (!uError && userData) {
            userData.forEach(u => userMap.set(u.session_id, u));
        }
        
        const sessionsMap = new Map();
        messages.forEach((msg: any) => {
            if (!sessionsMap.has(msg.session_id)) {
                sessionsMap.set(msg.session_id, {
                    session_id: msg.session_id,
                    last_message: msg.content,
                    created_at: msg.created_at,
                    user: userMap.get(msg.session_id)
                });
            }
        });
        
        return Array.from(sessionsMap.values());
    } catch (error) {
        return [];
    }
}

export async function logVisit(event: Omit<AnalyticEvent, 'id' | 'created_at'>): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('analytics')
      .insert([
        {
          ...event,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error logging visit:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in logVisit:', error);
    return false;
  }
}

export async function getVisitStats() {
  return await getAnalyticsSummary();
}

export async function getAnalyticsSummary() {
  if (!supabase) return { total: 0, uniqueIps: 0, googleTraffic: 0, recent: [], topPages: [], deviceStats: { mobile: 0, desktop: 0, tablet: 0 } };

  try {
    const { data: allData, error } = await supabase
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const total = allData?.length || 0;
    const uniqueIps = new Set(allData?.map(d => d.ip)).size;
    const googleTraffic = allData?.filter(d => d.referrer?.includes('google.com')).length || 0;
    const recent = allData?.slice(0, 20) || [];

    // Top Pages Aggregation
    const pageMap = new Map();
    allData?.forEach(d => {
      pageMap.set(d.path, (pageMap.get(d.path) || 0) + 1);
    });
    const topPages = Array.from(pageMap.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Device Stats
    let mobile = 0, tablet = 0, desktop = 0;
    allData?.forEach(d => {
      const ua = d.user_agent?.toLowerCase() || '';
      if (ua.includes('tablet') || ua.includes('ipad')) tablet++;
      else if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) mobile++;
      else desktop++;
    });

    return { 
      total, 
      uniqueIps, 
      googleTraffic, 
      recent, 
      topPages, 
      deviceStats: { mobile, desktop, tablet } 
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return { total: 0, uniqueIps: 0, googleTraffic: 0, recent: [], topPages: [], deviceStats: { mobile: 0, desktop: 0, tablet: 0 } };
  }
}
