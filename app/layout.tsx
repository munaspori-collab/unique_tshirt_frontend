import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Unique T-shirts | Premium Fashion for Everyone",
  description: "Discover premium quality t-shirts crafted with care. From classic designs to limited editions, express your unique style with our curated collections.",
  keywords: "t-shirts, fashion, premium clothing, men's fashion, women's fashion, unisex clothing, limited edition",
  authors: [{ name: "Unique T-shirts" }],
  openGraph: {
    title: "Unique T-shirts | Premium Fashion for Everyone",
    description: "Discover premium quality t-shirts crafted with care.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
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
