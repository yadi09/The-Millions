import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const ToggleBadge = ({ enabled }: { enabled: boolean }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${enabled
        ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
        : "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200"
      }`}
  >
    {enabled ? "Enabled" : "Disabled"}
  </span>
);

const SettingRow = ({
  title,
  description,
  enabled = false,
}: {
  title: string;
  description: string;
  enabled?: boolean;
}) => (
  <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-200">
    <div>
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <ToggleBadge enabled={enabled} />
  </div>
);

const AdminSettings = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 text-blue-600"
        >
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35.492-.12.896-.454 1.065-.942.94-1.543 3.31-.826 2.37-2.37.169-.488.573-.822 1.065-.942z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your admin account preferences</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingRow
            title="Email Notifications"
            description="Receive email updates about your account activity"
            enabled
          />
          <SettingRow
            title="Dark Mode"
            description="Use dark theme for the admin dashboard"
            enabled
          />
          <SettingRow
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
