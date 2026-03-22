"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@snappin/ui/components/dialog";
import { Button } from "@snappin/ui/components/button";
import { Add01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
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

// Build country list once
const COUNTRIES = getCountries()
  .map((code) => ({
    code,
    dialCode: `+${getCountryCallingCode(code)}`,
    label: new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const NewMobileScannerDialog = () => {
  const [open, setOpen] = useState(false);
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
        toast.success("Mobile Scanner added successfully");
        setError(null);
      },
      onError: () => {
        toast.success("Failed to add mobile scanner");
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
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="min-w-fit">
          <HugeiconsIcon icon={Add01Icon} /> Add mobile scanner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>Mobile Scanner</DialogTitle>
          <DialogDescription>
            Provide your WhatsApp number to start sending documents from there.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            {/* Country code selector */}
            <Select
              value={countryCode}
              onValueChange={(v) => setCountryCode(v as CountryCode)}
            >
              <SelectTrigger className="w-35 min-h-9 shrink-0">
                <SelectValue>
                  {selectedCountry
                    ? `${selectedCountry.code} ${selectedCountry.dialCode}`
                    : "Country"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
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

        <DialogFooter>
          <Button
            variant="mono"
            size="sm"
            onClick={handleSubmit}
            disabled={!phone || addScanner.isPending}
          >
            {addScanner.isPending ? "Adding..." : "Add Mobile Scanner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
