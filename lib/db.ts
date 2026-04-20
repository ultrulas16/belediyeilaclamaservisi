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

