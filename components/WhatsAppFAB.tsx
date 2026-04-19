"use client";

import { siteConfig } from "@/lib/config";

export default function WhatsAppFAB() {
  const handleClick = () => {
    window.open(`https://wa.me/${siteConfig.whatsapp}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
      aria-label="WhatsApp'tan iletişime geçin"
    >
      <div className="absolute -top-12 right-0 hidden whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-xl group-hover:block animate-bounce mb-2">
        Size nasıl yardımcı olabiliriz?
        <div className="absolute right-6 top-full h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
      </div>
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.983.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.993c-.001 5.45-4.436 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.004 12.049c0 2.12.554 4.189 1.605 6.02L0 24l6.135-1.61a11.854 11.854 0 005.91 1.587h.005c6.634 0 12.043-5.412 12.043-12.05a11.782 11.782 0 00-3.483-8.52z" />
      </svg>
    </button>
  );
}
