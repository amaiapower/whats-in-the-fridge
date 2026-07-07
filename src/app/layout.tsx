import type { Metadata } from "next";
import { Handlee, Nunito } from "next/font/google";
import "./globals.css";

const handlee = Handlee({
  variable: "--font-retro-scrawl",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "What's in the Fridge?",
  description:
    "Tell us what you've got, pick a vibe, and we'll dream up an original recipe for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${handlee.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream font-body text-ink">
        {children}
      </body>
    </html>
  );
}
