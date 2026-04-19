"use server";

import { cookies } from "next/headers";

export async function loginAction(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || "buyuksehir2026";

  if (password === adminPassword) {
    // Set a secure cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Geçersiz şifre." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
