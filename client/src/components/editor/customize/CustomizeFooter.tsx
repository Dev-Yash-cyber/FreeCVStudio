import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { PanelBottom, Check, RotateCcw } from 'lucide-react';

export const CustomizeFooter: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  const formats = [
    { id: 'Page 1 of 1', label: 'Page 1 of 1' },
    { id: '1 / 1', label: '1 / 1' },
    { id: '1', label: '1 (Number only)' },
  ];

  const positions = [
    { id: 'left', label: 'Left' },
    { id: 'center', label: 'Center' },
    { id: 'right', label: 'Right' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <PanelBottom className="w-5 h-5 text-[#7c3aed]" />
          Footer & Page Numbers
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Configure multi-page numbering, placement, and custom disclaimer notes.
        </p>
      </div>

      {/* Page Numbers Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
        <div>
          <span className="text-xs font-bold text-slate-900 block">Show Page Numbers</span>
          <span className="text-[11px] text-slate-500">
            Render page numbers on all pages or multi-page resumes
          </span>
        </div>
        <button
          type="button"
          onClick={() => updateDesign({ showPageNumbers: !design.showPageNumbers })}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
            design.showPageNumbers ? 'bg-[#7c3aed]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
              design.showPageNumbers ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {design.showPageNumbers && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Numbering Format */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Numbering Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {formats.map((f) => {
                const isSelected = (design.pageNumberFormat || 'Page 1 of 1') === f.id;

                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateDesign({ pageNumberFormat: f.id as any })}
                    className={`py-2 text-xs rounded-lg border text-center transition ${
                      isSelected
                        ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Numbering Position */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Horizontal Alignment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map((pos) => {
                const isSelected = (design.pageNumberPosition || 'center') === pos.id;

                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => updateDesign({ pageNumberPosition: pos.id as any })}
                    className={`py-2 text-xs rounded-lg border text-center transition ${
                      isSelected
                        ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pos.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Custom Footer Text */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Custom Footer Note (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. References available upon request"
          value={design.footerText || ''}
          onChange={(e) => updateDesign({ footerText: e.target.value })}
          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7c3aed]"
        />
        <span className="text-[11px] text-slate-400">
          Printed discreetly at the bottom edge of the document.
        </span>
      </div>

      {/* Show Footer Divider Line */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
        <div>
          <span className="text-xs font-bold text-slate-800 block">Footer Divider Rule</span>
          <span className="text-[11px] text-slate-500">
            Draw a thin separating line above the footer
          </span>
        </div>
        <button
          type="button"
          onClick={() => updateDesign({ showFooterDivider: !design.showFooterDivider })}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
            design.showFooterDivider ? 'bg-[#7c3aed]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
              design.showFooterDivider ? 'translate-x-5' : 'translate-x-0'
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
              showPageNumbers: false,
              pageNumberPosition: 'center',
              pageNumberFormat: 'Page 1 of 1',
              footerText: '',
              showFooterDivider: false,
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Footer defaults
        </button>
      </div>
    </div>
  );
};
