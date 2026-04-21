"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, ShieldCheck, CheckSquare, Square } from "lucide-react";
import { supabase } from "@/lib/db";
import { getChatRoomAction, sendChatMessageAction, getChatMessagesAction } from "@/app/actions";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"entry" | "chat">("entry");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  
  // Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Ziyaretçi Kimliği ve Mevcut Oda Kontrolü
  useEffect(() => {
    let sid = localStorage.getItem("chat_session_id");
    const savedName = localStorage.getItem("chat_full_name");
    
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(7);
      localStorage.setItem("chat_session_id", sid);
    }
    setVisitorId(sid);

    const initChat = async () => {
      if (savedName) {
        const room = await getChatRoomAction(sid!);
        if (room) {
          setRoomId(room.session_id);
          const existingMessages = await getChatMessagesAction(room.session_id);
          setMessages(existingMessages);
          setStep("chat");
        }
      }
    };
    initChat();
  }, []);

  // 2. Realtime Bağlantısı
  useEffect(() => {
    if (!roomId || !supabase) return;

    const channel = supabase
      .channel(`room_${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [roomId]);

  // 3. Otomatik Scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, step]);

  // 4. Sohbete Başla (Form Gönderimi)
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !kvkkAccepted || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const room = await getChatRoomAction(visitorId!, name, phone);
      if (room) {
        setRoomId(room.session_id);
        localStorage.setItem("chat_full_name", name);
        setStep("chat");
        
        await sendChatMessageAction(room.session_id, "Merhaba, size nasıl yardımcı olabilirim?", "admin");
      }
    } catch (error) {
      console.error("Chat init error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  // 5. Mesaj Gönder
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !roomId) return;

    const content = inputValue.trim();
    setInputValue("");
    
    // Geçici olarak listeye ekle (Hız algısı için)
    const tempMsg = { 
      id: Math.random(), 
      content, 
      sender: "visitor", 
      created_at: new Date().toISOString() 
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await sendChatMessageAction(roomId, content, "visitor");
    } catch (error) {
      console.error("Send error:", error);
      // Hata durumunda mesajın yanına ünlem konulabilir
    }
  };

  return (
    <div className="fixed bottom-6 right-24 z-50 flex flex-col items-end">
      {/* Sohbet Penceresi */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-tighter">Canlı Destek</h4>
                <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Çevrimiçi</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {step === "entry" ? (
            /* Giriş Formu */
            <div className="flex-grow p-8 bg-slate-50 flex flex-col overflow-y-auto">
              <div className="mb-8 text-center">
                <h3 className="text-xl font-black text-slate-800 mb-2">Hoş Geldiniz!</h3>
                <p className="text-xs text-slate-500 font-bold">Lütfen başlamadan önce bilgilerinizi girin.</p>
              </div>

              <form onSubmit={handleStartChat} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block px-2">Ad Soyad</label>
                  <input 
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block px-2">Telefon</label>
                  <input 
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xx xxx xx xx"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                  />
                </div>
                
                <div 
                  className="flex gap-3 items-start p-2 cursor-pointer group"
                  onClick={() => setKvkkAccepted(!kvkkAccepted)}
                >
                  <div className="mt-1 flex-shrink-0">
                    {kvkkAccepted ? <CheckSquare className="text-blue-600" size={18} /> : <Square className="text-slate-300" size={18} />}
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                    <span className="text-slate-800 underline">KVKK ve Gizlilik Sözleşmesi</span>'ni okudum, iletişim bilgilerimin işlenmesini kabul ediyorum.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={!kvkkAccepted || !name || !phone || isSubmitting}
                  className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  {isSubmitting ? "Hazırlanıyor..." : "Sohbete Başla"}
                </button>
              </form>
            </div>
          ) : (
            /* Sohbet Alanı */
            <>
              <div 
                ref={scrollRef}
                className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50"
              >
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col ${msg.sender === "visitor" ? "items-end" : "items-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                        msg.sender === "visitor" 
                          ? "bg-slate-900 text-white rounded-tr-none" 
                          : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Bir mesaj yazın..."
                  className="flex-grow bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || !roomId}
                  className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group bg-slate-900 text-white p-4 rounded-[2rem] shadow-2xl hover:bg-blue-600 transition-all duration-300 flex items-center gap-3 overflow-hidden"
      >
        <div className="relative">
          <MessageCircle size={28} className={isOpen ? "scale-0 opacity-0 absolute" : "scale-100 opacity-100 transition-all duration-300"} />
          <X size={28} className={isOpen ? "scale-100 opacity-100 transition-all duration-300" : "scale-0 opacity-0 absolute"} />
        </div>
        {!isOpen && (
          <span className="max-w-0 group-hover:max-w-xs transition-all duration-500 font-bold text-sm uppercase tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100">
            Destek Ekibi
          </span>
        )}
      </button>
    </div>
  );
}
