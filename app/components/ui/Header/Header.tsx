//Components
import { ToggleThemeIcon } from "./ToggleThemeIcon";
import { Description } from "./Description";

export const Header = () => {
  return (
    <div className="flex flex-col px-4  text-[rgb(68,68,68)] dark:text-[#f1f1f1]">
      <div className="flex justify-between pt-6 lg:pt-12  ">
        <h1 className="font-semibold">[ door ]</h1>
        <ToggleThemeIcon />
      </div>
      <Description />
    </div>
  );
};
