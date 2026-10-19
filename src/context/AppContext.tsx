import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  CareerRole,
  SkillItem,
  RoadmapModule,
  ProjectTemplate,
  UserProjectSubmission,
  CredentialBadge,
  OpportunityItem,
  AppNotification,
  InterviewSession,
  EvidenceLevel
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  CAREER_ROLES,
  INITIAL_USER_SKILLS,
  INITIAL_ROADMAP,
  PROJECT_TEMPLATES,
  INITIAL_SUBMISSION,
  INITIAL_CREDENTIALS,
  INITIAL_OPPORTUNITIES
} from '../data/mockData';
import { calculateRoleReadiness, UserProject } from '../utils/scoring';

interface AppContextType {
  profile: UserProfile;
  roles: CareerRole[];
  currentRole: CareerRole;
  skills: SkillItem[];
  roadmap: RoadmapModule[];
  projectTemplates: ProjectTemplate[];
  submissions: UserProjectSubmission[];
  credentials: CredentialBadge[];
  opportunities: OpportunityItem[];
  notifications: AppNotification[];
  interviewSessions: InterviewSession[];
  readinessMetrics: ReturnType<typeof calculateRoleReadiness>;
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setTargetRole: (roleId: string) => void;
  completeRoadmapTask: (taskId: string) => void;
  submitProjectForEvaluation: (data: {
    projectId: string;
    repositoryUrl: string;
    demoUrl: string;
    description: string;
    architecturalDecisions: string;
    tradeoffsAndChallenges: string;
  }) => Promise<UserProjectSubmission>;
  updateSkillLevel: (skillId: string, level: EvidenceLevel, score: number) => void;
  updateOpportunityStatus: (oppId: string, status: OpportunityItem['applicationStatus']) => void;
  saveInterviewSession: (session: InterviewSession) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDefaultData: () => void;
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'skillproof_v2_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error loading ${key} from localStorage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState<string>('/');
  const [profile, setProfile] = useState<UserProfile>(() => 
    loadFromStorage('profile', INITIAL_STUDENT_PROFILE)
  );
  const [roles] = useState<CareerRole[]>(CAREER_ROLES);
  const [skills, setSkills] = useState<SkillItem[]>(() => 
    loadFromStorage('skills', INITIAL_USER_SKILLS)
  );
  const [roadmap, setRoadmap] = useState<RoadmapModule[]>(() => 
    loadFromStorage('roadmap', INITIAL_ROADMAP)
  );
  const [submissions, setSubmissions] = useState<UserProjectSubmission[]>(() => 
    loadFromStorage('submissions', [INITIAL_SUBMISSION])
  );
  const [credentials, setCredentials] = useState<CredentialBadge[]>(() => 
    loadFromStorage('credentials', INITIAL_CREDENTIALS)
  );
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(() => 
    loadFromStorage('opportunities', INITIAL_OPPORTUNITIES)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() => 
    loadFromStorage('notifications', [
      {
        id: 'notif-1',
        title: 'Project Verified & Credential Issued',
        message: 'Your submission for Realtime Collaborative Task Engine scored 92/100. Credential SKP-2026-FSTK-4921 has been published.',
        timestamp: '2 hours ago',
        read: false,
        type: 'evaluation',
        linkRoute: '/submissions',
      },
      {
        id: 'notif-2',
        title: '14-Day Consistency Streak!',
        message: 'You have actively verified practical learning for 14 consecutive days. Keep building momentum!',
        timestamp: '1 day ago',
        read: false,
        type: 'streak',
        linkRoute: '/dashboard',
      },
    ])
  );
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>(() => 
    loadFromStorage('interviews', [])
  );

  // Sync to storage
  useEffect(() => saveToStorage('profile', profile), [profile]);
  useEffect(() => saveToStorage('skills', skills), [skills]);
  useEffect(() => saveToStorage('roadmap', roadmap), [roadmap]);
  useEffect(() => saveToStorage('submissions', submissions), [submissions]);
  useEffect(() => saveToStorage('credentials', credentials), [credentials]);
  useEffect(() => saveToStorage('opportunities', opportunities), [opportunities]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('interviews', interviewSessions), [interviewSessions]);

