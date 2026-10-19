import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AnimatedGridBg } from './components/ui/AnimatedGridBg';
import { FloatingNav } from './components/navigation/FloatingNav';
import { CommandSearchModal } from './components/navigation/CommandSearchModal';

// Views
import { LandingView } from './views/LandingView';
import { OnboardingView } from './views/OnboardingView';
import { DashboardView } from './views/DashboardView';
import { CareerExplorerView } from './views/CareerExplorerView';
import { SkillGapView } from './views/SkillGapView';
import { RoadmapView } from './views/RoadmapView';
import { ProjectsView } from './views/ProjectsView';
import { SubmissionsView } from './views/SubmissionsView';
import { PortfolioView } from './views/PortfolioView';
import { PublicPortfolioView } from './views/PublicPortfolioView';
import { CredentialsView } from './views/CredentialsView';
import { VerifyCredentialView } from './views/VerifyCredentialView';
import { MockInterviewView } from './views/MockInterviewView';
import { OpportunitiesView } from './views/OpportunitiesView';
import { EcosystemPortalView } from './views/EcosystemPortals';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { activeRoute } = useApp();
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Router resolution
  const renderActiveView = () => {
    if (activeRoute === '/') return <LandingView />;
    if (activeRoute === '/onboarding') return <OnboardingView />;
    if (activeRoute === '/dashboard') return <DashboardView />;
    if (activeRoute.startsWith('/career-explorer')) return <CareerExplorerView />;
    if (activeRoute.startsWith('/skill-gap') || activeRoute === '/resume-analyzer') return <SkillGapView />;
    if (activeRoute.startsWith('/roadmap')) return <RoadmapView />;
    if (activeRoute.startsWith('/projects')) return <ProjectsView />;
    if (activeRoute.startsWith('/submissions')) return <SubmissionsView />;
    if (activeRoute === '/portfolio') return <PortfolioView />;
    if (activeRoute.startsWith('/portfolio/')) return <PublicPortfolioView />;
    if (activeRoute === '/credentials') return <CredentialsView />;
    if (activeRoute.startsWith('/verify-credential')) return <VerifyCredentialView />;
    if (activeRoute.startsWith('/interviews')) return <MockInterviewView />;
    if (activeRoute.startsWith('/opportunities') || activeRoute === '/applications') return <OpportunitiesView />;
    if (activeRoute === '/college/dashboard') return <EcosystemPortalView portalType="college" />;
    if (activeRoute === '/recruiter/dashboard') return <EcosystemPortalView portalType="recruiter" />;
    if (activeRoute === '/mentor/dashboard') return <EcosystemPortalView portalType="mentor" />;

    // Fallback
    return <DashboardView />;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white relative">
      {/* ReactBits Style Ambient Motion Background */}
      <AnimatedGridBg />

      {/* Centered Floating Navigation Menu (No Sidebar!) */}
      <FloatingNav onOpenSearch={() => setSearchModalOpen(true)} />

      {/* Global Quick Command Search Modal */}
      <CommandSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Page View with subtle transition */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoute}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
