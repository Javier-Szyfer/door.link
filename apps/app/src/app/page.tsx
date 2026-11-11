import { AppShell } from "@/components/shell/app-shell";
import { DesktopGate } from "@/components/shell/desktop-gate";

export default function Page() {
  return (
    <>
      <DesktopGate />
      <div className="desktop:hidden">
        <AppShell />
      </div>
    </>
  );
}
