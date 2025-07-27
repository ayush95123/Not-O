"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function Logo() {
  const { resolvedTheme,theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
      setMounted(true);
  }, []);

   // 🔍 Log current selected theme and resolved system theme
//   useEffect(() => {
//     if (mounted) {
//       console.log("Selected theme:", theme); // 'light', 'dark', or 'system'
//       console.log("Resolved (actual) theme:", resolvedTheme); // 'light' or 'dark'
//       console.log("system prefers dark?", window.matchMedia('(prefers-color-scheme: dark)').matches);
//     }
//   }, [resolvedTheme, theme, mounted]);

  if (!mounted) return null;
  return (
    <div>
      {mounted && (
        <Image
          src={resolvedTheme === "dark" ? "/notes.png" : "/notes-white.png"}
          alt="logo"
          width={50}
          height={50}
          className="rounded-sm"
          priority
        />
      )}
    </div>
  );
}

export default Logo;
