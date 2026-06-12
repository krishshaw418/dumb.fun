import { Button } from "./ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

function Navbar() {
  
  const navigate = useNavigate();
  const wallet = useWallet();
  const handleClick = () => {
    if (!wallet.connected) {
      toast.error("Connect wallet to create coin!");
    } else {
      navigate("/create");
    }
  }

  return (
    <nav className="flex justify-between items-center px-5 py-3.5 border-b-[#212225] border-b-2 sticky top-0 z-50 bg-[#111113]">
      <h1 className="font-extrabold text-2xl cursor-pointer" onClick={() => navigate("/")}>Dumb.fun</h1>
      <div className="flex items-center gap-5">
        <Button
          size="lg"
          className="rounded-lg bg-[#212225] text-base font-extralight cursor-pointer"
          onClick={handleClick}
        >
          Create
        </Button>
        <Button
          size="lg"
          className="rounded-lg bg-[#212225] text-base font-extralight cursor-pointer"
        >
          Sign in
        </Button>
        <WalletMultiButton style={{
          font: "inherit",
          fontWeight: "lighter",
          height: "36px",
          borderRadius: "10px",
          background: "#212225",
          display: "flex",
          justifyContent: "center",
          paddingLeft: "10px",
          paddingRight: "10px"
        }} />
      </div>
    </nav>
  );
}

export default Navbar;
