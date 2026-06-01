/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Settings, 
  Info, 
  Volume2, 
  Check, 
  HelpCircle, 
  ChevronRight, 
  Award, 
  RefreshCw, 
  Play, 
  Gamepad2, 
  Quote, 
  CheckCircle2, 
  Sparkles, 
  X,
  Languages,
  RotateCcw
} from 'lucide-react';

import { 
  ARM_SPANISH_GRAMMAR, 
  POPULAR_VERBS, 
  PRACTICE_QUESTIONS, 
  QuizQuestion 
} from './SpanishData';
import PedroGame3D from './PedroGame3D';

export default function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'trainer' | 'game3d'>('theory');
  
  // Interactive Explorer state (Theory tab)
  const [explorerSubject, setExplorerSubject] = useState<number>(0);
  const [explorerVerb, setExplorerVerb] = useState<number>(0);

  // Trainer state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [trainerMode, setTrainerMode] = useState<'choice' | 'construct'>('choice');
  const [customTranslationInput, setCustomTranslationInput] = useState<string>('');
  const [writingCorrect, setWritingCorrect] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Sound Synth Helper
  const playSoundEffect = (freq: number, type: OscillatorType = 'sine', duration = 0.2) => {
    try {
      const cx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = cx.createOscillator();
      const gain = cx.createGain();
      osc.connect(gain);
      gain.connect(cx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, cx.currentTime);
      gain.gain.setValueAtTime(0.1, cx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, cx.currentTime + duration);
      osc.start();
      osc.stop(cx.currentTime + duration);
    } catch (e) {
      // Ignored if secure audio context is blocked on first load
    }
  };

  // Handle option select
  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    const isCorrect = index === PRACTICE_QUESTIONS[quizIndex].correctIndex;
    if (isCorrect) {
      setScore(s => s + 10);
      playSoundEffect(523.25, 'sine', 0.15); // Success note C5
    } else {
      playSoundEffect(220, 'triangle', 0.25); // Error low note
    }
  };

  // Next Question
  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setCustomTranslationInput('');
    setWritingCorrect(null);
    if (quizIndex + 1 < PRACTICE_QUESTIONS.length) {
      setQuizIndex(q => q + 1);
    } else {
      setShowResults(true);
    }
  };

  // Reset Trainer
  const restartTrainer = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowExplanation(false);
    setCustomTranslationInput('');
    setWritingCorrect(null);
    setShowResults(false);
  };

  // Interactive sentence builder check
  const checkCustomWriting = () => {
    const q = PRACTICE_QUESTIONS[quizIndex];
    const userAns = customTranslationInput.trim().toLowerCase().replace(/\./g, '');
    const correctAns = q.spanish.trim().toLowerCase().replace(/\./g, '');

    const isMatch = userAns === correctAns;
    setWritingCorrect(isMatch);
    setIsAnswered(true);

    if (isMatch) {
      setScore(s => s + 15);
      playSoundEffect(523.25, 'sine', 0.2);
    } else {
      playSoundEffect(220, 'triangle', 0.25);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/60 font-sans text-slate-800 flex flex-col selection:bg-orange-500 selection:text-white pb-6">
      
      {/* Upper Brand Bar */}
      <header className="border-b-4 border-orange-200 bg-white sticky top-0 z-40 px-4 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <div className="flex items-center gap-3">
            {/* Visual sombrerito logo */}
            <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md relative overflow-hidden border-2 border-slate-800">
              <span className="text-xl font-black font-display z-10">P</span>
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight font-display text-slate-800">
                  PEDRO'S <span className="text-orange-500">SPANISH</span>
                </h1>
                <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-mono border border-teal-200 font-bold">
                  Pretérito Perfecto
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Իսպաներենի անցյալ ժամանակաձևի ինտերակտիվ մարզիչ
              </p>
            </div>
          </div>

          {/* Navigation Links / Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="tab_theory"
              onClick={() => setActiveTab('theory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'theory' 
                  ? 'bg-orange-500 text-white border-b-2 border-orange-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Տեսություն</span>
            </button>
            <button
              id="tab_trainer"
              onClick={() => setActiveTab('trainer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'trainer' 
                  ? 'bg-orange-500 text-white border-b-2 border-orange-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Տրենաժոր</span>
            </button>
            <button
              id="tab_game3d"
              onClick={() => {
                setActiveTab('game3d');
                playSoundEffect(440, 'sine', 0.1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'game3d' 
                  ? 'bg-teal-500 text-white border-b-2 border-teal-700 shadow-sm' 
                  : 'text-slate-600 hover:text-white hover:bg-slate-200 font-bold'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              <span>Pedro 3D Խաղ</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-2 text-xs bg-amber-100 border border-amber-200 px-3.5 py-1.5 rounded-full font-bold text-amber-800 shadow-sm">
            <Languages className="w-4 h-4 text-amber-700" />
            <span>Հայերեն ➔ Իսպաներեն</span>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: THEORY / GRAMMAR GENERAL OVERVIEW */}
          {activeTab === 'theory' && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              
              {/* Teacher Pedro Avatar Card */}
              <div className="lg:col-span-1 bg-white border-4 border-slate-800 rounded-[28px] shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
                
                {/* Spanish Sombrero SVG character Pedro */}
                <div className="w-28 h-28 relative mb-4">
                  {/* Sombrero brim */}
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    {/* Shadow */}
                    <ellipse cx="50" cy="80" rx="30" ry="10" fill="#020617" opacity="0.1" />
                    {/* Pedro poncho body */}
                    <path d="M25,80 L75,80 L65,58 L35,58 Z" fill="#dc2626" />
                    <rect x="42" y="58" width="16" height="22" fill="#eab308" />
                    {/* Head */}
                    <circle cx="50" cy="48" r="16" fill="#fdb874" />
                    {/* Sombrero brim line */}
                    <ellipse cx="50" cy="38" rx="28" ry="4" fill="#facc15" />
                    {/* Sombrero crown */}
                    <path d="M35,38 L42,16 L58,16 L65,38 Z" fill="#eab308" />
                    <path d="M42,16 L50,8 L58,16 Z" fill="#dc2626" />
                    {/* Eyes */}
                    <circle cx="44" cy="46" r="2.5" fill="#1e293b" />
                    <circle cx="56" cy="46" r="2.5" fill="#1e293b" />
                    {/* Mustache */}
                    <path d="M36,54 Q50,48 64,54 Q50,56 36,54" fill="#0f172a" />
                  </svg>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-1">Señor Pedro</h3>
                <span className="text-xs text-orange-600 font-bold tracking-wider uppercase mb-4 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">Ձեր Մենթորը</span>
                
                {/* Speech Bubble */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 relative text-left text-slate-700">
                  <Quote className="w-4 h-4 text-orange-500/20 absolute top-2 left-2" />
                  <p className="text-sm text-slate-800 leading-relaxed pl-3 font-medium">
                    ¡Hola! Իսպաներենում <b>Pretérito Perfecto-ն</b> շատ հեշտ անցյալ ժամանակաձև է: 
                    Այն օգտագործվում է, երբ խոսում ենք մի գործողության մասին, որն արդեն կատարվել է, բայց այն ժամանակաշրջանը, որտեղ դա կատարվել է, դեռ չի ավարտվել (օրինակ՝ այսօր, այս շաբաթ):
                  </p>
                  <p className="text-xs text-slate-500 mt-2 pl-3">
                    Բանաձևը պարզ է՝ <span className="text-orange-600 font-bold">haber</span> բայը ներկա ժամանակով + <span className="text-teal-600 font-bold">Participio</span> (դերբայ):
                  </p>
                </div>

                {/* Important Time markers list */}
                <div className="w-full mt-6 bg-orange-50/50 p-4 rounded-2xl border-2 border-orange-100 text-left">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-2.5">Ժամանակային ցուցիչներ (Markers)</span>
                  <div className="grid grid-cols-2 gap-2">
                    {ARM_SPANISH_GRAMMAR.markers.map((item, i) => (
                      <div key={i} className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 flex flex-col shadow-sm">
                        <span className="text-orange-600 font-mono text-sm font-bold">{item.phrase}</span>
                        <span className="text-[11px] text-slate-500 font-semibold">{item.translation}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Core Conjugation Explorer Card */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Interactive Formula Explorer */}
                <div className="bg-white border-4 border-slate-800 rounded-[28px] shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black font-display text-slate-800">Ինտերակտիվ Բանաձևի Կոնստրուկտոր</h3>
                      <p className="text-xs text-slate-500 font-medium">Ընտրիր դերանունը և բայը՝ տեսնելու համար, թե ինչպես է այն կազմվում</p>
                    </div>
                  </div>

                  {/* Picker inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* PRONOUN SELECTOR */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Դերանուն (Subject Pronoun)</label>
                      <select 
                        id="explorer_subject"
                        value={explorerSubject}
                        onChange={(e) => {
                          setExplorerSubject(Number(e.target.value));
                          playSoundEffect(350, 'sine', 0.08);
                        }}
                        className="bg-slate-50 border-2 border-slate-200 text-sm font-bold rounded-xl px-4 py-3 outline-none text-slate-800 focus:border-orange-500 cursor-pointer shadow-sm transition-all"
                      >
                        {ARM_SPANISH_GRAMMAR.haberConjugation.map((sub, idx) => (
                          <option key={idx} value={idx}>
                            {sub.pronoun}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* BASE VERB SELECTOR */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Բայ (Infinitive Verb)</label>
                      <select 
                        id="explorer_verb"
                        value={explorerVerb}
                        onChange={(e) => {
                          setExplorerVerb(Number(e.target.value));
                          playSoundEffect(380, 'sine', 0.08);
                        }}
                        className="bg-slate-50 border-2 border-slate-200 text-sm font-bold rounded-xl px-4 py-3 outline-none text-slate-800 focus:border-orange-500 cursor-pointer shadow-sm transition-all"
                      >
                        {POPULAR_VERBS.map((v, idx) => (
                          <option key={idx} value={idx}>
                            {v.verb} ({v.translation}) {v.isIrregular ? '⚠️ անկանոն' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* The visual math equation representation */}
                  <div className="bg-amber-50/40 border-2 border-amber-200 rounded-2xl p-5 mb-6">
                    <div className="flex flex-wrap items-center justify-center gap-3 text-center sm:text-left">
                      
                      {/* Part 1: Pronoun */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Դերանուն</span>
                        <div className="bg-white border-2 border-slate-300 font-mono font-bold px-4 py-2.5 rounded-xl text-slate-700 shadow-sm">
                          {ARM_SPANISH_GRAMMAR.haberConjugation[explorerSubject].pronoun.split(' ')[0]}
                        </div>
                      </div>

                      <div className="text-2xl font-black text-slate-400">+</div>

                      {/* Part 2: Auxiliary haber form */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-orange-600 mb-1">Haber-ի ձևը</span>
                        <div className="bg-orange-100 border-2 border-orange-300 text-orange-850 font-mono font-bold px-4 py-2.5 rounded-xl text-lg shadow-sm">
                          {ARM_SPANISH_GRAMMAR.haberConjugation[explorerSubject].form}
                        </div>
                      </div>

                      <div className="text-2xl font-black text-slate-400">+</div>

                      {/* Part 3: Past Participle */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-teal-600 mb-1">Participio</span>
                        <div className="bg-teal-100 border-2 border-teal-300 text-teal-850 font-mono font-bold px-4 py-2.5 rounded-xl text-lg shadow-sm">
                          {POPULAR_VERBS[explorerVerb].participle}
                        </div>
                      </div>

                      <div className="text-2xl font-black text-slate-400">=</div>

                      {/* Final Conjugated Compound Phrase */}
                      <div className="flex flex-col items-center w-full sm:w-auto sm:ml-4 bg-emerald-50 border-2 border-emerald-200 px-5 py-3 rounded-xl shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Կազմված նախադասությունը</span>
                        <span className="text-lg font-black font-display text-emerald-800">
                          {ARM_SPANISH_GRAMMAR.haberConjugation[explorerSubject].pronoun.split(' ')[0]} {ARM_SPANISH_GRAMMAR.haberConjugation[explorerSubject].form} {POPULAR_VERBS[explorerVerb].participle}
                        </span>
                        <span className="text-xs text-slate-500 mt-1 italic font-semibold">
                          ({ARM_SPANISH_GRAMMAR.haberConjugation[explorerSubject].pronoun.match(/\(([^)]+)\)/)?.[1] || 'ես'} {POPULAR_VERBS[explorerVerb].translation} {explorerSubject === 0 ? 'եմ' : explorerSubject === 1 ? 'ես' : explorerSubject === 2 ? 'է' : explorerSubject === 3 ? 'ենք' : explorerSubject === 4 ? 'եք' : 'են'})
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Conjugation notes */}
                  <div className="text-xs text-slate-600 space-y-1 bg-blue-50/80 p-4 rounded-2xl border-2 border-blue-100 leading-relaxed font-semibold">
                    <p className="font-extrabold text-blue-800 mb-1">💡 Կարևոր է իմանալ՝</p>
                    <p>• Օժանդակ բայը (<span className="text-orange-600 font-bold">he, has, ha...</span>) և անցյալ դերբայը (<span className="text-teal-600 font-bold">participio</span>) <b>ԵՐԲԵՔ չեն բաժանվում</b> ոչ մի այլ բառով:</p>
                    <p>• Ի տարբերություն ֆրանսերենի կամ իտալերենի, իսպաներենում դերբայի վերջավորությունը <b>չի փոխվում</b> ըստ սեռի կամ թվի: Այն միշտ ավարտվում է <b>-o</b>-ով:</p>
                  </div>
                </div>

                {/* Sub table details: Regular Participles & Haber forms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Participle building rules */}
                  <div className="bg-white border-4 border-slate-800 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] p-5">
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-3 block">Կանոնավոր Դերբայներ</h4>
                    <div className="space-y-2.5">
                      {ARM_SPANISH_GRAMMAR.participleRules.map((rule, idx) => (
                        <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{rule.group}</span>
                            <span className="text-[11px] text-slate-500 font-semibold">{rule.endings}</span>
                          </div>
                          <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
                            {rule.example}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Irregular participles spotlight */}
                  <div className="bg-white border-4 border-slate-800 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] p-5">
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-3 block">Անկանոն Դերբայներ (⚠️ Կարևոր)</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                      {ARM_SPANISH_GRAMMAR.irregularParticiples.map((irr, idx) => (
                        <div key={idx} className="bg-orange-50/50 p-2 rounded-xl border border-orange-100 flex flex-col items-center text-center shadow-sm">
                          <span className="text-xs text-slate-500 italic font-bold">{irr.infinitive} ({irr.translation})</span>
                          <span className="text-sm font-black font-mono text-orange-600 mt-1">{irr.participle}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Switch to exercises prompt callout banner */}
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-4 border-slate-800 rounded-[28px] shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-orange-600 uppercase font-mono tracking-wider">Պատրա՞ստ ես փորձել</span>
                    <h4 className="text-lg font-black text-slate-800 mt-1">Անցնե՞նք գործնական մարզումներին</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5 animate-pulse">Ստուգիր քո նոր գիտելիքները 10 ինտերակտիվ թեստային առաջադրանքներով</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('trainer')}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 border-b-4 border-orange-700 text-white font-black rounded-2xl shadow-md cursor-pointer transition-all hover:translate-y-[2px] hover:border-b-2 shrink-0 text-sm"
                  >
                    Սկսել Տրենաժորը <ChevronRight className="w-5 h-5 stroke-[3px]" />
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 2: INTERACTIVE PRACTICE TRAINER */}
          {activeTab === 'trainer' && (
            <motion.div
              key="trainer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-3xl mx-auto"
            >
              
              {showResults ? (
                /* QUIZ COMPLETED RESULTS SCREEN */
                <div className="bg-white border-4 border-slate-800 rounded-[28px] shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 border-2 border-amber-300 flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
                    <Award className="w-9 h-9 stroke-[2]" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2 font-display">
                    Մարզումն Ավարտվեց:
                  </h2>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm font-semibold">
                    Դու հաջողությամբ անցար <b>Pretérito Perfecto</b> ժամանակաձևի բոլոր ինտերակտիվ առաջադրանքները:
                  </p>

                  <div className="mb-8 max-w-md mx-auto grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Միավորներ</span>
                      <span className="text-2xl font-black text-orange-600 font-mono">{score}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Ճիշտ պատասխաններ</span>
                      <span className="text-2xl font-black text-teal-600 font-mono">
                        {Math.round(score / 10)} / {PRACTICE_QUESTIONS.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      id="btn_retry_trainer"
                      onClick={restartTrainer}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-400 border-b-4 border-orange-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-display text-sm shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4 text-white" /> Նորից անցնել
                    </button>
                    <button
                      onClick={() => setActiveTab('game3d')}
                      className="px-6 py-3 bg-teal-500 hover:bg-teal-400 border-b-4 border-teal-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-display text-sm shadow-md"
                    >
                      <Gamepad2 className="w-4 h-4 text-yellow-300 animate-pulse" /> Խաղալ 3D Խաղը
                    </button>
                  </div>
                </div>
              ) : (
                /* ACTIVE QUIZ QUESTION CARD */
                <div className="bg-white border-4 border-slate-800 rounded-[28px] shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] p-6 relative">
                  
                  {/* Upper bar & progress */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-slate-500">
                      ԱՌԱՋԱԴՐԱՆՔ <span className="text-orange-600 font-extrabold">{quizIndex + 1}</span> / {PRACTICE_QUESTIONS.length}
                    </span>
                    <div className="flex gap-2">
                      <button
                        id="mode_choice"
                        onClick={() => {
                          setTrainerMode('choice');
                          playSoundEffect(320);
                        }}
                        className={`text-[11px] px-3 py-1.5 font-bold rounded-lg border cursor-pointer transition-all ${
                          trainerMode === 'choice' 
                            ? 'bg-orange-500 text-white border-orange-600' 
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        Բազմակի Ընտրություն
                      </button>
                      <button
                        id="mode_construct"
                        onClick={() => {
                          setTrainerMode('construct');
                          playSoundEffect(340);
                        }}
                        className={`text-[11px] px-3 py-1.5 font-bold rounded-lg border cursor-pointer transition-all ${
                          trainerMode === 'construct' 
                            ? 'bg-orange-500 text-white border-orange-600' 
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        Գրավոր Թարգմանություն
                      </button>
                    </div>
                  </div>

                  {/* Question Title in Armenian */}
                  <div className="bg-orange-50 p-5 rounded-2xl border-2 border-orange-100 mb-6 relative">
                    <div className="absolute top-2 left-2 text-[10px] font-bold text-orange-600 uppercase tracking-wider">Թարգմանիր հայերենից՝</div>
                    <p className="text-lg md:text-xl font-black font-sans text-slate-850 mt-2">
                      «{PRACTICE_QUESTIONS[quizIndex].armenian}»
                    </p>
                  </div>

                  {/* MODE 1: MULTIPLE CHOICE BOX */}
                  {trainerMode === 'choice' && (
                    <div className="space-y-3 mb-6">
                      {PRACTICE_QUESTIONS[quizIndex].options.map((opt, oIdx) => {
                        const isSelected = selectedOption === oIdx;
                        const isCorrectAnswer = oIdx === PRACTICE_QUESTIONS[quizIndex].correctIndex;
                        
                        let btnStyle = "bg-slate-50 border-2 border-slate-250 hover:border-slate-400 hover:bg-slate-100/60 text-slate-800";
                        if (isAnswered) {
                          if (isCorrectAnswer) {
                            btnStyle = "bg-emerald-50 border-4 border-emerald-500 text-emerald-800 shadow-sm font-bold";
                          } else if (isSelected) {
                            btnStyle = "bg-rose-50 border-4 border-rose-500 text-rose-800 shadow-sm font-bold";
                          } else {
                            btnStyle = "bg-slate-50/40 border-2 border-slate-200 text-slate-400 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            id={`option_${oIdx}`}
                            onClick={() => handleOptionSelect(oIdx)}
                            className={`w-full text-left p-4 rounded-2xl border font-mono text-sm tracking-wide transition-all duration-150 relative ${
                              !isAnswered ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'
                            } ${btnStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-white border-2 border-slate-350 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm shrink-0">
                                {oIdx + 1}
                              </span>
                              <span className="font-bold">{opt}</span>
                            </div>

                            {/* Correct / Incorrect visual labels */}
                            {isAnswered && isCorrectAnswer && (
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-emerald-100 border-2 border-emerald-355 px-3 py-1 text-emerald-800 rounded-full font-sans font-bold shadow-sm">
                                Ճիշտ է
                              </span>
                            )}
                            {isAnswered && isSelected && !isCorrectAnswer && (
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-rose-100 border-2 border-rose-355 px-3 py-1 text-rose-800 rounded-full font-sans font-bold shadow-sm animate-pulse">
                                Սխալ է
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* MODE 2: WRITE WRITING FILL-IN-THE-GAP */}
                  {trainerMode === 'construct' && (
                    <div className="bg-orange-50/40 border-2 border-orange-100 p-5 rounded-2xl mb-6 flex flex-col gap-4">
                      <div className="text-xs text-slate-600 leading-relaxed font-semibold">
                        💡 Ինստրուկտաժ՝ Մուտքագրիր ամբողջական նախադասությունը իսպաներենով (վերջակետով կամ առանց)`
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Իսպաներեն պատասխանը</label>
                        <input
                          id="txt_writing_input"
                          type="text"
                          autoComplete="off"
                          disabled={isAnswered}
                          placeholder="Yo he..."
                          value={customTranslationInput}
                          onChange={(e) => setCustomTranslationInput(e.target.value)}
                          className={`bg-white border-2 border-slate-300 text-sm font-bold tracking-wide rounded-2xl px-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500 w-full transition-all shadow-sm ${
                            isAnswered ? 'opacity-70 bg-slate-100' : ''
                          }`}
                        />
                      </div>

                      {/* Display validation outcomes */}
                      {isAnswered && (
                        <div className={`p-4 rounded-2xl border text-sm font-bold leading-relaxed shadow-sm ${
                          writingCorrect 
                            ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-800' 
                            : 'bg-rose-50 border-2 border-rose-300 text-rose-800'
                        }`}>
                          {writingCorrect ? (
                            <span>🎉 Փայլո՛ւն տարբերակ: Ճիշտ է:</span>
                          ) : (
                            <span>
                              ❌ Սխալ: Մուտքագրված է սխալ բաղադրիչ: <br />
                              Ճիշտ տարբերակն է՝ <b className="text-orange-600">"{PRACTICE_QUESTIONS[quizIndex].spanish}"</b>
                            </span>
                          )}
                        </div>
                      )}

                      {!isAnswered && (
                        <button
                          id="btn_check_writing"
                          onClick={checkCustomWriting}
                          disabled={!customTranslationInput.trim()}
                          className="w-full py-3 bg-orange-500 hover:bg-orange-400 border-b-4 border-orange-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all hover:translate-y-[1px] font-display text-sm cursor-pointer shadow-md"
                        >
                          Ստուգել
                        </button>
                      )}
                    </div>
                  )}

                  {/* Explanations & Hints Bubble by Señor Pedro */}
                  <AnimatePresence>
                    {(showExplanation || isAnswered) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 border-2 border-blue-100 p-4 rounded-2xl mb-6 relative text-left"
                      >
                        <div className="flex gap-2.5 items-start">
                          <span className="text-sm font-extrabold text-blue-850">Պեդրոյի հուշումը՝</span>
                          <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                            {PRACTICE_QUESTIONS[quizIndex].hint}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions / Buttons Footer */}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-slate-200">
                    <button
                      id="btn_hint"
                      onClick={() => setShowExplanation(e => !e)}
                      className="text-xs text-slate-500 hover:text-orange-600 flex items-center gap-1.5 transition-all cursor-pointer font-bold"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>{showExplanation ? 'Թաքցնել հուշումը' : 'Ցույց տալ հուշումը'}</span>
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-bold">Միավորներ՝ <b className="text-orange-600 font-black">{score}</b></span>
                      {isAnswered && (
                        <button
                          id="btn_next"
                          onClick={handleNextQuiz}
                          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 border-b-4 border-orange-700 text-white font-black rounded-xl text-xs font-display flex items-center gap-1 cursor-pointer hover:translate-y-[1px] transition-transform shadow-md"
                        >
                          {quizIndex + 1 < PRACTICE_QUESTIONS.length ? 'Հաջորդը ➔' : 'Ավարտել ➔'}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          )}

          {/* TAB 3: PEDRO'S 3D RUNNER/COLLECTING GAME */}
          {activeTab === 'game3d' && (
            <motion.div
              key="game3d"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="h-[600px] w-full"
            >
              <PedroGame3D onBackToMenu={() => setActiveTab('theory')} />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Persistent global responsive statistics / banner */}
      <footer className="mt-12 border-t-2 border-slate-200 bg-white py-6 px-4 text-center text-slate-600 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-400 font-bold">
            © 2026 Señor Pedro's Spanish School. All rights reserved. 
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <span>Մակարդակներ՝ {PRACTICE_QUESTIONS.length}</span>
            <span className="text-slate-300">•</span>
            <span>Մշակված է իսպաներենի խորացված ուսուցման համար</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
