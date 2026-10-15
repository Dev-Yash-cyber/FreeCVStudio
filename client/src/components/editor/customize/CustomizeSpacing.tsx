import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { MoveVertical, RotateCcw } from 'lucide-react';

export const CustomizeSpacing: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  const presets = [
    { label: 'Tight', section: 12, entry: 6, line: 1.25 },
    { label: 'Normal', section: 18, entry: 10, line: 1.4 },
    { label: 'Relaxed', section: 24, entry: 14, line: 1.6 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MoveVertical className="w-5 h-5 text-[#7c3aed]" />
          Spacing & Density
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Tune vertical rhythm, margins, and gaps to fit content onto 1 or 2 pages.
        </p>
      </div>

      {/* Density Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Density Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => {
            const isMatch = design.sectionSpacing === p.section;

            return (
              <button
                key={p.label}
                type="button"
                onClick={() =>
                  updateDesign({
                    sectionSpacing: p.section,
                    entrySpacing: p.entry,
                    lineSpacing: p.line,
                  })
                }
                className={`py-2 px-2 text-xs rounded-lg border text-center transition ${
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

      <div className="space-y-4">
        {/* Section Spacing */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-xs font-semibold text-slate-800">
            <span>Section Spacing</span>
            <span className="font-mono text-[#7c3aed]">{design.sectionSpacing || 18}px</span>
          </div>
          <input
            type="range"
            min={8}
            max={32}
            value={design.sectionSpacing || 18}
            onChange={(e) => updateDesign({ sectionSpacing: Number(e.target.value) })}
            className="w-full accent-[#7c3aed]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Compact (8px)</span>
            <span>Balanced (18px)</span>
            <span>Spacious (32px)</span>
          </div>
        </div>

        {/* Entry Spacing */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-xs font-semibold text-slate-800">
            <span>Entry Gap (Between Jobs/Schools)</span>
            <span className="font-mono text-[#7c3aed]">{design.entrySpacing || 10}px</span>
          </div>
          <input
            type="range"
            min={4}
            max={24}
            value={design.entrySpacing || 10}
            onChange={(e) => updateDesign({ entrySpacing: Number(e.target.value) })}
            className="w-full accent-[#7c3aed]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Tight (4px)</span>
            <span>Normal (10px)</span>
            <span>Loose (24px)</span>
          </div>
        </div>

        {/* Line Height / Leading */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-xs font-semibold text-slate-800">
            <span>Line Height / Leading</span>
            <span className="font-mono text-[#7c3aed]">{design.lineSpacing || 1.4}</span>
          </div>
          <input
            type="range"
            min={1.1}
            max={1.85}
            step={0.05}
            value={design.lineSpacing || 1.4}
            onChange={(e) => updateDesign({ lineSpacing: Number(e.target.value) })}
            className="w-full accent-[#7c3aed]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Dense (1.1)</span>
            <span>Balanced (1.4)</span>
            <span>Airy (1.85)</span>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={() =>
            updateDesign({
              sectionSpacing: 18,
              entrySpacing: 10,
              lineSpacing: 1.4,
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Spacing defaults
        </button>
      </div>
    </div>
  );
};
