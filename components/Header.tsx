"use client";

import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/config";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-bold tracking-tight md:text-2xl">BÜYÜKŞEHİR</span>
            <span className="text-xs font-medium tracking-[0.2em] md:text-sm">İLAÇLAMA SERVİSİ</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center space-x-8 lg:flex">
            <Link href="/" className="hover:text-blue-200 transition-colors">Anasayfa</Link>
            <Link href="/hizmetler" className="hover:text-blue-200 transition-colors">Hizmetlerimiz</Link>
            <Link href="/bolgeler" className="hover:text-blue-200 transition-colors">Bölgeler</Link>
            <Link href="/hakkimizda" className="hover:text-blue-200 transition-colors">Hakkımızda</Link>
            <Link href="/sss" className="hover:text-blue-200 transition-colors">SSS</Link>
            <Link href="/blog" className="hover:text-blue-200 transition-colors">Blog</Link>
            <Link href="/haberler" className="hover:text-blue-200 transition-colors">Haberler</Link>
            <Link href="/iletisim" className="hover:text-blue-200 transition-colors">İletişim</Link>
            <Link 
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold transition-all transform hover:scale-105"
            >
              <Phone size={18} fill="currentColor" />
              <span>ACİL HAT: {siteConfig.phoneDisplay}</span>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-blue-800 border-t border-blue-700 p-4 space-y-4 animate-in slide-in-from-top duration-300">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg">Anasayfa</Link>
          <Link href="/hizmetler" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg">Hizmetlerimiz</Link>
          <Link href="/bolgeler" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg">Hizmet Bölgelerimiz</Link>
          <Link href="/hakkimizda" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg">Hakkımızda</Link>
          <Link href="/sss" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg">Sıkça Sorulan Sorular</Link>
          <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg">Blog</Link>
          <Link href="/haberler" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg">Sektörden Haberler</Link>
          <Link href="/iletisim" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg">İletişim</Link>
          <Link 
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-xl font-bold"
          >
            <Phone size={20} fill="currentColor" />
            <span>ACİL HAT: {siteConfig.phoneDisplay}</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
