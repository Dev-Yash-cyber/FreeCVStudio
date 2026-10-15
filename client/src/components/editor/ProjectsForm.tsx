import React from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { ProjectItem } from '../../types/index.js';
import { FolderGit2, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export const ProjectsForm: React.FC = () => {
  const { resume, updateProjects } = useResumeStore();
  const projects = resume?.data?.projects || [];

  const handleAdd = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      role: '',
      technologies: [],
      startDate: '',
      endDate: '',
      projectUrl: '',
      githubUrl: '',
      bulletPoints: [],
    };
    updateProjects([...projects, newItem]);
  };

  const handleUpdate = (index: number, updates: Partial<ProjectItem>) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], ...updates };
    updateProjects(updated);
  };

  const handleDelete = (index: number) => {
    updateProjects(projects.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === projects.length - 1)
    )
      return;
    const target = direction === 'up' ? index - 1 : index + 1;
    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    updateProjects(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blue-600" />
            Projects
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrate real-world engineering capability with projects, live demos, and GitHub repos.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-sm text-slate-500">No projects added yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            + Add a project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-xs font-bold text-slate-400">Project #{idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === projects.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="p-1 text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={proj.name || ''}
                    onChange={(e) => handleUpdate(idx, { name: e.target.value })}
                    placeholder="e.g. Real-Time Distributed Task Queue"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={proj.role || ''}
                    onChange={(e) => handleUpdate(idx, { role: e.target.value })}
                    placeholder="e.g. Lead Architect / Creator"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project / Demo URL</label>
                  <input
                    type="url"
                    value={proj.projectUrl || ''}
                    onChange={(e) => handleUpdate(idx, { projectUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={proj.githubUrl || ''}
                    onChange={(e) => handleUpdate(idx, { githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technologies Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={(proj.technologies || []).join(', ')}
                  onChange={(e) =>
                    handleUpdate(idx, {
                      technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="React, TypeScript, Node.js, Redis, Docker"
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Impact</label>
                <textarea
                  rows={2}
                  value={proj.description || ''}
                  onChange={(e) => handleUpdate(idx, { description: e.target.value })}
                  placeholder="Describe the problem, architectural approach, and outcome..."
                  className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
