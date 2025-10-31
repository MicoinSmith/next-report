"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "@/assets/globals.css";
import { ThemeProvider } from "next-themes";
import Slidebar from "@/components/Slidebar";
import { MessageProvider } from "@/components/ui/Message";
import { UserConfigProvider } from "@/contexts/UserConfigContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { api } from "@/HTTP/api";
import { useEffect } from "react";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {

  useEffect(() => {
    const checkHealth = async () => {
      const res = await api.health();
      Message[res.status == 'ok' ? 'success' : 'error'](res.message);
    };
    checkHealth();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" themes={["light", "dark", "system"]}>
          <UserConfigProvider>
            <TaskProvider>
              <MessageProvider>
                <div className="flex">
                  {/* <Slidebar /> */}
                  <div className="min-h-svh flex-1">
                    <Header />
                    <div className="h-full max-h-[calc(100vh-48px)] flex overflow-hidden">
                      {children}
                    </div>
                  </div>
                </div>
              </MessageProvider>
            </TaskProvider>
          </UserConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
