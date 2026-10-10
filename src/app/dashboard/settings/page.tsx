import { AsyncSection } from "@/components/dashboard/async-section";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { ThemePicker } from "@/components/dashboard/theme-picker";

export default function DashboardSettingsPage() {
  return (
    <AsyncSection>
      {() => (
        <div className="flex flex-col gap-8">
          <ProfileForm />
          <ThemePicker />
        </div>
      )}
    </AsyncSection>
  );
}
