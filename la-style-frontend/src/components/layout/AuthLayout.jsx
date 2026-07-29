// src/components/layout/AuthLayout.jsx
import heroImage from '../../assets/doodle.svg';

export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-[80vh] flex items-center justify-center bg-cover bg-center px-6 py-12 relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(107,33,168,0.92)_0%,rgba(236,30,99,0.92)_100%)]" />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {children}
      </div>
    </div>
  );
}