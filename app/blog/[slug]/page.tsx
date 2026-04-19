import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/blog-data';
import { services } from '@/lib/services';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Tag, Share2, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { siteConfig } from '@/lib/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Yazı Bulunamadı' };

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="bg-white min-h-screen">
      <JsonLd 
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt,
          "image": post.image,
          "datePublished": post.date,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": siteConfig.name,
            "logo": {
              "@type": "ImageObject",
              "url": `${siteConfig.url}/logo.png`
            }
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
              "name": "Bilgi Merkezi",
              "item": `${siteConfig.url}/blog`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": post.title,
              "item": `${siteConfig.url}/blog/${post.slug}`
            }
          ]
        }}
      />

      {/* Article Header */}
      <section className="bg-slate-50 py-16 lg:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 font-bold mb-8 hover:-translate-x-1 transition-transform"
          >
            <ArrowLeft size={18} />
            <span>Bilgi Merkezine Dön</span>
          </Link>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                  {post.category}
               </span>
               <div className="h-px flex-grow bg-blue-100"></div>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                {new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                {post.author}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-8">
               <article 
                  className="prose prose-blue prose-lg max-w-none text-slate-700 leading-relaxed
                             prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight
                             prose-a:text-blue-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                             prose-table:border prose-table:rounded-xl prose-table:overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
               />
               
               <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Etiketler:</span>
                    <div className="flex gap-2">
                      {post.keywords.map(kw => (
                        <span key={kw} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-md">
                          #{kw.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Share2 size={20} />
                  </button>
               </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
               {/* Quick Info */}
               <div className="bg-blue-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <ShieldCheck size={48} className="mb-6 text-blue-300" />
                  <h3 className="text-2xl font-bold mb-4">Profesyonel Destek Mi Lazım?</h3>
                  <p className="text-blue-100 text-sm opacity-80 leading-relaxed mb-8">
                     Makaleyi okudunuz ama sorun hala devam mı ediyor? Uzman ekiplerimizle hemen iletişime geçin.
                  </p>
                  <a 
                    href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                    className="block bg-white text-blue-900 text-center py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                  >
                    Bizi Arayın
                  </a>
               </div>

               {/* Related Services */}
               <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                    <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                    Hizmetlerimiz
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {services.slice(0, 5).map(service => (
                      <Link 
                        key={service.slug}
                        href={`/hizmetler/${service.slug}`}
                        className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all"
                      >
                         <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{service.title}</span>
                         <div className="p-2 bg-white rounded-lg text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Clock size={16} />
                         </div>
                      </Link>
                    ))}
                  </div>
               </div>
            </aside>

          </div>
        </div>
      </section>
    </div>
  );
}
