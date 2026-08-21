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