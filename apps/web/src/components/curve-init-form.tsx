"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useWallet } from "@solana/wallet-adapter-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useProgram } from "@/hooks/program";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";

const formSchema = z.object({
  mint: z
    .string()
    .regex(
      /^[1-9A-HJ-NP-Za-km-z]+$/,
      "Create a new coin to initialize bonding curve!",
    ),
  k: z.number("Slope required!"),
  basePrice: z.number("Base price required!"),
});

export function BondingCurveInitForm() {
  //   const { program } = useProgram();
  const wallet = useWallet();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mint: "",
      k: 2,
      basePrice: 10,
    },
  });
  const program = useProgram()?.program;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    toast(
      JSON.stringify(
        {
          title: <span>You entered following data: </span>,
          description: (
            <div>
              mint: {data.mint}, slope: {data.k}, basePrice: {data.basePrice}
            </div>
          ),
        },
        null,
        2,
      ),
    );

    try {

      if (!wallet.publicKey) {
        throw new Error("Wallet publicKey is null");
      }

      if (!program) {
        throw new Error("Program is undefined!");
      }

      const tx = await program.methods
        .initialize(new BN(data.k), new BN(data.basePrice))
        .accounts({
          user: wallet.publicKey,
          mint: new PublicKey(data.mint),
        })
        .rpc();
      console.log("BondingCurve Init Tx sig:", tx);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  return (
    <div>
      <Card className="rounded-xl bg-[#18191b] text-white flex flex-col gap-5 p-5">
        <CardHeader>
          <CardTitle className="text-xl">Initialize Bonding Curve</CardTitle>
          <CardDescription>
            Copy-paste the new mint address & set the slope and base price for
            launch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="init-bondingcurve-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldSet>
              <Controller
                name="mint"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mint" className="text-base">
                      {"New Coin Mint Address"}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="mint"
                      aria-invalid={fieldState.invalid}
                      placeholder="Mint address of your coin"
                      autoComplete="off"
                      className="rounded-lg"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <FieldGroup className="flex flex-row">
                <Controller
                  name="basePrice"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="base-price" className="text-base">
                        {"Base price"}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="base-price"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter a base price for your coin (Ex: $1)"
                        autoComplete="off"
                        className="rounded-lg"
                      ></Input>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="k"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="curve-slope" className="text-base">
                        {"Curve slope"}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="curve-slope"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter slope for the bonding curve (EX: 2)"
                        autoComplete="off"
                        className="rounded-lg"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
        <CardFooter className="border-0 pb-5">
          {wallet.connected ? (
            <Field orientation="horizontal">
              <Button
                className="rounded-lg bg-[#ff0505ee] text-black text-base font-extralight cursor-pointer hover:bg-red-700"
                type="button"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                className="rounded-lg bg-[#50ff05ee] text-black text-base font-extralight cursor-pointer hover:bg-green-700"
                type="submit"
                form="init-bondingcurve-form"
              >
                Create
              </Button>
            </Field>
          ) : (
            <div className="text-lg">{"Connect a wallet to create coins!"}</div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default BondingCurveInitForm;
