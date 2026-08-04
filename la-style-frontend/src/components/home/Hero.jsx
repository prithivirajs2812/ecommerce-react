// src/components/home/Hero.jsx
import heroImage from '../../assets/hero.png';
import { Link } from 'react-router-dom';

export default function Hero() {

  return (
    <>
      <section
  className="relative overflow-hidden bg-cover bg-top md:bg-[center_top_15%]"
  style={{ backgroundImage: `url(${heroImage})` }}
>
        {/* Gradient overlay so white text stays readable over the illustration */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,11,54,0.92)_0%,rgba(107,33,168,0.75)_40%,rgba(236,30,99,0.25)_100%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40">
          <div className="max-w-xl text-white">
            <h1 className="font-display font-[800] text-4xl md:text-6xl leading-tight mb-4">
              Your Style. <br /> Your Statement.
            </h1>
            <p className="text-lg text-purple-100 mb-8">
              Shop the latest trends in fashion.
            </p>
            <div className="flex gap-4">
             <Link to="/shop"><button className="bg-brand-pink hover:bg-pink-600 transition-colors text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
                Shop Now
              </button></Link>
              <button className="bg-white/10 border border-white/40 hover:bg-white/20 transition-colors text-white font-semibold px-6 py-3 rounded-lg backdrop-blur-sm">
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
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-10">
        {items.map((item) => (
          <div key={item.title} className="text-center">
            <p className="font-semibold text-gray-800">{item.title}</p>
            <p className="text-sm text-gray-500">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}