import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatISOToDateInput = (isoDate: string): string => {
  return new Date(isoDate).toISOString().split('T')[0]; // e.g., "2025-06-01"
};