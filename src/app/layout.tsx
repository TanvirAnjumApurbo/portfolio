import type { Metadata } from "next";
import { geistSans, geistMono, displayFont } from "@/lib/fonts";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tanvir Anjum Apurbo",
  description:
    "CSE Student / ML & Computer Vision Researcher / Full-stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} antialiased`}
    >
      <body className="bg-background text-foreground">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
