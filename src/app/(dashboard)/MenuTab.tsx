"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";

function MenuTab() {
  const router = useRouter();
  const pathname = usePathname();

  const getTabValue = () => {
    if (pathname.includes("/saved")) return "saved";
    if (pathname.includes("/archives")) return "archives";
    if (pathname.includes("/new-note")) return "new-note";
    return "saved"; // fallback
  };

  return (
    <div>
      <Tabs
        defaultValue={getTabValue()}
        onValueChange={(val) => router.push(`/${val}`)}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="saved">Saved Notes</TabsTrigger>
          <TabsTrigger value="archives">Archives</TabsTrigger>
          <TabsTrigger value="new-note">New Note</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default MenuTab;
