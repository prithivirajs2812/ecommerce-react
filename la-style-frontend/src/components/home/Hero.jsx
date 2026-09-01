// src/components/home/Hero.jsx
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/hero.png';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <>
      <section
        className="relative overflow-hidden bg-cover bg-top md:bg-[center_top_15%]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(30,11,54,0.82)_0%,rgba(30,11,54,0.55)_45%,rgba(30,11,54,0.08)_100%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-44">
          <div className="max-w-xl text-white">
            <p className="font-ui text-[12px] tracking-[0.12em] text-brand-gold mb-4">New Season Arrivals</p>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.08] mb-6 font-medium">
              Your style,<br />your statement.
            </h1>
            <div className="h-px w-14 bg-white/30 mb-6" />
            <p className="text-[15px] font-ui text-purple-100/90 mb-9 max-w-sm">
              Considered fashion, sourced from independent sellers who care about the craft.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/shop')}
                className="bg-brand-pink hover:bg-pink-600 transition-colors text-white font-ui text-sm font-medium px-7 py-3 rounded-lg"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate('/deals')}
                className="border border-white/40 hover:border-brand-gold hover:text-brand-gold transition-colors text-white font-ui text-sm font-medium px-7 py-3 rounded-lg"
              >
                Explore Deals
              </button>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />
    </>
  );
}

function TrustBar() {
  const items = [
    { title: 'Free Delivery', subtitle: 'On all orders' },
    { title: 'Secure Payments', subtitle: '100% safe & secure' },
    { title: 'Easy Returns', subtitle: '7 days return policy' },
    { title: 'Best Quality', subtitle: 'Premium products' },
  ];

  return (
    <div className="bg-white border-b border-brand-deep/8">
      <div className="max-w-7xl mx-auto px-6 py-7 grid grid-cols-2 md:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={item.title}
            className={`text-center px-4 ${i !== 0 ? 'md:border-l border-brand-deep/8' : ''}`}
          >
            <p className="font-display text-[15px] text-brand-deep">{item.title}</p>
            <p className="text-[12px] font-ui text-brand-deep/45 mt-0.5">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}