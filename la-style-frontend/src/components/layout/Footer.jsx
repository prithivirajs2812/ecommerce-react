// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Footer() {
  const shopLinks = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];
  const helpLinks = ['Contact Us', 'FAQs', 'Shipping Info', 'Returns & Exchanges', 'Track Order'];
  const companyLinks = ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'];

  return (
    <footer className="bg-brand-deep text-purple-100">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105 hover:-rotate-1">
            <img src={logo} alt="LA Style" className="h-10 w-auto" />
          </Link>
          <p className="mt-5 text-base text-purple-200 max-w-xs leading-relaxed">
            Your style. Your statement. Premium fashion for every wardrobe.
          </p>
        </div>

        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Help" links={helpLinks} />
        <FooterColumn title="Company" links={companyLinks} />
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-4 text-base text-purple-300">
          <p>&copy; {new Date().getFullYear()} LA Style. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-gold transition-all duration-200 hover:-translate-y-0.5 inline-block">Instagram</a>
            <a href="#" className="hover:text-brand-gold transition-all duration-200 hover:-translate-y-0.5 inline-block">Facebook</a>
            <a href="#" className="hover:text-brand-gold transition-all duration-200 hover:-translate-y-0.5 inline-block">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-display font-[700] text-white text-lg mb-4">{title}</h4>
      <ul className="space-y-2.5 text-base">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="hover:text-brand-gold transition-all duration-200 hover:translate-x-1 inline-block"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}