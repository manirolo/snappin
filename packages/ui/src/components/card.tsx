'use client';

import * as React from 'react';
import { cn } from '@snappin/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Define CardContext
type CardContextType = {
  variant: 'default' | 'accent';
};

const CardContext = React.createContext<CardContextType>({
  variant: 'default', // Default value
});

// Hook to use CardContext
const useCardContext = () => {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a Card component');
  }
  return context;
};

// Variants
const cardVariants = cva('flex flex-col items-stretch text-card-foreground rounded-xl', {
  variants: {
    variant: {
      default: 'bg-card border border-bg-3 shadow-xs shadow-bg-2 flex flex-col rounded-xl corner-superellipse/1.125 overflow-hidden',
      accent: 'bg-muted shadow-xs p-1',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardHeaderVariants = cva('flex items-center justify-between flex-wrap p-5 min-h-14 gap-2', {
  variants: {
    variant: {
      default: 'border-b-0 border-border flex flex-col items-start justify-center',
      accent: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardContentVariants = cva('grow p-5', {
  variants: {
    variant: {
      default: '',
      accent: 'bg-card rounded-t-xl [&:last-child]:rounded-b-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardTableVariants = cva('grid grow', {
  variants: {
    variant: {
      default: '',
      accent: 'bg-card rounded-2xl',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardFooterVariants = cva('flex items-center p-5 min-h-14', {
  variants: {
    variant: {
      default: '',
      accent: 'bg-card rounded-b-xl mt-[2px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Card Component
function Card({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return (
    <CardContext.Provider value={{ variant: variant || 'default' }}>
      <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />
    </CardContext.Provider>
  );
}

// CardHeader Component
function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return <div data-slot="card-header" className={cn(cardHeaderVariants({ variant }), className)} {...props} />;
}

// CardContent Component
function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return <div data-slot="card-content" className={cn(cardContentVariants({ variant }), className)} {...props} />;
}

// CardTable Component
function CardTable({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return <div data-slot="card-table" className={cn(cardTableVariants({ variant }), className)} {...props} />;
}

// CardFooter Component
function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return <div data-slot="card-footer" className={cn(cardFooterVariants({ variant }), className)} {...props} />;
}

// Other Components
function CardHeading({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-heading" className={cn('space-y-1', className)} {...props} />;
}

function CardToolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-toolbar" className={cn('flex items-center gap-2.5', className)} {...props} />;
}


function CardLabel({ ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className="text-sm text-fg-2 font-medium text-center text-balance h-6 px-2 rounded-full bg-bg-a1 flex items-center justify-center w-fit"
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn('text-base font-medium leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-description" className={cn('text-sm font-normal text-muted-foreground', className)} {...props} />;
}

// Exports
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardHeading, CardTable, CardLabel, CardTitle, CardToolbar };
