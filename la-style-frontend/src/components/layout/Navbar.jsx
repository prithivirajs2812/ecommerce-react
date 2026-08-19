// src/components/layout/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import searchGif from '../../assets/search.gif';
import cartGif from '../../assets/shopping-cart.gif';
import profileGif from '../../assets/profile.gif';
import useAuthStore from '../../store/useAuthStore';
import { logoutUser } from '../../api/authApi';
import NotificationBell from './NotificationBell';

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
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="LA Style" className="h-20 w-auto" />
        </Link>

        <nav className="font-script  hidden md:flex gap-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-brand-pink transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-brand-pink transition-colors">Shop</Link>
          <Link to="/shop" className="hover:text-brand-pink transition-colors">Categories</Link>
          <Link to="/deals" className="hover:text-brand-pink transition-colors">Deals</Link>
          <Link to="/about" className="hover:text-brand-pink transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-brand-pink transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-5 text-gray-700">
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search"
              className="hover:text-brand-pink transition-colors"
            >
              <img src={searchGif} alt="" className="h-10 w-10 object-contain" />
            </button>

            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50"
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </form>
            )}
          </div>

          <Link to="/cart" aria-label="Cart" className="hover:text-brand-pink transition-colors">
            <img src={cartGif} alt="" className="h-10 w-10 object-contain" />
          </Link>

          {isAuthenticated && <NotificationBell />}

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 hover:text-brand-pink transition-colors"
              >
                <img src={profileGif} alt="" className="h-10 w-10 object-contain" />
                <span className="hidden lg:inline font-medium text-sm">
                  {user?.email?.split('@')[0]}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Profile
                  </Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Orders
                  </Link>
                  <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Wishlist
                  </Link>
                  {roles.includes('ROLE_SELLER') && (
                    <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Seller Dashboard
                    </Link>
                  )}
                  {roles.includes('ROLE_ADMIN') && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Admin Panel
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" aria-label="Account" className="hover:text-brand-pink transition-colors">
              <img src={profileGif} alt="" className="h-10 w-10 object-contain" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}