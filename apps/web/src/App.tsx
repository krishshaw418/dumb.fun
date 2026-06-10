import TokenContainer from "./components/token-container";
import Navbar from "./components/navbar";

function App() {
  return (
    <>
      <div className="w-full">
        <Navbar />
        <div className="m-5">
          <h1 className="text-2xl font-bold py-2">Explore Coins</h1>
          <TokenContainer />
        </div>
      </div>
    </>
  );
}

export default App;
