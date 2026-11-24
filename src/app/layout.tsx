import type { Metadata } from "next";
import { Bricolage_Grotesque, Onest } from "next/font/google";
import "./globals.css";

// Text face.
const text = Onest({ variable: "--font-text", subsets: ["latin"] });
// Headlines.
const grotesque = Bricolage_Grotesque({ variable: "--font-grotesque", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Green Goals: design and build contractor in Qatar",
  description:
    "Green Goals designs, builds and landscapes in Qatar: architecture, BIM, construction, landscaping and artificial grass from one team in Doha.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${text.variable} ${grotesque.variable}`}>
      <body>{children}</body>
    </html>
  );
}
