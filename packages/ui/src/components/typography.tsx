import { cn } from "@snappin/ui/lib/utils"

export function H1({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h1 className={cn("scroll-m-20 mb-3 text-[1.7rem] sm:text-4xl font-black tracking-tighter md:mb-8 md:text-4xl", className)}>
      {children}
    </h1>
  )
}

export function H2({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h2 className={cn("scroll-m-20 pb-2 text-3xl font-extrabold tracking-tight first:mt-0", className)}>
      {children}
    </h2>
  )
}

export function H3({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h3 className={cn("scroll-m-20 text-2xl font-bold tracking-tight", className)}>
      {children}
    </h3>
  )
}

export function H4({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h4 className={cn("scroll-m-20 text-lg md:text-[1.3rem] tracking-[-0.3px] font-semibold", className)}>
      {children}
    </h4>
  )
}

export function H5({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <h5 className={`scroll-m-20 text-lg font-semibold tracking-tight ${className || ''}`}>
      {children}
    </h5>
  )
}

export function Paragraph({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <p className={cn("text-secondary", className)}>
      {children}
    </p>
  )
}

export function Small({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <span className={cn("text-[14.2px] md:text-[14.5px] text-muted-foreground", className)}>
      {children}
    </span>
  )
}

export const ExtraSmall = ({children, className}: {children?: React.ReactNode, className?: string}) => {
  return (
    <span className={cn("text-[13px] text-muted-foreground", className)}>{children}</span>
  )
} 

export function Lead({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <p className={cn("text-muted-foreground text-[0.98rem] md:text-lg", className)}>
      {children}
    </p>
  )
}

