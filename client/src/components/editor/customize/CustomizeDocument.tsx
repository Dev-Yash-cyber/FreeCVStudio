import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { FileText, Check, RotateCcw } from 'lucide-react';

const BG_PRESETS = [
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Cream Warm', hex: '#fafaf9' },
  { name: 'Subtle Slate', hex: '#f8fafc' },
  { name: 'Ivory Soft', hex: '#fdfbf7' },
  { name: 'Cool Light', hex: '#f1f5f9' },
];

export const CustomizeDocument: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#7c3aed]" />
          Document Settings
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Configure paper size, page background, and outer dimensions.
        </p>
      </div>

      {/* Paper Size */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Paper Size
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateDesign({ paperSize: 'A4' })}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              design.paperSize === 'A4'
                ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] ring-1 ring-[#7c3aed]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">A4 Standard</span>
              {design.paperSize === 'A4' && <Check className="w-4 h-4 text-[#7c3aed]" />}
            </div>
            <span className="text-[11px] text-slate-500 mt-1">210 × 297 mm (Global standard)</span>
          </button>

          <button
            type="button"
            onClick={() => updateDesign({ paperSize: 'Letter' })}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              design.paperSize === 'Letter'
                ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] ring-1 ring-[#7c3aed]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">US Letter</span>
              {design.paperSize === 'Letter' && <Check className="w-4 h-4 text-[#7c3aed]" />}
            </div>
            <span className="text-[11px] text-slate-500 mt-1">8.5 × 11 in (US & Canada standard)</span>
          </button>
        </div>
      </div>

      {/* Page Margins */}
      <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <div className="flex justify-between text-xs font-semibold text-slate-800">
          <span>Page Margins</span>
          <span className="font-mono text-[#7c3aed]">{design.margins || 24}px</span>
        </div>
        <input
          type="range"
          min={12}
          max={44}
          value={design.margins || 24}
          onChange={(e) => updateDesign({ margins: Number(e.target.value) })}
          className="w-full accent-[#7c3aed]"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Compact (12px)</span>
          <span>Balanced (24px)</span>
          <span>Spacious (44px)</span>
        </div>
      </div>

      {/* Document Background Color */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Page Background Color
        </label>
        <div className="grid grid-cols-5 gap-2">
          {BG_PRESETS.map((bg) => (
            <button
              key={bg.hex}
              type="button"
              onClick={() => updateDesign({ backgroundColor: bg.hex })}
              className={`h-10 rounded-xl border-2 transition flex items-center justify-center relative shadow-sm ${
                (design.backgroundColor || '#ffffff').toLowerCase() === bg.hex.toLowerCase()
                  ? 'border-[#7c3aed] ring-2 ring-[#7c3aed]/30'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
              style={{ backgroundColor: bg.hex }}
              title={bg.name}
            >
              {(design.backgroundColor || '#ffffff').toLowerCase() === bg.hex.toLowerCase() && (
                <Check className="w-3.5 h-3.5 text-slate-900" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <input
            type="color"
            value={design.backgroundColor || '#ffffff'}
            onChange={(e) => updateDesign({ backgroundColor: e.target.value })}
            className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-600">
            {design.backgroundColor || '#ffffff'} (Custom background)
          </span>
        </div>
      </div>

      {/* Reset Defaults */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={() =>
            updateDesign({
              paperSize: 'A4',
              margins: 24,
              backgroundColor: '#ffffff',
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Document defaults
        </button>
      </div>
    </div>
  );
};
