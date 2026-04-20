// Telegram Bildirim Sistemi
// Bu modül Server-Side çalışır ve belirtilen Telegram botu üzerinden mesaj gönderir.

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
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
  
  newVisitor: (visitor: { ip: string, path: string, referer: string, device: string }) => `
👀 <b>YENİ ZİYARETÇİ!</b>

📍 <b>Sayfa:</b> ${visitor.path}
🌐 <b>Kaynak:</b> ${visitor.referer}
📱 <b>Cihaz:</b> ${visitor.device}
🔢 <b>IP:</b> ${visitor.ip}
  `
};
