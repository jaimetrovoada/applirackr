import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function getClasses(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
