// src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import IntroSplash from './components/layout/IntroSplash';
import routeConfig from './routes/routeConfig';

const INTRO_SESSION_KEY = 'introShown';

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
    // Plain, quiet fallback — each page/layout below owns its own background.
    // Home keeps the bold gradient; everything else gets something calmer.
    <div className="h-100% w-100% bg-brand-cream">
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