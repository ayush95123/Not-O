import { shadow } from "@/styles/utils";
import Link from "next/link";
import React, { use } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import Logo from "./Logo";
import { LogoutButton } from "./LogoutButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Satisfy } from "next/font/google";

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: "400", // Only available weight for Satisfy
  display: "swap", // Optional, but recommended for performance
  variable: "--font-satisfy", // Optional CSS variable
});

export default async function Header() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <Link href="/" className="flex items-end gap-2">
        <Logo />

        <h1
          className={`${satisfy.className} pb-1 text-center text-xl font-semibold`}
        >
          Not-O
        </h1>
      </Link>
      <div className="flex gap-4">
        {user && <LogoutButton />}
        <DarkModeToggle />
      </div>
    </header>
  );
}
