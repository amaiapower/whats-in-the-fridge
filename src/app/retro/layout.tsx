import { Handlee } from "next/font/google";

const retroScrawl = Handlee({
  variable: "--font-retro-scrawl",
  subsets: ["latin"],
  weight: "400",
});

export default function RetroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${retroScrawl.variable} retro-theme min-h-full flex flex-col flex-1`}>
      {children}
    </div>
  );
}
