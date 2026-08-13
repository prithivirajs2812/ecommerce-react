// src/routes/routeConfig.jsx
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Profile from '../pages/Profile';
import Wishlist from '../pages/Wishlist';
import BecomeSeller from '../pages/BecomeSeller';
import SellerDashboard from '../pages/SellerDashboard';
import MyProducts from '../pages/MyProducts';
import AdminOverview from '../pages/admin/AdminOverview';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminSellers from '../pages/admin/AdminSellers';
import AdminCoupons from '../pages/admin/AdminCoupons';
import SellerOrders from '../pages/SellerOrders';
import Deals from '../pages/Deals';
import SearchResults from '../pages/SearchResults';
import About from '../pages/About';
import Contact from '../pages/Contact';
import AdminMessages from '../pages/admin/AdminMessages';
import NotAuthorized from '../pages/NotAuthorized';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const routeConfig = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/shop', element: <Shop /> },
  { path: '/products/:id', element: <ProductDetail /> },
  { path: '/cart', element: <Cart /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/orders', element: <Orders /> },
  { path: '/orders/:id', element: <OrderDetail /> },
  { path: '/profile', element: <Profile /> },
  { path: '/wishlist', element: <Wishlist /> },
  { path: '/become-seller', element: <BecomeSeller /> },
  { path: '/not-authorized', element: <NotAuthorized /> },

  {
    path: '/seller/dashboard',
    element: <ProtectedRoute requiredRole="ROLE_SELLER"><SellerDashboard /></ProtectedRoute>,
  },
  {
    path: '/seller/products',
    element: <ProtectedRoute requiredRole="ROLE_SELLER"><MyProducts /></ProtectedRoute>,
  },
  {
    path: '/seller/orders',
    element: <ProtectedRoute requiredRole="ROLE_SELLER"><SellerOrders /></ProtectedRoute>,
  },

  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="ROLE_ADMIN"><AdminOverview /></ProtectedRoute>,
  },
  {
    path: '/admin/users',
    element: <ProtectedRoute requiredRole="ROLE_ADMIN"><AdminUsers /></ProtectedRoute>,
  },
  {
    path: '/admin/sellers',
    element: <ProtectedRoute requiredRole="ROLE_ADMIN"><AdminSellers /></ProtectedRoute>,
  },
  {
    path: '/admin/coupons',
    element: <ProtectedRoute requiredRole="ROLE_ADMIN"><AdminCoupons /></ProtectedRoute>,
  },
  {
    path: '/admin/messages',
    element: <ProtectedRoute requiredRole="ROLE_ADMIN"><AdminMessages /></ProtectedRoute>,
  },

  { path: '/deals', element: <Deals /> },
  { path: '/search', element: <SearchResults /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
];

export default routeConfig;