import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { Sliders, CheckCircle2 } from 'lucide-react';

export const SettingsPreferencesPage: React.FC = () => {
  const { user, updateUserPreferences } = useAuthStore();
  const [defaultPaperSize, setDefaultPaperSize] = useState<'A4' | 'Letter'>(
    user?.preferences?.defaultPaperSize || 'A4'
  );
  const [autoSave, setAutoSave] = useState<boolean>(
    user?.preferences?.autoSave !== false
  );
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await updateUserPreferences({
      defaultPaperSize,
      autoSave,
      theme: 'light',
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application Preferences</h1>
          <p className="text-xs text-slate-500">Configure your default editor behaviors and paper standards.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6 text-xs">
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Preferences saved!</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-2">Default Paper Format</label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              {(['A4', 'Letter'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setDefaultPaperSize(size)}
                  className={`py-2 px-3 border rounded-xl font-semibold transition ${
                    defaultPaperSize === size
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {size} {size === 'A4' ? '(International)' : '(US Standard)'}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>Enable real-time debounced autosave in editor</span>
            </label>
            <p className="text-[11px] text-slate-400 mt-1 pl-6">
              When checked, changes to resume content will automatically synchronize in the background.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
