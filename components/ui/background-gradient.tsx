// @/components/ui/background-gradient.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
  ...props
}: BackgroundGradientProps) => {
  return (
    <div
      className={cn(
        "relative p-[2px] rounded-[22px] overflow-hidden",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-blue-600 to-red-600 rounded-[22px]",
          animate && "animate-[spin_4s_linear_infinite]"
        )}
        style={{
          background: animate
            ? "linear-gradient(90deg, hsl(221, 100%, 50%), hsl(0, 100%, 50%), hsl(221, 100%, 50%))"
            : "linear-gradient(90deg, hsl(221, 100%, 50%), hsl(0, 100%, 50%))",
          backgroundSize: animate ? "200% 200%" : "100% 100%",
        }}
      />
      <div
        className={cn(
          "relative z-10 bg-background dark:bg-zinc-900 rounded-[20px] p-4 h-full w-full",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};