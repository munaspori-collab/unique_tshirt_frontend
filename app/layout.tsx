import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default: "Unique T-shirts | Premium Fashion for Everyone",
    template: "%s | Unique T-shirts",
  },
  description: "Discover premium quality t-shirts crafted with care. From classic designs to limited editions, express your unique style with our curated collections. Shop now!",
  keywords: [
    "unique t-shirts",
    "premium t-shirts",
    "fashion t-shirts",
    "limited edition t-shirts",
    "seasonal t-shirts",
    "custom t-shirts",
    "designer t-shirts",
    "quality t-shirts",
    "unique fashion",
    "online t-shirt store",
  ],
  authors: [{ name: "Unique T-shirts", url: "https://munaspori-collab.github.io/unique_tshirt_frontend" }],
  creator: "Unique T-shirts",
  publisher: "Unique T-shirts",
  metadataBase: new URL("https://munaspori-collab.github.io/unique_tshirt_frontend"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Unique T-shirts | Premium Fashion for Everyone",
    description: "Discover premium quality t-shirts crafted with care. From classic designs to limited editions, express your unique style with our curated collections.",
    url: "https://munaspori-collab.github.io/unique_tshirt_frontend",
    siteName: "Unique T-shirts",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Unique T-shirts - Premium Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unique T-shirts | Premium Fashion for Everyone",
    description: "Discover premium quality t-shirts crafted with care. Shop limited editions and seasonal collections.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <GoogleAnalytics />
      </head>
      <body className="antialiased">
        <Providers>
          <Header />
          <main className="pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