  // Handle URL sync if user uses browser back/forward or direct path
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      if (path && path !== '') {
        setActiveRoute(path);
      }
    };
    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  const changeRoute = (route: string) => {
    setActiveRoute(route);
    window.history.pushState(null, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#18181b', '#6366f1', '#06b6d4', '#10b981'],
      });
    } catch (e) {
      // Fallback silently if canvas-confetti is not rendered
    }
  };

  const currentRole = useMemo(() => {
    return roles.find(r => r.id === profile.targetRoleId) || roles[0];
  }, [roles, profile.targetRoleId]);

  // Derived user projects for readiness scoring
const userProjectsForScoring: UserProject[] = useMemo(() => {
  return submissions.map(sub => {
    const template = PROJECT_TEMPLATES.find(
      project => project.id === sub.projectId
    );

    return {
      id: sub.id,
      title: sub.projectTitle,
      roleId: profile.targetRoleId,
      status: sub.status,
      score: sub.overallScore,
      evaluatedAt: sub.evaluatedAt,

      // Only use skills explicitly associated with the project template.
      demonstratedSkills: template?.requiredSkills ?? [],
    };
  });
}, [submissions, profile.targetRoleId]);

  const readinessMetrics = useMemo(() => {
    return calculateRoleReadiness({
      skills,
      projects: userProjectsForScoring,
      requiredSkillNames: currentRole.requiredSkills,
      interviewScore: interviewSessions.length > 0
        ? interviewSessions.reduce(
            (acc, session) => acc + session.overallScore,
            0
          ) / interviewSessions.length
      : undefined,
    });
  }, [skills, userProjectsForScoring, currentRole.requiredSkills, interviewSessions]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const setTargetRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setProfile(prev => ({
        ...prev,
        targetRoleId: role.id,
        targetRoleTitle: role.title,
      }));
    }
  };

  const completeRoadmapTask = (taskId: string) => {
    let completedSkillNames: string[] = [];
    setRoadmap(prevModules => {
      return prevModules.map(module => ({
        ...module,
        tasks: module.tasks.map(task => {
          if (task.id === taskId) {
            completedSkillNames = task.skillsCovered;
            return { ...task, status: 'completed' as const };
          }
          return task;
        }),
      }));
    });

    // Elevate any Claimed skills that were covered to "Tested"
    if (completedSkillNames.length > 0) {
      setSkills(prevSkills => 
        prevSkills.map(sk => {
          if (completedSkillNames.includes(sk.name) && sk.evidenceLevel === 'Claimed') {
            return {
              ...sk,
              evidenceLevel: 'Tested' as const,
              score: Math.max(sk.score, 75),
              lastAssessed: new Date().toISOString().split('T')[0],
              verificationSource: `Completed Roadmap Exercise: ${taskId}`,
            };
          }
          return sk;
        })
      );
    }

    triggerCelebration();

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Roadmap Milestone Completed!',
        message: 'Your practical exercise was verified. Your readiness score and skill profile have been updated.',
        timestamp: 'Just now',
        read: false,
        type: 'roadmap',
        linkRoute: '/roadmap',
      },
      ...prev,
    ]);
  };

  const submitProjectForEvaluation = async (data: {
    projectId: string;
    repositoryUrl: string;
    demoUrl: string;
    description: string;
    architecturalDecisions: string;
    tradeoffsAndChallenges: string;
  }): Promise<UserProjectSubmission> => {
    const template = PROJECT_TEMPLATES.find(p => p.id === data.projectId);
    const title = template ? template.title : 'Custom Real-World Project';

    // Simulate multi-layer evaluation pipeline
    const rubricScores = (template ? template.rubricCategories : [
      { name: 'System Architecture', weight: 25, description: 'Clean architecture' },
      { name: 'Implementation Quality', weight: 25, description: 'Code quality' },
      { name: 'Error Handling & Resilience', weight: 25, description: 'Edge cases' },
      { name: 'Documentation & Clarity', weight: 25, description: 'Case study' },
    ]).map(cat => ({
      category: cat.name,
      score: Math.floor(88 + Math.random() * 10), // 88-97
      feedback: `Demonstrates thorough grasp of ${cat.name.toLowerCase()} with modular boundaries and explicit error handling.`,
    }));

    const overallScore = Math.round(
      rubricScores.reduce((acc, curr) => acc + curr.score, 0) / rubricScores.length
    );

    const submissionId = `sub-${Date.now()}`;
    const newSubmission: UserProjectSubmission = {
      id: submissionId,
      projectId: data.projectId,
      projectTitle: title,
      userId: profile.id,
      status: 'Verified',
      repositoryUrl: data.repositoryUrl,
      demoUrl: data.demoUrl,
      description: data.description,
      architecturalDecisions: data.architecturalDecisions,
      tradeoffsAndChallenges: data.tradeoffsAndChallenges,
      submittedAt: new Date().toISOString(),
      evaluatedAt: new Date().toISOString(),
      overallScore,
      evaluation: {
        overallScore,
        passed: overallScore >= 75,
        layer1AutomatedChecks: {
          repoAccessible: true,
          hasReadme: true,
          hasLicense: true,
          demoAccessible: !!data.demoUrl,
          codeStructureValid: true,
        },
        rubricScores,
        strengths: [
          'Clear separation between data access and service orchestrators',
          'Well-documented trade-off rationale in architectural decisions',
          'Production-ready error codes with defensive validation',
        ],
        weaknesses: [
          'Could add load testing metrics under simulated peak concurrency',
        ],
        recommendedFixes: [
          'Consider adding automated GitHub Actions CI step for linting and type checks',
        ],
        reviewerType: 'Automated + AI Rubric',
        evidenceLevelGranted: 'Project-Verified',
      },
    };

    setSubmissions(prev => [newSubmission, ...prev.filter(s => s.projectId !== data.projectId)]);

    // Issue verified credential badge
    const credId = `SKP-2026-PROJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCredential: CredentialBadge = {
      id: `cred-${Date.now()}`,
      credentialId: credId,
      title: `Verified Project: ${title}`,
      category: 'Verified Project',
      issuer: 'SkillProof Autonomous Verification Network',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      evidenceLevel: 'Project-Verified',
      relatedProjectOrSkill: title,
      verificationUrl: `/verify-credential/${credId}`,
      skillsVerified: template ? template.requiredSkills : ['TypeScript', 'Full-Stack'],
      score: overallScore,
    };

    setCredentials(prev => [newCredential, ...prev]);

    // Elevate skills to Project-Verified
    if (template) {
      setSkills(prev => 
        prev.map(sk => {
          if (template.requiredSkills.includes(sk.name)) {
            return {
              ...sk,
              evidenceLevel: 'Project-Verified',
              score: Math.max(sk.score, overallScore),
              lastAssessed: new Date().toISOString().split('T')[0],
              verificationSource: `Project: ${title}`,
            };
          }
          return sk;
        })
      );
    }

    triggerCelebration();

    // Push notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Project Submission Verified!',
        message: `"${title}" has passed multi-layer evaluation (${overallScore}/100). Credential ${credId} is now live.`,
        timestamp: 'Just now',
        read: false,
        type: 'evaluation',
        linkRoute: '/submissions',
      },
      ...prev,
    ]);

    return newSubmission;
  };

  const updateSkillLevel = (skillId: string, level: EvidenceLevel, score: number) => {
    setSkills(prev => prev.map(s => s.id === skillId ? { ...s, evidenceLevel: level, score } : s));
  };

  const updateOpportunityStatus = (oppId: string, status: OpportunityItem['applicationStatus']) => {
    setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, applicationStatus: status } : o));
  };

  const saveInterviewSession = (session: InterviewSession) => {
    setInterviewSessions(prev => [session, ...prev]);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Mock Interview Completed',
        message: `Your ${session.type} interview for ${session.roleTitle} scored ${session.overallScore}/100.`,
        timestamp: 'Just now',
        read: false,
        type: 'evaluation',
        linkRoute: '/interviews',
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToDefaultData = () => {
    setProfile(INITIAL_STUDENT_PROFILE);
    setSkills(INITIAL_USER_SKILLS);
    setRoadmap(INITIAL_ROADMAP);
    setSubmissions([INITIAL_SUBMISSION]);
    setCredentials(INITIAL_CREDENTIALS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        roles,
        currentRole,
        skills,
        roadmap,
        projectTemplates: PROJECT_TEMPLATES,
        submissions,
        credentials,
        opportunities,
        notifications,
        interviewSessions,
        readinessMetrics,
        activeRoute,
        setActiveRoute: changeRoute,
        updateProfile,
        setTargetRole,
        completeRoadmapTask,
        submitProjectForEvaluation,
        updateSkillLevel,
        updateOpportunityStatus,
        saveInterviewSession,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaultData,
        triggerCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
