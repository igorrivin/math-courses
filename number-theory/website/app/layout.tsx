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
    title: "Patterns, Proofs, and Primes",
    description: "An interactive, proof-oriented introduction to number theory—from Euclid to Chebyshev.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: "Patterns, Proofs, and Primes", description: "Touch the patterns. Follow them to a proof.", type: "website", images: [{ url: preview, width: 1731, height: 909 }] },
    twitter: { card: "summary_large_image", title: "Patterns, Proofs, and Primes", description: "An interactive introduction to number theory.", images: [preview] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${mono.variable} ${serif.variable}`}>{children}</body></html>;
}
