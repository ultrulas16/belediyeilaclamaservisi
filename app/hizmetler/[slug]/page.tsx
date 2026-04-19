import { notFound } from "next/navigation";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/config";
import ContactForm from "@/components/ContactForm";
import { CheckCircle, Shield, Clock, Phone, Zap } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { blogPosts } from "@/lib/blog-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  
  if (!service) return { title: "Hizmet Bulunamadı" };

  return {
    title: `${service.title} | ${siteConfig.name}`,
    description: `${service.description} 7/24 Acil Servis ve Garantili İlaçlama Çözümleri.`,
    alternates: {
      canonical: `/hizmetler/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <JsonLd 
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": service.title,
          "description": service.description,
          "provider": {
            "@type": "LocalBusiness",
            "name": siteConfig.name
          },
          "areaServed": "TR",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Böcek İlaçlama"
          }
        }}
      />
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
              "name": "Hizmetlerimiz",
              "item": `${siteConfig.url}/hizmetler`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": service.title,
              "item": `${siteConfig.url}/hizmetler/${service.slug}`
            }
          ]
        }}
      />
      {/* Banner / Hero */}
      <section className="bg-blue-900 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-1">
               <div className="p-4 bg-blue-800 rounded-2xl w-fit text-blue-300">
                  <Zap size={40} />
               </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <nav className="flex text-sm text-blue-300 gap-2 mb-4">
                <Link href="/" className="hover:text-white">Anasayfa</Link>
                <span>/</span>
                <Link href="/hizmetler" className="hover:text-white">Hizmetlerimiz</Link>
                <span>/</span>
                <span className="text-white">{service.title}</span>
              </nav>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white">{service.title}</h1>
              <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
                {service.description} Profesyonel ekipman ve %100 garantili uygulama ile sorunu kökten çözüyoruz.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-end">
               <Link 
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-2xl transition-all hover:scale-105"
               >
                 <Phone size={24} fill="currentColor" />
                 {siteConfig.phoneDisplay}
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div className="prose prose-blue max-w-none">
                <h2 className="text-3xl font-bold mb-6">Neden Büyükşehir {service.title}?</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>{service.content}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <CheckCircle className="text-green-500" size={24} />
                    <span className="font-bold text-gray-800">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                 <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-shrink-0 p-6 bg-white rounded-2xl shadow-sm text-blue-600">
                       <Shield size={48} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold mb-2">Sağlık Bakanlığı Onaylı Süreç</h3>
                       <p className="text-gray-600">
                          Uyguladığımız tüm yöntemler ve kullandığımız biyosidal ürünler halk sağlığına uygun, Sağlık Bakanlığı onaylı ve sertifikalıdır. Mekanınızın hijyenini ve sağlığınızı riske atmıyoruz.
                       </p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-2xl font-bold">Uygulama Adımlarımız</h3>
                 <div className="space-y-4">
                    {[
                      { step: 1, title: "Detaylı Keşif", desc: "Sorunun kaynağını ve yoğunluğunu belirliyoruz." },
                      { step: 2, title: "Stratejik Planlama", desc: "Haşere türüne ve mekana en uygun ilaçlama tekniğini seçiyoruz." },
                      { step: 3, title: "Profesyonel Uygulama", desc: "Uzman ekiplerimiz, teknolojik ekipmanlarla uygulamayı gerçekleştirir." },
                      { step: 4, title: "Kontrol ve Raporlama", desc: "Uygulama sonrası sonuçları takip ediyor ve size rapor sunuyoruz." }
                    ].map((item) => (
                      <div key={item.step} className="flex gap-6">
                         <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-lg">
                            {item.step}
                         </div>
                         <div>
                            <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Sidebar Form */}
            <div className="lg:col-span-1">
               <div className="sticky top-28">
                  <ContactForm 
                    defaultService={service.slug}
                    title="Acil Çözüm Talebi"
                    subtitle="Hemen formu doldurun, 30 dakika içinde bölgenizdeki ekibimizi yönlendirelim."
                  />
                  
                  <div className="mt-8 bg-blue-900 text-white p-8 rounded-2xl shadow-xl text-center">
                     <Clock className="mx-auto mb-4 text-blue-300" size={40} />
                     <h4 className="text-xl font-bold mb-2">7/24 Nöbetçi Ekip</h4>
                     <p className="text-blue-100 text-sm mb-6 opacity-80">
                        Şu anda bölgenizde müsait ekibimiz bulunmaktadır.
                     </p>
                     <Link 
                       href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                       className="block w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold transition-all shadow-lg"
                     >
                       ACİL SERVİS ÇAĞIR
                     </Link>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50 border-t border-gray-100">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-2xl font-bold mb-6">İlgili Blog Yazıları</h3>
                  <div className="space-y-4">
                     {blogPosts.slice(0, 3).map(post => (
                        <Link 
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-600 transition-colors"
                        >
                           <h4 className="font-bold text-blue-900 mb-1">{post.title}</h4>
                           <p className="text-xs text-gray-500">{post.excerpt.substring(0, 100)}...</p>
                        </Link>
                     ))}
                  </div>
               </div>
               <div>
                  <h3 className="text-2xl font-bold mb-6">Popüler Hizmet Bölgelerimiz</h3>
                  <div className="flex flex-wrap gap-2">
                     {["Beşiktaş", "Kadıköy", "Şişli", "Üsküdar", "Esenyurt", "Çankaya", "Nilüfer"].map(loc => (
                        <Link 
                          key={loc}
                          href="/bolgeler"
                          className="bg-white px-4 py-2 rounded-lg border border-gray-100 hover:text-blue-600 hover:border-blue-600 transition-all text-sm font-medium"
                        >
                           {loc} İlaçlama
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
