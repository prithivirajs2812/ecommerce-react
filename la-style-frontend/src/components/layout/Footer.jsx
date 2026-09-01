// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  const shopLinks = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];
  const helpLinks = ['Contact Us', 'FAQs', 'Shipping Info', 'Returns & Exchanges', 'Track Order'];
  const companyLinks = ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'];

  return (
    <footer className="bg-brand-deep text-purple-200">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="font-display text-3xl text-white tracking-tight">
            LA Style
          </Link>
          <div className="h-px w-10 bg-brand-gold my-4" />
          <p className="text-[13px] leading-relaxed text-purple-300 max-w-xs">
            Your style. Your statement. Considered fashion for every wardrobe.
          </p>
        </div>

        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Help" links={helpLinks} />
        <FooterColumn title="Company" links={companyLinks} />
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-purple-400 font-ui">
          <p>&copy; {new Date().getFullYear()} LA Style. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-gold transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Facebook</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-ui text-[12px] tracking-[0.08em] text-white/90 mb-4">{title}</h4>
      <ul className="space-y-2.5 text-[13px] font-ui">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-purple-300 hover:text-brand-gold transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}