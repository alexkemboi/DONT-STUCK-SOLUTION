import { systemSettings } from "@/lib/data/dummy-data";
import { SettingsForms } from "@/components/admin/settings/settings-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Percent, Calendar, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">
          Configure system parameters, financial rules, and notification settings.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Percent className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Interest Rate</p>
              <p className="text-xl font-bold text-slate-900">
                {systemSettings.interestRate}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Settings className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Processing Fee</p>
              <p className="text-xl font-bold text-slate-900">
                {systemSettings.processingFeePercent}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Max Tenure</p>
              <p className="text-xl font-bold text-slate-900">
                {systemSettings.maxTenureMonths} months
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <Bell className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">NPL Threshold</p>
              <p className="text-xl font-bold text-slate-900">
                {systemSettings.nplThresholdDays} days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Forms */}
      <SettingsForms settings={systemSettings} />
    </div>
  );
}
