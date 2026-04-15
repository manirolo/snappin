import React from "react";
import { Sheet, SheetTrigger } from "../../sheet";
import { Label } from "../../label";
import { Paragraph } from "../../typography";
import { MdKeyboardArrowRight } from "react-icons/md";

export interface SheetInputProps {
  label?: string;
  value?: string;
}

export const SheetInput = ({
  label = "Amount",
  value = "$40",
}: SheetInputProps) => {
  return (
    <Sheet>
      <SheetTrigger className="px-4 py-3 flex justify-between items-center  hover:bg-accent w-full cursor-pointer">
        <div className="flex flex-col gap-1">
          <Label className="text-muted-foreground tracking-[-0.1px] font-medium">{label}</Label>
          <Paragraph className="text-start tracking-[-0.2px] font-medium">{value}</Paragraph>
        </div>
        <div>
          <MdKeyboardArrowRight className="size-7 text-muted-foreground" />
        </div>
      </SheetTrigger>
    </Sheet>
  );
};
