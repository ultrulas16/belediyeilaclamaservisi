import { Metadata } from "next";
import { FileText, Lock, Eye, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "KVKK ve Gizlilik Politikası | Büyükşehir İlaçlama",
  description: "Kişisel verilerinizin korunması ve gizlilik politikamız hakkında detaylı bilgilendirme.",
};

export default function KVKKPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-slate-50 border-b border-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <Lock size={14} />
            Veri Güvenliği Merkezi
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">KVKK ve Gizlilik Politikası</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Büyükşehir İlaçlama olarak, kişisel verilerinizin güvenliği ve gizliliği bizim için en yüksek önceliğe sahiptir.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-slate prose-lg max-w-none space-y-12">
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-4">
                 <span className="p-2 bg-slate-100 rounded-lg text-slate-600"><FileText size={20} /></span>
                 1. Veri Sorumlusu
              </h2>
              <p className="text-slate-600 leading-relaxed">
                6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, Büyükşehir İlaçlama (“Şirket”), veri sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan amaçlar kapsamında ve mevzuata uygun olarak işlemektedir.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-4">
                 <span className="p-2 bg-slate-100 rounded-lg text-slate-600"><Eye size={20} /></span>
                 2. Kişisel Veri Toplama Yöntemleri
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Kişisel verileriniz; web sitemizdeki iletişim formları, telefon görüşmeleri, WhatsApp destek hattı ve yüz yüze görüşmeler aracılığıyla sözlü, yazılı veya elektronik ortamda toplanabilmektedir. Toplanan veriler arasında isim, soyisim, telefon numarası, e-posta adresi ve hizmet verilecek adres bilgileri yer almaktadır.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-4">
                 <span className="p-2 bg-slate-100 rounded-lg text-slate-600"><Lock size={20} /></span>
                 3. İşleme Amaçları
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Toplanan kişisel verileriniz şu amaçlarla işlenmektedir:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-slate-600 font-medium">
                <li>İlaçlama hizmet taleplerinin randevu planlamasının yapılması.</li>
                <li>Hizmet sonrası faturalama ve raporlama süreçlerinin yürütülmesi.</li>
                <li>Acil müdahale ekiplerinin ilgili adrese yönlendirilmesi.</li>
                <li>Müşteri memnuniyet analizleri ve şikayet yönetim süreçleri.</li>
                <li>Yasal mevzuattan kaynaklanan yükümlülüklerin yerine getirilmesi.</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-4">
                 <span className="p-2 bg-slate-100 rounded-lg text-slate-600"><ShieldAlert size={20} /></span>
                 4. Veri Aktarımı
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Kişisel verileriniz, kanunlarda açıkça öngörülen haller dışında ve hukuki uyuşmazlıklar haricinde üçüncü şahıslarla paylaşılmamaktadır. Verileriniz, hizmetin ifası için gerekli olan sınırlı ölçüde yetkili kamu kurum ve kuruluşları ile paylaşılabilecektir.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 mt-12">
               <h3 className="text-xl font-bold text-blue-900 mb-4">Veri Sahibi Hakları</h3>
               <p className="text-blue-800/80 text-sm leading-relaxed mb-6">
                  KVKK’nın 11. maddesi uyarınca, şirketimize başvurarak verilerinizin işlenip işlenmediğini öğrenme, yanlış işlenmişse düzeltilmesini isteme veya silinmesini talep etme hakkına sahipsiniz.
               </p>
               <a 
                 href="mailto:info@buyuksehirilaclama.com" 
                 className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
               >
                 Talepleriniz için: info@buyuksehirilaclama.com
               </a>
            </div>

            <div className="pt-12 border-t border-gray-100 text-slate-400 text-sm text-center italic">
              Son Güncelleme: 18 Nisan 2026
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
