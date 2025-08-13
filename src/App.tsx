// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import Top100 from '@/pages/Top100';
import Favorites from '@/pages/Favorites';
import Details from '@/pages/Details';
import PageFade from '@/components/PageFade';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <PageFade key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Top100 />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </PageFade>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
