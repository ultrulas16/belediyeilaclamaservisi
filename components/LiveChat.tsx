"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  ShieldAlert, 
  Zap, 
  User,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getChatMessages, sendChatMessage, ChatMessage, upsertChatSession, supabase } from "@/lib/db";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [checkboxes, setCheckboxes] = useState({ kvkk: false, privacy: false });
  const [userData, setUserData] = useState({ name: "", phone: "" });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Session & Consent
  useEffect(() => {
    let sId = localStorage.getItem("chat_session_id");
    if (!sId) {
      sId = Math.random().toString(36).substring(7);
      localStorage.setItem("chat_session_id", sId);
    }
    setSessionId(sId);

    const accepted = localStorage.getItem("chat_terms_accepted") === "true";
    setIsAccepted(accepted);
  }, []);

  const handleAccept = async () => {
    if (!sessionId) return;
    
    setLoading(true);

    // Save contact info formally
    await upsertChatSession({
      session_id: sessionId,
      full_name: userData.name,
      phone: userData.phone
    });

    // Send a system message with contact details for backward compatibility/quick view
    await sendChatMessage({
      session_id: sessionId,
      sender: 'user',
      content: `[SİSTEM] Yeni Bağlantı: ${userData.name} - Tel: ${userData.phone}`
    });

    localStorage.setItem("chat_terms_accepted", "true");
    setIsAccepted(true);
    setLoading(false);
  };

  // Fetch History & Subscribe
  useEffect(() => {
    if (!sessionId || !supabase) return;

    const fetchHistory = async () => {
      const history = await getChatMessages(sessionId);
      setMessages(history);
    };
    fetchHistory();

    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setMessages(prev => {
            if (prev.some(m => m.id === (payload.new as ChatMessage).id)) return prev;
            return [...prev, payload.new as ChatMessage];
          });
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [sessionId]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || loading) return;

    setLoading(true);
    const content = input;
    setInput("");

    const result = await sendChatMessage({
      session_id: sessionId,
      sender: 'user',
      content
    });

    if (!result) {
       alert("Mesaj gönderilemedi.");
       setInput(content);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-10 left-10 z-[60] flex flex-col items-start pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] h-[550px] bg-white border-8 border-safety-charcoal mb-6 flex flex-col shadow-[24px_24px_0px_rgba(18,18,18,0.2)] pointer-events-auto animate-safety-slide">
           {/* Header */}
           <div className="bg-safety-charcoal p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-safety-yellow p-2 text-safety-charcoal">
                    <ShieldAlert size={20} strokeWidth={3} />
                 </div>
                 <div className="space-y-1">
                    <div className="text-white font-black text-xs uppercase italic tracking-tighter">CANLI DESTEK</div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-500">
                       <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                       SİSTEM ÇEVRİMİÇİ
                    </div>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                 <X size={24} />
              </button>
           </div>

           {/* Chat Content or Consent */}
           {!isAccepted ? (
             <div className="flex-1 p-8 flex flex-col justify-center space-y-6 bg-safety-slate overflow-y-auto">
                <div className="space-y-4">
                   <Zap size={32} className="text-safety-yellow fill-safety-yellow" />
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-safety-charcoal">
                      CANLI DESTEK <br/> BAŞVURUSU
                   </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-safety-charcoal/40">AD SOYAD</label>
                    <input 
                      type="text"
                      placeholder="ADINIZI GİRİNİZ..."
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full bg-white border-2 border-safety-charcoal px-4 py-3 outline-none font-black text-xs uppercase italic focus:bg-safety-yellow/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-safety-charcoal/40">TELEFON NUMARASI</label>
                    <input 
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      value={userData.phone}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      className="w-full bg-white border-2 border-safety-charcoal px-4 py-3 outline-none font-black text-xs uppercase italic focus:bg-safety-yellow/10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="flex items-start gap-4 cursor-pointer group">
                      <input 
                         type="checkbox" 
                         checked={checkboxes.kvkk}
                         onChange={(e) => setCheckboxes({...checkboxes, kvkk: e.target.checked})}
                         className="mt-1 h-4 w-4 border-2 border-safety-charcoal rounded-none accent-safety-charcoal flex-shrink-0"
                      />
                      <span className="text-[9px] font-black uppercase italic tracking-tight text-safety-charcoal group-hover:text-black transition-colors">
                         KVKK Aydınlatma Metni'ni onaylıyorum.
                      </span>
                   </label>
                   <label className="flex items-start gap-4 cursor-pointer group">
                      <input 
                         type="checkbox" 
                         checked={checkboxes.privacy}
                         onChange={(e) => setCheckboxes({...checkboxes, privacy: e.target.checked})}
                         className="mt-1 h-4 w-4 border-2 border-safety-charcoal rounded-none accent-safety-charcoal flex-shrink-0"
                      />
                      <span className="text-[9px] font-black uppercase italic tracking-tight text-safety-charcoal group-hover:text-black transition-colors">
                         Gizlilik Sözleşmesi'ni kabul ediyorum.
                      </span>
                   </label>
                </div>

                <button 
                   disabled={!checkboxes.kvkk || !checkboxes.privacy || !userData.name.trim() || !userData.phone.trim() || loading}
                   onClick={handleAccept}
                   className="btn-safety-primary w-full disabled:opacity-30 disabled:grayscale italic"
                >
                   {loading ? "BAĞLANTI KURULUYOR..." : "SOHBETE BAŞLA"}
                </button>
             </div>
           ) : (
             <>
               {/* Messages */}
               <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-safety-slate scroll-smooth">
                  <div className="bg-safety-charcoal/5 p-4 text-[10px] font-black uppercase text-center tracking-widest text-safety-charcoal/40 border border-dashed border-safety-charcoal/20">
                     GÜVENLİ HAT KURULDU — MESAJ GÖNDEREBİLİRSİNİZ
                  </div>

                  {messages.map((msg, i) => (
                    <div key={i} className={cn(
                      "flex flex-col max-w-[85%]",
                      msg.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}>
                      <div className={cn(
                        "p-4 font-bold text-sm border-2",
                        msg.sender === 'user' 
                          ? "bg-safety-charcoal text-white border-safety-charcoal" 
                          : "bg-white text-safety-charcoal border-safety-charcoal shadow-[4px_4px_0px_rgba(18,18,18,0.1)]"
                      )}>
                        {msg.content}
                      </div>
                      <span className="text-[9px] font-black text-safety-charcoal/30 mt-2 uppercase tracking-tighter">
                         {msg.sender === 'user' ? 'VATANDAŞ' : 'ADMİN'} • {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
               </div>

               {/* Input */}
               <form onSubmit={handleSend} className="p-6 bg-white border-t-4 border-safety-charcoal flex gap-4">
                  <input 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder="BİR MESAJ YAZIN..."
                     className="flex-1 bg-safety-slate border-2 border-safety-charcoal px-4 py-3 outline-none focus:bg-white transition-all font-black text-xs uppercase italic"
                  />
                  <button 
                     type="submit" 
                     disabled={!input.trim() || loading}
                     className="bg-safety-charcoal text-safety-yellow p-4 border-2 border-safety-charcoal hover:bg-black transition-colors disabled:opacity-50"
                  >
                     <Send size={20} strokeWidth={3} />
                  </button>
               </form>
             </>
           )}
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-20 w-20 bg-safety-charcoal text-safety-yellow flex items-center justify-center border-4 border-safety-yellow shadow-[12px_12px_0px_rgba(18,18,18,0.1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all pointer-events-auto relative group",
          isOpen && "rotate-90 bg-safety-yellow text-safety-charcoal border-safety-charcoal"
        )}
      >
        {isOpen ? <X size={32} strokeWidth={3} /> : <MessageCircle size={32} strokeWidth={3} />}
        
        {/* Helper Badge */}
        {!isOpen && (
          <div className="absolute left-full ml-6 bg-safety-charcoal text-white px-4 py-2 font-black text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border-l-4 border-safety-yellow">
             ACİL MÜDAHALE HATTI
          </div>
        )}
      </button>
    </div>
  );
}
