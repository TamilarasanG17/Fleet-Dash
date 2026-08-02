import { useState } from "react";

// Shape of the settings this panel manages. Wire `onSave` up to your real
// settings API / SettingsContext once one exists — for now this component
// is self-contained and just holds local state.
export interface FleetSettings {
  // Map & alerts
  geofenceRadiusMeters: number;
  refreshIntervalSeconds: number;
  distanceUnit: "km" | "mi";
  // Notifications & display
  emailAlerts: boolean;
  smsAlerts: boolean;
  soundAlerts: boolean;
  darkMode: boolean;
}

const DEFAULT_SETTINGS: FleetSettings = {
  geofenceRadiusMeters: 200,
  refreshIntervalSeconds: 10,
  distanceUnit: "km",
  emailAlerts: true,
  smsAlerts: false,
  soundAlerts: true,
  darkMode: false,
};

interface SettingsPanelProps {
  initialSettings?: Partial<FleetSettings>;
  onSave?: (settings: FleetSettings) => void;
}

// --- Small inline icons, kept local so no extra icon library is required ---

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 21s-7-5.14-7-11a7 7 0 0 1 14 0c0 5.86-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// --- Reusable field controls, styled to match the rest of the dashboard ---

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function NumberField({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="py-3">
      <p className="text-sm font-medium text-slate-800">{label}</p>
      {description && <p className="mb-2 text-xs text-slate-400">{description}</p>}
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-28 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
      </div>
    </div>
  );
}

function SelectField({
  label,
  description,
  value,
  onChange,
  options,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="py-3">
      <p className="text-sm font-medium text-slate-800">{label}</p>
      {description && <p className="mb-2 text-xs text-slate-400">{description}</p>}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="mb-1 flex items-center gap-2 text-slate-700">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mb-2 text-xs text-slate-400">{description}</p>
      <div className="divide-y divide-slate-200">{children}</div>
    </div>
  );
}

function Settings({ initialSettings, onSave }: SettingsPanelProps) {
  const [settings, setSettings] = useState<FleetSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });
  const [justSaved, setJustSaved] = useState(false);

  const update = <K extends keyof FleetSettings>(key: K, value: FleetSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // TODO: replace with a real API call / SettingsContext update
    onSave?.(settings);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        {justSaved && (
          <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
            <CheckIcon />
            Saved
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SectionCard
          icon={<MapPinIcon />}
          title="Map & Alerts"
          description="Controls how geofence alerts and live tracking behave."
        >
          <NumberField
            label="Geofence radius"
            description="Distance from a zone boundary before an alert fires."
            value={settings.geofenceRadiusMeters}
            onChange={(value) => update("geofenceRadiusMeters", value)}
            min={20}
            max={5000}
            step={10}
            suffix="meters"
          />

          <SelectField
            label="Live refresh rate"
            description="How often vehicle positions update on the map."
            value={String(settings.refreshIntervalSeconds)}
            onChange={(value) => update("refreshIntervalSeconds", Number(value))}
            options={[
              { value: "5", label: "Every 5 seconds" },
              { value: "10", label: "Every 10 seconds" },
              { value: "30", label: "Every 30 seconds" },
              { value: "60", label: "Every minute" },
            ]}
          />

          <SelectField
            label="Distance unit"
            value={settings.distanceUnit}
            onChange={(value) => update("distanceUnit", value as "km" | "mi")}
            options={[
              { value: "km", label: "Kilometers (km)" },
              { value: "mi", label: "Miles (mi)" },
            ]}
          />
        </SectionCard>

        <SectionCard
          icon={<BellIcon />}
          title="Notifications & Display"
          description="Choose how you're notified and how the dashboard looks."
        >
          <Toggle
            label="Email alerts"
            description="Send geofence enter/exit alerts to your email."
            checked={settings.emailAlerts}
            onChange={(value) => update("emailAlerts", value)}
          />
          <Toggle
            label="SMS alerts"
            description="Send critical alerts (e.g. offline vehicles) via SMS."
            checked={settings.smsAlerts}
            onChange={(value) => update("smsAlerts", value)}
          />
          <Toggle
            label="Sound alerts"
            description="Play a sound in-app when a new alert comes in."
            checked={settings.soundAlerts}
            onChange={(value) => update("soundAlerts", value)}
          />
          <Toggle
            label="Dark mode (beta)"
            description="Switch the dashboard to a dark color scheme."
            checked={settings.darkMode}
            onChange={(value) => update("darkMode", value)}
          />
        </SectionCard>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

export default Settings;