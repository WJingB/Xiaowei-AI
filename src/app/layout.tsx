import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/app-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "午托伴侣 - 老师端",
  description: "为午托班/教培机构老师设计的自动化家校沟通工具",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500&display=swap"
        />
      </head>
      <body>
        <AppProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
