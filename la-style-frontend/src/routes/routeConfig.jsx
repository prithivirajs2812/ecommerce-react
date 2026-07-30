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
];

export default routeConfig;