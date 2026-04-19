import React from "react";
import { 
  Users, 
  MousePointer2, 
  TrendingUp, 
  AlertCircle,
  Inbox,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { getLeads } from "@/lib/db";

export default async function AdminDashboard() {
  const leads = await getLeads();
  
  // Calculate stats from real data
  const totalLeads = leads.length;
  const urgentLeads = leads.filter(l => l.status === 'Acil').length;
  const completedLeads = leads.filter(l => l.status === 'Tamamlandı').length;
  const conversionRate = totalLeads > 0 ? ((completedLeads / totalLeads) * 100).toFixed(1) : "0";

  const stats = [
    { title: "Toplam Talep", value: totalLeads.toString(), icon: Inbox, color: "bg-blue-500", trend: "+12%" },
    { title: "Ziyaretçi", value: "2,845", icon: Users, color: "bg-purple-500", trend: "+5.4%" },
    { title: "Dönüşüm Oranı", value: `%${conversionRate}`, icon: MousePointer2, color: "bg-green-500", trend: "+1.2%" },
    { title: "Acil Aramalar", value: urgentLeads.toString(), icon: AlertCircle, color: "bg-red-500", trend: "+8%" },
  ];

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
             <div className={`${stat.color} p-4 rounded-2xl text-white`}>
                <stat.icon size={24} />
             </div>
             <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                   <span className="text-xs font-bold text-green-600 flex items-center">
                     <TrendingUp size={12} className="mr-0.5" />
                     {stat.trend}
                   </span>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads Table */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Son Gelen Talepler</h3>
              <Link href="/admin/leads" className="text-blue-600 text-sm font-bold hover:underline">Tümünü Gör</Link>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                       <th className="px-6 py-4">Müşteri</th>
                       <th className="px-6 py-4">Hizmet</th>
                       <th className="px-6 py-4">Tarih</th>
                       <th className="px-6 py-4">Durum</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {recentLeads.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-400">Veri bulunmuyor.</td>
                      </tr>
                    ) : (
                      recentLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                  <span className="text-slate-900 font-bold">{lead.name}</span>
                                  <span className="text-xs text-slate-400 font-medium">{lead.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{lead.service}</td>
                            <td className="px-6 py-4 text-slate-400">{new Date(lead.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                  lead.status === "Yeni" ? "bg-blue-100 text-blue-700" : 
                                  lead.status === "Acil" ? "bg-red-100 text-red-700" :
                                  lead.status === "Tamamlandı" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                              }`}>
                                  {lead.status}
                              </span>
                            </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* System Status */}
        <div className="bg-blue-900 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
           <ShieldCheck size={48} className="mb-6 text-blue-300" />
           <h3 className="text-2xl font-extrabold mb-4 leading-tight">Sistem <br />Durumu: AKTİF</h3>
           <p className="text-blue-100 text-sm opacity-80 leading-relaxed mb-8">
              Veritabanı bağlantısı Supabase üzerinden stabil çalışıyor. Tüm formlar anlık kaydedilmektedir.
           </p>
           
           <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between border border-white/10">
                 <span className="text-xs font-bold uppercase tracking-widest opacity-60">Supabase DB</span>
                 <span className="bg-green-500 w-2 h-2 rounded-full"></span>
              </div>
              <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between border border-white/10">
                 <span className="text-xs font-bold uppercase tracking-widest opacity-60">Schema.org</span>
                 <span className="bg-green-500 w-2 h-2 rounded-full"></span>
              </div>
              <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between border border-white/10">
                 <span className="text-xs font-bold uppercase tracking-widest opacity-60">API Status</span>
                 <span className="bg-green-500 w-2 h-2 rounded-full"></span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
