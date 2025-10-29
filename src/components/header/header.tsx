"use client";

//Components
import { Description } from "./description";
import { ToggleThemeIcon } from "./toggle-theme";

export const Header = () => {
  return (
    <div className="flex flex-col px-4 text-[#414141] dark:text-[#f1f1f1]">
      <div className="flex items-center justify-between gap-4 pt-6 lg:pt-12">
        <h1 className="font-medium">[ door ]</h1>
        <div className="flex items-center gap-4">

          <ToggleThemeIcon />
        </div>
      </div>
      <Description />
    </div>
  );
};
