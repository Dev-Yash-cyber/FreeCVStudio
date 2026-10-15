import React, { useState } from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { Baseline, Check, RotateCcw } from 'lucide-react';

interface FontOption {
  name: string;
  category: 'Sans-Serif' | 'Serif' | 'Monospace';
  sample: string;
}

const FONTS: FontOption[] = [
  { name: 'Inter', category: 'Sans-Serif', sample: 'Modern, balanced, and hyper-legible' },
  { name: 'Roboto', category: 'Sans-Serif', sample: 'Geometric yet friendly curves' },
  { name: 'Open Sans', category: 'Sans-Serif', sample: 'Neutral, upright, and open reading' },
  { name: 'Outfit', category: 'Sans-Serif', sample: 'Contemporary design-forward aesthetic' },
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif', sample: 'Sleek executive tech typography' },
  { name: 'Merriweather', category: 'Serif', sample: 'Editorial warmth crafted for screens' },
  { name: 'Playfair Display', category: 'Serif', sample: 'Sophisticated luxury with high contrast' },
  { name: 'Lora', category: 'Serif', sample: 'Contemporary serif with calligraphy roots' },
  { name: 'Fira Code', category: 'Monospace', sample: 'Technical precision for software profiles' },
  { name: 'JetBrains Mono', category: 'Monospace', sample: 'Clean developer monospaced glyphs' },
];

export const CustomizeFont: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);
  const currentFont = design.fontFamily || 'Inter';
  const [selectedCat, setSelectedCat] = useState<'All' | 'Sans-Serif' | 'Serif' | 'Monospace'>('All');

  const filtered = FONTS.filter((f) => selectedCat === 'All' || f.category === selectedCat);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Baseline className="w-5 h-5 text-[#7c3aed]" />
          Font Family & Typography
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Select the typography voice for your resume. Renders seamlessly across browsers and PDF downloads.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 pb-1">
        {(['All', 'Sans-Serif', 'Serif', 'Monospace'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedCat === cat
                ? 'bg-[#7c3aed] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Font Cards Grid */}
      <div className="space-y-2.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
        {filtered.map((f) => {
          const isSelected = currentFont.toLowerCase() === f.name.toLowerCase();

          return (
            <button
              key={f.name}
              type="button"
              onClick={() => updateDesign({ fontFamily: f.name })}
              className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                isSelected
                  ? 'border-[#7c3aed] bg-[#7c3aed]/5 ring-1 ring-[#7c3aed]'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="font-bold text-base text-slate-900"
                    style={{ fontFamily: `'${f.name}', sans-serif` }}
                  >
                    {f.name}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {f.category}
                  </span>
                </div>
                <p
                  className="text-xs text-slate-500 mt-1"
                  style={{ fontFamily: `'${f.name}', sans-serif` }}
                >
                  {f.sample}
                </p>
              </div>

              {isSelected && <Check className="w-5 h-5 text-[#7c3aed] flex-shrink-0 ml-3" />}
            </button>
          );
        })}
      </div>

      {/* Body Font Weight */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Body Font Weight
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: '300', label: 'Light (300)' },
              { id: '400', label: 'Regular (400)' },
              { id: '500', label: 'Medium (500)' },
            ] as const
          ).map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => updateDesign({ bodyWeight: w.id })}
              className={`py-2 text-xs rounded-lg border text-center transition ${
                (design.bodyWeight || '400') === w.id
                  ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {w.label}
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
              fontFamily: 'Inter',
              bodyWeight: '400',
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Font defaults
        </button>
      </div>
    </div>
  );
};
