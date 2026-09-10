import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const serif = Lora({ variable: "--font-serif", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const preview = `${protocol}://${host}/og.png`;
  return {
    title: "Chance, Data, and Decisions",
    description: "A visual, interactive introduction to probability and statistics—from events to Bayesian inference.",
    icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
    openGraph: { title: "Chance, Data, and Decisions", description: "Model uncertainty. Simulate it. Learn from data.", type: "website", images: [{ url: preview, width: 1536, height: 1024 }] },
    twitter: { card: "summary_large_image", title: "Chance, Data, and Decisions", description: "An interactive introduction to probability and statistics.", images: [preview] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${mono.variable} ${serif.variable}`}>{children}</body></html>;
}
