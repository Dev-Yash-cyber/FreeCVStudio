import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout.js';
import { api } from '../services/api.js';
import { ApplicationStatus } from '../types/index.js';
import {
  Kanban,
  Table,
  Plus,
  Search,
  Download,
  Calendar,
  DollarSign,
  MapPin,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const STATUS_COLUMNS: ApplicationStatus[] = [
  'Wishlist',
  'Preparing',
  'Applied',
  'Screening',
  'Interview',
  'Assessment',
  'Offer',
  'Rejected',
];

export const JobApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<any | null>(null);

  // Form State
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadApplications();
  }, [search]);

  const loadApplications = async () => {
    try {
      const res = await api.getApplications({ search });
      setApplications(res.applications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingApp(null);
    setCompany('');
    setPosition('');
    setStatus('Applied');
    setLocation('');
    setSalaryRange('');
    setJobUrl('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: any) => {
    setEditingApp(app);
    setCompany(app.company);
    setPosition(app.position);
    setStatus(app.status);
    setLocation(app.location || '');
    setSalaryRange(app.salaryRange || '');
    setJobUrl(app.jobUrl || '');
    setNotes(app.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingApp) {
        await api.updateApplication(editingApp._id, {
          company,
          position,
          status,
          location,
          salaryRange,
          jobUrl,
          notes,
        });
      } else {
        await api.createApplication({
          company,
          position,
          status,
          location,
          salaryRange,
          jobUrl,
          notes,
        });
      }
      setIsModalOpen(false);
      loadApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      await api.updateApplication(appId, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this job application?')) return;
    try {
      await api.deleteApplication(appId);
      loadApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCsv = () => {
    const token = localStorage.getItem('freecv_auth_token');
    window.open(`/api/applications/export/csv?token=${token}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Job Application Tracker</h1>
            <p className="text-xs text-slate-500">
              Manage your complete job hunting pipeline from wishlist to offers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Application</span>
            </button>
          </div>
        </div>

        {/* Filter and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, roles..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setView('kanban')}
              className={`p-1.5 rounded-lg text-slate-600 ${view === 'kanban' ? 'bg-slate-100 font-bold' : ''}`}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-1.5 rounded-lg text-slate-600 ${view === 'table' ? 'bg-slate-100 font-bold' : ''}`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Kanban Board View */}
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading tracker...</div>
        ) : view === 'kanban' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 overflow-x-auto pb-4">
            {STATUS_COLUMNS.map((colStatus) => {
              const colApps = applications.filter((a) => a.status === colStatus);
              return (
                <div key={colStatus} className="bg-slate-100/70 rounded-xl p-2.5 flex flex-col min-w-[200px] border border-slate-200/80">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="font-bold text-xs text-slate-700">{colStatus}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full font-bold">
                      {colApps.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {colApps.map((app) => (
                      <div
                        key={app._id}
                        onClick={() => handleOpenEdit(app)}
                        className="bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-400 shadow-sm cursor-pointer space-y-2 transition"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">{app.company}</h4>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(app._id, e)}
                            className="text-slate-300 hover:text-red-500 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-tight">{app.position}</p>

                        {app.salaryRange && (
                          <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{app.salaryRange}</span>
                          </div>
                        )}

                        {/* Status advance selector */}
                        <div className="pt-1 border-t flex justify-between items-center">
                          <select
                            value={app.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleUpdateStatus(app._id, e.target.value as ApplicationStatus)}
                            className="text-[10px] font-medium bg-slate-50 border rounded px-1 py-0.5"
                          >
                            {STATUS_COLUMNS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left">Position</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Salary</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleOpenEdit(app)}>
                    <td className="px-4 py-3 font-bold text-slate-900">{app.company}</td>
                    <td className="px-4 py-3 text-slate-700">{app.position}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{app.location || '—'}</td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">{app.salaryRange || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => handleDelete(app._id, e)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2">
                {editingApp ? 'Edit Job Application' : 'Add New Job Application'}
              </h3>

              <form onSubmit={handleSave} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Stripe"
                      className="w-full px-3 py-1.5 text-xs border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Position *</label>
                    <input
                      type="text"
                      required
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full px-3 py-1.5 text-xs border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                      className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                    >
                      {STATUS_COLUMNS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      placeholder="e.g. $160,000 - $185,000"
                      className="w-full px-3 py-1.5 text-xs border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA / Remote"
                    className="w-full px-3 py-1.5 text-xs border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Posting URL</label>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Interview Details</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Interview dates, recruiter contacts, technical topics..."
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-1.5 text-xs font-semibold border rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Save Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
