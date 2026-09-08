// src/pages/Home.jsx
import Hero from '../components/home/Hero';

export default function Home() {
  return (
    // The one loud moment on the site — moved here from the global App
    // wrapper so it's specific to Home instead of following you everywhere.
    <div className="bg-[radial-gradient(125%_125%_at_50%_90%,_#fff_20%,_#f8aff6_100%)]">
      <Hero />
      {/* Category grid, deals section, etc. — built in the next steps */}
    </div>
  );
}