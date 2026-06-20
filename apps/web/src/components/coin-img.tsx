import { Dialog } from "./ui/dialog";

function CoinImg(props: { name: string; symbol: string; img: string }) {
  return (
    <Dialog>
      <div>
        <span>{props.name}</span>
        <span>{props.symbol}</span>
        <img src={props.img} alt="coin-img" />
      </div>
    </Dialog>
  );
}

export default CoinImg;
