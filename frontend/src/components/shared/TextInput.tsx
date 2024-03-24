import { ComponentPropsWithRef, forwardRef } from "react";
import { cnMerge } from "../../utils/cn-merge";

export const TextInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type='text'
      className={cnMerge(
        "appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm",
        className
      )}
      {...props}
    />
  );
});

TextInput.displayName = "TextInput";
