import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Modern Tailwind sınıf birleştirme fonksiyonu.
 * Çakışan sınıfları temizler ve koşullu sınıfları güvenle yönetir.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
