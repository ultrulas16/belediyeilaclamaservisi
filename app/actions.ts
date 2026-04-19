"use server";

import { addLead, updateLeadStatus } from "@/lib/db";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function changeLeadStatus(id: string, status: any) {
  await updateLeadStatus(id, status);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
