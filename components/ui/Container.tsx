import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={
        className
          ? `mx-auto w-full max-w-[1200px] px-6 md:px-8 ${className}`
          : "mx-auto w-full max-w-[1200px] px-6 md:px-8"
      }
    >
      {children}
    </div>
  );
}
