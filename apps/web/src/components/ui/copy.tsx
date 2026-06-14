import { IoCopyOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { useState, useRef, type ReactNode } from "react";

function CopyToClipboard(props: { children: ReactNode; className?: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleClick = async () => {
    setIsCopied(true);

    if (divRef.current) {
      const textToCopy = divRef.current.innerText;
      await navigator.clipboard.writeText(textToCopy);
    }

    setTimeout(() => {
      setIsCopied(false);
    }, 500);
  };

  return (
    <div
      className={`w-full flex items-center justify-between ${props.className}`}
      onClick={handleClick}
    >
      <div ref={divRef}>{props.children}</div>
      {isCopied ? (
        <IoCheckmarkCircleOutline size={15} />
      ) : (
        <IoCopyOutline size={15} />
      )}
    </div>
  );
}

export default CopyToClipboard;
