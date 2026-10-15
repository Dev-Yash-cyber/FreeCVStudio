import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { Type, RotateCcw } from 'lucide-react';

export const CustomizeFontSize: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  const presets = [
    { label: 'Compact', body: 9.5, heading: 14, name: 22 },
    { label: 'Standard', body: 11, heading: 16, name: 26 },
    { label: 'Legible', body: 12, heading: 18, name: 28 },
    { label: 'Large', body: 13, heading: 20, name: 32 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Type className="w-5 h-5 text-[#7c3aed]" />
          Font Size & Typography Scale
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Scale your text elements to achieve the perfect balance between density and readability.
        </p>
      </div>

      {/* Quick scale presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Scale Presets
        </label>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((p) => {
            const isMatch = design.fontSize === p.body;

            return (
              <button
                key={p.label}
                type="button"
                onClick={() =>
                  updateDesign({
                    fontSize: p.body,
                    headingFontSize: p.heading,
                    nameFontSize: p.name,
                  })
                }
                className={`py-2 px-1 text-xs rounded-lg border text-center transition ${
                  isMatch
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold ring-1 ring-[#7c3aed]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        {/* Body Font Size */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-xs font-semibold text-slate-800">
            <span>Body Text Size</span>
            <span className="font-mono text-[#7c3aed]">{design.fontSize || 11}px</span>
          </div>
          <input
            type="range"
            min={9}
            max={14}
            step={0.5}
            value={design.fontSize || 11}
            onChange={(e) => updateDesign({ fontSize: Number(e.target.value) })}
            className="w-full accent-[#7c3aed]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Small (9px)</span>
            <span>Standard (11px)</span>
            <span>Large (14px)</span>
          </div>
        </div>

        {/* Name Font Size */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-xs font-semibold text-slate-800">
            <span>Full Name Size</span>
            <span className="font-mono text-[#7c3aed]">{design.nameFontSize || 26}px</span>
          </div>
          <input
            type="range"
            min={18}
            max={36}
            step={1}
            value={design.nameFontSize || 26}
            onChange={(e) => updateDesign({ nameFontSize: Number(e.target.value) })}
            className="w-full accent-[#7c3aed]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Subtle (18px)</span>
            <span>Prominent (26px)</span>
            <span>Commanding (36px)</span>
          </div>
        </div>

        {/* Section Heading Font Size */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-xs font-semibold text-slate-800">
            <span>Section Headings Size</span>
            <span className="font-mono text-[#7c3aed]">{design.headingFontSize || 16}px</span>
          </div>
          <input
            type="range"
            min={13}
            max={24}
            step={0.5}
            value={design.headingFontSize || 16}
            onChange={(e) => updateDesign({ headingFontSize: Number(e.target.value) })}
            className="w-full accent-[#7c3aed]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Compact (13px)</span>
            <span>Standard (16px)</span>
            <span>Bold (24px)</span>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={() =>
            updateDesign({
              fontSize: 11,
              headingFontSize: 16,
              nameFontSize: 26,
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Font Size defaults
        </button>
      </div>
    </div>
  );
};
