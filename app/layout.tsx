import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { wedding } from "@/lib/config";
import BackgroundMusic from "@/components/BackgroundMusic";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${wedding.couple.a} & ${wedding.couple.b} · Wedding Invitation`,
  description: `Join us on ${wedding.displayDate}.`,
  openGraph: {
    title: `${wedding.couple.a} & ${wedding.couple.b}`,
    description: `Join us on ${wedding.displayDate}.`,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        <BackgroundMusic />
      </body>
    </html>
  );
}
