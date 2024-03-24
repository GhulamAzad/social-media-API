import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cnMerge } from "../../utils/cn-merge";

const variants = {
  default: "",
  full: "w-full",
  small: "px-3 py-2",
  full_small: "w-full px-3 py-2",
};

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  variant?: keyof typeof variants;
}

export default function Button({
  children,
  variant = "default",
  className,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      className={cnMerge(
        "relative flex justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md border border-transparent text-sm font-medium focus:outline-none ",
        className,
        variants[variant]
      )}
      {...props}
    >
      {children}
    </button>
  );
}
