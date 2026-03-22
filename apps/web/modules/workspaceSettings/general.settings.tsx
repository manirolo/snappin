"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
  DashboardDescription,
} from "../../components/layout/dashboardLayout";
import { DetailCard } from "@snappin/ui/components/detailCard";
import { useClerk } from "@clerk/nextjs";
import { useOrganization } from "@snappin/features/organization/hooks/useOrganization";
import {
  FileUpload,
  FileUploadTrigger,
} from "@snappin/ui/components/file-upload";
import { InputLayout } from "@snappin/ui/components/input/layout";
import TextInput from "@snappin/ui/components/input/components/textInput";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@snappin/ui/components/avatar";
import { Button } from "@snappin/ui/components/button";
import { HiCheck } from "react-icons/hi";
import type { InvoiceFileFormatPreference } from "@snappin/shared/organization/preference/invoiceFileFormatPreference.schema";
// import { Small } from "@snappin/ui/components/typography";
import { Spinner } from "@snappin/ui/assets/svg/spinner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  slug: string;
  invoiceFileNameFormat: InvoiceFileFormatPreference | undefined;
  logoFile: File | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ─── View ─────────────────────────────────────────────────────────────────────

export const GeneralSettingsView = () => {
  const { organization } = useClerk();
  const { organization: internalOrg, updateOrganization } = useOrganization();

  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    organization?.imageUrl ?? undefined,
  );

  const [form, setForm] = useState<FormState>({
    name: organization?.name ?? "",
    slug: organization?.slug ?? "",
    invoiceFileNameFormat:
      (internalOrg?.preference
        ?.invoiceFileNameFormat as InvoiceFileFormatPreference) ?? undefined,
    logoFile: null,
  });

  // Sync form when remote data loads
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: organization?.name ?? "",
      slug: organization?.slug ?? "",
      invoiceFileNameFormat:
        (internalOrg?.preference
          ?.invoiceFileNameFormat as InvoiceFileFormatPreference) ?? undefined,
    }));
    setLogoPreview(organization?.imageUrl ?? undefined);
  }, [
    organization?.name,
    organization?.slug,
    organization?.imageUrl,
    internalOrg?.preference?.invoiceFileNameFormat,
  ]);

  const original = {
    name: organization?.name ?? "",
    slug: organization?.slug ?? "",
    invoiceFileNameFormat:
      (internalOrg?.preference
        ?.invoiceFileNameFormat as InvoiceFileFormatPreference) ?? undefined,
  };

  const hasChanges =
    form.name !== original.name ||
    form.slug !== original.slug ||
    !isEqual(form.invoiceFileNameFormat, original.invoiceFileNameFormat) ||
    form.logoFile !== null;

  const updateForm = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleLogoChange = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      updateForm("logoFile", file);
      // Generate preview
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    },
    [updateForm],
  );

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;
    setIsSaving(true);
    try {
      // Upload logo if changed
      if (form.logoFile) {
        await organization?.setLogo({ file: form.logoFile });
        updateForm("logoFile", null);
      }

      // Update Clerk org name/slug if changed
      if (form.name !== original.name || form.slug !== original.slug) {
        await organization?.update({
          name: form.name,
          slug: form.slug,
        });
      }

      // Update internal org preference if changed
      if (
        !isEqual(form.invoiceFileNameFormat, original.invoiceFileNameFormat)
      ) {
        await updateOrganization({
          preference: {
            invoiceFileNameFormat: form.invoiceFileNameFormat,
          },
        });
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dashboard className="">
      <DashboardHeader>
      <DashboardHeaderMain>
          <DashboardTitle>General Settings</DashboardTitle>
          <DashboardDescription>
            Manage your workspace settings and view information
          </DashboardDescription>
        </DashboardHeaderMain> 
      </DashboardHeader>
      <DashboardContent>
        <div className="space-y-6">
          <DetailCard className="flex flex-col gap-7 items-start justify-start text-start mx-auto max-w-2xl">
            <div className="w-full flex flex-col bg-card gap-2 p-4 px-4 rounded-lg shadow-xs border border-border/40">
              <InputLayout label="Profile">
                <FileUpload
                  accept="image/*"
                  maxFiles={1}
                  onValueChange={handleLogoChange}
                >
                  <FileUploadTrigger asChild>
                    <Avatar className="rounded-md cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage
                        className="rounded-md object-cover"
                        src={logoPreview}
                        alt={(organization?.name ?? "") + "'s photo"}
                      />
                      <AvatarFallback className="rounded-md">
                        ORG
                      </AvatarFallback>
                    </Avatar>
                  </FileUploadTrigger>
                </FileUpload>
              </InputLayout>

              <InputLayout label="Name">
                <TextInput
                  value={form.name}
                  onChange={(val) => updateForm("name", val)}
                  inputWrapperClassName="min-h-9"
                />
              </InputLayout>

              <InputLayout label="Slug" className="border-0!">
                <TextInput
                  value={form.slug}
                  onChange={(val) => updateForm("slug", val)}
                  inputWrapperClassName="min-h-9"
                />
              </InputLayout>
              <Button
                variant="dim"
                disabled={!hasChanges || isSaving}
                onClick={handleSave}
                size="sm"
                className="w-fit ml-auto mt-4"
              >
                
                {isSaving ? <Spinner /> : <HiCheck />}
                Save
              </Button>
            </div>
          </DetailCard>
        </div>
      </DashboardContent>
    </Dashboard>
  );
};
