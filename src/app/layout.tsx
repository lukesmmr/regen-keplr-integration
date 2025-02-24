import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Regen Keplr Integration", 
  description: "Send Regen to a wallet on the Regen Redwood Testnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
