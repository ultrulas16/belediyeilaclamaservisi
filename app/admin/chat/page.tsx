"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Send, 
  User, 
  Clock, 
  MessageSquare, 
  Hash, 
  ChevronRight,
  ShieldCheck,
  Monitor
} from "lucide-react";
import { supabase, ChatRoom, Message } from "@/lib/db";
import { getActiveChatRoomsAction, getChatMessagesAction, sendChatMessageAction } from "@/app/actions";

export default function AdminChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Odaları Yükle
  useEffect(() => {
    const fetchRooms = async () => {
      const data = await getActiveChatRoomsAction();
      setRooms(data || []);
      setIsLoading(false);
    };
    fetchRooms();

    // Yeni oda veya mesaj geldiğinde listeyi güncellemek için Realtime
    if (!supabase) return;
    const channel = supabase
      .channel("admin_rooms_sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_sessions" },
        () => fetchRooms()
      )
      .subscribe();

    return () => { supabase?.removeChannel(channel); };
  }, []);

  // 2. Mesajları Yükle ve Realtime Bağlan
  useEffect(() => {
    if (!activeRoom || !supabase) return;

    const fetchMessages = async () => {
      const data = await getChatMessagesAction(activeRoom.session_id);
      setMessages(data || []);
    };
    fetchMessages();

    const channel = supabase
      .channel(`admin_room_${activeRoom.session_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${activeRoom.session_id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          getActiveChatRoomsAction().then(setRooms);
        }
      )
      .subscribe();

    return () => { supabase?.removeChannel(channel); };
  }, [activeRoom]);

  // 3. Otomatik Scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeRoom) return;

    const content = inputValue.trim();
    setInputValue("");
    
    await sendChatMessageAction(activeRoom.session_id, content, "admin");
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse font-bold text-slate-400">Sohbet Merkezi Yükleniyor...</div>;

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex overflow-hidden">
      {/* Sidebar: Konuşmalar Listesi */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-slate-800 text-lg uppercase tracking-tighter mb-4 flex items-center gap-2">
            <MessageSquare className="text-blue-600" size={20} />
            Konuşmalar
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Ziyaretçi ara..." 
              className="w-full bg-white border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-bold italic">Pasif Konuşma Yok</div>
          ) : (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room)}
                className={`w-full p-6 flex items-start gap-4 transition-all border-b border-slate-100/50 hover:bg-white group ${
                  activeRoom?.id === room.id ? "bg-white border-r-4 border-blue-600 shadow-sm" : ""
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                  activeRoom?.id === room.id ? "bg-blue-600 text-white shadow-lg" : "bg-slate-200 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                }`}>
                  <User size={20} />
                </div>
                <div className="flex-grow text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-xs text-slate-800 tracking-tighter truncate w-32">
                      {room.full_name || "Anonim Ziyaretçi"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      {new Date(room.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium truncate italic">
                    {room.phone || "Telefon yok"} • {room.last_message || "Yeni Konuşma"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main: Mesajlaşma Alanı */}
      <div className="flex-grow flex flex-col bg-white">
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm tracking-tight">
                    {activeRoom.full_name || "Anonim"}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                    {activeRoom.phone} • <span className="text-green-500 animate-pulse">Çevrimiçi</span>
                  </p>
                </div>
              </div>


              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                  Odayı Kapat
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow p-8 overflow-y-auto space-y-6 bg-slate-50/30"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] flex flex-col ${msg.sender === "admin" ? "items-end" : "items-start"}`}>
                    <div className={`p-4 rounded-3xl text-sm font-bold shadow-sm ${
                      msg.sender === "admin" 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase">
                      {msg.sender === "admin" ? "Siz" : "Ziyaretçi"} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="flex gap-4">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-slate-900 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  Gönder
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-20 space-y-6">
            <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-200">
              <MessageSquare size={64} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Hoş Geldiniz!</h3>
              <p className="text-slate-500 font-bold text-sm max-w-sm">
                Sol taraftaki listeden bir konuşma seçerek ziyaretçilerinizle anlık olarak yazışmaya başlayabilirsiniz.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
