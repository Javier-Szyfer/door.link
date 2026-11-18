import { AppShell } from "@/components/shell/app-shell";
import { DesktopGate } from "@/components/shell/desktop-gate";
import { InstallGuide } from "@/components/shell/install-guide";

export default function Page() {
  return (
    <>
      <DesktopGate />
      <InstallGuide />
      <div className="desktop:hidden">
        <AppShell />
      </div>
    </>
  );
}
