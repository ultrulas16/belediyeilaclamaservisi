import React from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { getLeads } from "@/lib/db";
import { changeLeadStatus } from "@/app/actions";

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="İsim, telefon veya bölge ile ara..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {leads.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
               <p className="text-slate-400 font-medium">Henüz bir talep bulunmuyor.</p>
            </div>
         ) : (
            leads.map((lead: any) => (
              <div key={lead.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                 <div className="flex-shrink-0">
                    <div className={`p-4 rounded-2xl ${
                       lead.status === "Acil" ? "bg-red-50 text-red-600" :
                       lead.status === "Yeni" ? "bg-blue-50 text-blue-600" :
                       lead.status === "Tamamlandı" ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"
                    }`}>
                       {lead.status === "Acil" ? <AlertCircle size={24} /> : 
                        lead.status === "Tamamlandı" ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                    </div>
                 </div>
                 
                 <div className="flex-grow space-y-2">
                    <div className="flex items-center gap-3">
                       <h4 className="text-lg font-black text-slate-900">{lead.name}</h4>
                       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                          lead.status === "Acil" ? "bg-red-100 text-red-700" :
                          lead.status === "Yeni" ? "bg-blue-100 text-blue-700" :
                          lead.status === "Tamamlandı" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                       }`}>
                          {lead.status}
                       </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-slate-500">
                       <div className="flex items-center gap-1.5 font-bold">
                          <Phone size={14} className="text-blue-600" /> {lead.phone}
                       </div>
                       <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Calendar size={14} className="text-blue-600" /> {new Date(lead.date).toLocaleString('tr-TR')}
                       </div>
                       <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-blue-600">●</span> {lead.service}
                       </div>
                    </div>
                    <p className="text-sm text-slate-400 font-medium italic">"{lead.message}"</p>
                 </div>

                 <div className="flex-shrink-0 flex items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                    <button className="flex-grow lg:flex-grow-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                       Arandı Olarak İşaretle
                    </button>
                    <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                       <MoreVertical size={20} />
                    </button>
                 </div>
              </div>
            ))
         )}
      </div>
    </div>
  );
}
