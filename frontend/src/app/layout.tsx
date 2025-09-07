import type { Metadata } from "next";
import "./globals.css";
import Providers from "../providers";

export const metadata: Metadata = {
  title: "IRMS - Idle Resource Management System",
  description: "System for managing idle resources and workforce allocation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
