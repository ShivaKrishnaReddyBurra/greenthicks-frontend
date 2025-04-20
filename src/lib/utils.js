
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This function merges tailwind classes together
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
