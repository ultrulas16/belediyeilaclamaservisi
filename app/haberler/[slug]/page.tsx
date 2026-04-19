import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { newsItems } from '@/lib/news-data';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Share2, ShieldCheck, Newspaper } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { siteConfig } from '@/lib/config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return newsItems.map((news) => ({
    slug: news.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = newsItems.find((n) => n.slug === slug);
  if (!news) return { title: 'Haber Bulunamadı' };

  return {
    title: `${news.title} | Büyükşehir Haber`,
    description: news.excerpt,
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = newsItems.find((n) => n.slug === slug);
  if (!news) notFound();

  return (
    <div className="bg-white min-h-screen">
      <JsonLd 
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": news.title,
          "description": news.excerpt,
          "image": news.image,
          "datePublished": news.date,
          "author": {
            "@type": "Organization",
            "name": siteConfig.name
          }
        }}
      />

      <section className="bg-slate-50 py-16 lg:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            href="/haberler"
            className="inline-flex items-center gap-2 text-blue-600 font-bold mb-8 hover:-translate-x-1 transition-transform"
          >
            <ArrowLeft size={18} />
            <span>Haberlere Dön</span>
          </Link>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] flex items-center gap-2">
                  <Newspaper size={12} />
                  Sektörel Haber
               </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                {new Date(news.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                {news.author}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
           <article 
              className="prose prose-blue prose-lg max-w-none text-slate-700 leading-relaxed
                         prose-headings:text-slate-900 prose-headings:font-black
                         prose-a:text-blue-600 prose-a:font-bold prose-a:no-underline"
              dangerouslySetInnerHTML={{ __html: news.content }} 
           />
           
           <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                 Kategori: <span className="text-blue-600">{news.category}</span>
              </div>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Share2 size={20} />
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}
