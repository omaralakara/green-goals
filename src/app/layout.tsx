import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// The one typeface of the site, for headings and text: IBM Plex Sans, drawn for engineering documents.
const text = IBM_Plex_Sans({ variable: "--font-text", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Green Goals: design and build contractor in Qatar",
  description:
    "Green Goals designs, builds and landscapes in Qatar: architecture, BIM, construction, landscaping and artificial grass from one team in Doha.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={text.variable}>
      <body>{children}</body>
    </html>
  );
}
