import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { newsItems } from '@/lib/news-data';
import { Calendar, User, ArrowRight, Newspaper, Bookmark } from 'lucide-react';

export const metadata: Metadata = {
  title: "Sektörden Haberler | İlaçlama Mevzuatı ve Güncel Gelişmeler",
  description: "İlaçlama sektöründeki yasal düzenlemeler, TSE standartları ve halk sağlığını ilgilendiren güncel haberler.",
};

export default function NewsIndexPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* News Header */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 -skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10 text-center lg:text-left">
           <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-600/30 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-8 tracking-widest">
              <Newspaper size={16} />
              <span>Sektörel Duyurular & Mevzuat</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black mb-6">Sektörden Haberler</h1>
           <p className="text-xl text-slate-300 max-w-2xl opacity-90 leading-relaxed font-medium">
             TSE standartları, Sağlık Bakanlığı duyuruları ve profesyonel ilaçlama dünyasındaki en son gelişmeleri takip edin.
           </p>
        </div>
      </section>

      {/* News List */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-12">
            {newsItems.map((news) => (
              <article 
                key={news.slug}
                className="group flex flex-col lg:flex-row gap-10 items-start p-8 rounded-[2.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              >
                <div className="w-full lg:w-1/3 aspect-[4/3] bg-slate-100 rounded-[2rem] overflow-hidden relative shadow-lg">
                   <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                      <Image 
                        src={news.image} 
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                   </div>
                </div>

                <div className="w-full lg:w-2/3 space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                     <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">
                        {news.category}
                     </span>
                     <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                        <Calendar size={14} className="text-blue-600" />
                        {new Date(news.date).toLocaleDateString('tr-TR')}
                     </div>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    <Link href={`/haberler/${news.slug}`}>
                      {news.title}
                    </Link>
                  </h2>
                  
                  <p className="text-slate-600 leading-relaxed font-medium line-clamp-2">
                    {news.excerpt}
                  </p>
                  
                  <div className="pt-6">
                    <Link 
                      href={`/haberler/${news.slug}`}
                      className="inline-flex items-center gap-3 text-slate-900 font-black text-sm uppercase tracking-widest hover:gap-5 transition-all"
                    >
                      <span className="border-b-2 border-blue-600 pb-1">Haberin Detayı</span>
                      <ArrowRight size={18} className="text-blue-600" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Section */}
      <section className="pb-24">
         <div className="container mx-auto px-4">
            <div className="bg-blue-900 rounded-[3rem] p-12 lg:p-24 text-white text-center space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
               <Bookmark size={64} className="mx-auto text-blue-300" />
               <h2 className="text-3xl md:text-5xl font-black max-w-2xl mx-auto">TSE Belgeli Hizmet Kalitemizden Taviz Vermiyoruz</h2>
               <p className="text-blue-100 text-lg opacity-80 max-w-3xl mx-auto">
                  Büyükşehir İlaçlama, tüm sektörel gelişmeleri ve yasal mevzuatları anlık olarak takip ederek size en güvenli hizmeti sunar.
               </p>
               <div className="pt-4">
                  <Link 
                    href="/iletisim"
                    className="bg-white text-blue-900 px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-colors shadow-2xl"
                  >
                    BİZE ULAŞIN
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
