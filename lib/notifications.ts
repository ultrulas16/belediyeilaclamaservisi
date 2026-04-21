// Telegram Bildirim Sistemi
// Bu modül Server-Side çalışır ve belirtilen Telegram botu üzerinden mesaj gönderir.

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Deploy Trigger: Env Update
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramNotification(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    // console.warn("Telegram ayarları eksik. Bildirim gönderilemedi.");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      console.error("Telegram Bildirimi Başarısız:", await response.text());
    }
  } catch (error) {
    console.error("Telegram Hatası:", error);
  }
}

// Hazır Şablonlar
export const notificationTemplates = {
  newLead: (lead: { name: string, phone: string, service: string, location: string }) => `
🚀 <b>YENİ MÜŞTERİ TALEBİ!</b>

👤 <b>İsim:</b> ${lead.name}
📞 <b>Telefon:</b> ${lead.phone}
🛠 <b>Hizmet:</b> ${lead.service}
📍 <b>Bölge:</b> ${lead.location}

<i>Hemen iletişime geçmek için admin panelini kontrol edin.</i>
  `,
  
  newVisitor: (visitor: { ip: string, path: string, referer: string, device: string }) => {
    const isGoogle = visitor.referer.toLowerCase().includes('google');
    return `
📊 <b>ZİYARETÇİ ANALİTİĞİ</b>

📍 <b>İzlenen Sayfa:</b> <code>${visitor.path}</code>
🔍 <b>Geliş Kaynağı:</b> ${isGoogle ? '🔎 Google Arama' : visitor.referer}
📱 <b>Cihaz Tipi:</b> ${visitor.device}
🔢 <b>Ziyaretçi IP:</b> <code>${visitor.ip}</code>

🕒 <i>Tarih: ${new Date().toLocaleString('tr-TR')}</i>
    `;
  },

  newChatMessage: (chat: { roomId: string, content: string, sender: string }) => `
💬 <b>YENİ MESAJ (CANLI DESTEK)</b>

📝 <b>Mesaj:</b> ${chat.content}
👤 <b>Gönderen:</b> ${chat.sender}
🆔 <b>Oda ID:</b> <code>${chat.roomId}</code>

<i>Cevaplamak için admin panelini ziyaret edin.</i>
  `
};

