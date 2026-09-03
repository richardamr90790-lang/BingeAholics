import type { Metadata } from "next";
import { Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const marker = Permanent_Marker({
  weight: "400",
  variable: "--font-marker",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bingeaholics",
  description: "Track your progress through recap video series.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${marker.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="app-bg" aria-hidden="true" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
