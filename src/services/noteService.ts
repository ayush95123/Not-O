// src/services/noteService.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function addNote(userId: string, title: string, content: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("notes")
    .insert({ user_id: userId, title, content });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
