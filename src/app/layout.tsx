import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { appUrl } from "./constants/config";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-pixelify-sans",
});

const config = {
  title: "Skelly",
  description:
    "SHA-256 entropy, modular arithmetic, and spatial Euclidean positioning.",
  url: appUrl,
};

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: config.title,
    description: config.description,
    type: "website",
    url: config.url,
    images: [
      {
        url: `${config.url}/banner.jpg`,
        width: 1279,
        height: 721,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description: config.description,
    images: [`${config.url}/banner.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pixelifySans.variable} font-pixelify-sans antialiased bg-slate-500`}
      >
        {children}
      </body>
    </html>
  );
}
