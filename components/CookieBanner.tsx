"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Çerez onayı daha önce verilmiş mi kontrol et
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-6 z-[9999] animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={24} />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-tighter">Gizlilik Odaklı Deneyim</h4>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-xs font-bold text-slate-500 leading-relaxed mb-4">
            Size daha iyi bir hizmet sunabilmek için sitemizde çerezler kullanılmaktadır. 
            Detaylı bilgi için <Link href="/kvkk" className="text-blue-600 hover:underline">KVKK Politikamızı</Link> inceleyebilirsiniz.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={acceptCookies}
              className="flex-grow bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-95"
            >
              Anladım ve Kabul Ediyorum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
