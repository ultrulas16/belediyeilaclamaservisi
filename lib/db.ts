import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client only if URL and Key are provided to prevent build errors
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
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
  if (!supabase) {
    console.error('Supabase client is not initialized. Check your environment variables.');
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
  if (!supabase) return null;

  try {
    // Toplam ziyaretler
    const { count: totalVisits, error: totalError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true });

    // Tekil IPler (Son 24 saat için basitleştirilmiş)
    const { data: uniqueData, error: uniqueError } = await supabase
      .from('visits')
      .select('ip');
    
    const uniqueIPs = new Set(uniqueData?.map(v => v.ip)).size;

    // Google referansları
    const { count: googleReferrals, error: googleError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .ilike('referer', '%google%');

    // Sayfa görüntüleme dağılımı
    const { data: pathData, error: pathError } = await supabase
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
    const { data: recentVisits, error: recentError } = await supabase
      .from('visits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (totalError || uniqueError || googleError || pathError || recentError) {
      console.error('Error fetching visit stats:', { totalError, uniqueError, googleError, pathError, recentError });
      return null;
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

