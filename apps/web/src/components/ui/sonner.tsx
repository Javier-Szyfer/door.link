"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group [&>*]:!rounded-none"
      toastOptions={{
        classNames: {
          toast:
            "group toast !rounded-none group-[.toaster]:bg-[#fff] dark:group-[.toaster]:bg-[#121212] group-[.toaster]:text-[#0000ff] dark:group-[.toaster]:text-[#f1f1f1] group-[.toaster]:border-[#0000ff] dark:group-[.toaster]:border-[#f1f1f1] group-[.toaster]:shadow-lg",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
