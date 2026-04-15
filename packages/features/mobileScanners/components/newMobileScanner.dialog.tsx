"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogLabel,
} from "@snappin/ui/components/dialog";
import { Button } from "@snappin/ui/components/button";
import TextInput from "@snappin/ui/components/input/components/textInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@snappin/ui/components/select";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberWithError,
  CountryCode,
} from "libphonenumber-js";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { Spinner } from "@snappin/ui/assets/svg/spinner";

// Build country list once
const COUNTRIES = getCountries()
  .map((code) => ({
    code,
    dialCode: `+${getCountryCallingCode(code)}`,
    label: new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const NewMobileScannerDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const addScanner =
    trpc.integration.mobileScanners.addMobileScanner.useMutation({
      onSuccess: () => {
        setOpen(false);
        setPhone("");
        utils.integration.connectedSource.invalidate();
        utils.integration.getIntegration.invalidate();
        utils.billing.usage.invalidate();
        toast.success("Mobile Scanner added successfully");
        setError(null);
      },
      onError: (err) => {
        toast.error(err.message ?? "Failed to add mobile scanner");
      },
    });

  const handleSubmit = () => {
    setError(null);
    try {
      const dialCode = `+${getCountryCallingCode(countryCode)}`;
      const parsed = parsePhoneNumberWithError(
        `${dialCode}${phone}`,
        countryCode,
      );

      if (!parsed.isValid()) {
        setError("Invalid phone number for the selected country.");
        return;
      }

      // e.g. "+919876543210" — E.164 format
      addScanner.mutate({ phone: parsed.number });
    } catch {
      setError("Please enter a valid phone number.");
    }
  };

  const selectedCountry = COUNTRIES.find((c) => c.code === countryCode);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-360">
        <DialogHeader>
          <DialogLabel>
            Mobile Scanner
          </DialogLabel>
          <DialogTitle>Add Scanner</DialogTitle>
          <DialogDescription>
            Provide your WhatsApp number to start sending documents from there.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-3">
          <div className="flex gap-1">
            {/* Country code selector */}
            <Select
              value={countryCode}
              onValueChange={(v) => setCountryCode(v as CountryCode)}
            >
              <SelectTrigger className="w-35 min-h-9 max-w-24 shrink-0">
                <SelectValue className="bg-transparent">
                  {selectedCountry
                    ? `${selectedCountry.code} ${selectedCountry.dialCode}`
                    : "Country"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-60">
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.label} ({country.dialCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Phone number input */}
            <TextInput
              inputWrapperClassName="min-h-9"
              value={phone}
              onChange={(e) => setPhone(e)}
              placeholder="9876543210"
              className="flex-1"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>

        <DialogFooter className="flex flex-col-reverse justify-between gap-4 sm:flex-row px-6 pb-6">
          <DialogClose className="mr-0" asChild>
            <Button variant="dim" className="w-full" size="lg">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!phone || addScanner.isPending}
            className="w-full"
            size="lg"
          >
            {addScanner.isPending ? <Spinner className="text-white"/> : "Add Scanner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
