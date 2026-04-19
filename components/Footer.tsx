import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { ShieldCheck, Clock, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-100 pt-16 pb-8 border-t border-blue-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex flex-col text-white">
              <span className="text-2xl font-bold tracking-tight">BÜYÜKŞEHİR</span>
              <span className="text-xs font-medium tracking-[0.2em]">İLAÇLAMA SERVİSİ</span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              Bölgesel koordinasyon merkezlerimiz aracılığıyla halk sağlığını tehdit eden haşere ve kemirgenlere karşı profesyonel mücadele birimiyiz.
            </p>
            <div className="flex items-center gap-2 text-green-400 font-semibold">
              <ShieldCheck size={20} />
              <span>Sağlık Bakanlığı Onaylı</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Popüler Hizmetler</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/hizmetler/hamambocek-ilaclama" className="hover:text-white transition-colors">Hamamböceği İlaçlama</Link></li>
              <li><Link href="/hizmetler/fare-ve-kemirgen-ilaclama" className="hover:text-white transition-colors">Fare İlaçlama</Link></li>
              <li><Link href="/hizmetler/apartman-ve-site-ilaclama" className="hover:text-white transition-colors">Apartman İlaçlama</Link></li>
              <li><Link href="/hizmetler/pire-ilaclama" className="hover:text-white transition-colors">Pire İlaçlama</Link></li>
              <li><Link href="/hizmetler/tahtakurusu-ilaclama" className="hover:text-white transition-colors">Tahtakurusu İlaçlama</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Hızlı Erişim</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/bolgeler" className="hover:text-white transition-colors">Hizmet Bölgelerimiz</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link></li>
              <li><Link href="/sss" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Bilgi Merkezi (Blog)</Link></li>
              <li><Link href="/kvkk" className="hover:text-white transition-colors">KVKK & Gizlilik</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition-colors">Bize Ulaşın</Link></li>
              <li><Link href="/hizmetler" className="hover:text-white transition-colors">Tüm Hizmetler</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Merkez Koordinasyon</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="mt-1 text-blue-400" size={18} />
                <div>
                  <p className="font-bold text-white">7/24 Nöbetçi Ekip</p>
                  <p className="opacity-80">Kesintisiz Hizmet Hattı</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 text-blue-400" size={18} />
                <div>
                  <p className="font-bold text-white">Bölgesel Mobil Birimler</p>
                  <p className="opacity-80">30 Dakikada Adresinizde</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs opacity-60 uppercase mb-2">Acil Müdahale Hattı</p>
                <Link 
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="text-xl font-bold text-white hover:text-red-400 transition-colors"
                >
                  {siteConfig.phoneDisplay}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-blue-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60 text-center md:text-left">
          <p>© {new Date().getFullYear()} Büyükşehir İlaçlama — Halk Sağlığı ve Zararlı Kontrol Merkezi</p>
          <div className="flex gap-6 uppercase tracking-widest font-semibold">
            <span>Sertifikalı Uygulama</span>
            <span>%100 Memnuniyet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
