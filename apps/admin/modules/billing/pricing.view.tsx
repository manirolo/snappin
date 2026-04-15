"use client";

import React from "react";
import { trpc } from "@snappin/features/trpc/react/client";
import {
  PricingSlug,
} from "@snappin/features/billing/lib/pricing";
import { Button } from "@snappin/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@snappin/ui/components/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@snappin/ui/components/dialog";
import { TextInput } from "@snappin/ui/components/input/components/textInput";
import SelectInput from "@snappin/ui/components/input/components/selectInput";
import { SwitchInput } from "@snappin/ui/components/input/components/switchInput";
import { ScrollArea } from "@snappin/ui/components/scroll-area";
import toast from "react-hot-toast";
import  { type PlanSlug, PlanInterval } from "@snappin/shared/billing/plan.schema";

const slugOptions = [
  { value: PricingSlug.BASIC, label: "Basic" },
  { value: PricingSlug.STARTER, label: "Starter" },
  { value: PricingSlug.SCALE, label: "Scale" },
  { value: PricingSlug.PREMIUM, label: "Premium" },
];

const intervalOptions = [
  { value: PlanInterval.MONTHLY, label: "Month" },
  { value: PlanInterval.YEARLY, label: "Year" },
];

type FormState = {
  slug: string;
  name: string;
  lsVariantId: number;
  lsProductId: number;
  amount: string;
  currency: string;
  interval: "monthly" | "yearly";
  isActive: boolean;
};

const emptyForm: FormState = {
  slug: "starter",
  name: "",
  lsVariantId: 0,
  lsProductId: 0,
  amount: "0",
  currency: "USD",
  interval: "monthly",
  isActive: true,
};

export function PricingAdminView() {
  const utils = trpc.useUtils();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(
    null,
  );
  const [form, setForm] = React.useState<FormState>(emptyForm);

  const plans = trpc.billing.listPlans.useQuery();

  const createPlan = trpc.billing.createPlan.useMutation({
    onSuccess: async () => {
      toast.success("Plan created");
      setOpenCreate(false);
      setForm(emptyForm);
      await utils.billing.listPlans.invalidate();
    },
    onError: (err) => toast.error(err.message || "Failed to create plan"),
  });

  const updatePlan = trpc.billing.updatePlan.useMutation({
    onSuccess: async () => {
      toast.success("Plan updated");
      setSelectedPlanId(null);
      setForm(emptyForm);
      await utils.billing.listPlans.invalidate();
      await utils.billing.getActivePlans.invalidate();
    },
    onError: (err) => toast.error(err.message || "Failed to update plan"),
  });

  const selectedPlan = React.useMemo(
    () => plans.data?.find((plan) => String(plan._id) === selectedPlanId),
    [plans.data, selectedPlanId],
  );

  React.useEffect(() => {
    if (!selectedPlan) return;
    setForm({
      slug: selectedPlan.slug,
      name: selectedPlan.name,
      lsVariantId: selectedPlan.lsVariantId,
      lsProductId: selectedPlan.lsProductId,
      amount: String(selectedPlan.amount),
      currency: selectedPlan.currency,
      interval: selectedPlan.interval,
      isActive: selectedPlan.isActive,
    });
  }, [selectedPlan]);

  const buildPayload = () => ({
    slug: form.slug as PlanSlug,
    name: form.name.trim(),
    lsVariantId: form.lsVariantId,
    lsProductId: form.lsProductId,
    amount: Number(form.amount || 0),
    currency: form.currency.trim().toUpperCase(),
    interval: form.interval,
    isActive: form.isActive,
  });

  const onCreate = () => {
    const payload = buildPayload();
    if (payload) createPlan.mutate(payload);
  };
  const onUpdate = () => {
    if (!selectedPlanId) return;
    const payload = buildPayload();
    if (payload) updatePlan.mutate({ planId: selectedPlanId, ...payload });
  };

  const formFields = (
    <ScrollArea className="space-y-3 flex flex-col gap-6 px-6 py-4 max-h-[60vh]">
      <SelectInput
        label="Slug"
        options={slugOptions}
        value={form.slug}
        onValueChange={(slug) => setForm((prev) => ({ ...prev, slug }))}
      />
      <TextInput
        label="Name"
        value={form.name}
        onChange={(name) => setForm((prev) => ({ ...prev, name }))}
      />
      <TextInput
        label="LS Variant ID"
        value={String(form.lsVariantId)}
        onChange={(lsVariantId) =>
          setForm((prev) => ({ ...prev, lsVariantId: Number(lsVariantId) }))
        }
      />
      <TextInput
        label="LS Product ID"
        value={String(form.lsProductId)}
        onChange={(lsProductId) =>
          setForm((prev) => ({ ...prev, lsProductId: Number(lsProductId) }))
        }
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Amount"
          value={form.amount}
          onChange={(amount) => setForm((prev) => ({ ...prev, amount }))}
        />
        <TextInput
          label="Currency"
          value={form.currency}
          onChange={(currency) => setForm((prev) => ({ ...prev, currency }))}
        />
      </div>
      <SelectInput
        label="Interval"
        options={intervalOptions}
        value={form.interval}
        onValueChange={(interval) =>
          setForm((prev) => ({
            ...prev,
            interval: interval as "monthly" | "yearly",
          }))
        }
      />
      <SwitchInput
        label="Active Plan"
        checked={form.isActive}
        onChange={(isActive) => setForm((prev) => ({ ...prev, isActive }))}
      />
    </ScrollArea>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Pricing</h2>
          <p className="text-sm text-fg-2">
            Create and manage Polar billing plans.
          </p>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button size="sm">Create plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create pricing plan</DialogTitle>
              <DialogDescription>
                Configure slug, amount and Polar product mapping.
              </DialogDescription>
            </DialogHeader>
            {formFields}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="dim" size="lg">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="lg"
                onClick={onCreate}
                disabled={createPlan.isPending}
              >
                {createPlan.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border border-border/50 bg-table p-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Slug</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Variant ID</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(plans.data ?? []).map((plan) => (
              <TableRow
                key={String(plan._id)}
                onClick={() => setSelectedPlanId(String(plan._id))}
              >
                <TableCell className="font-medium capitalize">
                  {plan.slug}
                </TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>
                  {plan.currency} {plan.amount}
                </TableCell>
                <TableCell>{plan.interval}</TableCell>
                <TableCell>{plan.lsProductId}</TableCell>
                <TableCell>{plan.lsVariantId}</TableCell>
                <TableCell>{plan.isActive ? "Active" : "Inactive"}</TableCell>
              </TableRow>
            ))}
            {!plans.isLoading && (plans.data?.length ?? 0) === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  No plans found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(selectedPlanId)}
        onOpenChange={(open) => !open && setSelectedPlanId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit pricing plan</DialogTitle>
            <DialogDescription>
              Update plan values used for checkout creation.
            </DialogDescription>
          </DialogHeader>
          {formFields}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="dim" size="lg">
                Close
              </Button>
            </DialogClose>
            <Button
              size="lg"
              onClick={onUpdate}
              disabled={updatePlan.isPending}
            >
              {updatePlan.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
