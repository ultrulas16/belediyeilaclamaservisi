import { Metadata } from "next";
import { Shield, Users, BadgeCheck, Zap, Heart, Award } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hakkımızda | Profesyonel Haşere Kontrol Birimi",
  description: "Büyükşehir İlaçlama olarak, halk sağlığını koruma misyonuyla Türkiye'nin lider haşere ve kemirgen kontrol birimiyiz. Profesyonel kadromuz ve Sağlık Bakanlığı onaylı çözümlerimizle hizmetinizdeyiz.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-blue-800/50 backdrop-blur-sm border border-blue-700 px-6 py-2 rounded-full text-blue-300 font-bold uppercase text-xs tracking-widest mb-8">
            Biz Kimiz?
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight">
            Halk Sağlığını <br /><span className="text-blue-400">Teknolojiyle</span> Koruyoruz
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto opacity-90 leading-relaxed font-medium">
            Büyükşehir İlaçlama, modern şehir yaşamının gerektirdiği hijyen standartlarını sağlamak ve zararlılarla bilimsel yöntemlerle mücadele etmek amacıyla kurulmuş bir uzmanlık birimidir.
          </p>
        </div>
      </section>

      {/* Identity Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-blue-900 leading-tight">Bilimsel Yaklaşım, <br />Garantili Çözümler</h2>
                <div className="h-2 w-20 bg-red-600 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Her haşere sorununun kendine özgü bir biyolojik yapısı ve mücadele yöntemi vardır. Biz, sadece "ilaçlama" yapmıyoruz; yaşam alanlarınızda zararlıların barınabileceği noktaları tespit ediyor, popülasyonu analiz ediyor ve kaynağında kurutuyoruz.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: "MOH Onaylı", desc: "Tüm ürünlerimiz Sağlık Bakanlığı onaylıdır." },
                  { icon: BadgeCheck, title: "Sertifikalı Ekip", desc: "Uzmanlarımız sürekli eğitim almaktadır." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-50"></div>
              <div className="relative bg-blue-900 rounded-[3rem] p-12 overflow-hidden shadow-2xl aspect-[4/5] flex flex-col justify-end">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/40 to-transparent"></div>
                <div className="relative z-10 space-y-6 text-white">
                  <div className="text-6xl font-black italic opacity-20">20+</div>
                  <h3 className="text-3xl font-bold">Yıllık Tecrübe ve Sektörel Liderlik</h3>
                  <p className="text-blue-100 opacity-80 leading-relaxed">
                    Binlerce başarılı operasyon ve mutlu müşterimizle, Türkiye'nin dört bir yanında güven inşa ettik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-blue-900">Değerlerimiz</h2>
            <p className="text-gray-500 font-medium italic">Bizi biz yapan, hizmet kalitemizin temel taşları</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Heart, 
                title: "İnsan ve Çevre Sağlığı", 
                desc: "Kullandığımız tüm biyosidal ürünler hedefe yönelik olup, insan ve evcil hayvan sağlığına zarar vermeyecek şekilde formüle edilmiştir." 
              },
              { 
                icon: Zap, 
                title: "Hızlı ve Etkili Müdahale", 
                desc: "Zararlı sorunlarının aciliyetini biliyoruz. Mobil ekiplerimizle çağrınızı takiben en kısa sürede adresinize ulaşıyoruz." 
              },
              { 
                icon: Award, 
                title: "Şeffaf Hizmet Anlaşışı", 
                desc: "Uygulama öncesi ve sonrası detaylı raporlama ile hangi işlemlerin yapıldığını, hangi ürünlerin kullanıldığını biliyorsunuz." 
              }
            ].map((value, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <value.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4 uppercase tracking-tight">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-[3rem] p-12 lg:p-20 text-white text-center space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-20"></div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-black leading-tight">Profesyonel Desteğe mi <br />İhtiyacınız Var?</h2>
              <p className="text-blue-100 text-lg opacity-80 leading-relaxed">
                Ekibimiz size yardımcı olmaya hazır. Ücretsiz keşif veya fiyat teklifi için bize hemen ulaşın.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                <a 
                  href="tel:08500000000" 
                  className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl transition-all hover:scale-105"
                >
                  0850 000 00 00
                </a>
                <a 
                  href="/iletisim" 
                  className="bg-white text-blue-900 hover:bg-blue-50 px-12 py-5 rounded-2xl font-black text-xl transition-all"
                >
                  BİZE YAZIN
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
