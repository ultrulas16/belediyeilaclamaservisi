const token = "8687186730:AAHHjmMUJC5yRXZpiruot88UVr4Z5WS1c_A";
const chatId = "6283303829";
const message = "🚀 BÜYÜKŞEHİR İLAÇLAMA - TEST BİLDİRİMİ BAŞARILI!\n\nAnlık bildirim sisteminiz şu an aktif. Müşterilerinizden gelen mesajlar ve formlar artık bu şekilde cebinize düşecek.";

async function test() {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });
    const result = await response.json();
    if (result.ok) {
      console.log("Test mesajı başarıyla gönderildi!");
    } else {
      console.error("Hata:", result);
    }
  } catch (err) {
    console.error("Sistem Hatası:", err);
  }
}

test();
