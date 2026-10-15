import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { Link2, Check, RotateCcw } from 'lucide-react';

export const CustomizeLinks: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  const displayModes = [
    {
      id: 'short',
      label: 'Clean Short Domain',
      desc: 'e.g. github.com/username, linkedin.com/in/profile',
    },
    {
      id: 'full',
      label: 'Full Canonical URL',
      desc: 'e.g. https://www.github.com/username',
    },
    {
      id: 'icon-label',
      label: 'Icon + Platform Label',
      desc: 'e.g. GitHub: username, Portfolio: site',
    },
    {
      id: 'icon-only',
      label: 'Minimalist Icon Only',
      desc: 'Compact clickable social icons',
    },
  ];

  const colorOptions = [
    { id: 'accent', label: 'Accent Color', desc: 'Highlights links in your primary theme color' },
    { id: 'text', label: 'Match Body Text', desc: 'Seamlessly blends into surrounding content' },
    { id: 'muted', label: 'Subtle Slate', desc: 'Subtle medium-gray styling' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-[#7c3aed]" />
          Links & Web Profiles
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Customize how LinkedIn, GitHub, portfolios, and websites appear.
        </p>
      </div>

      {/* Link Display Format */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          URL Presentation Mode
        </label>
        <div className="space-y-2">
          {displayModes.map((dm) => {
            const isSelected = (design.linkDisplayMode || 'short') === dm.id;

            return (
              <button
                key={dm.id}
                type="button"
                onClick={() => updateDesign({ linkDisplayMode: dm.id as any })}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] ring-1 ring-[#7c3aed]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{dm.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{dm.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#7c3aed] flex-shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Link Color Scheme */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Link Color Tone
        </label>
        <div className="space-y-2">
          {colorOptions.map((co) => {
            const isSelected = (design.linkColor || 'accent') === co.id;

            return (
              <button
                key={co.id}
                type="button"
                onClick={() => updateDesign({ linkColor: co.id as any })}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] ring-1 ring-[#7c3aed]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{co.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{co.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#7c3aed] flex-shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Underline Links Toggle */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
        <div>
          <span className="text-xs font-bold text-slate-800 block">Underline Hyperlinks</span>
          <span className="text-[11px] text-slate-500">
            Show a discrete underline beneath interactive web links
          </span>
        </div>
        <button
          type="button"
          onClick={() => updateDesign({ linkUnderline: !design.linkUnderline })}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
            design.linkUnderline ? 'bg-[#7c3aed]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
              design.linkUnderline ? 'translate-x-5' : 'translate-x-0'
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
              linkDisplayMode: 'short',
              linkUnderline: false,
              linkColor: 'accent',
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Links defaults
        </button>
      </div>
    </div>
  );
};
