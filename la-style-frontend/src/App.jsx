// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import routeConfig from './routes/routeConfig';

function App() {
  return (
    <div className='h-full w-full bg-[radial-gradient(125%_125%_at_50%_90%,_#fff_20%,_#f8aff6_100%)]'>
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