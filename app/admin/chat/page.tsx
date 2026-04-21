"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Search, 
  Send, 
  ShieldAlert, 
  Zap, 
  MessageCircle,
  Clock,
  User,
  History,
  RefreshCw,
  Activity
} from "lucide-react";
import { 
  getChatMessages, 
  sendChatMessage, 
  getAllChatSessions, 
  ChatMessage, 
  ChatSession,
  supabase 
} from "@/lib/db";
import { cn } from "@/lib/utils";

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<{ session_id: string, last_message: string, created_at: string, user?: ChatSession }[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch all active sessions
  const fetchSessions = async () => {
    setSessionsLoading(true);
    const data = await getAllChatSessions();
    setSessions(data);
    setSessionsLoading(false);
  };

  useEffect(() => {
    fetchSessions();
    
    // Subscribe to all new messages to update session list
    if (!supabase) return;
    const channel = supabase
      .channel('admin-chat-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'buyuksehir_messages' 
      }, () => {
        fetchSessions();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'buyuksehir_chat_sessions' 
      }, () => {
        fetchSessions();
      })
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Fetch messages for selected session
  useEffect(() => {
    if (!selectedSession || !supabase) return;

    const fetchHistory = async () => {
      const history = await getChatMessages(selectedSession);
      setMessages(history);
    };
    fetchHistory();

    const channel = supabase
      .channel(`admin_chat:${selectedSession}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${selectedSession}` },
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
  }, [selectedSession]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedSession || loading) return;

    setLoading(true);
    const content = input;
    setInput("");

    const result = await sendChatMessage({
      session_id: selectedSession,
      sender: 'admin',
      content
    });

    if (!result) {
       alert("Mesaj gönderilemedi.");
       setInput(content);
    }
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-240px)] flex border-4 border-safety-charcoal bg-white shadow-[16px_16px_0px_rgba(18,18,18,1)] overflow-hidden">
      {/* Session List */}
      <aside className="w-96 border-r-4 border-safety-charcoal flex flex-col bg-safety-slate">
         <div className="p-8 border-b-2 border-safety-charcoal flex items-center justify-between">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-safety-charcoal">AKTIF SOHBETLER</h3>
            <button onClick={fetchSessions} className="text-safety-charcoal/40 hover:text-safety-charcoal transition-colors">
               <RefreshCw size={18} className={sessionsLoading ? "animate-spin" : ""} />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto">
            {sessionsLoading ? (
               <div className="p-10 text-center opacity-20">YÜKLENİYOR...</div>
            ) : sessions.length === 0 ? (
               <div className="p-20 text-center opacity-20 uppercase font-black tracking-widest text-[10px]">HENÜZ MESAJ YOK</div>
            ) : (
               sessions.map((session) => (
                  <button
                     key={session.session_id}
                     onClick={() => setSelectedSession(session.session_id)}
                     className={cn(
                        "w-full p-8 text-left border-b-2 border-safety-charcoal transition-all group",
                        selectedSession === session.session_id ? "bg-safety-charcoal text-white" : "hover:bg-white"
                     )}
                  >
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">
                           {session.user ? session.user.full_name : `#ID_${session.session_id.substring(0, 4)}`}
                        </span>
                        <span className="text-[9px] font-black opacity-30">{new Date(session.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                     <div className="font-black text-sm uppercase italic truncate">{session.last_message}</div>
                  </button>
               ))
            )}
         </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col relative bg-white">
         {selectedSession ? (
            <>
               {/* Chat Header */}
               <div className="p-8 border-b-2 border-safety-charcoal flex items-center justify-between bg-white z-10">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-safety-charcoal text-safety-yellow flex items-center justify-center">
                        <MessageCircle size={24} />
                     </div>
                      <div className="space-y-1">
                         <div className="font-black italic uppercase tracking-tighter text-safety-charcoal text-xl leading-none">
                            {sessions.find(s => s.session_id === selectedSession)?.user?.full_name || "BİLİNMEYEN KULLANICI"}
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-500">
                               <Activity size={10} />
                               VATANDAŞ BAĞLI
                            </div>
                            {sessions.find(s => s.session_id === selectedSession)?.user?.phone && (
                               <a href={`tel:${sessions.find(s => s.session_id === selectedSession)?.user?.phone}`} className="flex items-center gap-1.5 text-xs font-black text-safety-charcoal/40 hover:text-safety-charcoal transition-colors">
                                  <Clock size={12} />
                                  Geri Dönüş: {sessions.find(s => s.session_id === selectedSession)?.user?.phone}
                               </a>
                            )}
                         </div>
                      </div>
                  </div>
               </div>

               {/* Messages */}
               <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-safety-slate scroll-smooth">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn(
                      "flex flex-col max-w-[70%]",
                      msg.sender === 'admin' ? "ml-auto items-end" : "mr-auto items-start"
                    )}>
                      <div className={cn(
                        "p-6 font-bold text-sm border-2",
                        msg.sender === 'admin' 
                          ? "bg-safety-charcoal text-white border-safety-charcoal" 
                          : "bg-white text-safety-charcoal border-safety-charcoal shadow-[8px_8px_0px_rgba(18,18,18,0.1)]"
                      )}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] font-black text-safety-charcoal/30 mt-3 uppercase tracking-widest italic">
                         {msg.sender === 'admin' ? 'OPERATÖR' : 'VATANDAŞ'} • {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
               </div>

               {/* Reply Box */}
               <form onSubmit={handleSend} className="p-8 bg-white border-t-4 border-safety-charcoal flex gap-6">
                  <input 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder="YANITINIZI BURAYA YAZIN..."
                     className="flex-1 bg-safety-slate border-4 border-safety-charcoal px-8 py-5 outline-none focus:bg-white transition-all font-black text-sm uppercase italic"
                  />
                  <button 
                     type="submit" 
                     disabled={!input.trim() || loading}
                     className="bg-safety-charcoal text-safety-yellow px-12 border-4 border-safety-charcoal hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-3 font-black italic uppercase"
                  >
                     <span>GÖNDER</span>
                     <Send size={20} strokeWidth={3} />
                  </button>
               </form>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-10">
               <div className="p-10 bg-safety-slate border-4 border-dashed border-safety-charcoal/20 text-safety-charcoal/10">
                  <Zap size={120} strokeWidth={1} />
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-safety-charcoal/20">MESAJ SEÇİLMEMİŞ</h3>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-safety-charcoal/10 max-w-xs">
                     SOL MENÜDEN BİR SOHBET SEÇEREK VATANDAŞA YANIT VERMEYE BAŞLAYIN
                  </p>
               </div>
            </div>
         )}
      </main>
    </div>
  );
}
