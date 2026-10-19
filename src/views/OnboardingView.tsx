import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  User,
  Compass,
  Layers,
  Target,
  FileText,
  Rocket,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OnboardingView: React.FC = () => {
  const { profile, updateProfile, roles, setTargetRole, setActiveRoute, triggerCelebration } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Resume upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [parsedResumeData, setParsedResumeData] = useState<any | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: profile.name,
    institution: profile.institution,
    degree: profile.degree,
    branch: profile.branch,
    academicYear: profile.academicYear,
    graduationYear: profile.graduationYear,
    preferredLocation: profile.preferredLocation,
    targetRoleId: profile.targetRoleId,
    selectedSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git'],
    careerObjective: 'Internship readiness for Summer 2027',
    githubUrl: profile.githubUrl,
    resumeText: '',
  });

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    setResumeError(null);

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        body,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned status ${res.status}`);
      }

      const data = await res.json();
      setParsedResumeData(data);

      // Merge real extracted skills with selected skills
      if (data.extracted_profile?.skills?.length > 0) {
        setFormData(prev => ({
          ...prev,
          selectedSkills: Array.from(new Set([...prev.selectedSkills, ...data.extracted_profile.skills])),
          targetRoleId: data.recommended_role?.title
            ? (roles.find(r => r.title.toLowerCase().includes(data.recommended_role.title.toLowerCase()) || data.recommended_role.title.toLowerCase().includes(r.title.toLowerCase()))?.id || prev.targetRoleId)
            : prev.targetRoleId,
        }));
      }

      triggerCelebration();
    } catch (err: any) {
      setResumeError(err.message || 'Failed to analyze resume with ML backend. Ensure the backend is reachable.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const availableSkills = [
    'Python', 'Java', 'JavaScript / ES6+', 'TypeScript', 'React',
    'Node.js', 'SQL / PostgreSQL', 'Data Structures & Algorithms',
    'Docker', 'Redis', 'System Design', 'Tailwind CSS', 'Git',
  ];

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill],
    }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save all and redirect
      updateProfile({
        name: formData.name,
        institution: formData.institution,
        degree: formData.degree,
        branch: formData.branch,
        academicYear: formData.academicYear,
        graduationYear: formData.graduationYear,
        preferredLocation: formData.preferredLocation,
        targetRoleId: formData.targetRoleId,
        githubUrl: formData.githubUrl,
      });
      setTargetRole(formData.targetRoleId);
      triggerCelebration();
      setActiveRoute('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const steps = [
    { num: 1, title: 'Profile', icon: User },
    { num: 2, title: 'Target Role', icon: Compass },
    { num: 3, title: 'Current Skills', icon: Layers },
    { num: 4, title: 'Objective', icon: Target },
    { num: 5, title: 'Resume & Links', icon: FileText },
    { num: 6, title: 'Verification Launch', icon: Rocket },
  ];

  return (
    <div className="relative pt-24 pb-28 px-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Student Onboarding Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
          Let’s Build Your Evidence-First Profile
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Takes under 2 minutes. We will calibrate your starting role-readiness score.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 max-w-xl mx-auto relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 -z-10 -translate-y-1/2" />
        {steps.map(s => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          return (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-zinc-950 text-white ring-4 ring-zinc-100'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-zinc-400 border border-zinc-200'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[10px] mt-1 hidden sm:block ${isCurrent ? 'font-semibold text-zinc-900' : 'text-zinc-600'}`}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Cards */}
      <SpotlightCard className="p-6 sm:p-8 bg-white border-zinc-200 shadow-xl">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Profile */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-base text-zinc-900">Step 1: Academic & Personal Profile</h3>
                <p className="text-xs text-zinc-500">Provide your basic university details to benchmark cohort standards.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                    placeholder="e.g. Aryan Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">College / Institution</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={e => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                    placeholder="e.g. NIT Trichy / IIT Delhi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Degree & Major</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                    placeholder="e.g. Computer Science & Engineering"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={formData.graduationYear}
                    onChange={e => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                    placeholder="e.g. 2027"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Target Role Selection */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-base text-zinc-900">Step 2: Select Your Target Engineering Role</h3>
                <p className="text-xs text-zinc-500">Your roadmap, skill-gap analysis, and readiness score adapt to this role.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {roles.map(r => {
                  const isSelected = formData.targetRoleId === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setFormData({ ...formData, targetRoleId: r.id })}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs text-zinc-900">{r.title}</span>
                        {isSelected && <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{r.overview}</p>
                      <div className="mt-2 text-[10px] text-zinc-400">
                        Skills: {r.requiredSkills.slice(0, 3).join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3: Current Skills */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-base text-zinc-900">Step 3: What Skills Have You Explored?</h3>
                <p className="text-xs text-zinc-500">
                  Select your current familiar technologies. These will initially be tagged as <span className="text-zinc-700 font-medium">Claimed</span> until verified.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {availableSkills.map(skill => {
                  const isSelected = formData.selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {skill} {isSelected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 4: Career Objective */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-base text-zinc-900">Step 4: Primary Career Objective</h3>
                <p className="text-xs text-zinc-500">What milestone are you currently preparing for?</p>
              </div>

              <div className="space-y-2 mt-4">
                {[
                  'Internship readiness for Summer 2027',
                  'On-campus placement preparation (Day 1 Tech Firms)',
                  'Targeting a specific off-campus company (e.g., Razorpay, Zerodha)',
                  'Building a verified project portfolio to replace an empty resume',
                ].map(obj => (
                  <div
                    key={obj}
                    onClick={() => setFormData({ ...formData, careerObjective: obj })}
                    className={`p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      formData.careerObjective === obj
                        ? 'border-zinc-950 bg-zinc-50 text-zinc-950 font-semibold'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    {obj}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Resume & Repo */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-base text-zinc-900">Step 5: Resume & Code Profiles</h3>
                <p className="text-xs text-zinc-500">Optional. You can skip this and upload your resume or link GitHub later.</p>
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                    placeholder="https://github.com/your-username"
                  />
                </div>

                <div className="p-5 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 text-center space-y-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />

                  {!parsedResumeData ? (
                    <div>
                      <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                      <span className="text-xs font-bold text-zinc-900 block">
                        Upload Your PDF or DOCX Resume
                      </span>
                      <span className="text-[11px] text-zinc-500 block max-w-xs mx-auto mt-0.5">
                        Our backend ML service extracts skills, detects sections, and matches your profile against 600KB+ job dataset.
                      </span>

                      {resumeError && (
                        <div className="my-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                          {resumeError}
                        </div>
                      )}

                      <div className="mt-3.5">
                        <button
                          type="button"
                          disabled={isUploadingResume}
                          onClick={() => fileInputRef.current?.click()}
                          className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
                        >
                          {isUploadingResume ? 'Analyzing with ML Model...' : 'Select Resume File (.pdf / .docx)'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Real ML Extracted Intelligence Card */
                    <div className="space-y-4 text-left animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-zinc-900">
                            ML Model Analysis Complete: {parsedResumeData.filename}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setParsedResumeData(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-[11px] text-indigo-600 hover:underline"
                        >
                          Change File
                        </button>
                      </div>

                      {/* Model Recommendation */}
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                            Top Dataset Match
                          </span>
                          <span className="text-xs font-bold text-emerald-950">
                            {parsedResumeData.recommended_role?.title}
                          </span>
                          <span className="text-[11px] text-emerald-700 block mt-0.5">
                            Cosine Similarity: {parsedResumeData.recommended_role?.match_score}% • Readiness: {parsedResumeData.readiness?.score}%
                          </span>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                          {parsedResumeData.recommended_role?.experience_level}
                        </span>
                      </div>

                      {/* Extracted Skills */}
                      <div>
                        <span className="text-[11px] font-semibold text-zinc-700 block mb-1.5">
                          Extracted Skills from Document ({parsedResumeData.extracted_profile?.skills?.length || 0}):
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {parsedResumeData.extracted_profile?.skills?.map((sk: string, i: number) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-800 font-mono shadow-2xs"
                            >
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Sections Detected */}
                      <div className="flex gap-4 text-[11px] text-zinc-600 pt-1">
                        <span>Projects: {parsedResumeData.extracted_profile?.sections_detected?.projects ? '✓ Detected' : '—'}</span>
                        <span>Experience: {parsedResumeData.extracted_profile?.sections_detected?.experience ? '✓ Detected' : '—'}</span>
                        <span>Education: {parsedResumeData.extracted_profile?.sections_detected?.education ? '✓ Detected' : '—'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Verification Launch */}
          {currentStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4 text-center py-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mx-auto shadow-md">
                <Rocket className="w-6 h-6 text-cyan-300" />
              </div>
              <h3 className="font-bold text-lg text-zinc-950">Profile Ready for Verification!</h3>
              <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
                We have initialized your customized roadmap, benchmarked your baseline readiness against <strong>{roles.find(r => r.id === formData.targetRoleId)?.title}</strong>, and configured your project verification workspace.
              </p>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 max-w-sm mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Candidate:</span>
                  <span className="font-medium text-zinc-900">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Target Role:</span>
                  <span className="font-medium text-indigo-600">{roles.find(r => r.id === formData.targetRoleId)?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Initial Skills:</span>
                  <span className="font-medium text-zinc-900">{formData.selectedSkills.length} selected</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {currentStep === 5 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                Skip for now
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentStep === 6 ? 'Launch My Dashboard' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};
