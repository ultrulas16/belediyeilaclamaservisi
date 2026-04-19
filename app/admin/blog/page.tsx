"use client";

import React, { useState } from "react";
import { blogPosts } from "@/lib/blog-data";
import { 
  FileEdit, 
  Trash2, 
  Plus, 
  Search,
  Eye,
  Calendar,
  User,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminBlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Başlık veya kategori ile ara..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
            <Plus size={20} />
            Yeni Yazı Ekle
         </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Tüm Blog Yazıları ({blogPosts.length})</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                     <th className="px-6 py-4">Makale Bilgisi</th>
                     <th className="px-6 py-4">Kategori</th>
                     <th className="px-6 py-4">İstatistik</th>
                     <th className="px-6 py-4">Tarih</th>
                     <th className="px-6 py-4 text-center">İşlemler</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-sm font-medium">
                  {filteredPosts.map((post) => (
                     <tr key={post.slug} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-8">
                           <div className="flex items-center gap-4">
                              <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                 {/* Placeholder icon if image fails or for simplify */}
                                 <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
                                    <FileEdit size={24} />
                                 </div>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-slate-900 font-bold leading-tight">{post.title}</span>
                                 <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <User size={12} /> {post.author}
                                 </span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-8">
                           <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                              {post.category}
                           </span>
                        </td>
                        <td className="px-6 py-8">
                           <div className="flex flex-col text-xs space-y-1">
                              <div className="flex items-center gap-2 text-slate-600 font-bold">
                                 <Eye size={12} /> 1.2K
                              </div>
                              <div className="text-slate-400">Okunma</div>
                           </div>
                        </td>
                        <td className="px-6 py-8 text-slate-400 flex items-center gap-1 mt-3">
                           <Calendar size={14} /> {new Date(post.date).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-8">
                           <div className="flex items-center justify-center gap-2">
                              <Link 
                                href={`/blog/${post.slug}`} 
                                target="_blank"
                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                              >
                                 <ExternalLink size={18} />
                              </Link>
                              <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                                 <FileEdit size={18} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                 <Trash2 size={18} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
