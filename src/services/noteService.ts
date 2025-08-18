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

export async function getNotes(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateNote(id: string, title: string, content: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
