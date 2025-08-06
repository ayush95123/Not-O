import { shadow } from "@/styles/utils";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { useTheme } from "next-themes";
import Logo from "./Logo";
import { LogoutButton } from "./LogoutButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <Link href="/" className="flex items-end gap-2">
        <Logo />

        <h1 className="flex flex-col pb-1 text-xl leading-6 font-semibold">
          NOTE<span>Pilot</span>
        </h1>
      </Link>
      <div className="flex gap-4">
        {user && <LogoutButton/>}
        <DarkModeToggle />
      </div>
    </header>
  );
}

