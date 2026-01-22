"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const DialogContext = React.createContext<Ctx | null>(null);

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  return <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) return children;
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: (e: any) => {
      child.props?.onClick?.(e);
      ctx.setOpen(true);
    },
  });
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(DialogContext);
  if (!ctx || !ctx.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => ctx.setOpen(false)} />
      <div className={cn("relative z-10 w-[min(560px,92vw)] rounded-2xl border bg-white p-4 shadow-xl", className)}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-2", className)} {...props} />;
}
export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn("text-base font-bold", className)} {...props} />;
}
