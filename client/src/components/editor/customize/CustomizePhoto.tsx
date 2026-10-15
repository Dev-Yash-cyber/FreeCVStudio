import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { Camera, Check, RotateCcw } from 'lucide-react';

export const CustomizePhoto: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const design = resume?.design || ({} as any);

  const shapes = [
    { id: 'circle', label: 'Circle' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'square', label: 'Square' },
  ];

  const borders = [
    { id: 'none', label: 'None' },
    { id: 'thin', label: 'Thin Gray' },
    { id: 'thick-accent', label: 'Accent Border' },
    { id: 'shadow', label: 'Soft Shadow' },
  ];

  const positions = [
    { id: 'left', label: 'Left of Name' },
    { id: 'right', label: 'Right of Name' },
    { id: 'center', label: 'Centered' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#7c3aed]" />
          Profile Photograph
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Adjust profile picture visibility, crop geometry, sizing, and styling.
        </p>
      </div>

      {/* Enable/Disable Photo Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
        <div>
          <span className="text-xs font-bold text-slate-900 block">Display Profile Photo</span>
          <span className="text-[11px] text-slate-500">
            Show avatar in the resume header or sidebar
          </span>
        </div>
        <button
          type="button"
          onClick={() => updateDesign({ showPhoto: !design.showPhoto })}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
            design.showPhoto ? 'bg-[#7c3aed]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
              design.showPhoto ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {design.showPhoto && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Photo Shape */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Crop Shape
            </label>
            <div className="grid grid-cols-3 gap-2">
              {shapes.map((s) => {
                const isSelected = (design.photoShape || 'circle') === s.id;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateDesign({ photoShape: s.id as any })}
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

          {/* Photo Size Slider */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex justify-between text-xs font-semibold text-slate-800">
              <span>Photo Diameter / Size</span>
              <span className="font-mono text-[#7c3aed]">{design.photoSize || 80}px</span>
            </div>
            <input
              type="range"
              min={48}
              max={130}
              step={4}
              value={design.photoSize || 80}
              onChange={(e) => updateDesign({ photoSize: Number(e.target.value) })}
              className="w-full accent-[#7c3aed]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Small (48px)</span>
              <span>Medium (80px)</span>
              <span>Large (130px)</span>
            </div>
          </div>

          {/* Photo Border */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Border Treatment
            </label>
            <div className="grid grid-cols-2 gap-2">
              {borders.map((b) => {
                const isSelected = (design.photoBorder || 'none') === b.id;

                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => updateDesign({ photoBorder: b.id as any })}
                    className={`p-2.5 text-xs rounded-lg border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed] font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{b.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#7c3aed]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Position */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Placement Position
            </label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map((pos) => {
                const isSelected = (design.photoPosition || 'right') === pos.id;

                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => updateDesign({ photoPosition: pos.id as any })}
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

          {/* Grayscale filter toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Black & White Filter
              </span>
              <span className="text-[11px] text-slate-500">
                Render photo in professional monochrome
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateDesign({ photoGrayscale: !design.photoGrayscale })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                design.photoGrayscale ? 'bg-[#7c3aed]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                  design.photoGrayscale ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Reset */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={() =>
            updateDesign({
              showPhoto: false,
              photoShape: 'circle',
              photoSize: 80,
              photoBorder: 'none',
              photoPosition: 'right',
              photoGrayscale: false,
            })
          }
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Photo defaults
        </button>
      </div>
    </div>
  );
};
