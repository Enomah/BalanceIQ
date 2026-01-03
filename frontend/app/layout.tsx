import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GeneralAppProvider from "@/components/ui/GeneralAppProvider";
import PwaRegistrar from "@/components/ui/PwaRegistrar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BalanceIQ",
  description:
    "BalanceIQ helps you manage income, expenses, and savings with actionable financial insights.",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BalanceIQ",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import ToastContainer from "@/components/ui/ToastContainer";
import QueryProvider from "@/lib/api/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <GeneralAppProvider>{children}</GeneralAppProvider>
          <ToastContainer />
          <PwaRegistrar />
        </QueryProvider>
      </body>
    </html>
  );
}
