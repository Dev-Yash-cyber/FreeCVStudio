import React from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { Sliders, X, RotateCcw } from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Navy Executive', hex: '#1e3a8a' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Teal Modern', hex: '#0d9488' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Warm Amber', hex: '#d97706' },
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Minimal Slate', hex: '#0f172a' },
];

const FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Merriweather',
  'Lora',
  'Playfair Display',
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSettingsDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 md:w-96 bg-white shadow-2xl border-l flex flex-col transition-transform">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          Document Design Settings
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Paper Size */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Paper Size & Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['A4', 'Letter'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => updateDesign({ paperSize: size })}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  design.paperSize === size
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {size} {size === 'A4' ? '(Standard)' : '(US Letter)'}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Accent Color
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => updateDesign({ accentColor: c.hex })}
                className="h-8 rounded-lg border-2 transition transform hover:scale-105"
                style={{
                  backgroundColor: c.hex,
                  borderColor: design.accentColor === c.hex ? '#000' : 'transparent',
                }}
                title={c.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              value={design.accentColor || '#2563eb'}
              onChange={(e) => updateDesign({ accentColor: e.target.value })}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-600">{design.accentColor}</span>
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Typography / Font Family
          </label>
          <select
            value={design.fontFamily || 'Inter'}
            onChange={(e) => updateDesign({ fontFamily: e.target.value })}
            className="w-full p-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Sizing Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Body Font Size</span>
              <span>{design.fontSize || 11}px</span>
            </div>
            <input
              type="range"
              min={9}
              max={13}
              step={0.5}
              value={design.fontSize || 11}
              onChange={(e) => updateDesign({ fontSize: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Page Margins</span>
              <span>{design.margins || 24}px</span>
            </div>
            <input
              type="range"
              min={12}
              max={36}
              value={design.margins || 24}
              onChange={(e) => updateDesign({ margins: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Section Spacing</span>
              <span>{design.sectionSpacing || 18}px</span>
            </div>
            <input
              type="range"
              min={8}
              max={32}
              value={design.sectionSpacing || 18}
              onChange={(e) => updateDesign({ sectionSpacing: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Line Spacing</span>
              <span>{design.lineSpacing || 1.4}</span>
            </div>
            <input
              type="range"
              min={1.1}
              max={1.8}
              step={0.05}
              value={design.lineSpacing || 1.4}
              onChange={(e) => updateDesign({ lineSpacing: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
        <button
          type="button"
          onClick={() =>
            updateDesign({
              fontFamily: 'Inter',
              fontSize: 11,
              margins: 24,
              sectionSpacing: 18,
              lineSpacing: 1.4,
              accentColor: '#2563eb',
            })
          }
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Apply & Close
        </button>
      </div>
    </div>
  );
};
