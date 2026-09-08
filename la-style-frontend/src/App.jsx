// src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import IntroSplash from './components/layout/IntroSplash';
import routeConfig from './routes/routeConfig';
import { pageVariants } from './utils/motionVariants';

const INTRO_SESSION_KEY = 'introShown';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          {routeConfig.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(
    () => sessionStorage.getItem(INTRO_SESSION_KEY) !== 'true'
  );

  const handleIntroFinish = () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroSplash onFinish={handleIntroFinish} />;
  }

  return (
    <div className="h-100% w-100% bg-brand-cream">
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;