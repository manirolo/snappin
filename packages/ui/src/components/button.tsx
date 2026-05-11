import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import { cn } from "@snappin/ui/lib/utils";

const buttonVariants = cva(
  "cursor-pointer group whitespace-nowrap focus-visible:outline-hidden transition-colors duration-300 transition-all duration-300 font-medium tracking-normal inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary hover:bg-green-a4 shadow-[inset_0_1px_4px_rgba(255,255,255,0.2),0_15px_25px_-10px_rgba(34,197,94,0.25)] border-2 border-green-400 text-white tracking-tight-tighter transition-all duration-300 rounded-full",
        mono: "bg-gradient-to-b from-zinc-800 to-zinc-950 text-white dark:bg-zinc-300 dark:text-black active:scale-95 hover:bg-zinc-950/90 dark:hover:bg-zinc-300/90 data-[state=open]:bg-zinc-950/90 dark:data-[state=open]:bg-zinc-300/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 data-[state=open]:bg-destructive/90",
        destructive_light: "bg-red-2 text-destructive hover:bg-red-3",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 data-[state=open]:bg-secondary/90",
        outline:
          "bg-transparent shadow-none text-foreground border border-bg-4 hover:bg-accent data-[state=open]:bg-accent transition-colors duration-300 ",
        dashed:
          "text-accent-foreground border-2 border-input border-dashed bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:text-accent-foreground",
        ghost:
          "text-foreground hover:bg-accent hover:text-foreground  transition-all data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        dim: "text-foreground hover:bg-bg-a3 bg-bg-a2 disabled:text-muted-foreground hover:text-foreground data-[state=open]:text-foreground",
        foreground: "",
        inverse: "",
        link: "hover:opacity-100 opacity-70 transition-opacity p-0 duration-300",
        outline_2: "bg-card border border-border",
        warning: "bg-yellow-4",
      },
      appearance: {
        default: "",
        ghost: "",
      },
      underline: {
        solid: "",
        dashed: "",
      },
      underlined: {
        solid: "",
        dashed: "",
      },
      size: {
        _3xl: "h-[4.5rem]",
        _2xl: "min-w-46 sm:min-w-sm mx-auto md:min-w-102 min-h-[3rem] sm:min-h-[4.2rem] flex-1 gap-4 font-bold! text-lg sm:text-xl tracking-tight",
        xl: "h-[3rem] text-[1rem] gap-2 px-5",
        lg: "h-[2.85rem] text-[0.9rem] px-4 gap-1.5 [&_svg:not([class*=size-])]:size-4",
        md: "h-8.5 px-3 min-w-14.5 gap-1.5 text-[13px] [&_svg:not([class*=size-])]:size-4",
        sm: "h-8 px-2 gap-1.25 text-xs [&_svg:not([class*=size-])]:size-3.5",
        xs: "h-6 px-1 gap-1 text-xs [&_svg:not([class*=size-])]:size-3.5",
        icon: "size-8 [&_svg:not([class*=size-])]:size-3.5 shrink-0",
      },
      autoHeight: {
        true: "",
        false: "",
      },
      radius: {
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-2xl",
        full: "rounded-full",
      },
      mode: {
        default:
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        icon: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0",
        link: "text-primary h-auto p-0 bg-transparent rounded-none hover:bg-transparent data-[state=open]:bg-transparent",
        input: `
            justify-start font-normal hover:bg-background [&_svg]:transition-colors [&_svg]:hover:text-foreground data-[state=open]:bg-background 
            focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/30 
            [[data-state=open]>&]:border-ring [[data-state=open]>&]:outline-hidden [[data-state=open]>&]:ring-[3px] 
            [[data-state=open]>&]:ring-ring/30 
            aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
            in-data-[invalid=true]:border-destructive/60 in-data-[invalid=true]:ring-destructive/10  dark:in-data-[invalid=true]:border-destructive dark:in-data-[invalid=true]:ring-destructive/20
          `,
      },
      placeholder: {
        true: "text-muted-foreground",
        false: "",
      },
    },
    compoundVariants: [
      // Icons opacity for default mode
      {
        variant: "ghost",
        mode: "default",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "outline",
        mode: "default",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "dashed",
        mode: "default",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "secondary",
        mode: "default",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },

      // Icons opacity for default mode
      {
        variant: "outline",
        mode: "input",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "outline",
        mode: "icon",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },

      // Auto height
      {
        size: "xs",
        autoHeight: true,
        className: "h-auto min-h-7",
      },
      {
        size: "md",
        autoHeight: true,
        className: "h-auto min-h-10",
      },
      {
        size: "sm",
        autoHeight: true,
        className: "h-auto min-h-10",
      },
      {
        size: "lg",
        autoHeight: true,
        className: "h-auto min-h-10",
      },

      // shadow-xssupport
      {
        variant: "primary",
        mode: "default",
        appearance: "default",
      },
      {
        variant: "mono",
        mode: "default",
        appearance: "default",
        className: "shadow-xs shadow-black/5",
      },
      {
        variant: "secondary",
        mode: "default",
        appearance: "default",
        className: "shadow-xs shadow-black/5",
      },
      {
        variant: "outline",
        mode: "default",
        appearance: "default",
        className: "shadow-none",
      },
      {
        variant: "dashed",
        mode: "default",
        appearance: "default",
        className: "shadow-xs shadow-black/5",
      },
      {
        variant: "destructive",
        mode: "default",
        appearance: "default",
        className: "shadow-xs shadow-black/5",
      },

      // shadow-xssupport
      {
        variant: "primary",
        mode: "icon",
        appearance: "default",
        className: "shadow-xs shadow-black/5",
      },
      {
        variant: "mono",
        mode: "icon",
        appearance: "default",
        className: "shadow-xs shadow-black/5",
      },
      {
        variant: "secondary",
        mode: "icon",
        appearance: "default",
        className: "shadow-xs shadow-black/5",
      },
      {
        variant: "outline",
        mode: "icon",
        appearance: "default",
        className: "shadow-none",
      },
      {
        variant: "dashed",
        mode: "icon",
        appearance: "default",
        className: "shadow-xs shadow-black/5",
      },
      {
        variant: "destructive",
        mode: "icon",
        appearance: "default",
        className: "shadow-xs shadow-black/5",
      },

      // Link
      {
        variant: "primary",
        mode: "link",
        underline: "solid",
        className:
          "font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid",
      },
      {
        variant: "primary",
        mode: "link",
        underline: "dashed",
        className:
          "font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1",
      },
      {
        variant: "primary",
        mode: "link",
        underlined: "solid",
        className:
          "font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid",
      },
      {
        variant: "primary",
        mode: "link",
        underlined: "dashed",
        className:
          "font-medium text-primary hover:text-primary/90 [&_svg]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1",
      },

      {
        variant: "inverse",
        mode: "link",
        underline: "solid",
        className:
          "font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid",
      },
      {
        variant: "inverse",
        mode: "link",
        underline: "dashed",
        className:
          "font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1",
      },
      {
        variant: "inverse",
        mode: "link",
        underlined: "solid",
        className:
          "font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid",
      },
      {
        variant: "inverse",
        mode: "link",
        underlined: "dashed",
        className:
          "font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1",
      },

      {
        variant: "foreground",
        mode: "link",
        underline: "solid",
        className:
          "font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid",
      },
      {
        variant: "foreground",
        mode: "link",
        underline: "dashed",
        className:
          "font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1",
      },
      {
        variant: "foreground",
        mode: "link",
        underlined: "solid",
        className:
          "font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid",
      },
      {
        variant: "foreground",
        mode: "link",
        underlined: "dashed",
        className:
          "font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1",
      },

      // Ghost
      {
        variant: "primary",
        appearance: "ghost",
        className:
          "bg-transparent text-primary/90 hover:bg-primary/5 data-[state=open]:bg-primary/5",
      },
      {
        variant: "destructive",
        appearance: "ghost",
        className:
          "bg-transparent text-destructive/90 hover:bg-destructive/5 data-[state=open]:bg-destructive/5",
      },
      {
        variant: "ghost",
        mode: "icon",
        className: "text-muted-foreground",
      },

      // Size
      {
        size: "xs",
        mode: "icon",
        className: "w-7 h-7 p-0 [[&_svg:not([class*=size-])]:size-3.5",
      },
      {
        size: "sm",
        mode: "icon",
        className: "w-8 h-8 p-0 [[&_svg:not([class*=size-])]:size-3.5",
      },
      {
        size: "md",
        mode: "icon",
        className: "w-9 h-9 p-0 [&_svg:not([class*=size-])]:size-4",
      },
      {
        size: "icon",
        className: "w-9 h-9 p-0 [&_svg:not([class*=size-])]:size-4",
      },
      {
        size: "lg",
        mode: "icon",
        className: "w-10 h-10 p-0 [&_svg:not([class*=size-])]:size-4",
      },

      // Input mode
      {
        mode: "input",
        placeholder: true,
        variant: "outline",
        className: "font-normal text-muted-foreground",
      },
      {
        mode: "input",
        variant: "outline",
        size: "sm",
        className: "gap-1.25",
      },
      {
        mode: "input",
        variant: "outline",
        size: "md",
        className: "gap-1.5",
      },
      {
        mode: "input",
        variant: "outline",
        size: "lg",
        className: "gap-1.5",
      },
    ],
    defaultVariants: {
      variant: "primary",
      mode: "default",
      size: "md",
      radius: "lg",
      appearance: "default",
    },
  },
);

function Button({
  className,
  selected,
  variant,
  radius,
  appearance,
  mode,
  size,
  autoHeight,
  underlined,
  underline,
  asChild = false,
  placeholder = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    selected?: boolean;
    asChild?: boolean;
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          radius,
          appearance,
          mode,
          autoHeight,
          placeholder,
          underlined,
          underline,
          className,
        }),
        asChild && props.disabled && "pointer-events-none opacity-30",
      )}
      {...(selected && { "data-state": "open" })}
      {...props}
    />
  );
}

export { Button, buttonVariants };
