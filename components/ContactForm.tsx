"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitContactForm } from "@/app/actions";

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  defaultService?: string;
  defaultLocation?: string;
}

export default function ContactForm({ 
  title = "Hızlı İletişim Formu", 
  subtitle = "Bilgilerinizi bırakın, uzman ekiplerimiz 15 dakika içinde sizi arasın.",
  defaultService = "",
  defaultLocation = ""
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);
    if (result.success) {
      setSubmitted(true);
    } else {
      alert(result.error || "Bir hata oluştu.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4 border border-green-100">
        <div className="flex justify-center">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Talebiniz Alındı!</h3>
        <p className="text-gray-600">
          Uzman ekiplerimiz en kısa sürede sizinle iletişime geçecektir. Acil durumlar için lütfen telefon hattımızı kullanın.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-blue-600 font-semibold hover:underline"
        >
          Yeni bir form gönder
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ad Soyad</label>
            <input 
              required
              name="name"
              type="text" 
              placeholder="Örn: Ahmet Yılmaz"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Telefon</label>
            <input 
              required
              name="phone"
              type="tel" 
              placeholder="0533 665 22 51"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Hizmet Türü</label>
          <select 
            name="service"
            defaultValue={defaultService}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
          >
            <option value="">Seçiniz</option>
            <option value="hamambocek">Hamamböceği İlaçlama</option>
            <option value="fare">Fare ve Kemirgen İlaçlama</option>
            <option value="apartman">Apartman ve Site İlaçlama</option>
            <option value="pire">Pire İlaçlama</option>
            <option value="tahtakurusu">Tahtakurusu İlaçlama</option>
            <option value="karinca">Karınca İlaçlama</option>
            <option value="diger">Diğer</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Bölge / Lokasyon (Otomatik)</label>
          <input 
             name="location"
             type="text" 
             readOnly 
             value={defaultLocation}
             className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 outline-none text-sm font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mesajınız (Opsiyonel)</label>
          <textarea 
            name="message"
            rows={3}
            placeholder="Sorununuzu kısaca özetleyin..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 group"
        >
          <span>ÜCRETİZ TEKLİF AL</span>
          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>

        <p className="text-[10px] text-gray-400 text-center uppercase tracking-tighter">
          Kişisel verileriniz KVKK kapsamında korunmakta ve sadece iletişim amacıyla kullanılmaktadır.
        </p>
      </form>
    </div>
  );
}
