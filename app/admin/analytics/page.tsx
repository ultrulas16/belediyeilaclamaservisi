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
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Navigation className="text-blue-600" size={24} />
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">En Çok Ziyaret Edilen Sayfalar</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {stats.pageViews.slice(0, 10).map((pv, i) => (
                <div key={i} className="flex items-center p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <span className="w-8 text-slate-300 font-bold italic text-lg">{i + 1}</span>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-slate-700">{pv.path}</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${(pv.count / stats.totalVisits) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <span className="text-lg font-black text-slate-900">{pv.count}</span>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Gösterim</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Traffic Log */}
        <div className="bg-slate-900 text-white rounded-[3rem] shadow-2xl p-8 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="relative z-10 space-y-6 flex-grow">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="font-black text-lg uppercase tracking-widest">Canlı Akış</h3>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {stats.recentVisits.map((visit, i) => {
                // Parse user agent for human readable device info
                const ua = visit.user_agent;
                let device = "Bilinmeyen Cihaz";
                if (ua.includes("iPhone")) device = "iPhone";
                else if (ua.includes("Android")) device = "Android";
                else if (ua.includes("Windows")) device = "Windows PC";
                else if (ua.includes("Macintosh")) device = "Mac";
                
                let browser = "Tarayıcı";
                if (ua.includes("Chrome")) browser = "Chrome";
                else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
                else if (ua.includes("Firefox")) browser = "Firefox";
                else if (ua.includes("Edg")) browser = "Edge";

                return (
                  <div key={i} className="border-l-2 border-white/10 pl-4 py-1 space-y-1 hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-between text-[10px] font-black text-blue-400 uppercase tracking-widest">
                      <span>{visit.ip}</span>
                      <span>{new Date(visit.created_at).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <p className="text-sm font-bold text-slate-200 truncate">{visit.path}</p>
                       <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-blue-200 font-black">
                         {device} - {browser}
                       </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      {visit.referer.includes("google") ? "🔎 Google Araması" : 
                       visit.referer.includes("direct") || visit.referer === "Direkt Giriş" ? "🔗 Direkt Giriş" : 
                       visit.referer}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black text-center">
              Panel verileri anlık olarak güncellenmektedir
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
