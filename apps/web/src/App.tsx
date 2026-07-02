import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Coin from "./pages/Coin";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/coin/:mint" element={<Coin />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
