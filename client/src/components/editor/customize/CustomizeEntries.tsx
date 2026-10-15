import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { ListFilter, Check, RotateCcw } from 'lucide-react';

export const CustomizeEntries: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  const bulletStyles = [
    { id: 'disc', label: 'Classic Disc', glyph: '•' },
    { id: 'dash', label: 'Clean Dash', glyph: '–' },
    { id: 'arrow', label: 'Modern Arrow', glyph: '▸' },
    { id: 'diamond', label: 'Diamond', glyph: '◆' },
    { id: 'square', label: 'Square', glyph: '▪' },
    { id: 'check', label: 'Checkmark', glyph: '✓' },
  ];

  const dateFormats = [
    { id: 'MMM YYYY', label: 'Jan 2024' },
    { id: 'MM/YYYY', label: '01/2024' },
    { id: 'MMMM YYYY', label: 'January 2024' },
    { id: 'YYYY', label: '2024 (Year only)' },
  ];

  const datePositions = [
    { id: 'right', label: 'Right Aligned', desc: 'Date sits on the far right of the role title' },
    { id: 'below', label: 'Below Title', desc: 'Date appears underneath the role and employer' },
    { id: 'inline', label: 'Inline with Role', desc: 'Date appears right next to employer name' },
  ];

  const subtitleStyles = [
    { id: 'normal', label: 'Regular' },
    { id: 'bold', label: 'Bold' },
    { id: 'italic', label: 'Italic' },
    { id: 'uppercase', label: 'UPPERCASE' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-[#7c3aed]" />
          Entries & Bullet Points
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Customize bullet markers, dates formatting, and subtitle presentation.
        </p>
      </div>

      {/* Bullet Marker Style */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Bullet Marker Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {bulletStyles.map((b) => {
            const isSelected = (design.bulletStyle || 'disc') === b.id;

            return (
              <button
                key={b.id}
                type="button"
                onClick={() => updateDesign({ bulletStyle: b.id as any })}
                className={`p-3 rounded-xl border transition flex flex-col items-center justify-center text-center ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] ring-1 ring-[#7c3aed]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-lg font-bold leading-none mb-1 text-slate-900">{b.glyph}</span>
                <span className="text-[11px] font-medium">{b.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Format */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Date Display Format
        </label>
        <div className="grid grid-cols-2 gap-2">
          {dateFormats.map((df) => {
            const isSelected = (design.dateFormat || 'MMM YYYY') === df.id;

            return (
              <button
                key={df.id}
                type="button"
                onClick={() => updateDesign({ dateFormat: df.id as any })}
                className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs">{df.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#7c3aed]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Alignment Position */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Date Placement
        </label>
        <div className="space-y-2">
          {datePositions.map((dp) => {
            const isSelected = (design.datePosition || 'right') === dp.id;

            return (
              <button
                key={dp.id}
                type="button"
                onClick={() => updateDesign({ datePosition: dp.id as any })}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] ring-1 ring-[#7c3aed]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{dp.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{dp.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#7c3aed] flex-shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtitle / Company Styling */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Employer & Subtitle Style
        </label>
        <div className="grid grid-cols-4 gap-2">
          {subtitleStyles.map((s) => {
            const isSelected = (design.subtitleStyle || 'normal') === s.id;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => updateDesign({ subtitleStyle: s.id as any })}
                className={`py-2 text-xs rounded-lg border text-center transition ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={() =>
            updateDesign({
              bulletStyle: 'disc',
              dateFormat: 'MMM YYYY',
              datePosition: 'right',
              subtitleStyle: 'normal',
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Entries defaults
        </button>
      </div>
    </div>
  );
};
