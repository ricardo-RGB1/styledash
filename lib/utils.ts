import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A formatter object that formats numbers as currency in USD.
 * To be used in the products page.
 */
export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
