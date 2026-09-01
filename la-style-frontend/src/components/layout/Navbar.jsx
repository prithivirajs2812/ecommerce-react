// src/components/layout/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import useAuthStore from '../../store/useAuthStore';
import { logoutUser } from '../../api/authApi';
import NotificationBell from './NotificationBell';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/deals', label: 'Deals' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const logout = useAuthStore((state) => state.logout);
  const roles = useAuthStore((state) => state.roles) || [];
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser(refreshToken);
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="w-full bg-brand-ivory/90 backdrop-blur-sm border-b border-brand-deep/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center shrink-0">
          <img src={logo} alt="LA Style" className="h-11 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-9 font-ui text-[13px] tracking-[0.04em] text-brand-deep/80">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative py-1 hover:text-brand-deep transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-brand-gold after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-brand-deep">
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search"
              className="hover:text-brand-pink transition-colors"
            >
              <SearchIcon />
            </button>

            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 mt-3 w-64 bg-white rounded-lg border border-brand-deep/10 shadow-[0_8px_30px_-8px_rgba(30,11,54,0.18)] p-2 z-50"
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full border border-brand-deep/15 rounded-md px-3 py-2 text-sm font-ui focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </form>
            )}
          </div>

          <Link to="/cart" aria-label="Cart" className="hover:text-brand-pink transition-colors">
            <CartIcon />
          </Link>

          {isAuthenticated && <NotificationBell />}

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 hover:text-brand-pink transition-colors"
              >
                <UserIcon />
                <span className="hidden lg:inline font-ui text-[13px] font-medium">
                  {user?.email?.split('@')[0]}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg border border-brand-deep/10 shadow-[0_8px_30px_-8px_rgba(30,11,54,0.18)] py-2 z-50 font-ui">
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-[13px] text-brand-deep/80 hover:bg-brand-ivory">
                    My Profile
                  </Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-[13px] text-brand-deep/80 hover:bg-brand-ivory">
                    My Orders
                  </Link>
                  <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-[13px] text-brand-deep/80 hover:bg-brand-ivory">
                    My Wishlist
                  </Link>
                  {roles.includes('ROLE_SELLER') && (
                    <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-[13px] text-brand-deep/80 hover:bg-brand-ivory">
                      Seller Dashboard
                    </Link>
                  )}
                  {roles.includes('ROLE_ADMIN') && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-[13px] text-brand-deep/80 hover:bg-brand-ivory">
                      Admin Panel
                    </Link>
                  )}
                  <hr className="my-1 border-brand-deep/10" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[13px] text-brand-pink hover:bg-brand-ivory">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" aria-label="Account" className="hover:text-brand-pink transition-colors">
              <UserIcon />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
      <path d="M6 6L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="20" r="1.15" />
      <circle cx="17.5" cy="20" r="1.15" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" strokeLinecap="round" />
    </svg>
  );
}