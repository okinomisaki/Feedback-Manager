"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

type Props = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
};

export function Checkbox({ checked, onCheckedChange, className, id }: Props) {
  return (
    <input
      id={id}
      type="checkbox"
      className={cn("h-4 w-4 rounded border-gray-300", className)}
      checked={!!checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
    />
  );
}
