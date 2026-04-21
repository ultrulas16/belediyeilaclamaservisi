"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Globe, 
  Search, 
  RefreshCw,
  Clock,
  Zap,
  ShieldAlert,
  ArrowRight,
  Smartphone,
  Monitor,
  Tablet,
  Layout
} from "lucide-react";
import { getAnalyticsSummary } from "@/lib/db";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const summary = await getAnalyticsSummary();
    setData(summary);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 opacity-50 bg-white border-4 border-safety-charcoal border-dashed">
         <RefreshCw size={48} className="animate-spin text-safety-charcoal" />
         <div className="font-black uppercase tracking-widest text-[10px]">ANALİZ VERİLERİ ÇEKİLİYOR...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "TOPLAM HİT", value: data?.total || 0, icon: BarChart3, color: "bg-safety-charcoal text-safety-yellow" },
          { label: "TEKİL ZİYARETÇİ (IP)", value: data?.uniqueIps || 0, icon: Users, color: "bg-safety-yellow text-safety-charcoal" },
          { label: "GOOGLE TRAFİĞİ", value: data?.googleTraffic || 0, icon: Search, color: "bg-white text-safety-charcoal" }
        ].map((stat, i) => (
          <div key={i} className={cn(
            "p-10 border-4 border-safety-charcoal flex flex-col gap-6 shadow-[12px_12px_0px_rgba(18,18,18,1)]",
            stat.color
          )}>
            <div className="flex items-center justify-between">
              <stat.icon size={32} strokeWidth={3} />
              <div className="h-4 w-4 bg-safety-charcoal/10 rounded-full"></div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">{stat.label}</div>
              <div className="text-6xl font-black italic tracking-tighter leading-none">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="border-4 border-safety-charcoal bg-white shadow-[12px_12px_0px_rgba(18,18,18,0.1)]">
          <div className="p-6 border-b-4 border-safety-charcoal bg-safety-slate flex items-center gap-3">
            <Layout size={20} className="text-safety-charcoal" />
            <h3 className="font-black italic uppercase tracking-tighter text-safety-charcoal">EN ÇOK TIKLANAN SAYFALAR</h3>
          </div>
          <div className="p-6 space-y-6">
            {data?.topPages.map((page: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase italic tracking-tight text-safety-charcoal truncate max-w-[70%]">{page.path}</span>
                  <span className="text-[10px] font-black text-safety-charcoal/40">{page.count} HİT</span>
                </div>
                <div className="h-4 bg-safety-slate border-2 border-safety-charcoal relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-safety-yellow border-r-2 border-safety-charcoal"
                    style={{ width: `${(page.count / data.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="border-4 border-safety-charcoal bg-white shadow-[12px_12px_0px_rgba(18,18,18,0.1)]">
          <div className="p-6 border-b-4 border-safety-charcoal bg-safety-slate flex items-center gap-3">
            <Smartphone size={20} className="text-safety-charcoal" />
            <h3 className="font-black italic uppercase tracking-tighter text-safety-charcoal">CİHAZ DAĞILIMI</h3>
          </div>
          <div className="p-8 flex flex-col justify-center h-full space-y-8">
            {[
              { label: "DESKTOP", value: data?.deviceStats.desktop, icon: Monitor },
              { label: "MOBILE", value: data?.deviceStats.mobile, icon: Smartphone },
              { label: "TABLET", value: data?.deviceStats.tablet, icon: Tablet }
            ].map((device, i) => {
              const percentage = data?.total > 0 ? Math.round((device.value / data.total) * 100) : 0;
              return (
                <div key={i} className="flex items-center gap-6">
                  <div className="bg-safety-charcoal text-safety-yellow p-4 border-2 border-safety-charcoal">
                    <device.icon size={24} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest">{device.label}</span>
                      <span className="text-xl font-black italic">{percentage}%</span>
                    </div>
                    <div className="h-3 bg-safety-slate border border-safety-charcoal relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-safety-charcoal transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Traffic Log Section */}
      <div className="border-4 border-safety-charcoal bg-white shadow-[16px_16px_0px_rgba(18,18,18,0.2)]">
        <div className="p-8 border-b-4 border-safety-charcoal flex items-center justify-between bg-safety-slate">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-safety-charcoal text-safety-yellow">
                 <ShieldAlert size={20} strokeWidth={3} />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-safety-charcoal">SON ZİYARET TRAFİĞİ</h3>
           </div>
           <button onClick={fetchData} className="btn-safety-primary !px-4 !py-2 !text-[10px]">
              YENİLE
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-safety-charcoal text-white text-[10px] font-black uppercase tracking-widest italic">
                <th className="p-6">IP ADRESİ</th>
                <th className="p-6">GELDİĞİ YER (REFERRER)</th>
                <th className="p-6">İNCELENEN SAYFA</th>
                <th className="p-6">TARİH / SAAT</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-safety-charcoal/10">
              {data?.recent.map((visit: any, i: number) => (
                <tr key={i} className="hover:bg-safety-slate/50 transition-colors group">
                  <td className="p-6 font-black text-sm text-safety-charcoal/80 flex items-center gap-3">
                     <Globe size={14} className="text-safety-yellow" />
                     {visit.ip}
                  </td>
                  <td className="p-6">
                     <span className={cn(
                        "text-[10px] font-black px-3 py-1 uppercase italic",
                        visit.referrer.includes('google') ? "bg-emerald-500 text-white" : "bg-safety-charcoal/5 text-safety-charcoal/40"
                     )}>
                        {visit.referrer}
                     </span>
                  </td>
                  <td className="p-6 font-black text-xs uppercase italic text-safety-charcoal underline underline-offset-4 decoration-safety-yellow decoration-4">
                     {visit.path}
                  </td>
                  <td className="p-6 font-black text-[10px] text-safety-charcoal/30 flex items-center gap-2">
                     <Clock size={12} />
                     {new Date(visit.created_at).toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data?.recent.length === 0 && (
           <div className="p-20 text-center text-safety-charcoal/20 font-black uppercase italic tracking-widest">
              GÖSTERİLECEK VERİ BULUNAMADI
           </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="bg-safety-charcoal p-8 text-white flex items-center justify-between">
         <div className="flex items-center gap-6">
            <Zap size={32} className="text-safety-yellow fill-safety-yellow" />
            <div className="space-y-1">
               <div className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">ANALİZ NOTU</div>
               <div className="text-sm font-bold uppercase tracking-tight">SİSTEM REEL-TİME OLARAK HER 5 DAKİKADA BİR VERİLERİ SENKRONİZE EDER.</div>
            </div>
         </div>
         <div className="text-[10px] font-black text-safety-yellow uppercase italic tracking-widest border border-safety-yellow/30 px-6 py-2">
            VERSİYON 2.0.1 ALPHA
         </div>
      </div>
    </div>
  );
}
