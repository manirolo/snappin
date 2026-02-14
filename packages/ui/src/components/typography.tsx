import { cn } from "@snappin/ui/lib/utils"

const headingStyle = 'font-onest'

export function H1({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h1 className={cn(headingStyle, "scroll-m-20 text-[1.7rem] sm:text-4xl font-bold tracking-tight md:text-[2.7rem]", className)}>
      {children}
    </h1>
  )
}

export function H2({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h2 className={cn(headingStyle, "scroll-m-20 pb-2 text-3xl font-bold first:mt-0", className)}>
      {children}
    </h2>
  )
}

export function H3({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h3 className={cn(headingStyle, "scroll-m-20 text-2xl xl:text-[1.55rem] font-bold", className)}>
      {children}
    </h3>
  )
}

export function H4({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h4 className={cn(headingStyle, "scroll-m-20 text-lg md:text-[1.3rem] tracking-[-0.3px] font-semibold", className)}>
      {children}
    </h4>
  )
}

export function H5({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h5 className={cn(headingStyle, 'scroll-m-20 text-lg font-semibold', className)}>
      {children}
    </h5>
  )
}

export function Paragraph({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <p className={cn("text-foreground font-onest", className)}>
      {children}
    </p>
  )
}

export function Small({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <p className={cn("font-onest text-[14.2px] md:text-[14.5px] text-muted-foreground", className)}>
      {children}
    </p>
  )
}

export const ExtraSmall = ({children, className}: {children?: React.ReactNode, className?: string}) => {
  return (
    <p className={cn("font-onest text-xs text-muted-foreground", className)}>{children}</p>
  )
} 

export function Lead({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <p className={cn("text-muted-foreground text-[0.98rem] md:text-[1rem]", className)}>
      {children}
    </p>
  )
}

