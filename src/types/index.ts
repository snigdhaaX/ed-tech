export type EvidenceLevel = 
  | 'Claimed' 
  | 'Tested' 
  | 'Project-Verified' 
  | 'Peer-Verified' 
  | 'Mentor-Verified';

export type UserRoleType = 'student' | 'college' | 'recruiter' | 'mentor';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  institution: string;
  degree: string;
  branch: string;
  academicYear: string;
  graduationYear: string;
  preferredLocation: string;
  targetRoleId: string;
  targetRoleTitle: string;
  bio: string;
  avatarUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioPublished: boolean;
  role: UserRoleType;
  learningStreak: number;
}

export interface CareerRole {
  id: string;
  title: string;
  category: string;
  overview: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  tools: string[];
  foundationalKnowledge: string[];
  recommendedProjects: string[];
  interviewTopics: string[];
  careerProgression: string;
  salaryContext: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'fundamentals' | 'database' | 'devops' | 'system_design';
  evidenceLevel: EvidenceLevel;
  score: number; // 0-100
  lastAssessed?: string;
  verificationSource?: string;
}

export interface SkillGapItem {
  name: string;
  category: string;
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
  currentLevel: EvidenceLevel;
  targetLevel: EvidenceLevel;
  reason: string;
  estimatedEffortHours: number;
  recommendedAction: string;
}

export interface RoadmapTask {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  skillsCovered: string[];
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  prerequisites: string[];
  learningObjective: string;
  resources: Array<{ title: string; url: string; type: 'doc' | 'video' | 'repo' }>;
  taskPrompt: string;
  solutionHint?: string;
}

export interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  tasks: RoadmapTask[];
}

export interface ProjectTemplate {
  id: string;
  title: string;
  category: 'Full-Stack' | 'Backend' | 'Frontend' | 'Machine Learning' | 'DevOps' | 'Systems';
  roleId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  problemStatement: string;
  realWorldRelevance: string;
  requiredSkills: string[];
  techStack: string[];
  functionalRequirements: string[];
  suggestedMilestones: string[];
  acceptanceCriteria: string[];
  rubricCategories: Array<{ name: string; weight: number; description: string }>;
}

export interface UserProjectSubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  userId: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Changes Requested' | 'Verified' | 'Rejected';
  repositoryUrl: string;
  demoUrl: string;
  description: string;
  architecturalDecisions: string;
  tradeoffsAndChallenges: string;
  submittedAt?: string;
  evaluatedAt?: string;
  overallScore?: number;
  evaluation?: ProjectEvaluationResult;
}

export interface ProjectEvaluationResult {
  overallScore: number;
  passed: boolean;
  layer1AutomatedChecks: {
    repoAccessible: boolean;
    hasReadme: boolean;
    hasLicense: boolean;
    demoAccessible: boolean;
    codeStructureValid: boolean;
  };
  rubricScores: Array<{
    category: string;
    score: number; // 0-100
    feedback: string;
  }>;
  strengths: string[];
  weaknesses: string[];
  recommendedFixes: string[];
  reviewerType: 'Automated + AI Rubric' | 'Peer Review' | 'Mentor Review';
  evidenceLevelGranted: EvidenceLevel;
}

export interface CredentialBadge {
  id: string;
  credentialId: string; // e.g. SKP-2026-REACT-8841
  title: string;
  category: 'Technical Skill' | 'Verified Project' | 'Career Readiness' | 'Specialization';
  issuer: string;
  issueDate: string;
  evidenceLevel: EvidenceLevel;
  relatedProjectOrSkill: string;
  verificationUrl: string;
  skillsVerified: string[];
  score: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'Project Defense';
  expectedKeyPoints: string[];
}

export interface InterviewSession {
  id: string;
  roleTitle: string;
  type: 'Technical' | 'Behavioral' | 'Project Defense';
  date: string;
  overallScore: number;
  questions: Array<{
    question: string;
    studentAnswer: string;
    feedback: string;
    score: number;
  }>;
  strengths: string[];
  improvements: string[];
}

export interface OpportunityItem {
  id: string;
  company: string;
  roleTitle: string;
  location: string;
  type: 'Internship' | 'Full-time' | 'Fellowship';
  remoteStatus: 'Remote' | 'Hybrid' | 'On-site';
  deadline: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  stipendOrSalary: string;
  applicationStatus?: 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'evaluation' | 'streak' | 'roadmap' | 'opportunity';
  linkRoute?: string;
}
