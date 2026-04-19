import Link from "next/link";
import Image from "next/image";
import { Phone, CheckCircle, Shield, Clock, Zap, ArrowRight, MessageSquare } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { services } from "@/lib/services";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700 px-4 py-2 rounded-full text-blue-200 text-sm font-semibold">
                <Shield size={16} />
                <span>Sağlık Bakanlığı Onaylı & Sertifikalı</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
                Yaşam Alanlarınızda <br />
                <span className="text-red-500">Haşereye Geçit Yok</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-xl leading-relaxed">
                Büyükşehir İlaçlama olarak, 7/24 nöbetçi ekiplerimizle 30 dakikada kapınızdayız. Garantili, kokusuz ve profesyonel çözümler.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-red-900/20 transition-all transform hover:-translate-y-1"
                >
                  <Phone size={24} fill="currentColor" />
                  <span>HEMEN ARA: {siteConfig.phoneDisplay}</span>
                </Link>
                <Link 
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-900/20 transition-all transform hover:-translate-y-1"
                >
                  <MessageSquare size={24} fill="currentColor" />
                  <span>WHATSAPP DESTEK</span>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm font-medium text-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-400" />
                  <span>%100 Garanti</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-400" />
                  <span>Kokusuz İlaç</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-400" />
                  <span>7/24 Servis</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <ContactForm 
                title="Ücretsiz Keşif & Teklif" 
                subtitle="Bilgilerinizi bırakın, uzmanımız sizi hemen bilgilendirsin."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Badges */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-blue-900">30 DK</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Hızlı Müdahale</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-blue-900">81+</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Hizmet Noktası</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-blue-900">%100</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Kesin Çözüm</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-blue-900">7/24</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Nöbetçi Ekip</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-blue-950">Profesyonel Hizmetlerimiz</h2>
            <p className="text-lg text-gray-600">
              En modern teknikler ve uzman kadromuzla, her türlü haşere ve kemirgen sorununa karşı yanınızdayız.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link 
                key={service.slug}
                href={`/hizmetler/${service.slug}`}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full"
              >
                <div className="mb-6 inline-flex p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  {service.description}
                </p>
                <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                  <span>Detayları İncele</span>
                  <ArrowRight size={18} className="opacity-0 group-hover:opacity-100" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-square bg-blue-800 rounded-3xl overflow-hidden shadow-2xl">
                 {/* Placeholder for real image */}
                 <div className="w-full h-full flex items-center justify-center text-blue-700 bg-blue-100">
                    <Shield size={120} />
                 </div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white text-blue-900 p-8 rounded-2xl shadow-2xl hidden md:block">
                <div className="text-4xl font-black mb-1">Garantili</div>
                <div className="text-sm font-bold uppercase tracking-widest text-blue-600 text-center">İlaçlama</div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
                Neden Bizi <br />Tercih Etmelisiniz?
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Uzman Kadro", desc: "Ziraat mühendisleri denetiminde, sertifikalı ve tecrübeli uygulama ekipleri." },
                  { title: "Sağlık Bakanlığı Onayı", desc: "Kullanılan tüm biyosidal ürünler Sağlık Bakanlığı onaylı ve halk sağlığına uygundur." },
                  { title: "Kokusuz Uygulama", desc: "Mekanınızı terk etmenize gerek kalmadan, iş akışınızı bozmadan uygulama yapıyoruz." },
                  { title: "Kesin ve Kalıcı Çözüm", desc: "Sadece mevcut haşereyi değil, kaynağını kurutarak tekrar oluşmasını engelliyoruz." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-800 rounded-full flex items-center justify-center text-blue-300">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1 text-white">{item.title}</h4>
                      <p className="text-blue-100 opacity-80 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Link 
                  href="/iletisim"
                  className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                >
                  BİZE ULAŞIN
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile CTA (Sticky on bottom for mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/80 backdrop-blur-md border-t shadow-2xl flex gap-3">
        <Link 
          href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-xl font-bold shadow-lg"
        >
          <Phone size={20} fill="currentColor" />
          <span>HEMEN ARA</span>
        </Link>
        <Link 
          href={`https://wa.me/${siteConfig.whatsapp}`}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg"
        >
          <MessageSquare size={20} fill="currentColor" />
          <span>WHATSAPP</span>
        </Link>
      </div>
    </div>
  );
}
