import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely. Standard shadcn / 21st.dev helper. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
