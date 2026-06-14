import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import CopyToClipboard from "./ui/copy";

function MintAddressDisplay(props: { mint: string | undefined }) {
  if (!props.mint) return;
  return (
    <Card className="rounded-xl bg-[#212225] text-white p-5">
      <CardHeader className="flex items-center">
        <CardTitle className="w-[35%] text-base">Your Mint Address: </CardTitle>
        <CopyToClipboard>
          <CardContent className="text-base">{props.mint}</CardContent>
        </CopyToClipboard>
      </CardHeader>
    </Card>
  );
}

export default MintAddressDisplay;
