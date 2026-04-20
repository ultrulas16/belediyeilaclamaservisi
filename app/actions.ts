"use server";

import { addLead, updateLeadStatus, logVisit } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { sendTelegramNotification, notificationTemplates } from "@/lib/notifications";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const service = formData.get("service") as string;
  const location = formData.get("location") as string;
  const message = formData.get("message") as string;

  if (!name || !phone) {
    return { error: "İsim ve telefon zorunludur." };
  }

  const result = await addLead({
    name,
    phone,
    service,
    location: location || "Belirtilmedi",
    message: message || "Mesaj yok"
  });

  if (!result) {
    return { error: "Talep iletilemedi. Lütfen daha sonra tekrar deneyin." };
  }

  // Telegram Bildirimi Gönder
  await sendTelegramNotification(notificationTemplates.newLead({
    name,
    phone,
    service,
    location: location || "Belirtilmedi"
  }));

  revalidatePath("/admin/leads");
  return { success: true };
}


export async function changeLeadStatus(id: string, status: any) {
  await updateLeadStatus(id, status);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function trackVisit(path: string, clientReferrer?: string) {
  try {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const userAgent = headerList.get("user-agent") || "unknown";
    
    // Basit cihaz tanıma
    let device = "Masaüstü";
    if (userAgent.includes("iPhone")) device = "iPhone";
    else if (userAgent.includes("Android")) device = "Android";
    else if (userAgent.includes("iPad")) device = "iPad";

    const referer = clientReferrer || headerList.get("referer") || "Direkt Giriş";

    await logVisit({
      ip,
      referer,
      path,
      user_agent: userAgent
    });

    // Telegram Bildirimi Gönder (Sadece ana sayfa ve hizmet sayfaları için kafa karıştırmasın)
    if (path === "/" || path.startsWith("/hizmetler")) {
      await sendTelegramNotification(notificationTemplates.newVisitor({
        ip,
        path,
        referer,
        device
      }));
    }
  } catch (error) {
    console.error("Tracking error:", error);
  }
}

// CHAT ACTIONS
import { getOrCreateChatRoom, sendMessage, getChatMessages, getActiveChatRooms, supabaseAdmin } from "@/lib/db";

export async function getChatRoomAction(sessionId: string, name?: string, phone?: string) {
  return await getOrCreateChatRoom(sessionId, name, phone);
}

export async function sendChatMessageAction(roomId: string, content: string, sender: 'visitor' | 'admin') {
  const message = await sendMessage(roomId, content, sender);
  
  if (message && sender === 'visitor' && supabaseAdmin) {
    // Odadan kullanıcı bilgilerini alalım (Bildirim için)
    const { data: room } = await supabaseAdmin
      .from('chat_sessions')
      .select('full_name, phone')
      .eq('session_id', roomId)
      .single();

    // Ziyaretçi yazdığında admini uyar
    await sendTelegramNotification(notificationTemplates.newChatMessage({
      roomId,
      content,
      sender: room ? `${room.full_name} (${room.phone})` : "Ziyaretçi"
    }));
  }
  
  return message;
}

export async function getChatMessagesAction(roomId: string) {
  return await getChatMessages(roomId);
}

export async function getActiveChatRoomsAction() {
  return await getActiveChatRooms();
}




