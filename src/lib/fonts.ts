import { Geist, Geist_Mono, Outfit } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const displayFont = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});
