import Link from "next/link";
import { cities } from "@/lib/regions";
import { siteConfig } from "@/lib/config";
import { MapPin, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hizmet Bölgelerimiz | Türkiye Genelinde 7/24 Servis",
  description: "Büyükşehir İlaçlama olarak İstanbul, Ankara, İzmir, Bursa, Mersin, Adana ve Eskişehir genelinde hizmet vermekteyiz. En yakın servis noktasını bulun.",
};

export default function RegionsIndexPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-blue-900 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Hizmet Bölgelerimiz</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Şu anda 8 ana şehirde, mobil ekiplerimizle adresinize 30 dakikada ulaşıyoruz. Bölgenizi seçerek detaylı bilgi alabilirsiniz.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {cities.map((city) => (
              <div key={city.name} className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-4">
                   <div className="h-12 w-12 bg-blue-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                      {city.name.substring(0, 1)}
                   </div>
                   <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">{city.name}</h2>
                </div>
                
                <ul className="space-y-3">
                  {city.districts.map((district) => (
                    <li key={district.slug}>
                      <Link 
                        href={`/bolgeler/${district.slug}`}
                        className="flex items-center justify-between text-gray-600 hover:text-blue-600 font-medium group transition-all"
                      >
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-blue-600"></div>
                           <span>{district.name} İlaçlama</span>
                        </div>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 mt-4 border-t border-gray-100">
                   <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                      7/24 Mobil Ekip Aktif
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-blue-950 text-white overflow-hidden relative">
         <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
               <div className="inline-flex items-center gap-2 bg-blue-900 border border-blue-800 px-6 py-2 rounded-full text-blue-300 font-bold uppercase text-xs tracking-[0.2em]">
                  <Clock size={16} />
                  <span>Hızlı Müdahale Merkezi</span>
               </div>
               <h2 className="text-3xl md:text-5xl font-black">Bölgenizde Bir Ekibimiz Mutlaka Var</h2>
               <p className="text-xl text-blue-200 opacity-80 leading-relaxed">
                  İstanbul'dan Mersin'e, Bursa'dan Ankara'ya kadar tüm hizmet bölgelerimizde nöbetçi ekiplerimiz çağrınızı bekliyor. Hemen arayın, en geç 30 dakika içinde kapınızda olalım.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                  <Link 
                    href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                    className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all hover:scale-105"
                  >
                    {siteConfig.phoneDisplay}
                  </Link>
                  <Link 
                    href="/iletisim"
                    className="bg-white text-blue-950 px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all"
                  >
                    BİZE ULAŞIN
                  </Link>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16 border-t border-blue-900 mt-16">
                  {[
                    { title: "30 DK", desc: "Varış Süresi" },
                    { title: "8", desc: "Hizmet Şehri" },
                    { title: "%100", desc: "Müşteri Memnuniyeti" },
                    { title: "7/24", desc: "Kesintisiz Hizmet" }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1 text-center">
                       <div className="text-3xl md:text-4xl font-black text-white">{stat.title}</div>
                       <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">{stat.desc}</div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
