// src/pages/About.jsx
export default function About() {
  return (
    // Quieter echo of the Home gradient — smaller radius, lower opacity,
    // so Home stays the loudest page and this feels like a soft reprise.
    <div className="min-h-screen bg-[radial-gradient(90%_60%_at_50%_100%,_#fff_45%,_#f8aff6_100%)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display font-[800] text-3xl text-brand-deep mb-6">About Us</h1>
        <div className="prose text-gray-600 space-y-4 leading-relaxed">
          <p>
            LA Style is a fashion-forward marketplace connecting independent sellers with
            shoppers who want to express their own sense of style. We built this platform to
            make it easy for small and growing fashion businesses to reach customers, and for
            shoppers to discover pieces they won't find everywhere else.
          </p>
          <p>
            Every seller on LA Style is verified before their products go live, so you can shop
            with confidence knowing you're supporting real, accountable businesses.
          </p>
        </div>
      </div>
    </div>
  );
}