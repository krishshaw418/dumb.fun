import "@/components/css/token-card.css";

function TradeMetrics() {
  return (
    <div className="grid grid-cols-5 gap-2 w-full">
      <div
        aria-label="volume"
        className="bg-[#18191b] flex flex-col justify-center items-center rounded-lg py-2 text-sm border border-[#212225]"
      >
        <span className="secondary-text-color">{"Vol 24h"}</span>
        <span>{"$1.15M"}</span>
      </div>
      <div
        aria-label="price"
        className="bg-[#18191b] flex flex-col justify-center items-center rounded-lg py-2 text-sm border border-[#212225]"
      >
        <span className="secondary-text-color">{"Price"}</span>
        <span>{"$0.00935642"}</span>
      </div>
      <div
        aria-label="5m"
        className="bg-[#18191b] flex flex-col justify-center items-center rounded-lg py-2 text-sm border border-[#212225]"
      >
        <span className="secondary-text-color">{"5m"}</span>
        <span>{"-11.02%"}</span>
      </div>
      <div
        aria-label="1h"
        className="bg-[#18191b] flex flex-col justify-center items-center rounded-lg py-2 text-sm border border-[#212225]"
      >
        <span className="secondary-text-color">{"1h"}</span>
        <span>{"+94.08%"}</span>
      </div>
      <div
        aria-label="6h"
        className="bg-[#18191b] flex flex-col justify-center items-center rounded-lg py-2 text-sm border border-[#212225]"
      >
        <span className="secondary-text-color">{"6h"}</span>
        <span>{"+20.67%"}</span>
      </div>
    </div>
  );
}

export default TradeMetrics;
