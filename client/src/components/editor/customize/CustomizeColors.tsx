import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { Palette, Check, RotateCcw } from 'lucide-react';

const PALETTES = [
  {
    name: 'Royal Blue',
    accent: '#2563eb',
    heading: '#1e293b',
    text: '#334155',
  },
  {
    name: 'Executive Navy',
    accent: '#1e3a8a',
    heading: '#0f172a',
    text: '#1e293b',
  },
  {
    name: 'Modern Emerald',
    accent: '#059669',
    heading: '#064e3b',
    text: '#1f2937',
  },
  {
    name: 'Clean Teal',
    accent: '#0d9488',
    heading: '#134e4a',
    text: '#1e293b',
  },
  {
    name: 'Luxury Violet',
    accent: '#7c3aed',
    heading: '#4c1d95',
    text: '#1e293b',
  },
  {
    name: 'Sunset Amber',
    accent: '#d97706',
    heading: '#78350f',
    text: '#292524',
  },
  {
    name: 'Crimson Bold',
    accent: '#dc2626',
    heading: '#7f1d1d',
    text: '#1e293b',
  },
  {
    name: 'Minimal Slate',
    accent: '#0f172a',
    heading: '#020617',
    text: '#334155',
  },
];

export const CustomizeColors: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#7c3aed]" />
          Color Scheme & Palette
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Pick curated professional color presets or dial in exact brand hex colors.
        </p>
      </div>

      {/* Palette Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Color Themes
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {PALETTES.map((p) => {
            const isMatch = design.accentColor === p.accent;

            return (
              <button
                key={p.name}
                type="button"
                onClick={() =>
                  updateDesign({
                    accentColor: p.accent,
                    headingColor: p.heading,
                    textColor: p.text,
                  })
                }
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  isMatch
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 ring-1 ring-[#7c3aed]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: p.accent }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: p.heading }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{p.name}</span>
                </div>
                {isMatch && <Check className="w-3.5 h-3.5 text-[#7c3aed]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Individual Color Pickers */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Custom Color Tokens
        </label>

        {/* Accent Color */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Primary Accent</span>
            <span className="text-[11px] text-slate-500">Links, highlights, bullet accents</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={design.accentColor || '#2563eb'}
              onChange={(e) => updateDesign({ accentColor: e.target.value })}
              className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-700 font-medium">
              {design.accentColor || '#2563eb'}
            </span>
          </div>
        </div>

        {/* Section Heading Color */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Section Headings</span>
            <span className="text-[11px] text-slate-500">Titles for experience, education, etc.</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={design.headingColor || '#0f172a'}
              onChange={(e) => updateDesign({ headingColor: e.target.value })}
              className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-700 font-medium">
              {design.headingColor || '#0f172a'}
            </span>
          </div>
        </div>

        {/* Body Text Color */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Body Text</span>
            <span className="text-[11px] text-slate-500">Descriptions and bullet content</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={design.textColor || '#1e293b'}
              onChange={(e) => updateDesign({ textColor: e.target.value })}
              className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-700 font-medium">
              {design.textColor || '#1e293b'}
            </span>
          </div>
        </div>

        {/* Secondary / Subtitle Color */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Secondary / Subtitles</span>
            <span className="text-[11px] text-slate-500">Dates, locations, minor metadata</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={design.secondaryColor || '#64748b'}
              onChange={(e) => updateDesign({ secondaryColor: e.target.value })}
              className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-700 font-medium">
              {design.secondaryColor || '#64748b'}
            </span>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={() =>
            updateDesign({
              accentColor: '#2563eb',
              headingColor: '#0f172a',
              textColor: '#1e293b',
              secondaryColor: '#64748b',
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Colors defaults
        </button>
      </div>
    </div>
  );
};
