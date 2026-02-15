import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@snappin/ui/components/dialog";
import { Button } from "@snappin/ui/components/button";
import { Input } from "@snappin/ui/components/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@snappin/ui/components/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@snappin/ui/components/command";
import { Label } from "@snappin/ui/components/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons-pro/core-solid-rounded";
import { ExtraSmall } from "@snappin/ui/components/typography";
import { trpc } from "@snappin/trpc/react/client";
import { Icon } from "@iconify/react";
import { appMetadata } from "@snappin/apps/app.metadata";

const DATE_RANGES = [
  { id: "today", label: "Today" },
  { id: "this-month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
  { id: "last-6-months", label: "Last 6 months" },
  { id: "custom", label: "Custom" },
] as const;

export const NewScanDialog = () => {
  const [range, setRange] = React.useState<string>("this-month");
  const [open, setOpen] = React.useState(false);
  const [selectedEmail, setSelectedEmail] = React.useState<string | null>(null);

  const { data } = trpc.integration.connectedEmailAccounts.useQuery(undefined, {
    retry: 1,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Search01Icon} />
            Find past invoices
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Find past invoices</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 mt-4">
          {/* Email */}
          <div className="space-y-2">
            <Label className="text-[0.9rem]">Email account</Label>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  radius={"md"}
                  size={"lg"}
                  aria-expanded={open}
                  className="border w-full active:scale-100 justify-between"
                >
                  {selectedEmail ?? "Select an account"}
                  <Icon
                    icon="mynaui:mail"
                    className="ml-2 h-4 w-4 shrink-0 opacity-50"
                  />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="min-w-full drop-shadow-xl"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search email account..." />
                  <CommandList>
                    <CommandEmpty>No account found.</CommandEmpty>

                    <CommandGroup>
                      {data?.map((email) => (
                        <CommandItem
                          key={email.identifierEmail}
                          value={email.identifierEmail}
                          onSelect={(value) => {
                            setSelectedEmail(value);
                            setOpen(false);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Icon
                            icon={appMetadata[email.appSlug].icon}
                            className="h-4 w-4"
                          />
                          <span className="flex-1">
                            {email.identifierEmail}
                          </span>

                          {selectedEmail === email.identifierEmail && (
                            <Icon
                              icon="entypo:check"
                              className="h-4 w-4 text-primary"
                            />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Date range buttons */}
          <div className="space-y-2">
            <Label>Select date range</Label>

            <div className="flex flex-wrap gap-2">
              {DATE_RANGES.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  radius={"md"}
                  variant={range === item.id ? "primary" : "outline"}
                  onClick={() => setRange(item.id)}
                  size={"xs"}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom range inputs */}
          {range === "custom" && (
            <div className="space-y-2">
              <div className="flex gap-3 items-center">
                <Input type="date" className="hide-calendar-icon" /> to
                <Input type="date" className="hide-calendar-icon" />
              </div>
              <ExtraSmall className="text-xs">
                Note: Range should not be longer than 6 months
              </ExtraSmall>
            </div>
          )}

          {/* Action */}
          <div className="pt-4 flex justify-end">
            <Button type="submit">Scan now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
