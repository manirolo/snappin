import { useUsage } from "@snappin/features/billing/hooks/useUsage";
import { ManualInvoiceUploadDialog } from "@snappin/features/invoices/components/manualInvoiceUpload.dialog";
import { NewMobileScannerDialog } from "@snappin/features/mobileScanners/components/newMobileScanner.dialog";
import { Button } from "@snappin/ui/components/button";
import { Card, CardContent, CardHeader } from "@snappin/ui/components/card";
import { ExtraSmall } from "@snappin/ui/components/typography";
import { cn } from "@snappin/ui/lib/utils";
import React, { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";

export const GetStarted = () => {
  const [openMobileScanner, setOpenMobileScanner] = useState<boolean>(false);
  const [openInvoiceUpload, setOpenInvoiceUpload] = useState<boolean>(false);
  const { usage } = useUsage();

  const hasEmailAccount = (usage?.usage?.emailAccounts ?? 0) > 0;
  const hasMobileScanner = (usage?.usage?.mobileScanners ?? 0) > 0;
  const hasInvoice = (usage?.usage?.invoices ?? 0) > 0;

  // First incomplete step gets the CTA button
  const activeStep = !hasEmailAccount ? 1 : !hasMobileScanner ? 2 : !hasInvoice ? 3 : null;
  const allDone = activeStep === null;

  const steps = [
    { index: 1, label: "Setup mobile scanners", done: hasMobileScanner },
    { index: 2, label: "Upload a document", done: hasInvoice },
  ];

  return (
    <Card className="bg-table">
      <CardHeader>
        <h6 className="font-medium">Get started</h6>
        <ExtraSmall>
          {allDone ? "All steps completed!" : "Complete all steps to get started"}
        </ExtraSmall>
      </CardHeader>
      <CardContent className="pb-8 pt-2">
        <div className="flex flex-col">
          {steps.map((step, i) => {
            const isActive = step.index === activeStep;
            const isLast = i === steps.length - 1;

            return (
              <div key={step.index} className="flex gap-4">
                {/* Left column: indicator + dotted connector line */}
                <div className="flex flex-col items-center shrink-0">
                  {step.done ? (
                    <HiCheckCircle className="size-5 text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <span className={cn("text-xs text-gray-4 border rounded-full size-5 flex items-center justify-center mt-0.5 shrink-0")}>
                      {step.index}
                    </span>
                  )}
                  {/* Dotted vertical line — hidden after last step */}
                  {!isLast && (
                    <div
                      className="flex-1 mt-1"
                      style={{
                        width: "2px",
                        borderLeft: "2px dashed",
                        borderColor: step.done ? "#22c55e" : "#d1d5db",
                      }}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className={`flex flex-col gap-1 ${!isLast ? "pb-5" : ""}`}>
                  <h6 className={`text-sm ${step.done ? "text-muted-foreground" : ""}`}>
                    {step.label}
                  </h6>

                  {isActive && step.index === 2 && (
                    <Button
                      className="w-fit p-0 justify-start text-link"
                      variant="link"
                      onClick={() => setOpenMobileScanner((prev) => !prev)}
                    >
                      Setup
                    </Button>
                  )}

                  {isActive && step.index === 3 && (
                    <ManualInvoiceUploadDialog
                      open={openInvoiceUpload}
                      setOpen={setOpenInvoiceUpload}
                    >
                      <Button
                        className="w-fit p-0 justify-start text-link"
                        variant="link"
                      >
                        Upload
                      </Button>
                    </ManualInvoiceUploadDialog>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <NewMobileScannerDialog
          open={openMobileScanner}
          setOpen={setOpenMobileScanner}
        />
      </CardContent>
    </Card>
  );
};