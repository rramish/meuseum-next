import type { Metadata } from "next";
import { Geist, Marcellus_SC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const marcellus_sc = Marcellus_SC({
  variable: "--font-marcellus_sc",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "MOSIDA - First Social Interactive Digital Art Museum in the World",
  description: "Mosida drawing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${marcellus_sc.variable} antialiased w-full h-full flex-1 max-h-full bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
