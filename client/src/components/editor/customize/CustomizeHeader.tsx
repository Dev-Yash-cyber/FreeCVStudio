import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { AlignLeft, Check, RotateCcw } from 'lucide-react';

export const CustomizeHeader: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  const alignments = [
    { id: 'left', label: 'Left Aligned', desc: 'Standard left-aligned header' },
    { id: 'center', label: 'Centered', desc: 'Classic centered executive layout' },
    { id: 'right', label: 'Right Aligned', desc: 'Modern right-aligned layout' },
  ];

  const nameStyles = [
    { id: 'bold', label: 'Bold' },
    { id: 'black', label: 'Extra Bold' },
    { id: 'uppercase', label: 'UPPERCASE' },
  ];

  const headerDividers = [
    { id: 'none', label: 'None' },
    { id: 'thin', label: 'Subtle Line' },
    { id: 'accent', label: 'Thick Accent Bar' },
    { id: 'double', label: 'Double Line' },
  ];

  const contactStyles = [
    { id: 'simple', label: 'Inline Dots (•)' },
    { id: 'accent', label: 'Colored Icons' },
    { id: 'badge', label: 'Pill Badges' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlignLeft className="w-5 h-5 text-[#7c3aed]" />
          Header & Contact Block
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Customize personal header alignment, name typographic treatment, and contact layout.
        </p>
      </div>

      {/* Alignment */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Header Alignment
        </label>
        <div className="space-y-2">
          {alignments.map((a) => {
            const isSelected = (design.headerAlignment || 'left') === a.id;

            return (
              <button
                key={a.id}
                type="button"
                onClick={() => updateDesign({ headerAlignment: a.id as any })}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] ring-1 ring-[#7c3aed]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{a.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{a.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#7c3aed] flex-shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Name Typography Style */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Name Styling
        </label>
        <div className="grid grid-cols-3 gap-2">
          {nameStyles.map((ns) => {
            const isSelected = (design.nameStyle || 'bold') === ns.id;

            return (
              <button
                key={ns.id}
                type="button"
                onClick={() => updateDesign({ nameStyle: ns.id as any })}
                className={`py-2 text-xs rounded-lg border text-center transition ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {ns.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact Details Style */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Contact Info Badges
        </label>
        <div className="grid grid-cols-3 gap-2">
          {contactStyles.map((cs) => {
            const isSelected = (design.contactIconsStyle || 'simple') === cs.id;

            return (
              <button
                key={cs.id}
                type="button"
                onClick={() => updateDesign({ contactIconsStyle: cs.id as any })}
                className={`p-2.5 rounded-lg border text-xs text-center transition ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cs.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Divider Line */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Header Divider Line
        </label>
        <div className="grid grid-cols-4 gap-2">
          {headerDividers.map((hd) => {
            const isSelected = (design.headerDivider || 'thin') === hd.id;

            return (
              <button
                key={hd.id}
                type="button"
                onClick={() => updateDesign({ headerDivider: hd.id as any })}
                className={`py-2 text-xs rounded-lg border text-center transition ${
                  isSelected
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {hd.label}
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
              headerAlignment: 'left',
              nameStyle: 'bold',
              headerDivider: 'thin',
              contactIconsStyle: 'simple',
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Header defaults
        </button>
      </div>
    </div>
  );
};
