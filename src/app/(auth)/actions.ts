"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(_: unknown, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login error:", error.message);
    return { error: error.message };
    // redirect('/error') // Optional: handle error display
  }

  // revalidatePath("/", "layout");
  // redirect("/dashboard");
  return redirect("/saved");
}

export async function signup(_: unknown, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Please provide both email and password" };
  }

  // Custom validations
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  // Your Supabase or DB signup logic here...
  const { data, error } = await supabase.auth.signUp({ email, password });

  console.log("Signup response identities:", data);

  // ⚠️ Supabase behavior: Repeated signups return status 200, but no session/user
  if (data?.user?.identities?.length === 0) {
    console.error("Signup error: User already exists or signup failed");
    return {
      error: "This email is already registered. Please log in instead.",
    };
  }

  if (error) return { error: error.message };

  return { error: "", message: "Signup successful" };
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  // if (error) return { error: error.message };
  // Redirect to login page after logout
  redirect("/login");
}
