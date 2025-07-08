import Home from './home/page';

export const revalidate = 120;

export const metadata = {
  title: 'InfoCryptoX – Cryptocurrency News',
  description: 'Latest cryptocurrency news, analysis and research.',
};

export default async function HomePage() {
  return <Home />;
}
