import React from "react";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@snappin/ui/components/card";
import { ExtraSmall } from "@snappin/ui/components/typography";
import { trpc } from "@snappin/api/react/client";
import { Icon } from "@iconify/react";
import { appMetadata } from "@snappin/apps/app.metadata";

const DATE_RANGES = [
  { id: "today", label: "Today" },
  { id: "this-month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
  { id: "last-12-months", label: "Last 12 months" },
  { id: "custom", label: "Custom" },
] as const;

export const NewScanCard = () => {
  const [range, setRange] = React.useState<string>("this-month");
  const [open, setOpen] = React.useState(false);
  const [selectedEmail, setSelectedEmail] = React.useState<string | null>(null);

  const { data } = trpc.integration.connectedEmailAccounts.useQuery(undefined, {
    retry: 1,
  });

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon={"lucide:search"} />
          Find past invoices
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Email account */}
        <div className="space-y-2">
          <Label>Email account</Label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {selectedEmail ?? "Select an account"}
                <Icon icon="mynaui:mail" className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="p-0 drop-shadow-xl">
              <div className="w-[--radix-popover-trigger-width] box-border">
                <Command className="border-0">
                  <CommandInput placeholder="Search email account..." />
                  <CommandList className="p-0">
                    <CommandEmpty>No account found.</CommandEmpty>

                    <CommandGroup className="p-0">
                      {data?.map((email) => (
                        <CommandItem
                          key={email.identifierEmail}
                          value={email.identifierEmail}
                          onSelect={(value) => {
                            setSelectedEmail(value);
                            setOpen(false);
                          }}
                          className="flex items-center gap-2 px-3"
                        >
                          <Icon
                            icon={appMetadata[email.appSlug].icon}
                            className="h-4 w-4"
                          />
                          <span className="flex-1 truncate">
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
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date range */}
        <div className="space-y-2">
          <Label>Select date range</Label>

          <div className="flex flex-wrap gap-2">
            {DATE_RANGES.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="xs"
                variant={range === item.id ? "primary" : "outline"}
                onClick={() => setRange(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom range */}
        {range === "custom" && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Input type="date" className="hide-calendar-icon" />
              <span className="text-muted-foreground">to</span>
              <Input type="date" className="hide-calendar-icon" />
            </div>

            <ExtraSmall>
              Note: Range should not be longer than 12 months
            </ExtraSmall>
          </div>
        )}

        {/* Action */}
        <div className="flex justify-end pt-2">
          <Button>Scan now</Button>
        </div>
      </CardContent>
    </Card>
  );
};
