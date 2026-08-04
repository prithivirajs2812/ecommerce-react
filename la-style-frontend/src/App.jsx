// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import routeConfig from './routes/routeConfig';

function App() {
  return (
    <div className='bg-fuchsia-50'>
    <BrowserRouter>
      <Navbar />
      <Routes>
        {routeConfig.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Footer />
    </BrowserRouter>
    </div>
  );
}

export default App;