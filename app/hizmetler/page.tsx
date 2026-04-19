import Link from "next/link";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/config";
import { Zap, ArrowRight, Shield, CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hizmetlerimiz | Profesyonel Haşere ve Kemirgen Kontrolü",
  description: "Büyükşehir İlaçlama tarafından sunulan tüm haşere, böcek ve kemirgen kontrol hizmetleri. Garantili ve Sağlık Bakanlığı onaylı çözümler.",
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-blue-900 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">İlaçlama Hizmetlerimiz</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Halk sağlığını tehdit eden tüm zararlılara karşı, modern teknikler ve uzman kadromuzla kesin çözüm sunuyoruz.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
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
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{service.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                  <span>Detayları ve Fiyatları İncele</span>
                  <ArrowRight size={18} className="opacity-0 group-hover:opacity-100" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t">
         <div className="container mx-auto px-4">
            <div className="bg-blue-900 rounded-[3rem] p-12 lg:p-20 text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-800/10 skew-x-12 translate-x-1/2"></div>
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                     <h2 className="text-3xl md:text-5xl font-black leading-tight">İhtiyacınıza Özel <br/>Uygulama Seçenekleri</h2>
                     <p className="text-blue-100 text-lg opacity-80 leading-relaxed">
                        Haşere sorununun türüne ve mekanın büyüklüğüne göre sıvı ilaçlama, jel yemleme veya ULV sisleme yöntemlerinden en uygun olanını seçerek garantili sonuç sağlıyoruz.
                     </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                           "Evler & Villa",
                           "Restoran & Gıda Alanları",
                           "Depo & Fabrikalar",
                           "Ofis & İş Yerleri"
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-3 font-bold text-white uppercase tracking-wider text-sm">
                              <CheckCircle size={20} className="text-green-400" />
                              {item}
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="text-center lg:text-right">
                     <div className="inline-block bg-white text-blue-900 p-8 rounded-3xl shadow-2xl">
                        <Shield size={64} className="mx-auto mb-4 text-blue-600" />
                        <h3 className="text-2xl font-black mb-2">Garantili Sonuç</h3>
                        <p className="text-gray-500 font-medium mb-6">Uygulama sonrası %100 memnuniyet garantisi.</p>
                        <Link 
                           href="/iletisim"
                           className="inline-block bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg"
                        >
                           ÜCRETSİZ TEKLİF AL
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
