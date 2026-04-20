"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/db";
import { getChatRoomAction, sendChatMessageAction, getChatMessagesAction } from "@/app/actions";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Ziyaretçi Kimliği ve Oda Kurulumu
  useEffect(() => {
    let vid = localStorage.getItem("chat_visitor_id");
    if (!vid) {
      vid = "visitor_" + Math.random().toString(36).substring(7);
      localStorage.setItem("chat_visitor_id", vid);
    }
    setVisitorId(vid);

    const initChat = async () => {
      const room = await getChatRoomAction(vid!);
      if (room) {
        setRoomId(room.id);
        const existingMessages = await getChatMessagesAction(room.id);
        setMessages(existingMessages);
      }
    };
    initChat();
  }, []);

  // 2. Realtime Bağlantısı (Mesajları anlık al)
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
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // 3. Otomatik Scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !roomId) return;

    const content = inputValue.trim();
    setInputValue("");
    
    // Server action ile mesajı gönder ve bildirimi tetikle
    await sendChatMessageAction(roomId, content, "visitor");
  };

  return (
    <div className="fixed bottom-6 right-24 z-50 flex flex-col items-end">
      {/* Sohbet Penceresi */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
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

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50"
          >
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                  <MessageCircle size={32} />
                </div>
                <p className="text-sm font-bold text-slate-500">Size nasıl yardımcı olabiliriz?</p>
              </div>
            )}
            
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
              disabled={!inputValue.trim()}
              className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              <Send size={20} />
            </button>
          </form>
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
