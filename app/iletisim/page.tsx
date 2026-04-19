import { siteConfig } from "@/lib/config";
import ContactForm from "@/components/ContactForm";
import { Phone, MessageSquare, Clock, MapPin, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | Merkez Koordinasyon Hattı",
  description: "Büyükşehir İlaçlama iletişim bilgileri. 7/24 kesintisiz hizmet hattı, WhatsApp destek ve online randevu formu.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-blue-900 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Merkez Koordinasyon Hattı</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto opacity-90 leading-relaxed">
            7/24 kesintisiz hizmet anlayışıyla, acil ilaçlama talepleriniz ve bilgi almak için bize her an ulaşabilirsiniz.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold">Resmi İletişim Kanalları</h2>
                
                <div className="space-y-6">
                   <div className="flex gap-6 p-8 bg-gray-50 rounded-2xl border border-gray-100 items-center group hover:bg-red-50 hover:border-red-100 transition-all">
                      <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm group-hover:scale-110 transition-transform">
                         <Phone size={32} fill="currentColor" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Acil Müdahale Hattı</p>
                         <Link 
                           href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                           className="text-2xl md:text-3xl font-black text-blue-900"
                         >
                           {siteConfig.phoneDisplay}
                         </Link>
                      </div>
                   </div>

                   <div className="flex gap-6 p-8 bg-gray-50 rounded-2xl border border-gray-100 items-center group hover:bg-green-50 hover:border-green-100 transition-all">
                      <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm group-hover:scale-110 transition-transform">
                         <MessageSquare size={32} fill="currentColor" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">WhatsApp Destek Birimi</p>
                         <Link 
                           href={`https://wa.me/${siteConfig.whatsapp}`}
                           className="text-2xl md:text-3xl font-black text-blue-900"
                         >
                           Online Mesaj Hattı
                         </Link>
                      </div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-blue-600">
                       <Clock size={24} />
                       <h3 className="text-xl font-bold text-blue-900">Çalışma Saatleri</h3>
                    </div>
                    <p className="text-gray-600 font-medium">
                       7 Gün 24 Saat <br />
                       Nöbetçi Ekiplerimizle Hizmetinizdeyiz.
                    </p>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-blue-600">
                       <ShieldCheck size={24} />
                       <h3 className="text-xl font-bold text-blue-900">Resmi Kayıtlar</h3>
                    </div>
                    <p className="text-gray-600 font-medium">
                       Biyosidal Ürün Uygulama İzin Belgesi No: 2024/00-X-B
                    </p>
                 </div>
              </div>

              <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                 <h3 className="text-xl font-bold mb-4">Hizmet Alanlarımız</h3>
                 <p className="text-gray-600 leading-relaxed text-sm mb-4">
                    Büyükşehir İlaçlama; Ev, İş Yeri, Fabrika, Hastane, Okul, Apartman, Site ve Bahçe gibi tüm yaşam alanlarınızda profesyonel dezenfeksiyon ve haşere kontrol hizmeti sunar.
                 </p>
                 <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <MapPin size={18} />
                    <span>81+ Hizmet Noktası</span>
                 </div>
              </div>
            </div>

            <div>
              <ContactForm 
                title="Online Randevu ve Bilgi Formu"
                subtitle="Formu doldurmanız durumunda 15 dakika içerisinde koordinasyon merkezimiz sizi arayarak bilgilendirecektir."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t">
         <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-8">Kurumsal Bilgilendirme</h3>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-600 text-sm leading-relaxed italic">
               <p>
                  "Büyükşehir İlaçlama" markası, bölgesel bazda profesyonel ilaçlama hizmeti veren yetkili birimlerin koordinasyonunu sağlayan, halk sağlığı standartlarını en üst seviyede tutmayı hedefleyen bir servis ağıdır.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
}
