import { AsyncSection } from "@/components/dashboard/async-section";
import { LinksManager } from "@/components/dashboard/links-manager";

export default function DashboardLinksPage() {
  return (
    <AsyncSection>
      {() => <LinksManager />}
    </AsyncSection>
  );
}
