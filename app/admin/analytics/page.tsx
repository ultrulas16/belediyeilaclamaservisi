import React from "react";
import { 
  BarChart3, 
  Users, 
  Globe, 
  Search, 
  Clock, 
  ArrowUpRight, 
  MousePointer2,
  Navigation
} from "lucide-react";
import { getVisitStats } from "@/lib/db";

export default async function AnalyticsPage() {
  const stats = await getVisitStats();

  if (!stats) {
    return (
      <div className="p-8 text-center text-slate-500">
        Analiz verileri yüklenemedi. Supabase bağlantısını kontrol edin.
      </div>
    );
  }

  const cards = [
    { title: "Toplam Sayfa Görüntüleme", value: stats.totalVisits.toLocaleString(), icon: MousePointer2, color: "bg-blue-500" },
    { title: "Tekil Ziyaretçi", value: stats.uniqueIPs.toLocaleString(), icon: Users, color: "bg-purple-500" },
    { title: "Google'dan Gelenler", value: stats.googleReferrals.toLocaleString(), icon: Search, color: "bg-green-500" },
    { title: "Google Trafik Oranı", value: `%${stats.totalVisits > 0 ? ((stats.googleReferrals / stats.totalVisits) * 100).toFixed(1) : 0}`, icon: Globe, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trafik Analizi</h2>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-sm font-bold text-slate-500">
          <Clock size={16} />
          <span>Anlık Canlı Veri</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 ${card.color} opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2`}></div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`${card.color} p-3 rounded-2xl text-white shadow-lg`}>
                <card.icon size={20} />
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{card.title}</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Pages */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Navigation className="text-blue-600" size={24} />
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">En Çok Ziyaret Edilen Sayfalar</h3>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.pageViews.slice(0, 10).map((pv, i) => (
              <div key={i} className="flex items-center p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <span className="w-8 text-slate-300 font-bold italic text-lg">{i + 1}</span>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-slate-700">{pv.path}</p>
                  <div className="w-full bg-white h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${(pv.count / stats.totalVisits) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-6 text-right">
                  <span className="text-lg font-black text-slate-900">{pv.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width Live Traffic Log */}
      <div className="bg-slate-900 text-white rounded-[3rem] shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="font-black text-xl uppercase tracking-widest">Detaylı Canlı Akış</h3>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Son 50 Etkinlik</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                  <th className="px-6 pb-4">Zaman / IP</th>
                  <th className="px-6 pb-4">Ziyaret Edilen Sayfa</th>
                  <th className="px-6 pb-4">Cihaz & Kaynak</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentVisits.map((visit, i) => {
                  const ua = visit.user_agent;
                  let device = "Bilinmeyen";
                  if (ua.includes("iPhone")) device = "📱 iPhone";
                  else if (ua.includes("Android")) device = "📱 Android";
                  else if (ua.includes("Windows")) device = "💻 Windows";
                  else if (ua.includes("Macintosh")) device = "💻 Mac";
                  
                  let browser = "";
                  if (ua.includes("Chrome")) browser = "Chrome";
                  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
                  else if (ua.includes("Firefox")) browser = "Firefox";
                  else if (ua.includes("Edg")) browser = "Edge";

                  return (
                    <tr key={i} className="group bg-white/5 hover:bg-white/10 transition-colors rounded-2xl">
                      <td className="px-6 py-4 rounded-l-2xl">
                        <div className="flex flex-col">
                          <span className="text-blue-400 font-black text-xs tracking-tight">{visit.ip}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{new Date(visit.created_at).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-200">{visit.path}</span>
                      </td>
                      <td className="px-6 py-4 rounded-r-2xl">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-300 uppercase">{device}</span>
                            <span className="text-[9px] text-slate-500 font-medium">({browser})</span>
                          </div>
                          <p className="text-[10px] text-blue-400 font-medium truncate max-w-[200px]">
                            {visit.referer.includes("google") ? "🔎 Google Arama" : 
                             visit.referer.includes("localhost") ? "🛠️ Yerel (Dev)" :
                             visit.referer === "Direkt Giriş" ? "🔗 Direkt" : visit.referer}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
