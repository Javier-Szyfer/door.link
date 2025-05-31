//Components
import { ToggleThemeIcon } from "./toggle-theme";
import { Description } from "./description";

export const Header = () => {
  return (
    <div className="flex flex-col px-4 text-[#414141] dark:text-[#f1f1f1]">
      <div className="flex justify-between pt-6 lg:pt-12">
        <h1 className="font-medium">[ door ]</h1>
        <ToggleThemeIcon />
      </div>
      <Description />
    </div>
  );
};
