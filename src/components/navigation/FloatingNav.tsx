import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  LayoutDashboard,
  MapPin,
  Layers,
  FolderGit2,
  FileCheck,
  UserCheck,
  Award,
  Mic,
  Briefcase,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  Shield,
  Sparkles,
  RotateCcw,
  ExternalLink,
  GraduationCap,
  Building2,
  UserCheck2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingNavProps {
  onOpenSearch: () => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ onOpenSearch }) => {
  const {
    activeRoute,
    setActiveRoute,
    profile,
    currentRole,
    readinessMetrics,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetToDefaultData,
  } = useApp();

  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const moreRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const mainNavItems = [
    { label: 'Overview', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Roles', route: '/career-explorer', icon: Compass },
    { label: 'Skill Gap', route: '/skill-gap', icon: Layers },
    { label: 'Roadmap', route: '/roadmap', icon: MapPin },
    { label: 'Projects', route: '/projects', icon: FolderGit2 },
    { label: 'Portfolio', route: '/portfolio', icon: UserCheck },
  ];

  const handleNavClick = (route: string) => {
    setActiveRoute(route);
    setMoreMenuOpen(false);
    setMobileMenuOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  };

  return (
    <>
      {/* Floating Centered Menu Container */}
      <header className="fixed top-3 inset-x-0 z-40 flex justify-center px-3 pointer-events-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-xl border border-zinc-200/90 shadow-lg shadow-zinc-900/5 rounded-full"
        >
          {/* Brand mark */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-full hover:bg-zinc-100/70 transition-colors group cursor-pointer"
            title="SkillProof Home"
          >
            <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-3.5 h-3.5 text-cyan-300 stroke-[2.5]" />
            </div>
            <span className="font-semibold text-xs tracking-tight text-zinc-900 hidden sm:inline">
              SkillProof
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 hidden md:inline">
              Verified
            </span>
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-zinc-200 hidden md:block mx-0.5" />

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-0.5">
            {mainNavItems.map(item => {
              const isActive = activeRoute === item.route;
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'text-zinc-950 font-semibold' 
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-zinc-100 rounded-full -z-10 border border-zinc-200/60"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-zinc-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* "More" Popover */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  moreMenuOpen 
                    ? 'bg-zinc-100 text-zinc-900' 
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                }`}
                aria-expanded={moreMenuOpen}
              >
                <span>More</span>
                <ChevronDown className={`w-3 h-3 text-zinc-600 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-64 p-2 bg-white rounded-2xl border border-zinc-200/90 shadow-xl shadow-zinc-900/10 z-50 text-left"
                  >
                    <div className="px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                      Evaluation & Preparation
                    </div>
                    <div className="space-y-0.5">
                      <button
                        onClick={() => handleNavClick('/submissions')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
                      >
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-medium">Submissions & Rubrics</div>
                          <div className="text-[10px] text-zinc-600">Multi-layer project evaluation</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('/credentials')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
                      >
                        <Award className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="font-medium">Verifiable Credentials</div>
                          <div className="text-[10px] text-zinc-600">Cryptographic public certificates</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('/interviews')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
                      >
                        <Mic className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="font-medium">AI Mock Interview</div>
                          <div className="text-[10px] text-zinc-600">Project defense & technical drill</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('/opportunities')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-cyan-600" />
                        <div>
                          <div className="font-medium">Opportunity Marketplace</div>
                          <div className="text-[10px] text-zinc-600">Matched internships with skill proof</div>
                        </div>
                      </button>
                    </div>

                    <div className="my-1.5 h-px bg-zinc-100" />

                    <div className="px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                      Ecosystem Views
                    </div>
                    <div className="space-y-0.5">
                      <button
                        onClick={() => handleNavClick('/college/dashboard')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-left"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                        <span>College Placement Cell</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('/recruiter/dashboard')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-left"
                      >
                        <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Recruiter Candidate View</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('/mentor/dashboard')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-left"
                      >
                        <UserCheck2 className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Mentor Review Queue</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-1 pl-1">
            {/* Quick search button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/70 transition-colors cursor-pointer"
              title="Search roles, skills, and projects (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="hidden lg:inline-block text-[10px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-1.5 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 p-3 bg-white rounded-2xl border border-zinc-200/90 shadow-xl shadow-zinc-900/10 z-50 text-left"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-zinc-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-zinc-500 hover:text-zinc-800 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.linkRoute) handleNavClick(n.linkRoute);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                            n.read ? 'bg-zinc-50/50 hover:bg-zinc-50' : 'bg-indigo-50/40 hover:bg-indigo-50/70'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-medium text-xs text-zinc-900">{n.title}</span>
                            <span className="text-[10px] text-zinc-600 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-zinc-600 mt-0.5 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar Pill with Role Readiness */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full hover:bg-zinc-100/70 transition-colors cursor-pointer border border-transparent hover:border-zinc-200"
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-200"
                />
                <span className="text-xs font-semibold text-zinc-800 hidden sm:inline">
                  {readinessMetrics.overallScore}%
                </span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 p-3 bg-white rounded-2xl border border-zinc-200/90 shadow-xl shadow-zinc-900/10 z-50 text-left"
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                      <div>
                        <div className="font-semibold text-xs text-zinc-900">{profile.name}</div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[170px]">{currentRole.title}</div>
                        <div className="text-[10px] text-indigo-600 font-medium">{profile.institution}</div>
                      </div>
                    </div>

                    <div className="py-2.5 border-b border-zinc-100 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Readiness Score</span>
                        <span className="font-semibold text-zinc-900">{readinessMetrics.overallScore}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Verified Skills</span>
                        <span className="font-semibold text-emerald-600">{readinessMetrics.verifiedCount} verified</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Active Streak</span>
                        <span className="font-semibold text-amber-600">{profile.learningStreak} days 🔥</span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-0.5">
                      <button
                        onClick={() => handleNavClick('/portfolio')}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-zinc-700 hover:bg-zinc-50 text-left"
                      >
                        <span>Edit Verifiable Portfolio</span>
                        <ExternalLink className="w-3 h-3 text-zinc-600" />
                      </button>
                      <button
                        onClick={() => handleNavClick('/onboarding')}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-zinc-700 hover:bg-zinc-50 text-left"
                      >
                        <span>Rerun Onboarding Wizard</span>
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Reset demo state to initial seed data?')) {
                            resetToDefaultData();
                            setProfileOpen(false);
                          }
                        }}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <span>Reset Seed Data</span>
                        <RotateCcw className="w-3 h-3 text-rose-500" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-zinc-600 hover:text-zinc-900 md:hidden hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Drawer / Drawer overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="mt-16 mx-4 p-4 bg-white rounded-3xl border border-zinc-200 shadow-2xl space-y-3"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="font-semibold text-xs text-zinc-800">Navigation</span>
                <span className="text-[11px] text-zinc-500">{currentRole.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ...mainNavItems,
                  { label: 'Submissions', route: '/submissions', icon: FileCheck },
                  { label: 'Credentials', route: '/credentials', icon: Award },
                  { label: 'Mock Interview', route: '/interviews', icon: Mic },
                  { label: 'Opportunities', route: '/opportunities', icon: Briefcase },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.route;
                  return (
                    <button
                      key={item.route}
                      onClick={() => handleNavClick(item.route)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                        isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-zinc-100 flex justify-between items-center text-xs">
                <button
                  onClick={() => handleNavClick('/')}
                  className="text-zinc-500 hover:text-zinc-900"
                >
                  Landing Page
                </button>
                <button
                  onClick={() => handleNavClick('/onboarding')}
                  className="text-indigo-600 font-medium"
                >
                  Onboarding Wizard →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
