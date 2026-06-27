import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Grain } from "@/components/Grain";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

// Fraunces italic, for editorial emphasis in the hero headline. A variable
// google font can't take an array of styles, so we load italic as its own
// instance and expose it through a second CSS variable.
const frauncesItalic = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces-italic",
  display: "swap",
  style: "italic",
  axes: ["opsz", "SOFT", "WONK"],
});

// Body / UI. A warm humanist grotesque — deliberately not Inter/Geist, the two
// faces every AI builder defaults to. Carries character without shouting.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

// Monospace, used semantically: the machine-checked artifacts (cited words,
// tense particles, live metrics) are set in mono so "verified in code" is
// legible in the typography itself, not just claimed in prose.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lantern-cyan.vercel.app"),
  title: "Lantern, carry the light of a language forward",
  description:
    "A language dies every two weeks. Lantern turns a handful of phrases from an endangered language into a living, growing course, with AI that learns the language's structure from the community's own words, never inventing what it cannot see.",
  openGraph: {
    title: "Lantern, Duolingo for languages that are dying",
    description:
      "A language dies every two weeks. Lantern turns the words a community still remembers into a real course, with AI that never invents a word.",
    type: "website",
    url: "https://lantern-cyan.vercel.app",
    siteName: "Lantern",
    images: [
      {
        url: "/og.png",
        width: 1800,
        height: 1200,
        alt: "Lantern, Duolingo for languages that are dying",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lantern, Duolingo for languages that are dying",
    description:
      "A language dies every two weeks. Lantern turns the words a community still remembers into a real course, with AI that never invents a word.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${frauncesItalic.variable} ${hanken.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Grain />
      </body>
    </html>
  );
}
