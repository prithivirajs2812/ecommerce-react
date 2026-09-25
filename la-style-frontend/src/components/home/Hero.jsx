// src/components/home/Hero.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getDeals } from '../../api/productApi';
import heroImage from '../../assets/hero.png';

const AUTOPLAY_MS = 5000;

export default function Hero() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [index, setIndex] = useState(0);

  // Pull the current top discounts — whatever a seller has active shows up here automatically.
  useEffect(() => {
    let ignore = false;
    getDeals(0, 5)
      .then((res) => {
        if (!ignore) setDeals(res.data.content.filter((p) => p.image));
      })
      .catch(() => {
        if (!ignore) setDeals([]);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Build the full rotation: the default brand slide first, then every active deal.
  // With one deal this gives [default, deal] so it still alternates back and forth
  // instead of freezing on a single slide.
  const slides = useMemo(
    () => [{ type: 'default' }, ...deals.map((d) => ({ type: 'deal', product: d }))],
    [deals]
  );

  const slideCount = slides.length;

  // Derived at render time instead of "corrected" inside an effect — deals can load
  // after the first render and shrink/grow the list, so this keeps index safe without
  // ever calling setState synchronously from an effect body.
  const safeIndex = index < slideCount ? index : 0;

  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slideCount);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [slideCount]);

  const goTo = useCallback((i) => setIndex(i), []);

  const active = slides[safeIndex] || slides[0];
  const activeDeal = active?.type === 'deal' ? active.product : null;
  const bgImage = activeDeal?.image || heroImage;

  return (
    <>
      <section className="relative overflow-hidden h-[520px] md:h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDeal?.id ?? 'default-bg'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-cover bg-top md:bg-[center_top_15%]"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,11,54,0.92)_0%,rgba(107,33,168,0.75)_40%,rgba(236,30,99,0.25)_100%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40 h-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDeal?.id ?? 'default-copy'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl text-white"
            >
              {activeDeal ? (
                <>
                  <span className="inline-block bg-brand-pink text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5">
                    {activeDeal.discountPercent}% OFF — Limited Time
                  </span>
                  <h1 className="font-display font-[800] text-4xl md:text-6xl leading-tight mb-5">
                    {activeDeal.title}
                  </h1>
                  <p className="text-xl text-purple-100 mb-3">
                    Now <span className="font-bold text-white">₹{activeDeal.effectivePrice}</span>{' '}
                    <span className="line-through text-purple-300">₹{activeDeal.price}</span>
                  </p>
                  <p className="text-lg text-purple-100 mb-10">Grab this deal before it's gone.</p>
                  <div className="flex gap-4 flex-wrap">
                    <button
                      onClick={() => navigate(`/products/${activeDeal.id}`)}
                      className="press bg-brand-pink hover:bg-pink-600 hover:scale-105 transition-all duration-200 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg"
                    >
                      Shop This Deal
                    </button>
                    <button
                      onClick={() => navigate('/deals')}
                      className="press bg-white/10 border border-white/40 hover:bg-white/20 hover:scale-105 transition-all duration-200 text-white text-lg font-semibold px-8 py-4 rounded-xl backdrop-blur-sm"
                    >
                      Explore Deals
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="font-display font-[800] text-5xl md:text-7xl leading-tight mb-5">
                    Your Style. <br /> Your Statement.
                  </h1>
                  <p className="text-xl text-purple-100 mb-10">Shop the latest trends in fashion.</p>
                  <div className="flex gap-4 flex-wrap">
                    <button
                      onClick={() => navigate('/shop')}
                      className="press bg-brand-pink hover:bg-pink-600 hover:scale-105 transition-all duration-200 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg"
                    >
                      Shop Now
                    </button>
                    <button
                      onClick={() => navigate('/deals')}
                      className="press bg-white/10 border border-white/40 hover:bg-white/20 hover:scale-105 transition-all duration-200 text-white text-lg font-semibold px-8 py-4 rounded-xl backdrop-blur-sm"
                    >
                      Explore Deals
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {slideCount > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((s, i) => (
              <button
                key={s.type === 'deal' ? s.product.id : 'default'}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === safeIndex ? 'w-8 bg-brand-pink' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
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