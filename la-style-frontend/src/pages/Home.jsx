// src/pages/Home.jsx
import Hero from '../components/home/Hero';
import TrendingProducts from '../components/home/TrendingProducts';

export default function Home() {
  return (
    <div className="bg-[radial-gradient(125%_125%_at_50%_90%,_#fff_20%,_#f8aff6_100%)]">
      <Hero />
      <TrendingProducts />
    </div>
  );
}