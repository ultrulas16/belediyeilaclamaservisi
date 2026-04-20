import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Standart istemci
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Admin istemcisi
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

// Sizin SQL Şemanıza Uygun Interface
export interface ChatRoom {
  id: any;
  session_id: string; 
  full_name?: string; 
  phone?: string;     
  last_message?: string;
  updated_at?: string;
  created_at: string;
}

export interface Message {
  id: number;
  room_id: string; // session_id ile eşleşecek
  content: string;
  sender: 'visitor' | 'admin';
  created_at: string;
}

// ... Diğer fonksiyonlar (getLeads, addLead vb.) aynı kalıyor ...

export async function getLeads(): Promise<Lead[]> {
  if (!supabaseAdmin) return [];
  try {
    const { data, error } = await supabaseAdmin.from('leads').select('*').order('date', { ascending: false });
    return data || [];
  } catch (error) { return []; }
}

export async function addLead(lead: Omit<Lead, 'id' | 'date' | 'status'>): Promise<Lead | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('leads').insert([{ ...lead, status: 'Yeni' }]).select().single();
    return data;
  } catch (error) { return null; }
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
  if (!supabase) return;
  try { await supabase.from('leads').update({ status }).eq('id', id); } catch (error) {}
}

export async function logVisit(visit: Omit<Visit, 'id' | 'created_at'>): Promise<void> {
  if (!supabase) return;
  try { await supabase.from('visits').insert([visit]); } catch (error) {}
}

export async function getVisitStats(): Promise<VisitStats | null> {
  if (!supabaseAdmin) return null;
  try {
    const { count: totalVisits } = await supabaseAdmin.from('visits').select('*', { count: 'exact', head: true });
    const { data: uniqueData } = await supabaseAdmin.from('visits').select('ip');
    const uniqueIPs = new Set(uniqueData?.map(v => v.ip)).size;
    const { count: googleReferrals } = await supabaseAdmin.from('visits').select('*', { count: 'exact', head: true }).ilike('referer', '%google%');
    const { data: pathData } = await supabaseAdmin.from('visits').select('path');
    const pathCounts: Record<string, number> = {};
    pathData?.forEach(v => { pathCounts[v.path] = (pathCounts[v.path] || 0) + 1; });
    const pageViews = Object.entries(pathCounts).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count);
    const { data: recentVisits } = await supabaseAdmin.from('visits').select('*').order('created_at', { ascending: false }).limit(50);
    return { totalVisits: totalVisits || 0, uniqueIPs, googleReferrals: googleReferrals || 0, pageViews, recentVisits: (recentVisits as any) || [] };
  } catch (error) { return null; }
}

// SOHBET FONKSİYONLARI - SİZİN ŞEMANIZA (%100 UYUMLU)
export async function getOrCreateChatRoom(sessionId: string, name?: string, phone?: string): Promise<ChatRoom | null> {
  if (!supabaseAdmin) return null;

  try {
    // Önce session_id ile arıyoruz
    const { data: existingRoom } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (existingRoom) {
      if (name || phone) {
        const { data: updated } = await supabaseAdmin
          .from('chat_sessions')
          .update({ 
            full_name: name || existingRoom.full_name, 
            phone: phone || existingRoom.phone 
          })
          .eq('session_id', sessionId)
          .select()
          .single();
        return updated;
      }
      return existingRoom;
    }

    // Yoksa yeni oluşturuyoruz
    const { data: newRoom, error } = await supabaseAdmin
      .from('chat_sessions')
      .insert([{ 
        session_id: sessionId, 
        full_name: name || 'Anonim',
        phone: phone || 'Belirtilmedi',
        last_message: 'Sohbet Başlatıldı' 
      }])
      .select()
      .single();

    if (error) {
      console.error('Oda oluşturma hatası:', error.message);
      return null;
    }

    return newRoom;
  } catch (error) {
    return null;
  }
}

export async function sendMessage(roomId: string, content: string, sender: 'visitor' | 'admin'): Promise<Message | null> {
  if (!supabaseAdmin) return null;

  try {
    // Sizin şemanızda room_id session_id'ye karşılık gelir
    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .insert([{ room_id: roomId, content, sender }])
      .select()
      .single();

    if (error) {
      console.error('Mesaj kaydetme hatası:', error.message);
      return null;
    }

    // chat_sessions tablosunu güncelle (last_message için)
    // Eğer last_message sütunu yoksa bu hata verebilir ama mesaj yine de gider.
    try {
      await supabaseAdmin
        .from('chat_sessions')
        .update({ last_message: content, updated_at: new Date().toISOString() })
        .eq('session_id', roomId);
    } catch (e) {
      // last_message sütunu eklenmemişse sessizce devam eder
    }

    return message;
  } catch (error) {
    return null;
  }
}

export async function getChatMessages(roomId: string): Promise<Message[]> {
  if (!supabaseAdmin) return [];
  try {
    const { data } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    return data || [];
  } catch (error) { return []; }
}

export async function getActiveChatRooms(): Promise<ChatRoom[]> {
  if (!supabaseAdmin) return [];
  try {
    const { data } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  } catch (error) { return []; }
}
