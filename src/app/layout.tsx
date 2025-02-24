import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Regen Keplr Integration',
  description: 'Send Regen to a wallet on the Regen Redwood Testnet',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${openSans.className} antialiased bg-[url('https://cdn.sanity.io/images/jm12rn9t/production/ae3ddf5597959dde431d48ba343b3f25461130bf-2880x1728.jpg')] bg-cover bg-no-repeat bg-center min-h-screen`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
