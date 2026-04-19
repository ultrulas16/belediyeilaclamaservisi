import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/blog-data';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: "Bilgi Merkezi & Blog | Haşere Kontrol Rehberi",
  description: "Büyükşehir İlaçlama bilgi merkezi. Haşerelerle mücadele yöntemleri, 2026 ilaçlama fiyatları ve sağlık rehberleri.",
};

export default function BlogIndexPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Blog Header */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6">Bilgi Merkezi</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Uzmanlarımızdan haşere kontrolü, hijyen ve sağlıklı yaşam alanları üzerine ipuçları ve güncel rehberler.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.map((post) => (
              <article 
                key={post.slug}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group"
              >
                {/* Image Placeholder */}
                <div className="aspect-[16/10] bg-blue-100 relative overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center text-blue-300">
                      <Image 
                        src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070" 
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                      />
                   </div>
                   <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                         {post.category}
                      </span>
                   </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">
                     <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.date).toLocaleDateString('tr-TR')}</span>
                     <span className="flex items-center gap-1"><User size={14} /> {post.author.split(' ').pop()}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-blue-950 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="pt-6 border-t border-gray-50">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                    >
                      <span>Haberi Oku</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="pb-24">
         <div className="container mx-auto px-4">
            <div className="bg-blue-950 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
                  <div className="space-y-6">
                     <h2 className="text-3xl md:text-5xl font-black">Uzman Tavsiyesi mi Gerekiyor?</h2>
                     <p className="text-blue-200 text-lg opacity-80">
                        Haşere sorununuzla ilgili profesyonel görüş almak için bize çekinmeden ulaşabilirsiniz.
                     </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                     <Link 
                       href="/iletisim"
                       className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-red-700 transition-colors shadow-2xl"
                     >
                       ÜCRETSİZ TEKLİF AL
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
