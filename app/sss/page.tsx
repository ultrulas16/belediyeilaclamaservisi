import { Metadata } from "next";
import { HelpCircle, ChevronRight, MessageCircle, Phone, Info, Clock, Shield } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | Büyükşehir İlaçlama",
  description: "İlaçlama süreci, kullanılan ürünlerin güvenliği ve garanti kapsamı hakkında en çok merak edilen soruların yanıtlarını burada bulabilirsiniz.",
};

const faqs = [
  {
    question: "İlaçlama sırasında evi terk etmem gerekiyor mu?",
    answer: "Kullandığımız yöntemlerin çoğunda (kokusuz sıvı ilaçlama ve jel yemleme) evi terk etmenize gerek yoktur. Ancak 'Sisleme (ULV)' gibi yoğun uygulamalarda, uygulama sırasında mekanın 2 saat kapalı kalması ve ardından 30 dakika havalandırılması önerilir. Uzmanımız uygulama öncesi size özel bilgilendirme yapacaktır."
  },
  {
    question: "Kullandığınız ilaçlar evcil hayvanlara zarar verir mi?",
    answer: "Sağlık Bakanlığı onaylı 'Biyosidal' ürünlerimiz haşere ve kemirgenlerin biyolojik yapılarına göre formüle edilmiştir. Uygulama alanına kuruduktan sonra temas edilmesi evcil hayvanlar için güvenlidir. Yine de uygulama sırasında evcil hayvanların farklı bir odada tutulmasını tavsiye ederiz."
  },
  {
    question: "İlaçlama sonrası temizlik yapmalı mıyım?",
    answer: "Uygulama yapılan yüzeylerdeki ilacın kalıcı etkisinin devam etmesi için 1 hafta boyunca 'ıslak temizlik' (paspas, silme) yapılmamasını öneririz. Süpürme işleminin bir sakıncası yoktur. Detaylı bilgi uygulama sonrası uzmanımız tarafından size iletilecek rapor dosyası ile verilir."
  },
  {
    question: "İlaçlama etkisini ne zaman gösterir? Garantiniz var mı?",
    answer: "Uygulama sonrası haşere aktivitesinde hemen bir azalma görülür, ancak tam çözüm biyolojik döngüye bağlı olarak 7-14 gün sürebilir. Büyükşehir İlaçlama olarak, yaptığımız tüm uygulamalarda 'Kesin Çözüm' garantisi veriyoruz. Sorun devam ederse ücretsiz tekrar uygulama yapıyoruz."
  },
  {
    question: "Hamam böceği ve kalorifer böceği için kesin çözüm müdür?",
    answer: "Evet, özellikle jel yemleme tekniğimiz koloniyi kökten yok etmek için tasarlanmıştır. İlacı yiyen böcek yuvaya döner ve orada ölür; diğer böceklerin onunla temas etmesiyle tüm koloni zincirleme reaksiyonla yok edilir."
  },
  {
    question: "Kurumsal işletmeler için periyodik ilaçlama yapıyor musunuz?",
    answer: "Restoran, fabrika, otel ve ofis gibi işletmeler için yasal mevzuatlara uygun periyodik ilaçlama ve raporlama hizmeti sunuyoruz. İlgili denetimlerde geçerli olan 'Uygulama Sertifikası' ve 'EK-1 Belgesi' her ziyaret sonrası düzenlenir."
  }
];

export default function FAQPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <JsonLd 
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
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
              "name": "Sıkça Sorulan Sorular",
              "item": `${siteConfig.url}/sss`
            }
          ]
        }}
      />
      {/* Header Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-800 rounded-2xl shadow-inner">
               <HelpCircle size={48} className="text-blue-300" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Sıkça Sorulan Sorular</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto opacity-90 leading-relaxed font-medium">
            Süreçlerimiz, güvenliğiniz ve hizmet kalitemiz hakkında merak ettikleriniz.
          </p>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 gap-6">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all group lg:flex lg:gap-8"
              >
                 <div className="mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                       {i + 1}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-blue-950 flex items-start gap-3">
                       {faq.question}
                    </h3>
                    <div className="h-0.5 w-12 bg-blue-600 rounded-full group-hover:w-24 transition-all duration-500"></div>
                    <p className="text-gray-600 text-lg leading-relaxed pt-2">
                       {faq.answer}
                    </p>
                 </div>
              </div>
            ))}
          </div>
          
          {/* Quick Contact Footer */}
          <div className="mt-16 bg-white rounded-[3rem] p-12 border border-blue-100 shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                   <h3 className="text-2xl md:text-3xl font-black text-blue-900 leading-tight">Cevabınızı bulamadınız mı?</h3>
                   <p className="text-gray-500 font-medium">Uzman ekibimiz sorularınızı yanıtlamak için 7/24 hazır.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                   <a 
                     href="https://wa.me/900000000000" 
                     className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-700 transition-colors shadow-lg"
                   >
                     <MessageCircle size={24} />
                     WhatsApp Destek
                   </a>
                   <a 
                     href="tel:08500000000" 
                     className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-950 transition-colors shadow-lg"
                   >
                     <Phone size={24} />
                     Hemen Arayın
                   </a>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Info Boxes */}
      <section className="pb-24">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 flex gap-6 items-start">
                  <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm">
                     <Info size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-blue-900 mb-2">Bakanlık Onayı</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">Tüm ruhsat ve belgelerimiz şeffaf bir şekilde paylaşılmaktadır.</p>
                  </div>
               </div>
               <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 flex gap-6 items-start">
                  <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm">
                     <Shield size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-blue-900 mb-2">Sigortalı Hizmet</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">Uygulama sırasında oluşabilecek tüm riskler güvencemiz altındadır.</p>
                  </div>
               </div>
               <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 flex gap-6 items-start">
                  <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm">
                     <Clock size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-blue-900 mb-2">7/24 Acil Müdahale</h4>
                     <p className="text-sm text-gray-600 leading-relaxed">Gece veya hafta sonu fark etmeksizin hizmetinizdeyiz.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
