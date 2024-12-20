import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from 'next/font/google';
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-plus-jakarta',
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Upfront Ops Pipeline Health Calculator",
  description: "Generated by Upfront Ops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <main>
          {children}
        </main>
        <SpeedInsights />
        <script dangerouslySetInnerHTML={{
          __html: `
            function sendHeight() {
              const height = document.documentElement.scrollHeight;
              window.parent.postMessage({
                type: 'calculator-resize',
                height: height
              }, '*');
            }
            sendHeight();
            setTimeout(sendHeight, 1000);
            new ResizeObserver(() => sendHeight()).observe(document.body);
          `
        }} />
      </body>
    </html>
  );
}//