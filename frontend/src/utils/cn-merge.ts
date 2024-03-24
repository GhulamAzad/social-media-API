import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tw-merge";

export function cnMerge(...classValues: ClassValue[]) {
    return twMerge(clsx(classValues))
}