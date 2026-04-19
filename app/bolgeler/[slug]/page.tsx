import { notFound } from "next/navigation";
import { allDistricts, cities } from "@/lib/regions";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/config";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, MessageSquare, Clock, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const district = allDistricts.find((d) => d.slug === slug);
  
  if (!district) return { title: "Bölge Bulunamadı" };

  return {
    title: `${district.name} İlaçlama | 7/24 Acil Servis`,
    description: `${district.name} bölgesinde profesyonel ilaçlama hizmeti. 30 dakikada acil servis, ekonomik fiyatlar ve garantili çözümler.`,
    alternates: {
      canonical: `/bolgeler/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return allDistricts.map((district) => ({
    slug: district.slug,
  }));
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const district = allDistricts.find((d) => d.slug === slug);

  if (!district) {
    notFound();
  }

  // Find which city this district belongs to
  const city = cities.find(c => c.districts.some(d => d.slug === slug));

  return (
    <div className="flex flex-col">
      <JsonLd 
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Anasayfa",
              "item": siteConfig.url
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Bölgelerimiz",
              "item": `${siteConfig.url}/bolgeler`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": district.name,
              "item": `${siteConfig.url}/bolgeler/${district.slug}`
            }
          ]
        }}
      />
      {/* Local Hero */}
      <section className="bg-blue-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-800/20 -skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <nav className="flex text-sm text-blue-300 gap-2 mb-4">
                <Link href="/" className="hover:text-white">Anasayfa</Link>
                <span>/</span>
                <Link href="/bolgeler" className="hover:text-white">Bölgelerimiz</Link>
                <span>/</span>
                <span className="text-white">{district.name}</span>
              </nav>
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600 text-red-400 px-4 py-1.5 rounded-full text-sm font-bold animate-pulse uppercase tracking-wider">
                <Clock size={16} />
                <span>Bölgenizde 30 Dakikada Acil Servis</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                {district.name} <br />
                <span className="text-blue-300">İlaçlama Hizmetleri</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-xl leading-relaxed">
                {city?.name} {district.name} ilçesinde profesyonel haşere ve kemirgen kontrolü. Büyükşehir İlaçlama güvencesiyle 7/24 hizmetinizdeyiz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl"
                >
                  <Phone size={24} fill="currentColor" />
                  HEMEN ARA
                </Link>
                <Link 
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl"
                >
                  <MessageSquare size={24} fill="currentColor" />
                  WHATSAPP
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
               <ContactForm 
                defaultLocation={`${city?.name} / ${district.name}`}
                title={`${district.name} Özel Teklif`}
                subtitle="Bilgilerinizi bırakın, en yakındaki mobil ekibimizi yönlendirelim."
               />
            </div>
          </div>
        </div>
      </section>

      {/* Local Strategy Section */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-3xl font-bold tracking-tight">{district.name} Bölgesi İçin Özel Çözümler</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {district.name} ilçesinin coğrafi yapısı ve bina yaş ortalamasına göre en sık karşılaşılan haşere türleri (Hamamböceği, Fare, Pire) için özelleştirilmiş ilaçlama programları uyguluyoruz. Uzmanlarımız bölgeyi iyi tanıyan, tecrübeli teknisyenlerden oluşmaktadır.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.slice(0, 4).map((s) => (
                      <Link 
                        key={s.slug}
                        href={`/hizmetler/${s.slug}`}
                        className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-blue-900 transition-all"
                      >
                         <h3 className="text-xl font-bold mb-2 group-hover:text-white">{district.name} {s.title}</h3>
                         <p className="text-sm text-gray-500 group-hover:text-blue-100 italic">Kesin çözüm ve 1 yıl garanti.</p>
                      </Link>
                    ))}
                  </div>

                  <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
                    <h3 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                       <Clock size={28} />
                       Acil Müdahale Hattı
                    </h3>
                    <p className="text-gray-700 mb-4">
                       {district.name} bölgesinde konuşlanmış mobil birimlerimiz sayesinde, çağrınızı takiben ortalama 30 dakika içerisinde adresinize ulaşıyoruz. Acil durum haşere problemlerinizde vaktinizi çalmıyoruz.
                    </p>
                    <Link 
                      href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                      className="text-2xl font-black text-blue-900 hover:underline"
                    >
                      {siteConfig.phoneDisplay}
                    </Link>
                  </div>
               </div>

               <div className="lg:col-span-1 space-y-8">
                  <div className="bg-gray-50 p-8 rounded-2xl">
                     <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-900 border-b pb-4">
                        <MapPin size={22} />
                        Anlaşmalı Noktalar
                     </h3>
                     <ul className="space-y-4">
                        {[
                          "Toplu Konut Siteleri",
                          "Restoran ve Kafeler",
                          "Fabrikalar & Depolar",
                          "Okul ve Kreşler",
                          "Hastaneler",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 font-medium text-gray-700">
                             <CheckCircle size={18} className="text-blue-600" />
                             {item}
                          </li>
                        ))}
                     </ul>
                  </div>

                  <div className="bg-blue-900 p-8 rounded-2xl text-white">
                     <Shield size={48} className="mb-4 text-blue-300" />
                     <h3 className="text-xl font-bold mb-2">Garantili Uygulama</h3>
                     <p className="text-sm text-blue-100 opacity-80 mb-4">
                        Yaptığımız tüm ilaçlama işlemleri sertifikalıdır. Sorun çözülmezse ücretsiz tekrar uygulama garantisi veriyoruz.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Other Regions CTA */}
      <section className="py-16 bg-gray-50 border-t">
         <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold mb-8 text-center">{city?.name} Diğer Hizmet Bölgelerimiz</h3>
            <div className="flex flex-wrap justify-center gap-3">
               {city?.districts.filter(d => d.slug !== slug).map((d) => (
                 <Link 
                  key={d.slug}
                  href={`/bolgeler/${d.slug}`}
                  className="bg-white px-6 py-3 rounded-full border border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all font-medium shadow-sm leading-none"
                 >
                   {d.name}
                 </Link>
               ))}
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
