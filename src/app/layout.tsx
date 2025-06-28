import type { Metadata } from "next";
import "./globals.css";
import Providers from '../components/Providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CryptoTicker from '../components/CryptoTicker';

export const metadata: Metadata = {
  title: "CryptoNews UK - Latest Cryptocurrency News & Analysis",
  description: "Your premier source for cryptocurrency news, analysis and research in the United Kingdom. Stay updated with Bitcoin, Ethereum, DeFi and altcoin news.",
  keywords: ["cryptocurrency", "bitcoin", "ethereum", "crypto news", "blockchain", "DeFi", "UK"],
  authors: [{ name: "CryptoNews UK Team" }],
  creator: "CryptoNews UK",
  publisher: "CryptoNews UK",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_UK',
    url: '/',
    title: 'CryptoNews UK - Latest Cryptocurrency News & Analysis',
    description: 'Your premier source for cryptocurrency news, analysis and research in the United Kingdom.',
    siteName: 'CryptoNews UK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoNews UK - Latest Cryptocurrency News & Analysis',
    description: 'Your premier source for cryptocurrency news, analysis and research in the United Kingdom.',
    creator: '@cryptonewsuk',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-slate-900 text-white antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <CryptoTicker />
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
