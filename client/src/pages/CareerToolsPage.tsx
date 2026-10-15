import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout.js';
import { api } from '../services/api.js';
import {
  Wrench,
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Plus,
  Trash2,
  Copy,
  Search,
} from 'lucide-react';

export const CareerToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'star' | 'verbs' | 'questions' | 'skillsGap'>('star');
  const [savedItems, setSavedItems] = useState<any[]>([]);

  // STAR Worksheet state
  const [starTitle, setStarTitle] = useState('');
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');

  // Interview Questions state
  const [roleInput, setRoleInput] = useState('Senior Full Stack Engineer');
  const [levelInput, setLevelInput] = useState('Senior');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Power verbs dictionary
  const [verbCategories, setVerbCategories] = useState<any>(null);

  useEffect(() => {
    loadSavedContent();
    api.getActionVerbs().then((res) => setVerbCategories(res.dictionary));
  }, []);

  const loadSavedContent = async () => {
    try {
      const res = await api.getSavedContent();
      setSavedItems(res.items || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveStarStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!starTitle || !situation) return;
    try {
      await api.saveContent({
        type: 'star_story',
        title: starTitle,
        content: { situation, task, action, result },
      });
      setStarTitle('');
      setSituation('');
      setTask('');
      setAction('');
      setResult('');
      loadSavedContent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSaved = async (id: string) => {
    try {
      await api.deleteSavedContent(id);
      loadSavedContent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await api.getInterviewQuestions(roleInput, levelInput);
      setGeneratedQuestions(res.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Career Tools Suite</h1>
          <p className="text-xs text-slate-500">
            Worksheets, power verbs, and interview preparation to accelerate your hiring success.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b space-x-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('star')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'star'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            STAR Method Worksheet
          </button>
          <button
            onClick={() => setActiveTab('verbs')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'verbs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Power Verbs Dictionary
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'questions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Interview Question Generator
          </button>
        </div>

        {/* Tab 1: STAR Worksheet */}
        {activeTab === 'star' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Draft a STAR Story (Situation, Task, Action, Result)
              </h2>
              <p className="text-xs text-slate-500">
                The proven behavioral framework used by Amazon, Google, Meta, and Fortune 500 companies.
              </p>

              <form onSubmit={handleSaveStarStory} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Story Title / Theme</label>
                  <input
                    type="text"
                    required
                    value={starTitle}
                    onChange={(e) => setStarTitle(e.target.value)}
                    placeholder="e.g. Resolving Production Latency Surge Under 4x Peak Load"
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Situation (Context & background)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Set the scene: what was happening, what was the scale, what was at stake?"
                    className="w-full p-2.5 text-xs border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Task (Your specific responsibility)
                  </label>
                  <textarea
                    rows={2}
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="What did you specifically need to accomplish or solve?"
                    className="w-full p-2.5 text-xs border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Action (Steps taken, technologies chosen, leadership displayed)
                  </label>
                  <textarea
                    rows={3}
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    placeholder="Walk through the concrete architectural steps, cross-functional collaboration, or code you wrote..."
                    className="w-full p-2.5 text-xs border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Result (Quantifiable outcomes, numbers, metrics, long-term impact)
                  </label>
                  <textarea
                    rows={2}
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="Reduced latency by 45%, eliminated downtime, saved $25k in cloud costs..."
                    className="w-full p-2.5 text-xs border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Save to Story Library
                </button>
              </form>
            </div>

            {/* Saved Library */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Your Saved Story Library</h3>
              {savedItems.length === 0 ? (
                <div className="p-6 bg-slate-50 border border-dashed rounded-xl text-center text-xs text-slate-400">
                  No stories saved yet. Fill out the form to build your interview cheat sheet.
                </div>
              ) : (
                <div className="space-y-3">
                  {savedItems.map((item) => (
                    <div key={item._id} className="p-4 bg-white border rounded-xl shadow-sm space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        <button
                          onClick={() => handleDeleteSaved(item._id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">
                        {item.content?.action}
                      </p>
                      {item.content?.result && (
                        <div className="text-emerald-700 font-semibold text-[11px]">
                          Result: {item.content.result}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Power Verbs Dictionary */}
        {activeTab === 'verbs' && (
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Action Verbs for High-Impact Resumes</h2>
              <p className="text-xs text-slate-500">
                Replace passive terms ("helped with", "responsible for") with active verbs that convey leadership and ownership.
              </p>
            </div>

            {verbCategories && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(verbCategories).map(([category, words]: any) => (
                  <div key={category} className="p-4 bg-slate-50 border rounded-xl space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {words.map((w: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-white border text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium shadow-2xl"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Interview Question Generator */}
        {activeTab === 'questions' && (
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Targeted Interview Question Generator</h2>
              <p className="text-xs text-slate-500">
                Practice answering role-specific questions tailored to your experience tier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="Target Job Title"
                className="col-span-2 px-3 py-2 text-xs border rounded-xl"
              />
              <button
                type="button"
                onClick={handleGenerateQuestions}
                disabled={loadingQuestions}
                className="py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
              >
                {loadingQuestions ? 'Generating...' : 'Generate Questions'}
              </button>
            </div>

            {generatedQuestions.length > 0 && (
              <div className="space-y-4 pt-4 border-t">
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border rounded-xl space-y-2 text-xs">
                    <span className="font-bold text-[10px] uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {q.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{q.question}</h4>
                    <p className="text-slate-600 leading-relaxed italic bg-white p-2.5 rounded border border-slate-200">
                      💡 Pro Tip: {q.tips}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
