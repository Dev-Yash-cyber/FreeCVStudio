import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import { api } from '../services/api.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { Search, CheckCircle2, ArrowRight, Layers, Sparkles } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, demoLogin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await api.getTemplates();
      setTemplates(res.templates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    'ATS Friendly',
    'Modern',
    'Executive',
    'Technical',
    'Creative',
    'Academic',
    'Compact',
  ];

  const filtered = templates.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUseTemplate = async (templateId: string) => {
    if (!isAuthenticated) {
      await demoLogin();
    }
    // Create new resume with chosen template
    try {
      const res = await api.createResume({
        title: `Resume (${templates.find((t) => t.id === templateId)?.name || 'Custom'})`,
        templateId,
      });
      navigate(`/resumes/${res.resume._id}/edit`);
    } catch (e) {
      console.error(e);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> 15 Genuinely Distinct Layouts
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Original Resume Template Gallery
          </h1>
          <p className="mt-2 text-slate-600 text-sm max-w-xl mx-auto">
            Choose from professionally balanced single-column, two-column, sidebar, and executive designs. Every template is 100% free with no premium locks.
          </p>

          {/* Search bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates by style, career type..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap justify-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Template Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading template gallery...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-sm text-slate-500">No templates match your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400 transition flex flex-col group"
              >
                {/* Visual Thumbnail Card */}
                <div
                  className="h-44 p-4 flex flex-col justify-between border-b relative"
                  style={{ backgroundColor: t.colorScheme.background || '#f8fafc' }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/10 text-slate-700">
                      {t.category}
                    </span>
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: t.colorScheme.primary }}
                    />
                  </div>

                  {/* Stylized Document Skeleton Preview */}
                  <div className="space-y-1.5 opacity-80">
                    <div className="h-3 w-1/2 rounded" style={{ backgroundColor: t.colorScheme.primary }} />
                    <div className="h-1.5 w-1/3 bg-slate-300 rounded" />
                    <div className="h-1 w-full bg-slate-200 rounded mt-2" />
                    <div className="h-1 w-5/6 bg-slate-200 rounded" />
                    <div className="h-1 w-4/6 bg-slate-200 rounded" />
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">Layout: {t.layout}</span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {t.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {(t.features || []).map((feat: string, idx: number) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUseTemplate(t.id)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Use This Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
