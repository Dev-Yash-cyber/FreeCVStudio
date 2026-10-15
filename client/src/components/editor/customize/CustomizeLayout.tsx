import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { Columns, Check, RotateCcw } from 'lucide-react';

export const CustomizeLayout: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  const layoutModes = [
    {
      id: 'single',
      name: 'Single Column',
      desc: 'Linear top-to-bottom reading order. Highest ATS compatibility.',
    },
    {
      id: 'two-column-left',
      name: 'Two Column (Left Sidebar)',
      desc: 'Skills, contact, and credentials on the left side.',
    },
    {
      id: 'two-column-right',
      name: 'Two Column (Right Sidebar)',
      desc: 'Main experience on the left, auxiliary info on the right.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Columns className="w-5 h-5 text-[#7c3aed]" />
          Layout & Columns
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Adjust the visual structure, column distribution, and spacing.
        </p>
      </div>

      {/* Column Structure Mode */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Structure Style
        </label>
        <div className="space-y-2">
          {layoutModes.map((m) => {
            const isSelected = (design.layoutMode || 'single') === m.id;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() =>
                  updateDesign({
                    layoutMode: m.id as any,
                    twoColumnLayout: m.id !== 'single',
                  })
                }
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 ring-1 ring-[#7c3aed]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-slate-900">{m.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{m.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#7c3aed] flex-shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Column Gap */}
      <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <div className="flex justify-between text-xs font-semibold text-slate-800">
          <span>Column Gap / Gutters</span>
          <span className="font-mono text-[#7c3aed]">{design.columnGap || 24}px</span>
        </div>
        <input
          type="range"
          min={12}
          max={40}
          value={design.columnGap || 24}
          onChange={(e) => updateDesign({ columnGap: Number(e.target.value) })}
          className="w-full accent-[#7c3aed]"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Narrow (12px)</span>
          <span>Medium (24px)</span>
          <span>Wide (40px)</span>
        </div>
      </div>

      {/* Sidebar Ratio */}
      {design.layoutMode !== 'single' && (
        <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-xs font-semibold text-slate-800">
            <span>Sidebar Width</span>
            <span className="font-mono text-[#7c3aed]">{design.sidebarWidth || 32}%</span>
          </div>
          <input
            type="range"
            min={24}
            max={42}
            step={2}
            value={design.sidebarWidth || 32}
            onChange={(e) => updateDesign({ sidebarWidth: Number(e.target.value) })}
            className="w-full accent-[#7c3aed]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Slim (24%)</span>
            <span>Balanced (32%)</span>
            <span>Wide (42%)</span>
          </div>
        </div>
      )}

      {/* Section Divider Line Style */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Section Divider Lines
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['none', 'solid', 'dashed', 'dotted', 'thick', 'gradient'] as const).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => updateDesign({ dividerStyle: style })}
              className={`p-2.5 rounded-lg border text-xs font-medium capitalize text-center transition ${
                (design.dividerStyle || 'solid') === style
                  ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={() =>
            updateDesign({
              layoutMode: 'single',
              twoColumnLayout: false,
              columnGap: 24,
              sidebarWidth: 32,
              dividerStyle: 'solid',
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Layout defaults
        </button>
      </div>
    </div>
  );
};
