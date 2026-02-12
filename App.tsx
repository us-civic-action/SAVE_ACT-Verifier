declare module "*.png";
import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Info,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Scale,
  Building2,
  ExternalLink,
  AlertCircle,
  Fingerprint,
  Home,
  MapPin,
  ClipboardCheck,
  Search,
  Clock,
  BookOpen,
  ArrowLeft,
  Lock,
  Mail,
  Gavel,
  Check,
  Settings,
  Moon,
  Sun,
  Type,
  Eye,
  WifiOff,
  GitBranch,
  X,
  Coffee,
  Database,
  FileCode,
  Menu,
  Globe,
  LayoutGrid,
  Github,
  ChevronDown
} from 'lucide-react';
import { AppState, EligibilityStatus, AppView, AccessibilitySettings } from './types';
import { QUESTIONS, STATES, ACCEPTABLE_DPOC, BRIDGING_DOCUMENTS, RESIDENCY_EXAMPLES, SAVE_ACT_BILL_URL } from './constants';
import civicLogo from './assets/civic_logo.png';

const App: React.FC = () => {
  // Persistence initialization
  const savedAccessibility = localStorage.getItem('accessibility_settings');
  const initialAccessibility: AccessibilitySettings = savedAccessibility
    ? JSON.parse(savedAccessibility)
    : { isDarkMode: false, isHighContrast: false, isLargeText: false };

  const [state, setState] = useState<AppState>({
    currentStep: -1,
    answers: {},
    selectedState: null,
    view: 'checker',
    accessibility: initialAccessibility
  });

  const [stateSearch, setStateSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    localStorage.setItem('accessibility_settings', JSON.stringify(state.accessibility));
    // Apply dark class to html for tailwind dark mode
    if (state.accessibility.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.accessibility]);

  const toggleAccessibility = (key: keyof AccessibilitySettings) => {
    setState(prev => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: !prev.accessibility[key]
      }
    }));
  };

  const selectedStateData = useMemo(() =>
    STATES.find(s => s.code === state.selectedState),
    [state.selectedState]);

  const filteredStates = useMemo(() =>
    STATES.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()) || s.code.toLowerCase().includes(stateSearch.toLowerCase())),
    [stateSearch]);

  const activeQuestions = useMemo(() => {
    const baseQs = QUESTIONS.filter(q => q.id !== 'residencyDuration');
    const finalQs = [...baseQs];

    if (selectedStateData && selectedStateData.residencyDays > 0) {
      const residencyIndex = finalQs.findIndex(q => q.id === 'residency');
      const templateQ = QUESTIONS.find(q => q.id === 'residencyDuration');
      if (templateQ && residencyIndex !== -1) {
        const customQ = {
          ...templateQ,
          text: templateQ.text.replace('{STATE_NAME}', selectedStateData.name).replace('{DAYS}', selectedStateData.residencyDays.toString())
        };
        finalQs.splice(residencyIndex + 1, 0, customQ);
      }
    }
    return finalQs;
  }, [selectedStateData]);


  const handleStateSelect = (code: string) => {
    setState(prev => ({ ...prev, selectedState: code, currentStep: 0 }));
  };

  const handleAnswer = (questionId: string, value: any) => {
    if ((questionId === 'citizenship' && value === false) || (questionId === 'age' && value === false)) {
      setState(prev => ({
        ...prev,
        answers: { ...prev.answers, [questionId]: value },
        currentStep: activeQuestions.length
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
      currentStep: prev.currentStep + 1
    }));
  };

  const reset = () => {
    setState(prev => ({
      ...prev,
      currentStep: -1,
      answers: {},
      isPlainEnglishMode: false,
      selectedState: null,
      view: 'checker'
    }));
    setStateSearch('');
  };

  const goBack = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const setView = (view: AppView) => {
    setState(prev => ({ ...prev, view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateResults = (): { status: EligibilityStatus; checklist: React.ReactNode[]; actionItems: { title: string; description: string; icon: React.ReactNode }[] } => {
    const { answers } = state;
    const isCitizen = answers['citizenship'] === true;
    const isOfAge = answers['age'] === true;
    const isResident = answers['residency'] === true;
    const hasResidencyProof = answers['residencyProof'] === true;
    const dpocStatus = answers['dpoc'];
    const namesMatch = answers['nameMatch'] === true;

    const checklist: React.ReactNode[] = [];
    const actionItems: { title: string; description: string; icon: React.ReactNode }[] = [];

    if (!isCitizen) {
      return {
        status: 'Ineligible',
        checklist: [<span className="text-red-600 dark:text-red-400 font-bold">Federal Law (2026 SAVE Act) restricts voter registration to U.S. Citizens only. Non-citizens are not eligible to register.</span>],
        actionItems: []
      };
    }

    if (!isOfAge) {
      return {
        status: 'Ineligible',
        checklist: [<span>You must be at least 18 years old on or before Election Day. You may be able to pre-register depending on local {selectedStateData?.name} laws.</span>],
        actionItems: []
      };
    }

    if (!isResident || !hasResidencyProof) {
      const item = (
        <div className={`flex flex-col gap-3 p-5 rounded-[2rem] border-2 shadow-sm ${state.accessibility.isHighContrast ? 'bg-white border-black dark:bg-black dark:border-white' : 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30'}`}>
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-black uppercase tracking-[0.15em] text-[10px]">
            <Home className="w-4 h-4" />
            Establish Residency Proof
          </div>
          <span className="text-sm text-blue-900 dark:text-blue-100 font-bold leading-relaxed">
            Registering in {selectedStateData?.name} requires documentation linking your identity to your local address.
          </span>
          <div className={`p-4 rounded-xl border ${state.accessibility.isHighContrast ? 'border-black dark:border-white' : 'bg-white/80 dark:bg-slate-800/80 border-blue-200/50'}`}>
            <ul className="space-y-1.5">
              {RESIDENCY_EXAMPLES.slice(0, 5).map((ex, idx) => (
                <li key={idx} className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-2 font-medium">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
      checklist.push(item);
      actionItems.push({
        title: 'Establish Residency',
        description: 'You need a utility bill, bank statement, or government mailer with your name and address.',
        icon: <Home className="w-5 h-5" />
      });
    }
    let residencyDurationMet = false;

    if (selectedStateData && selectedStateData.residencyDays > 0) {
      const hasDuration = answers['residencyDuration'];
      // Only flag if they explicitly said NO to the duration requirement
      if (hasDuration === false) {
        checklist.push(
          <div className={`flex flex-col gap-3 p-5 rounded-[2rem] border-2 shadow-sm ${state.accessibility.isHighContrast ? 'bg-white border-black dark:bg-black dark:border-white' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-black uppercase tracking-[0.15em] text-[10px]">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Residency Duration Requirement
            </div>
            <div className="space-y-2">
              <span className="text-sm text-slate-900 dark:text-slate-100 font-bold block">
                You must wait until you have lived in {selectedStateData.name} for at least {selectedStateData.residencyDays} days before registering.
              </span>
            </div>
          </div>
        );
        actionItems.push({
          title: 'Wait for Residency Period',
          description: `You must live in ${selectedStateData.name} for ${selectedStateData.residencyDays} days.`,
          icon: <Clock className="w-5 h-5" />
        });
      } else if (hasDuration === true) {
        // User met the requirement. Track it but DO NOT block.
        residencyDurationMet = true;
      }
    }

    if (namesMatch === false) {
      const item = (
        <div className={`flex flex-col gap-4 p-5 rounded-[2rem] border-2 shadow-sm ${state.accessibility.isHighContrast ? 'bg-white border-black dark:bg-black dark:border-white' : 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30'}`}>
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black uppercase tracking-[0.15em] text-[10px]">
            <Fingerprint className="w-4 h-4" />
            Critical: Identity Linkage Required
          </div>
          <div className="space-y-3">
            <span className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed font-bold block">
              Since your current name (on ID) differs from your citizenship proof, a "paper trail" is mandatory.
            </span>
            <div className={`p-4 rounded-xl border ${state.accessibility.isHighContrast ? 'border-black dark:border-white' : 'bg-white/60 dark:bg-slate-800/60 border-amber-200/50'}`}>
              <ul className="space-y-2">
                {BRIDGING_DOCUMENTS.map((doc, idx) => (
                  <li key={idx} className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1 shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
      checklist.push(item);
      actionItems.push({
        title: 'Bridge Name Change',
        description: 'Provide a Marriage Certificate, Divorce Decree, or Court Order linking your names.',
        icon: <Fingerprint className="w-5 h-5" />
      });
    }

    if (dpocStatus === 'none' || dpocStatus === 'available') {
      const isStrict = selectedStateData?.strictDPOC;

      if (isStrict) {
        const item = (
          <div className={`flex flex-col gap-5 p-6 rounded-[2.5rem] border-2 shadow-sm ${state.accessibility.isHighContrast ? 'bg-white border-black dark:bg-black dark:border-white' : 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30'}`}>
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-black uppercase tracking-widest text-[10px]">
              <AlertCircle className="w-4 h-4" />
              Strict Enforcement: DPOC Required
            </div>
            <div className="space-y-4">
              <span className="text-sm text-red-900 dark:text-red-100 font-bold leading-relaxed block">
                {selectedStateData?.name} mandates physical proof of citizenship at the time of registration.
              </span>
              <div className={`p-5 rounded-2xl shadow-sm border ${state.accessibility.isHighContrast ? 'bg-white border-black dark:bg-black dark:border-white' : 'bg-white dark:bg-slate-800 border-red-100 dark:border-red-900/40'}`}>
                <ul className="space-y-2">
                  {ACCEPTABLE_DPOC.slice(0, 4).map((doc, idx) => (
                    <li key={idx} className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
        checklist.push(item);
        actionItems.push({
          title: 'Provide Citizenship Proof',
          description: 'You MUST have a Passport, Birth Certificate, or Naturalization Certificate.',
          icon: <AlertCircle className="w-5 h-5" />
        });
      } else {
        checklist.push(
          <div className={`flex flex-col gap-3 p-5 rounded-[2rem] border-2 shadow-sm ${state.accessibility.isHighContrast ? 'bg-white border-black dark:bg-black dark:border-white' : 'bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30'}`}>
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">Streamlined Verification</span>
            <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
              {selectedStateData?.name} uses automated DMV checks. Re-submission may not be required if previously verified.
            </p>
          </div>
        );
      }
    }

    if (checklist.length === 0) {
      const successItems = [
        <div key="base" className={`flex flex-col gap-1 p-5 rounded-[2rem] border-2 shadow-sm ${state.accessibility.isHighContrast ? 'bg-white border-black dark:bg-black dark:border-white' : 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30'}`}>
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-black uppercase tracking-[0.15em] text-[10px]">
            <ShieldCheck className="w-4 h-4" />
            Confirmed: Identity Verified
          </div>
          <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200 block mt-1">
            You meet the standard identity documentation rules for {selectedStateData?.name}.
          </span>
        </div>
      ];

      if (residencyDurationMet) {
        successItems.unshift(
          <div key="duration" className={`flex flex-col gap-1 p-5 mb-4 rounded-[2rem] border-2 shadow-sm ${state.accessibility.isHighContrast ? 'bg-white border-black dark:bg-black dark:border-white' : 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30'}`}>
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-black uppercase tracking-[0.15em] text-[10px]">
              <MapPin className="w-4 h-4" />
              Confirmed: Residency Duration
            </div>
            <span className="text-sm text-emerald-900 dark:text-emerald-200 font-bold block mt-1">
              You have lived in {selectedStateData?.name} for at least {selectedStateData?.residencyDays} days.
            </span>
          </div>
        );
      } else {
        // Even if duration wasn't explicitly asked (0 days), confirm residency generally
        successItems.unshift(
          <div key="residency_general" className={`flex flex-col gap-1 p-5 mb-4 rounded-[2rem] border-2 shadow-sm ${state.accessibility.isHighContrast ? 'bg-white border-black dark:bg-black dark:border-white' : 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30'}`}>
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-black uppercase tracking-[0.15em] text-[10px]">
              <Home className="w-4 h-4" />
              Confirmed: Residency Established
            </div>
            <span className="text-sm text-emerald-900 dark:text-emerald-200 font-bold block mt-1">
              You have a fixed habitation in {selectedStateData?.name}.
            </span>
          </div>
        );
      }

      return {
        status: 'Likely Eligible',
        checklist: successItems,
        actionItems: []
      };
    }

    return { status: 'Action Required', checklist, actionItems };
  };



  const renderProgress = () => {
    if (state.currentStep < 0 || state.currentStep >= activeQuestions.length) return null;
    const progress = ((state.currentStep + 1) / activeQuestions.length) * 100;
    return (
      <div className={`w-full h-2 mb-8 rounded-full overflow-hidden shadow-inner ${state.accessibility.isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
        <div className="bg-blue-900 dark:bg-blue-500 h-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>
    );
  };

  const highContrastClass = state.accessibility.isHighContrast ? 'border-2 border-black dark:border-white bg-white text-black dark:bg-black dark:text-white shadow-none' : '';
  const largeTextClass = state.accessibility.isLargeText ? 'text-lg md:text-xl' : '';

  const renderView = () => {
    switch (state.view) {
      case 'privacy':
        return (
          <div className="p-8 md:p-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-blue-900 dark:bg-blue-600 p-3 rounded-2xl shadow-xl text-white">
                <Lock className="w-6 h-6" />
              </div>
              <h2
                className={`text-3xl font-black tracking-tighter uppercase ${largeTextClass}`}
                style={{ color: state.accessibility.isDarkMode ? '#ffffff' : '#000000' }}
              >
                Privacy Policy
              </h2>
            </div>
            <div className="prose dark:prose-invert prose-slate max-w-none space-y-8">
              <div className={`p-6 md:p-8 rounded-[2.5rem] border shadow-inner ${state.accessibility.isHighContrast ? 'bg-white dark:bg-black border-black dark:border-white' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
                <h4 className="text-sm font-black text-black dark:text-white uppercase tracking-widest mb-4">No Data Collection</h4>
                <p
                  className={`leading-relaxed text-sm ${largeTextClass}`}
                  style={{ color: state.accessibility.isDarkMode ? '#e2e8f0' : '#0f172a' }}
                >
                  We believe civic tools should be private by design. <strong>This application does not collect, store, or transmit any information you enter.</strong> All eligibility calculations are performed locally in your browser.
                </p>
              </div>
            </div>
            <button onClick={() => setView('checker')} className="mt-12 flex items-center gap-3 bg-slate-900 dark:bg-blue-600 text-white font-black uppercase tracking-[0.2em] px-8 py-5 rounded-[2rem] hover:bg-slate-800 transition-all shadow-xl text-[10px] active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Return to Checker
            </button>
          </div>
        );
      case 'statutes':
        return (
          <div className="p-6 md:p-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-blue-900 dark:bg-blue-600 p-3 rounded-2xl shadow-xl text-white">
                <Gavel className="w-6 h-6" />
              </div>
              <h2
                className={`text-3xl font-black tracking-tighter uppercase ${largeTextClass}`}
                style={{ color: state.accessibility.isDarkMode ? '#ffffff' : '#000000' }}
              >
                Transparency & Legal
              </h2>
            </div>

            <div className={`p-6 md:p-8 mb-12 rounded-[2.5rem] border shadow-xl ${state.accessibility.isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${state.accessibility.isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-900 text-white'}`}>
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-wide mb-2 ${state.accessibility.isDarkMode ? 'text-white' : 'text-blue-900'}`}>Why This Matters</h3>
                  <p className={`text-xs leading-relaxed ${state.accessibility.isDarkMode ? 'text-blue-100' : 'text-blue-900/80'} ${largeTextClass}`}>
                    The <strong>SAVE Act (H.R.8281)</strong> has passed the House and is currently in the Senate. This tool reflects the requirements as they are written in the proposed law, helping you verify if you have the correct documents ready for 2026.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-12">
              <div className={`p-6 md:p-8 rounded-[2.5rem] border ${state.accessibility.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl'}`}>
                <div className="flex items-start gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${state.accessibility.isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-black uppercase tracking-wide mb-2 ${state.accessibility.isDarkMode ? 'text-white' : 'text-slate-900'}`}>Zero Data Retention</h3>
                    <p className={`text-xs leading-relaxed ${state.accessibility.isDarkMode ? 'text-slate-300' : 'text-slate-600'} ${largeTextClass}`}>
                      We believe civic tools should be private by design. <strong>We save absolutely no data.</strong> Everything runs locally in your browser.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 md:p-8 rounded-[2.5rem] border ${state.accessibility.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl'}`}>
                <div className="flex items-start gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${state.accessibility.isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                    <FileCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-black uppercase tracking-wide mb-2 ${state.accessibility.isDarkMode ? 'text-white' : 'text-slate-900'}`}>Minimalist Code</h3>
                    <p className={`text-xs leading-relaxed ${state.accessibility.isDarkMode ? 'text-slate-300' : 'text-slate-600'} ${largeTextClass}`}>
                      This site is so tiny it could fit on a milk carton. No bloat, no tracking scripts, just the logic you need.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className={`text-xs font-black uppercase tracking-widest ${state.accessibility.isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Legal Basis</h3>
              <p
                className={`leading-relaxed ${largeTextClass}`}
                style={{ color: state.accessibility.isDarkMode ? '#f1f5f9' : '#0f172a' }}
              >
                The logic within this tool is derived from <strong>H.R.8281 - Safeguard American Voter Eligibility Act (SAVE Act)</strong>.
              </p>
              <div className="p-6 md:p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/40">
                <a
                  href={SAVE_ACT_BILL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full bg-blue-900 dark:bg-blue-600 text-white font-black uppercase tracking-[0.2em] py-5 rounded-[1.5rem] hover:bg-blue-800 transition-all text-[11px]"
                >
                  View Bill Text on Congress.gov <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <button onClick={() => setView('checker')} className="mt-12 flex items-center gap-3 bg-slate-900 dark:bg-blue-600 text-white font-black uppercase tracking-[0.2em] px-8 py-5 rounded-[2rem] hover:bg-slate-800 transition-all shadow-xl text-[10px] active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Return to Checker
            </button>
          </div>
        );
      case 'contact':
        return (
          <div className="p-6 md:p-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-blue-900 dark:bg-blue-600 p-3 rounded-2xl shadow-xl text-white">
                <Mail className="w-6 h-6" />
              </div>
              <h2
                className={`text-3xl font-black tracking-tighter uppercase ${largeTextClass}`}
                style={{ color: state.accessibility.isDarkMode ? '#ffffff' : '#000000' }}
              >
                Get Support
              </h2>
            </div>
            <div className="space-y-4">
              <button onClick={() => window.open('https://vote.gov', '_blank')} className={`w-full flex items-center justify-between p-6 rounded-3xl transition-colors group ${state.accessibility.isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                    <Home className="w-5 h-5 text-blue-900 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-black dark:text-white uppercase">Vote.gov</h4>
                    <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium uppercase tracking-widest">Official Registration Portal</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-900 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <button onClick={() => setView('checker')} className="mt-12 flex items-center gap-3 bg-slate-900 dark:bg-blue-600 text-white font-black uppercase tracking-[0.2em] px-8 py-5 rounded-[2rem] hover:bg-slate-800 transition-all shadow-xl text-[10px] active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Return to Checker
            </button>
          </div>
        );
      default:
        return (
          <>
            {state.currentStep === -1 && (
              <div className="p-6 md:p-16">
                <div className={`p-6 md:p-8 mb-12 rounded-[2.5rem] border shadow-xl ${state.accessibility.isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                  <div className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${state.accessibility.isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-900 text-white'}`}>
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-black uppercase tracking-wide mb-2 ${state.accessibility.isDarkMode ? 'text-white' : 'text-blue-900'}`}>Why This Matters</h3>
                      <p className={`text-xs leading-relaxed ${state.accessibility.isDarkMode ? 'text-blue-100' : 'text-blue-900/80'} ${largeTextClass}`}>
                        The <strong>SAVE Act (H.R.8281)</strong> has passed the House and is currently in the Senate. This tool reflects the requirements as they are written in the proposed law, helping you verify if you have the correct documents ready for 2026.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-10">
                  <div className={`inline-flex items-center justify-center w-28 h-28 rounded-[2.5rem] rotate-3 mb-8 shadow-inner ring-1 transition-transform hover:rotate-0 duration-700 ${state.accessibility.isDarkMode ? 'bg-blue-900/30 text-blue-400 ring-blue-900/50' : 'bg-blue-50 text-blue-900 ring-blue-100/50'}`}>
                    <Scale className="w-14 h-14 -rotate-3" />
                  </div>
                  <h2
                    className={`text-4xl font-black leading-[1.1] tracking-tighter uppercase ${largeTextClass}`}
                    style={{ color: state.accessibility.isDarkMode ? '#ffffff' : '#000000' }}
                  >
                    Check Your 2026 Eligibility
                  </h2>
                  <p
                    className={`mt-4 text-lg font-medium ${largeTextClass}`}
                    style={{ color: state.accessibility.isDarkMode ? '#e2e8f0' : '#1e293b' }}
                  >
                    Requirements vary by state. Select yours to begin checking your eligibility.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for your state..."
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      className={`block w-full pl-11 pr-4 py-5 border-2 rounded-2xl focus:ring-4 transition-all outline-none font-bold placeholder-slate-500 ${state.accessibility.isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/10' : 'bg-slate-50/50 border-slate-50 focus:bg-white focus:border-blue-900 focus:ring-blue-900/5 text-black'}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-h-[18rem] overflow-y-auto pr-2 custom-scrollbar p-1">
                    {filteredStates.map((s) => (
                      <button
                        key={s.code}
                        onClick={() => handleStateSelect(s.code)}
                        className={`flex items-center justify-between px-6 py-5 border-2 rounded-[1.2rem] hover:shadow-lg transition-all text-left group active:scale-[0.97] ${state.accessibility.isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-50 hover:border-blue-900 hover:bg-blue-50/30'}`}
                      >
                        <span className={`font-black text-xs uppercase tracking-tight group-hover:text-blue-900 dark:group-hover:text-blue-400 ${state.accessibility.isDarkMode ? 'text-white' : 'text-black'}`}>{s.name}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 transition-transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {state.currentStep >= 0 && state.currentStep < activeQuestions.length && (
              <div className="p-6 md:p-16">
                {renderProgress()}
                <div className="mb-12">
                  <button onClick={goBack} className="text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-12 transition-colors group">
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Step Back
                  </button>
                  <h3
                    className={`text-3xl font-black mb-6 leading-snug tracking-tighter uppercase ${largeTextClass}`}
                    style={{ color: state.accessibility.isDarkMode ? '#ffffff' : '#000000' }}
                  >
                    {activeQuestions[state.currentStep].text}
                  </h3>

                  {activeQuestions[state.currentStep].id === 'dpoc' && (
                    <div className={`p-6 md:p-6 mb-8 rounded-[2rem] border ${state.accessibility.isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-100'}`}>
                      <h4
                        className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2"
                        style={{ color: state.accessibility.isDarkMode ? '#ffffff' : '#1e293b' }}
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        Valid Documents Include:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ACCEPTABLE_DPOC.map((doc, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${state.accessibility.isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <span
                              className={`text-sm font-bold leading-tight ${state.accessibility.isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}
                            >
                              {doc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {activeQuestions[state.currentStep].options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswer(activeQuestions[state.currentStep].id, opt.value)}
                      className={`w-full text-left p-6 md:p-8 border-2 rounded-[1.8rem] transition-all group relative overflow-hidden active:scale-[0.98] ${state.accessibility.isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-700/50' : 'bg-white border-slate-50 hover:border-blue-900 hover:bg-blue-50/20'}`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className={`font-black text-base uppercase tracking-wider leading-none ${state.accessibility.isDarkMode ? 'text-white' : 'text-black'} ${largeTextClass}`}>{opt.label}</span>
                        <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all bg-white dark:bg-slate-900 shadow-sm ${state.accessibility.isDarkMode ? 'border-slate-700 group-hover:border-blue-500' : 'border-slate-100 group-hover:border-blue-900'}`}>
                          <div className="w-5 h-5 bg-blue-900 dark:bg-blue-500 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {state.currentStep === activeQuestions.length && (
              <div className="p-6 md:p-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {(() => {
                  const { status, checklist, actionItems } = calculateResults();
                  return (
                    <div>
                      <div className="text-center mb-14">
                        <div className="inline-flex items-center justify-center mb-10">
                          {status === 'Likely Eligible' && <div className={`p-8 rounded-full shadow-2xl ring-4 ${state.accessibility.isDarkMode ? 'bg-emerald-900/20 ring-emerald-900/50 shadow-emerald-900/30' : 'bg-emerald-50 ring-emerald-100 shadow-emerald-500/20'}`}><CheckCircle2 className="w-32 h-32 text-emerald-600 dark:text-emerald-500" /></div>}
                          {status === 'Action Required' && <div className={`p-6 md:p-8 rounded-[2.5rem] shadow-2xl ring-1 ${state.accessibility.isDarkMode ? 'bg-amber-900/20 ring-amber-900/50 shadow-amber-900/30' : 'bg-amber-50 ring-amber-100 shadow-amber-500/10'}`}><AlertTriangle className="w-24 h-24 text-amber-500" /></div>}
                          {status === 'Ineligible' && <div className={`p-6 md:p-8 rounded-[2.5rem] shadow-2xl ring-1 ${state.accessibility.isDarkMode ? 'bg-red-900/20 ring-red-900/50 shadow-red-900/30' : 'bg-red-50 ring-red-100 shadow-red-500/10'}`}><XCircle className="w-24 h-24 text-red-500" /></div>}
                        </div>
                        <h2 className={`text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4 ${status === 'Likely Eligible' ? 'text-emerald-700 dark:text-emerald-400' : status === 'Action Required' ? 'text-amber-600' : 'text-red-600'}`}>{status}</h2>
                        <div className="inline-block px-6 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg">Jurisdiction: {selectedStateData?.name}</div>
                      </div>

                      <div className={`rounded-[3rem] p-8 mb-10 border shadow-inner ring-1 ${state.accessibility.isDarkMode ? 'bg-slate-800/40 border-slate-700 ring-slate-900/50' : 'bg-slate-50 border-slate-100 ring-slate-900/5'}`}>
                        {status === 'Likely Eligible' ? (
                          <div className="space-y-4">
                            {checklist.map((item, i) => (
                              <div key={i}>{item}</div>
                            ))}
                          </div>
                        ) : (
                          <ul className="space-y-12">
                            {checklist.map((item, i) => (
                              <li key={i} className="flex gap-8 items-start">
                                <div className="shrink-0"><div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-xl font-black text-sm ${state.accessibility.isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>{i + 1}</div></div>
                                <div className={`leading-relaxed pt-1 flex-grow ${state.accessibility.isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="mb-10">
                        <details className="group">
                          <summary className="list-none cursor-pointer">
                            <div className="flex items-center justify-between p-6 bg-slate-100 dark:bg-blue-900/20 rounded-[2rem] hover:bg-slate-200 dark:hover:bg-blue-900/30 transition-colors">
                              <div className="flex items-center gap-3 text-slate-600 dark:text-blue-300 font-bold uppercase tracking-widest text-[10px]">
                                <BookOpen className="w-4 h-4" />
                                Legal Verification Basis
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90" />
                            </div>
                          </summary>
                          <div className="p-6 pt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 space-y-4 animate-in fade-in slide-in-from-top-2">
                            <p>This guidance is derived directly from the <strong>H.R.8281 - SAVE Act</strong>. It strictly adheres to federal requirements for documentary proof of citizenship.</p>
                            <button
                              onClick={() => setView('statutes')}
                              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-bold uppercase tracking-wider text-[10px]"
                            >
                              Read Full Statute Analysis <ExternalLink className="w-3 h-3" />
                            </button>
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                              <ShieldCheck className="w-3 h-3" />
                              Privacy Shield: Zero Data Saved
                            </div>
                          </div>
                        </details>
                      </div>

                      <div className="flex flex-col gap-4">
                        {status !== 'Likely Eligible' && actionItems.length > 0 ? (
                          <div className={`p-6 rounded-[2.5rem] border ${state.accessibility.isDarkMode ? 'bg-amber-950/30 border-amber-900/30' : 'bg-amber-50 border-amber-100'}`}>
                            <h4 className={`text-center text-xs font-black uppercase tracking-widest mb-6 ${state.accessibility.isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                              Steps to resolve your status:
                            </h4>
                            <div className="space-y-4 mb-8">
                              {actionItems.map((action, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${state.accessibility.isDarkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                                    {action.icon}
                                  </div>
                                  <div>
                                    <div className={`text-xs font-black uppercase ${state.accessibility.isDarkMode ? 'text-white' : 'text-slate-900'}`}>{action.title}</div>
                                    <div className={`text-xs leading-relaxed ${state.accessibility.isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{action.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => {
                                const selectedStateData = STATES.find(s => s.code === state.selectedState);
                                const targetUrl = selectedStateData
                                  ? `https://vote.gov/register/${selectedStateData.name.toLowerCase().replace(/\s+/g, '-')}`
                                  : 'https://vote.gov';
                                window.open(targetUrl, '_blank');
                              }}
                              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] py-6 rounded-[2rem] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-95 text-xs"
                            >
                              Register to Vote (Vote.gov) <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          // Default / Eligible
                          <button
                            onClick={() => {
                              const selectedStateData = STATES.find(s => s.code === state.selectedState);
                              const targetUrl = selectedStateData
                                ? `https://vote.gov/register/${selectedStateData.name.toLowerCase().replace(/\s+/g, '-')}`
                                : 'https://vote.gov';
                              window.open(targetUrl, '_blank');
                            }}
                            className={`w-full flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.2em] py-6 rounded-[2rem] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-95 text-xs ${status === 'Likely Eligible' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-800'}`}
                          >
                            {status === 'Likely Eligible' ? 'Register to Vote' : 'Check State Requirements'} <ExternalLink className="w-4 h-4" />
                          </button>
                        )}

                        <button onClick={reset} className="w-full flex items-center justify-center gap-3 bg-transparent text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] py-5 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 active:scale-95 text-[10px]">
                          <RotateCcw className="w-3 h-3" /> Check Another Person
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        );
    }
  };


  return (
    <div className={`min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900 antialiased font-['Inter'] transition-colors duration-300 ${state.accessibility.isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50/50 text-slate-900'} ${state.accessibility.isHighContrast ? 'contrast-125' : ''}`}>
      <header className="bg-slate-900 text-white py-4 px-4 shadow-xl sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 -ml-2 hover:bg-slate-800 rounded-xl transition-colors md:hidden"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
              <div className="group-hover:scale-105 transition-transform duration-300">
                <img src={civicLogo} alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1
                  className="text-lg font-black tracking-tighter leading-none"
                  style={{ color: '#ffffff' }}
                >
                  US CIVIC ACTION
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5 md:hidden">Project: SAVE Act Verifier</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 ml-8 flex-grow">
            <a
              href="https://nh-civic-app.vercel.app/"
              className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" /> Home
            </a>
            <a
              href="https://github.com/us-civic-action/SAVE_ACT-Verifier"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> Save Act Verifier { /* Using Github icon if available, implied by 'Project Page' request */}
            </a>
            <div className="relative group/menu">
              <button className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-not-allowed opacity-70">
                Future Tools <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </nav>


          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors"
              aria-label="Accessibility Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>


      {/* Sidebar Navigation */}
      {showSidebar && (
        <div className="fixed inset-0 z-[100] flex justify-start">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
          <div className={`relative w-full max-w-xs h-full shadow-2xl border-r p-6 animate-in slide-in-from-left duration-300 flex flex-col ${state.accessibility.isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <img src={civicLogo} alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-sm font-black uppercase tracking-tighter">US Civic Action</span>
              </div>
              <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-2 flex-grow">
              <div className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
                Apps
              </div>
              <button onClick={() => { window.location.href = 'https://nh-civic-app.vercel.app/'; setShowSidebar(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${state.accessibility.isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}>
                <Globe className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm font-bold">Home</div>
                  <div className="text-[10px] opacity-70">Main Hub</div>
                </div>
              </button>

              <button onClick={() => { window.location.href = 'https://nh-civic-app.vercel.app/legislate'; setShowSidebar(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${state.accessibility.isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}>
                <Gavel className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm font-bold">Legislate</div>
                  <div className="text-[10px] opacity-70">Drafting Tools</div>
                </div>
              </button>

              <button onClick={() => { setView('statutes'); setShowSidebar(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${state.accessibility.isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}>
                <Eye className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm font-bold">Transparency</div>
                  <div className="text-[10px] opacity-70">View Statutes</div>
                </div>
              </button>

              <div className="px-3 py-2 mt-6 text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
                Projects
              </div>
              <button onClick={() => { window.open('https://github.com/us-civic-action/SAVE_ACT-Verifier', '_blank'); setShowSidebar(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${state.accessibility.isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}>
                <Github className="w-5 h-5" />
                <div>
                  <div className="text-sm font-bold">Save Act Verifier</div>
                  <div className="text-[10px]">Open Source Repo</div>
                </div>
              </button>
              <button disabled className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left opacity-50 cursor-not-allowed">
                <LayoutGrid className="w-5 h-5" />
                <div>
                  <div className="text-sm font-bold">Future Tools</div>
                  <div className="text-[10px]">Coming Soon</div>
                </div>
              </button>
            </nav>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <a
                href="https://github.com/us-civic-action"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                GitHub Organization
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Drawer */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className={`relative w-full max-w-sm rounded-[2.5rem] shadow-2xl border p-8 animate-in zoom-in-95 duration-200 ${state.accessibility.isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-500" />
                Accessibility
              </h3>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => toggleAccessibility('isDarkMode')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${state.accessibility.isDarkMode ? 'border-blue-500 bg-blue-500/10' : 'border-slate-50 bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  {state.accessibility.isDarkMode ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-slate-500" />}
                  <span className="text-xs font-bold uppercase tracking-wider">Dark Mode</span>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${state.accessibility.isDarkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${state.accessibility.isDarkMode ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </button>

              <button
                onClick={() => toggleAccessibility('isHighContrast')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${state.accessibility.isHighContrast ? 'border-blue-500 bg-blue-500/10' : 'border-slate-50 bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-slate-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">High Contrast</span>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${state.accessibility.isHighContrast ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${state.accessibility.isHighContrast ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </button>

              <button
                onClick={() => toggleAccessibility('isLargeText')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${state.accessibility.isLargeText ? 'border-blue-500 bg-blue-500/10' : 'border-slate-50 bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-slate-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Large Text</span>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${state.accessibility.isLargeText ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${state.accessibility.isLargeText ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </button>
            </div>
            <p className="mt-8 text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">Preferences are saved locally to this browser.</p>
          </div>
        </div>
      )}

      <main className="flex-grow flex items-center justify-center p-4 md:p-12 lg:p-20">
        <div className={`max-w-xl w-full rounded-[3rem] border overflow-hidden ring-1 ring-slate-900/5 transition-all duration-500 ${state.accessibility.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)]'} ${highContrastClass}`}>
          {renderView()}
        </div>
      </main>

      <footer className={`py-12 px-4 border-t transition-colors ${state.accessibility.isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
          {/* Left Column */}
          <div className="space-y-4 max-w-sm">
            <div>
              <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-tighter">US Civic Action</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Independent. Non-partisan.</p>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
              We are 100% ad-free and tracking-free. Running our servers relies entirely on user support.
            </p>
          </div>

          {/* Right Column / Actions */}
          <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-4">
              <button onClick={() => window.location.href = '/'} className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-900 dark:hover:text-blue-400 transition-colors">Home</button>
              <button onClick={() => setView('statutes')} className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-900 dark:hover:text-blue-400 transition-colors">Transparency</button>
              <button onClick={() => setShowSettings(true)} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-1 rounded-md"><Settings className="w-3 h-3" /></div>
                A11Y
              </button>

              <a
                href="https://buy.stripe.com/cNi9ATgtb3vv9f6g1Sawo02"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#5F3DC4] hover:bg-[#5233ac] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <div className="bg-white/20 p-1 rounded-full">
                  <Coffee className="w-3 h-3" />
                </div>
                Support the project
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium text-center">
            Â© 2026 US Civic Action. Not affiliated with any state or federal government.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
              <WifiOff className="w-3 h-3" />
              Works Offline
            </div>
            <a
              href="https://github.com/us-civic-action/SAVE_ACT-Verifier"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold transition-all ${state.accessibility.isDarkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <GitBranch className="w-3 h-3" />
              Open Source Project
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
