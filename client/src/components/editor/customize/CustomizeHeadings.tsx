import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { Heading, Check, RotateCcw } from 'lucide-react';

export const CustomizeHeadings: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  const headingStyles = [
    { id: 'left-bar', label: 'Left Accent Bar', desc: 'Vertical accent strip on left margin' },
    { id: 'underlined', label: 'Underlined Line', desc: 'Horizontal colored accent rule below' },
    { id: 'uppercase', label: 'Uppercase Minimal', desc: 'Clean all-caps with generous tracking' },
    { id: 'standard', label: 'Classic Standard', desc: 'Simple title-case without decoration' },
    { id: 'pill', label: 'Colored Pill Badge', desc: 'Rounded background tint pill' },
    { id: 'boxed', label: 'Shaded Box Header', desc: 'Full-width shaded background banner' },
  ];

  const weights = [
    { id: '400', label: 'Regular (400)' },
    { id: '500', label: 'Medium (500)' },
    { id: '600', label: 'Semi-Bold (600)' },
    { id: '700', label: 'Bold (700)' },
  ];

  const trackings = [
    { id: 'normal', label: 'Normal' },
    { id: 'wide', label: 'Wide' },
    { id: 'wider', label: 'Extra Wide' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Heading className="w-5 h-5 text-[#7c3aed]" />
          Section Headings
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Customize section title decorations, typography weight, and divider rules.
        </p>
      </div>

      {/* Heading Visual Style */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Heading Decoration Style
        </label>
        <div className="space-y-2">
          {headingStyles.map((hs) => {
            const isSelected = (design.headingStyle || 'left-bar') === hs.id;

            return (
              <button
                key={hs.id}
                type="button"
                onClick={() => updateDesign({ headingStyle: hs.id as any })}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] ring-1 ring-[#7c3aed]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{hs.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{hs.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#7c3aed] flex-shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Heading Weight */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Heading Font Weight
        </label>
        <div className="grid grid-cols-2 gap-2">
          {weights.map((w) => {
            const isSelected = (design.headingWeight || '600') === w.id;

            return (
              <button
                key={w.id}
                type="button"
                onClick={() => updateDesign({ headingWeight: w.id as any })}
                className={`py-2 px-3 text-xs rounded-lg border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{w.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#7c3aed]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Letter Spacing */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Letter Spacing (Tracking)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {trackings.map((tr) => {
            const isSelected = (design.headingTracking || 'normal') === tr.id;

            return (
              <button
                key={tr.id}
                type="button"
                onClick={() => updateDesign({ headingTracking: tr.id as any })}
                className={`py-2 text-xs rounded-lg border text-center transition ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tr.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle Icons Next to Headings */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
        <div>
          <span className="text-xs font-bold text-slate-800 block">Section Category Icons</span>
          <span className="text-[11px] text-slate-500">
            Show decorative icons alongside section titles
          </span>
        </div>
        <button
          type="button"
          onClick={() => updateDesign({ showIcons: !design.showIcons })}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
            design.showIcons ? 'bg-[#7c3aed]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
              design.showIcons ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={() =>
            updateDesign({
              headingStyle: 'left-bar',
              headingWeight: '600',
              headingTracking: 'normal',
              showIcons: true,
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Headings defaults
        </button>
      </div>
    </div>
  );
};
