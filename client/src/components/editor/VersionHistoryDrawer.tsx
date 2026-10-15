import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { api } from '../../services/api.js';
import { History, X, RotateCcw, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistoryDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { resume, setResume } = useResumeStore();
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && resume) {
      loadVersions();
    }
  }, [isOpen, resume?._id]);

  const loadVersions = async () => {
    if (!resume) return;
    setLoading(true);
    try {
      const res = await api.getResumeVersions(resume._id);
      setVersions(res.versions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    if (!resume) return;
    setRestoringId(versionId);
    try {
      const res = await api.restoreResumeVersion(resume._id, versionId);
      setResume(res.resume);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setRestoringId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 md:w-96 bg-white shadow-2xl border-l flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-blue-600" />
          Version History & Snapshots
        </h3>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading versions...</div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No snapshots recorded yet. Click "Save Snapshot" in the top bar to record milestones.
          </div>
        ) : (
          versions.map((ver) => (
            <div
              key={ver._id}
              className="p-3 border rounded-xl hover:border-blue-400 bg-slate-50/50 space-y-2 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    Version #{ver.versionNumber}: {ver.label}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(ver.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRestore(ver._id)}
                disabled={restoringId === ver._id}
                className="w-full mt-1 inline-flex justify-center items-center gap-1 text-xs font-semibold py-1.5 px-3 bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 rounded-lg transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {restoringId === ver._id ? 'Restoring...' : 'Restore This Snapshot'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
