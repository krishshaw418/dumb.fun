import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Coin from "./pages/Coin";

function App() {
  return (
    <BrowserRouter>
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
