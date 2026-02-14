import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@snappin/ui/components/select";
import { Icon } from "@iconify/react";

export const FilterByPeriod = () => {
  return (
    <div>
      <Select>
        <SelectTrigger size="sm">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:calendar-month-outline"
              className="w-4 h-4 text-gray-9"
            />
            <SelectValue placeholder="All Time" className="text-foreground" />
          </div>
        </SelectTrigger>
        <SelectContent position="popper" align="start" className="min-w-56">
          <SelectGroup>
            <SelectLabel>Period</SelectLabel>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-6-months">Last 6 months</SelectItem>
            <SelectItem value="last-12-months">Last 12 months</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem value="custom"> Custom</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
