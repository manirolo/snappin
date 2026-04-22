import * as React from "react"
import { cn } from "@snappin/ui/lib/utils"

const headingStyle = 'font-inter'

export function H1({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h1 className={cn(headingStyle, "scroll-m-20 md:text-balance font-semibold tracking-tighter text-fg-4 text-6xl/17", className)}>
      {children}
    </h1>
  )
}

export function H2({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h2 className={cn(headingStyle, "text-4xl text-center font-medium tracking-tighter text-fg-4 leading-11 text-balance", className)}>
      {children}
    </h2>
  )
}

export function H3({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h3 className={cn(headingStyle, "scroll-m-20 text-2xl xl:text-[1.85rem] tracking-tight font-medium", className)}>
      {children}
    </h3>
  )
}

export function H4({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h4 className={cn(headingStyle, "scroll-m-20 text-xl md:text-[1.1rem] tracking-[-0.3px] font-semibold", className)}>
      {children}
    </h4>
  )
}

export function H5({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h5 className={cn(headingStyle, 'scroll-m-20 text-[19px] font-semibold', className)}>
      {children}
    </h5>
  )
}

export function Paragraph({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <p className={cn("text-foreground", className)}>
      {children}
    </p>
  )
}

export function Small({children, title, className}: {children?: React.ReactNode, title?: string, className?: string}) {
  return (
    <p className={cn("text-sm text-fg-2", className)} title={title}>
      {children}
    </p>
  )
}

export const ExtraSmall = ({children, className}: {children?: React.ReactNode, className?: string}) => {
  return (
    <p className={cn("text-xs text-fg-2", className)}>{children}</p>
  )
} 

export function Lead({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <p className={cn("text-muted-foreground tracking-tight font-medium text-lg/7", className)}>
      {children}
    </p>
  )
}

