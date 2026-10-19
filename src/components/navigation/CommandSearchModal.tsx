import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ArrowRight, ShieldCheck, MapPin, FolderGit2, Briefcase } from 'lucide-react';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({ isOpen, onClose }) => {
  const { roles, projectTemplates, roadmap, setActiveRoute } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredRoles = roles.filter(r => 
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.requiredSkills.some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredProjects = projectTemplates.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const allTasks = roadmap.flatMap(m => m.tasks);
  const filteredTasks = allTasks.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (route: string) => {
    setActiveRoute(route);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/25 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden text-left"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100">
          <Search className="w-4 h-4 text-zinc-600 shrink-0" />
          <input
            type="text"
            placeholder="Search roles, projects, roadmap tasks, or skills..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm text-zinc-900 bg-transparent placeholder-zinc-600 outline-none"
          />
          <kbd className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Shortcuts */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {[
                { label: 'Student Dashboard', route: '/dashboard' },
                { label: 'Skill Gap Intelligence', route: '/skill-gap' },
                { label: 'Interactive Roadmap', route: '/roadmap' },
                { label: 'Project Studio', route: '/projects' },
                { label: 'Verifiable Portfolio', route: '/portfolio' },
                { label: 'AI Mock Interview', route: '/interviews' },
              ].map(q => (
                <button
                  key={q.route}
                  onClick={() => handleSelect(q.route)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 text-left transition-colors cursor-pointer"
                >
                  <span>{q.label}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Career Roles */}
          {filteredRoles.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                Career Roles ({filteredRoles.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredRoles.slice(0, 4).map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleSelect('/career-explorer')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-zinc-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-medium text-zinc-900">{role.title}</span>
                      <span className="text-[10px] text-zinc-600">({role.category})</span>
                    </div>
                    <span className="text-[11px] text-zinc-600">{role.requiredSkills.slice(0, 3).join(', ')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                Projects ({filteredProjects.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredProjects.slice(0, 3).map(proj => (
                  <button
                    key={proj.id}
                    onClick={() => handleSelect('/projects')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-zinc-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-medium text-zinc-900">{proj.title}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">{proj.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                Roadmap Tasks
              </div>
              <div className="space-y-1 mt-1">
                {filteredTasks.slice(0, 3).map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleSelect('/roadmap')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-zinc-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="font-medium text-zinc-900 truncate max-w-sm">{task.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600">{task.estimatedHours}h</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
