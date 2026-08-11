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
  { path: '/seller/dashboard', element: <SellerDashboard /> },
  { path: '/seller/products', element: <MyProducts /> },
  { path: '/admin', element: <AdminOverview /> },
  { path: '/admin/users', element: <AdminUsers /> },
  { path: '/admin/sellers', element: <AdminSellers /> },
  { path: '/admin/coupons', element: <AdminCoupons /> },
  { path: '/deals', element: <Deals /> },
{ path: '/search', element: <SearchResults /> },
{ path: '/about', element: <About /> },
{ path: '/contact', element: <Contact /> },
  { path: '/seller/orders', element: <SellerOrders /> },
  { path: '/admin/messages', element: <AdminMessages /> }
];

export default routeConfig;