"use client";

import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useDropzone } from "react-dropzone";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import axios, { AxiosError } from "axios";

const VALID_FILE_TYPE = ["image/png", "image/jpg", "image/gif", "image/jpeg"];

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(32, "Name must be at most 32 characters."),
  symbol: z
    .string()
    .min(3, "Symbol must be at least 3 characters.")
    .max(16, "Symbol must be at most 16 characters."),
  description: z.optional(
    z.string().max(200, "Description must be atmost 200 characters."),
  ),
  image: z
    .instanceof(File)
    .refine((file) => VALID_FILE_TYPE.includes(file.type), {
      error: "Invalid file type!",
    })
    .refine((file) => file.size <= 15 * 1024 * 1024, {
      error: "Max size 15 MB!",
    }),
});

export function TokenCreateForm() {
  const wallet = useWallet();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      image: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/api/new-token`,
        data,
      );

      console.log(response);
      form.reset();
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        console.log(error.response?.data.error);
      }
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="w-200">
      <Card className="w-full rounded-xl bg-[#212225] text-white flex flex-col gap-5 p-5">
        <CardHeader>
          <CardTitle className="text-xl">Create new coin</CardTitle>
          <CardDescription>
            Choose carefully, these can't be changed once the coin is created
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="create-coin-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup className="flex flex-row">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name" className="text-base">
                        {"Name"}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Name your coin"
                        minLength={3}
                        maxLength={32}
                        autoComplete="off"
                        className="rounded-lg"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="symbol"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="symbol" className="text-base">
                        {"Ticker"}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="symbol"
                        aria-invalid={fieldState.invalid}
                        placeholder="Add a coin ticker"
                        minLength={3}
                        maxLength={16}
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
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description" className="text-base">
                      {"Description (Optional)"}
                    </FieldLabel>
                    <InputGroup className="rounded-lg">
                      <InputGroupTextarea
                        {...field}
                        id="description"
                        placeholder="Write a short description"
                        rows={6}
                        maxLength={200}
                        className="min-h-15"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.value?.length || 0}/200 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => {
                  const onDrop = useCallback(
                    (acceptedFiles: File[]) => {
                      field.onChange(acceptedFiles[0]);
                    },
                    [field],
                  );

                  const { getRootProps, getInputProps, isDragActive } =
                    useDropzone({
                      onDrop,
                      accept: { "image/*": [] },
                      maxFiles: 1,
                    });

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="image" className="text-base">
                        Image
                      </FieldLabel>
                      <div
                        {...getRootProps()}
                        className={`border min-h-20 border-dashed flex justify-center items-center rounded-lg ${fieldState.invalid ? "border-red-500" : "border-white"}`}
                      >
                        <Input
                          {...getInputProps()}
                          id="image"
                          aria-invalid={fieldState.invalid}
                        />
                        {isDragActive ? (
                          <p> Drop the file here... </p>
                        ) : (
                          <p>
                            Drag 'n' drop file here, or click to select file
                          </p>
                        )}
                      </div>
                      {field.value && <p>{field.value.name}</p>}
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
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
                form="create-coin-form"
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
