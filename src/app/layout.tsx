import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import MenuTab from "@/components/MenuTab";

export const metadata: Metadata = {
  title: "Notes App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full min-h-screen flex-col">
            <Header />
            <main className="flex flex-1 flex-col border border-cyan-300 px-4 pt-8 xl:px-8">
              <div className="flex-1 flex flex-col">
                <MenuTab />
                {/* <div className="flex-1 border border-red-400"></div> */}
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
