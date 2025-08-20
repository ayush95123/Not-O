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

export async function getNotes(userId: string, archived?: boolean) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (typeof archived === "boolean") {
    query = query.eq("is_archived", archived);
  }

  const { data, error } = await query;

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

export async function setArchived(
  userId: string,
  id: string,
  archived: boolean,
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("notes")
    .update({ is_archived: archived })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
