import { shadow } from "@/styles/utils";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { useTheme } from "next-themes";
import Logo from "./Logo";

function Header() {
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
        {/* Login/Logout */}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
