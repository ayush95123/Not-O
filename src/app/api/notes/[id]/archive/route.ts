import { NextResponse } from "next/server";
import { setArchived } from "@/services/noteService";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const note = await setArchived(user.id, params.id, true);
    return NextResponse.json({ success: true, note, message: "Note archived" });
  } catch (err: any) {
    if (String(err.message).includes("0 rows")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
