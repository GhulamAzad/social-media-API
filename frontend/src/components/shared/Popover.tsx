import { ReactNode, useState } from "react";
import { cnMerge } from "../../utils/cn-merge";

const variants = {
  right: "right-0",
  left: "left-0",
  center: "left-1/2 -translate-x-1/2",
};

interface PopoverProps {
  children: ReactNode;
  triggerButton: ReactNode;
  variant?: keyof typeof variants;
}

export default function Popover({
  children,
  triggerButton,
  variant = "center",
}: Readonly<PopoverProps>) {
  const [state, setState] = useState(false);

  return (
    <div className='relative'>
      <button onClick={() => setState((prev) => !prev)}>{triggerButton}</button>
      {state && (
        <div
          className={cnMerge(
            "absolute top-full bg-white border p-6 shadow-xl",
            variants[variant]
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
