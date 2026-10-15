import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import { api } from '../../../services/api.js';
import { Layout, Check, Sparkles, Search } from 'lucide-react';

export const CustomizeTemplates: React.FC = () => {
  const { resume, updateDesign } = useResumeStore();
  const currentTemplateId = resume?.design?.templateId || 'ats-professional';
  const [templates, setTemplates] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await api.getTemplates();
      setTemplates(res.templates || []);
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['All', 'ATS Friendly', 'Modern', 'Executive', 'Technical', 'Creative', 'Academic', 'Compact'];

  const filtered = templates.filter((t) => {
    const matchCat = category === 'All' || t.category === category;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layout className="w-5 h-5 text-[#7c3aed]" />
          Choose Resume Template
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Switch between 15 distinct layouts. Your resume content is preserved across all templates.
        </p>
      </div>

      {/* Search & Category filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7c3aed]"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition ${
                category === cat
                  ? 'bg-[#7c3aed] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
        {filtered.map((t) => {
          const isSelected = currentTemplateId === t.id;

          return (
            <div
              key={t.id}
              onClick={() => updateDesign({ templateId: t.id })}
              className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between text-left group relative ${
                isSelected
                  ? 'border-[#7c3aed] bg-[#7c3aed]/5 ring-2 ring-[#7c3aed]/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t.category}
                  </span>
                  {isSelected && (
                    <span className="bg-[#7c3aed] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#7c3aed] transition">
                  {t.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {t.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="capitalize">{t.layout}</span>
                <span className="text-[#7c3aed] font-medium group-hover:underline">
                  {isSelected ? 'Applied' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
