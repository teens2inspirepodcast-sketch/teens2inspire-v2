import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteOrigin } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: { default: "Teens2Inspire — a little more inspiration", template: "%s | Teens2Inspire" },
  description: "Stories, voices, and good ideas for Jewish teen girls finding their own way.",
  openGraph: {
    type: "website",
    siteName: "Teens2Inspire",
    title: "Teens2Inspire — a little more inspiration",
    description: "A thoughtful space for Jewish teen girls, full of stories, voices, and ideas.",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: "Teens2Inspire", description: "A little more inspiration for wherever you are in life.", images: ["/opengraph-image"] },
  applicationName: "Teens2Inspire",
  category: "lifestyle",
};

export const viewport: Viewport = {
  themeColor: "#151412",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
