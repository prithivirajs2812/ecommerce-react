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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,11,54,0.92)_0%,rgba(107,33,168,0.75)_40%,rgba(236,30,99,0.25)_100%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40">
          <div className="max-w-2xl text-white">
            {/* One orchestrated entrance: headline, then copy, then buttons, staggered */}
            <h1
              className="font-display font-[800] text-5xl md:text-7xl leading-tight mb-5 animate-pop-in"
              style={{ animationDelay: '0ms' }}
            >
              Your Style. <br /> Your Statement.
            </h1>
            <p
              className="text-xl text-purple-100 mb-10 animate-pop-in"
              style={{ animationDelay: '120ms' }}
            >
              Shop the latest trends in fashion.
            </p>
            <div
              className="flex gap-4 flex-wrap animate-pop-in"
              style={{ animationDelay: '240ms' }}
            >
              <button
                onClick={() => navigate('/shop')}
                className="press bg-brand-pink hover:bg-pink-600 hover:scale-105 hover:-rotate-1 transition-all duration-200 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate('/deals')}
                className="press bg-white/10 border border-white/40 hover:bg-white/20 hover:scale-105 hover:rotate-1 transition-all duration-200 text-white text-lg font-semibold px-8 py-4 rounded-xl backdrop-blur-sm"
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
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-10">
        {items.map((item) => (
          <div
            key={item.title}
            className="text-center transition-transform duration-200 hover:scale-105 hover:-translate-y-1"
          >
            <p className="font-semibold text-gray-800 text-lg">{item.title}</p>
            <p className="text-base text-gray-500">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}