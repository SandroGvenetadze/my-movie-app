import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top100 from "./pages/Top100";
import Favorites from "./pages/Favorites";
import Details from "./pages/Details";

export default function App() {
  return (
    <BrowserRouter>
      {/* შენი Navbar უკვე თუ გაქვს, დატოვე */}
      <Routes>
        <Route path="/" element={<Top100 />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/details/:id" element={<Details />} />
        {/* Login / Register გვერდები როგორც გაქვს */}
      </Routes>
    </BrowserRouter>
  );
}
