// src/components/layout/IntroSplash.jsx
import { useState, useRef, useEffect } from 'react';

export default function IntroSplash({ onFinish }) {
  const [fadingOut, setFadingOut] = useState(false);
  const videoRef = useRef(null);

  const finish = () => {
    setFadingOut(true);
    setTimeout(onFinish, 400);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      finish();
    });
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-brand-deep overflow-hidden transition-opacity duration-400 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        muted
        playsInline
        onEnded={finish}
        className="w-full h-full object-cover"
      />

      <button
        onClick={finish}
        className="absolute bottom-8 right-8 text-white/70 hover:text-white text-sm font-medium transition-colors"
      >
        Skip →
      </button>
    </div>
  );
}