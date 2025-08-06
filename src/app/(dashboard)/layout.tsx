import MenuTab from "@/app/(dashboard)/MenuTab";
import React from "react";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <MenuTab />
      {children}
    </div>
  );
}

export default layout;
