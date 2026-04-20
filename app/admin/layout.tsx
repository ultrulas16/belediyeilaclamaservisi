"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  BarChart3,
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { title: "Genel Bakış", icon: LayoutDashboard, href: "/admin" },
    { title: "Analiz", icon: BarChart3, href: "/admin/analytics" },
    { title: "Gelen Talepler", icon: Inbox, href: "/admin/leads" },
    { title: "Blog Yönetimi", icon: FileText, href: "/admin/blog" },
    { title: "Ayarlar", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 text-white transition-all duration-300 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className={`${!isSidebarOpen && "hidden"} flex flex-col`}>
             <span className="text-xl font-bold tracking-tighter">ADMIN</span>
             <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Kontrol Paneli</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-grow py-6 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-all hover:bg-slate-800 group ${
                pathname === item.href ? "bg-blue-600 text-white border-r-4 border-white" : "text-slate-400"
              }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className={`${!isSidebarOpen && "hidden"} font-medium transition-opacity`}>
                {item.title}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link 
            href="/"
            className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className={`${!isSidebarOpen && "hidden"}`}>Siteye Dön</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col max-h-screen overflow-hidden">
        <header className="bg-white border-b h-20 flex items-center justify-between px-8">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800">
                {menuItems.find(i => i.href === pathname)?.title || "Sayfa"}
              </h2>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                 <p className="text-sm font-bold text-slate-900">Operasyon Ekibi</p>
                 <p className="text-xs text-slate-500">Admin Yetkisi</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                AD
              </div>
           </div>
        </header>

        <div className="flex-grow p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
