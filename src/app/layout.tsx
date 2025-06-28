import type { Metadata } from "next";
import "./globals.css";
import Providers from '../components/Providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CryptoTicker from '../components/CryptoTicker';

export const metadata: Metadata = {
  title: "InfoCryptoX.com - Latest Cryptocurrency News & Analysis",
  description: "Your premier source for cryptocurrency news, analysis and research. Stay updated with Bitcoin, Ethereum, DeFi and altcoin news from infocryptox.com.",
  keywords: ["cryptocurrency", "bitcoin", "ethereum", "infocryptox.com", "blockchain", "DeFi", "crypto analysis"],
  authors: [{ name: "InfoCryptoX Team" }],
  creator: "InfoCryptoX.com",
  publisher: "InfoCryptoX.com",
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
    locale: 'en_US',
    url: '/',
    title: 'InfoCryptoX.com - Latest Cryptocurrency News & Analysis',
    description: 'Your premier source for cryptocurrency news, analysis and research. Stay updated with infocryptox.com.',
    siteName: 'InfoCryptoX.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InfoCryptoX.com - Latest Cryptocurrency News & Analysis',
    description: 'Your premier source for cryptocurrency news, analysis and research. Stay updated with infocryptox.com.',
    creator: '@infocryptox',
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
