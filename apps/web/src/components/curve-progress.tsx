import { Progress } from "./ui/progress";
import { Field, FieldLabel } from "./ui/field";
import { Card, CardHeader, CardContent } from "./ui/card";
import "@/components/css/token-card.css";

function CurveProgress() {
  return (
    <Card className="w-full h-full bg-[#18191b] p-5 rounded-lg text-white flex flex-col gap-2 border border-[#212225]">
      <CardHeader>
        <Field>
          <FieldLabel htmlFor="curve-progress" className="font-bold text-sm">
            <span>{"Bonding curve progress"}</span>
            <span className="ml-auto">{"66%"}</span>
          </FieldLabel>
          <Progress
            value={63}
            className="h-2 rounded-lg bg-[#4b5563]"
            id="curve-progress"
          />
        </Field>
      </CardHeader>
      <CardContent className="flex justify-between">
        <span className="text-xs secondary-text-color">
          {"40.216 SOL in bonding curve"}
        </span>
        <span className="text-xs secondary-text-color">
          {"$29,955 to graduate"}
        </span>
      </CardContent>
    </Card>
  );
}

export default CurveProgress;
