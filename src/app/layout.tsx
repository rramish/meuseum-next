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
  weight:['400']
});

export const metadata: Metadata = {
  title: "Mosida",
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
        className={`${geistSans.variable} ${marcellus_sc.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
