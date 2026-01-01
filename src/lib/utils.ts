import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function formatMAD(value: number): string {
  // Ensure 2 decimals
  const fixed = value.toFixed(2);

  // Split integer & decimals
  const [intPart, decimalPart] = fixed.split(".");

  // Add spaces every 3 digits
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Return final formatted string
  return `${formattedInt}.${decimalPart}`;
}

export const genRanHex = (size: number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
