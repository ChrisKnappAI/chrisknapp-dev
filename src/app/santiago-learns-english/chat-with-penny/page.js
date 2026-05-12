'use client';

import { useState, useEffect, useRef } from 'react';
import PennyBubble    from './_components/PennyBubble.js';
import SantiagoBubble from './_components/SantiagoBubble.js';
import PhotoQuestion  from './_components/PhotoQuestion.js';
import PennyScene, { CORRECT_ANIMS, WRONG_ANIM } from './_components/PennyScene.js';
import { LESSONS }       from './_data/lessons.js';
import { ENCOURAGEMENT } from './_data/encouragement.js';
import VOCAB_PHRASES      from './_data/vocab-phrases.js';
import { pickQuestion }  from './_lib/questionPicker.js';
import { gradeLocal }    from './_lib/localGrader.js';
import { speakLive }     from './_lib/tts.js';

const STORAGE_KEY = 'penny-active-topics';
const COUNT_KEY   = 'penny-correct-count';

const UNLOCKABLE = [
  { id: 'flyaway',   threshold: 5,  icon: '🐦', label: 'Fly Away'   },
  { id: 'layegg',    threshold: 10, icon: '🥚', label: 'Lay Egg'    },
  { id: 'holdhands', threshold: 15, icon: '💕', label: 'Hold Hands' },
];

const TOPIC_GROUPS = LESSONS.reduce((acc, l) => {
  if (!acc[l.group]) acc[l.group] = [];
  acc[l.group].push(l);
  return acc;
}, {});

function loadActiveTopics() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return LESSONS.map(l => l.id);
}

// ── Question type classification ──────────────────────────────────────────────
// Type 1: photo-pick  (click one of 6 images)
// Type 2: photo-name  (see one image, type the word)
// Type 3: free-form   (no photo — goes to Claude API)
function getQuestionType(q) {
  if (!q) return 3;
  if (q.hasPhoto && q.photoType === 'pick') return 1;
  if (q.hasPhoto && q.photoType === 'name') return 2;
  return 3;
}

const btnBase = {
  border: '2px solid #1D4ED8', borderRadius: 20, fontFamily: 'inherit',
  fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '6px 16px',
};

export default function ChatWithPenny() {
  const [activeTopics, setActiveTopics]     = useState([]);
  const [currentQuestion, setQuestion]      = useState(null);
  const [pennyText, setPennyText]                   = useState("Hi! I'm Penny! 🐧 Let's practice English!");
  const [pennySpanish, setPennySpanish]             = useState('¡Hola! Soy Penny! ¡Practiquemos inglés!');
  const [pennyResponse, setPennyResponse]           = useState(null);
  const [pennyResponseSpanish, setPennyResponseSpanish] = useState(null);
  const [pennyHint, setPennyHint]                   = useState(null);
  const [pennyHintSpanish, setPennyHintSpanish]     = useState(null);
  const [input, setInput]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [commandAnim, setCommandAnim]       = useState(null);
  const [correctCount, setCorrectCount]     = useState(0);
  const [attemptKey, setAttemptKey]         = useState(0);
  const [unlocked, setUnlocked]             = useState([]);
  const [newUnlock, setNewUnlock]           = useState(null);
  const [voiceEnabled, setVoiceEnabled]     = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedAnim, setSelectedAnim]     = useState('');
  const [unlockedScenes, setUnlockedScenes] = useState([]);
  const [selectedScene, setSelectedScene]   = useState('');

  const lastQuestionId    = useRef(null);
  const questionLoggedRef = useRef(false);

  function triggerAnim(name) {
    setCommandAnim({ name, ts: Date.now() });
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    setActiveTopics(LESSONS.map(l => l.id));
    try { setCorrectCount(parseInt(localStorage.getItem(COUNT_KEY) || '0')); } catch {}
    fetchUnlocks();
    fetchScenes();
  }, []);

  async function fetchUnlocks() {
    try {
      const res  = await fetch('/api/penny/unlocks');
      const data = await res.json();
      const ids  = data.filter(r => r.unlocked).map(r => r.animation_id);
      setUnlocked(ids);
      setSelectedAnim(prev => (ids.includes(prev) ? prev : ids[0] ?? ''));
    } catch {}
  }

  async function fetchScenes() {
    try {
      const res  = await fetch('/api/penny/scenes');
      const data = await res.json();
      const ids  = data.filter(r => r.unlocked).map(r => r.scene_id);
      setUnlockedScenes(ids);
      setSelectedScene(ids.includes('outdoor') ? 'outdoor' : ids[0] ?? 'outdoor');
    } catch {
      setSelectedScene('outdoor');
    }
  }

  useEffect(() => {
    if (activeTopics.length && !currentQuestion) askNextQuestion();
  }, [activeTopics]);

  // ── Question flow ──────────────────────────────────────────────────────────
  function askNextQuestion() {
    questionLoggedRef.current = false;
    const q = pickQuestion(activeTopics, lastQuestionId.current);
    if (!q) return;
    lastQuestionId.current = q.id;
    setQuestion(q);
    setPennyText(q.text);
    setPennySpanish(q.spanish ?? '');
    setPennyResponse(null);
    setPennyResponseSpanish(null);
    setPennyHint(null);
    setPennyHintSpanish(null);
    triggerAnim('wave');
    if (voiceEnabled) setTimeout(() => speakLive(q.text).catch(() => {}), 80);
  }

  // ── Correct answer handler (Types 1 & 2) ──────────────────────────────────
  async function handleCorrect(answer = '') {
    const wasLogged = questionLoggedRef.current;
    questionLoggedRef.current = false;
    const phrase   = ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
    const newCount = correctCount + 1;
    setCorrectCount(newCount);
    localStorage.setItem(COUNT_KEY, String(newCount));

    const justUnlocked = UNLOCKABLE.find(u => u.threshold === newCount && !unlocked.includes(u.id));
    if (justUnlocked) {
      setNewUnlock(justUnlocked);
      await fetch('/api/penny/unlocks', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ animation_id: justUnlocked.id, unlocked: true }),
      });
      fetchUnlocks();
      setTimeout(() => setNewUnlock(null), 4000);
    }

    const nextQ = pickQuestion(activeTopics, lastQuestionId.current);
    if (!nextQ) return;
    lastQuestionId.current = nextQ.id;

    // Build vocab/response line based on question type + answer length
    const qType     = getQuestionType(currentQuestion);
    const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
    let vocabLine   = '';
    let vocabLineEs = '';

    if (qType === 1 || (qType === 2 && wordCount < 5)) {
      const word = currentQuestion.answer;
      if (word) {
        const phrases = VOCAB_PHRASES[word.toLowerCase()];
        if (phrases && phrases.length) {
          const pick = phrases[Math.floor(Math.random() * phrases.length)];
          vocabLine   = pick.en;
          vocabLineEs = pick.es;
        }
      }
    } else if (qType === 2 && wordCount >= 5) {
      try {
        const res  = await fetch('/api/penny/grade', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ question: currentQuestion, answer }),
        });
        const data = await res.json();
        vocabLine   = data.english ?? '';
        vocabLineEs = data.spanish ?? '';
      } catch {}
    }

    // Response section (pink) — encouragement + vocab phrase
    const responseParts   = [phrase.en, vocabLine].filter(Boolean);
    const responsePartsEs = [phrase.es, vocabLineEs].filter(Boolean);

    setPennyResponse(responseParts.join(' '));
    setPennyResponseSpanish(responsePartsEs.join(' '));
    setPennyText('Next question: ' + nextQ.text);
    setPennySpanish('Siguiente pregunta: ' + (nextQ.spanish ?? nextQ.text));
    setPennyHint(null);
    setPennyHintSpanish(null);
    setQuestion(nextQ);
    triggerAnim(CORRECT_ANIMS[Math.floor(Math.random() * CORRECT_ANIMS.length)]);

    // Log only the first attempt — skip if already logged from a wrong answer
    const responseType = (qType === 2 && wordCount >= 5) ? 'ai' : 'static';
    if (!wasLogged) fetch('/api/penny/log', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId:    currentQuestion.id,
        questionText:  currentQuestion.text,
        topic:         currentQuestion.topic,
        topicGroup:    currentQuestion.group,
        questionType:  qType,
        answerGiven:   answer,
        correct:       true,
        gradingMethod: 'static',
        responseGiven: responseParts.join(' '),
        responseType,
      }),
    }).catch(() => {});

    // Speak encouragement + next question, skip placeholders
    const speakText = [...responseParts.filter(p => !p.startsWith('[')), 'Next question:', nextQ.text].join(' ');
    setLoading(false);
    if (voiceEnabled) { await new Promise(r => setTimeout(r, 80)); await speakLive(speakText).catch(() => {}); }
  }

  // ── Type 3 handler: always moves on, Claude grades + responds ─────────────
  async function handleType3Response(answer) {
    questionLoggedRef.current = false;
    const nextQ = pickQuestion(activeTopics, lastQuestionId.current);
    if (!nextQ) return;
    lastQuestionId.current = nextQ.id;

    let responseEn = 'Good try, Santiago!';
    let responseEs = '¡Buen intento, Santiago!';
    let wasCorrect = false;

    try {
      const res  = await fetch('/api/penny/grade', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ question: currentQuestion, answer, activeTopics }),
      });
      const data = await res.json();
      responseEn = data.english ?? responseEn;
      responseEs = data.spanish ?? responseEs;
      wasCorrect = data.correct ?? false;
    } catch {}

    setPennyResponse(responseEn);
    setPennyResponseSpanish(responseEs);
    setPennyText('Next question: ' + nextQ.text);
    setPennySpanish('Siguiente pregunta: ' + (nextQ.spanish ?? nextQ.text));
    setPennyHint(null);
    setPennyHintSpanish(null);
    setQuestion(nextQ);
    triggerAnim(wasCorrect ? CORRECT_ANIMS[Math.floor(Math.random() * CORRECT_ANIMS.length)] : WRONG_ANIM);

    // Log the completed interaction
    fetch('/api/penny/log', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId:    currentQuestion.id,
        questionText:  currentQuestion.text,
        topic:         currentQuestion.topic,
        topicGroup:    currentQuestion.group,
        questionType:  3,
        answerGiven:   answer,
        correct:       wasCorrect,
        gradingMethod: 'ai',
        responseGiven: responseEn,
        responseType:  'ai',
      }),
    }).catch(() => {});

    setLoading(false);
    if (voiceEnabled) { await new Promise(r => setTimeout(r, 80)); await speakLive([responseEn, 'Next question:', nextQ.text].join(' ')).catch(() => {}); }
  }

  // ── Main answer handler ────────────────────────────────────────────────────
  async function handleAnswer() {
    if (!input.trim() || loading) return;
    const answer = input.trim();
    setInput('');
    setLoading(true);

    try {
      const qType = getQuestionType(currentQuestion);

      if (qType === 3) {
        await handleType3Response(answer);
      } else {
        const result = gradeLocal(currentQuestion, answer);
        if (result.correct) {
          await handleCorrect(answer);
        } else {
          const answer  = currentQuestion.answer;
          const lesson  = LESSONS.find(l => l.id === currentQuestion.topic);
          const displayHint   = answer ?? null;
          const displayHintEs = answer ? (lesson?.spanishVocab?.[answer] ?? answer) : null;

          setPennyResponse(null);
          setPennyResponseSpanish(null);
          setPennyText(`Not quite. Try again, Santiago! ${currentQuestion.text}`);
          setPennySpanish(currentQuestion.spanish
            ? `¡No exactamente! ¡Inténtalo de nuevo, Santiago! ${currentQuestion.spanish}`
            : '¡No exactamente! ¡Inténtalo de nuevo, Santiago!');
          setPennyHint(displayHint ? `Hint: ${displayHint}` : null);
          setPennyHintSpanish(displayHintEs ? `Pista: ${displayHintEs}` : null);
          triggerAnim(WRONG_ANIM);

          if (!questionLoggedRef.current) {
            questionLoggedRef.current = true;
            fetch('/api/penny/log', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                questionId:    currentQuestion.id,
                questionText:  currentQuestion.text,
                topic:         currentQuestion.topic,
                topicGroup:    currentQuestion.group,
                questionType:  qType,
                answerGiven:   answer,
                correct:       false,
                gradingMethod: 'static',
                responseGiven: displayHint
                  ? `Not quite. Try again, Santiago! Hint: ${displayHint}`
                  : 'Not quite. Try again, Santiago!',
                responseType:  'static',
              }),
            }).catch(() => {});
          }

          setLoading(false);
          if (voiceEnabled) {
            await new Promise(r => setTimeout(r, 80));
            await speakLive(answer
              ? `Not quite. Try again, Santiago! Hint: ${answer}`
              : 'Not quite. Try again, Santiago!'
            ).catch(() => {});
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function toggleTopic(id) {
    setActiveTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }

  function closeTopicModal() {
    setShowTopicModal(false);
    if (!currentQuestion || !activeTopics.includes(currentQuestion.topic)) askNextQuestion();
  }

  const currentLesson     = currentQuestion ? LESSONS.find(l => l.id === currentQuestion.topic) : null;
  const currentTopicVocab = currentLesson?.vocab ?? [];
  const unlockedItems     = UNLOCKABLE.filter(u => unlocked.includes(u.id));

  return (
    <div style={{
      minHeight: '100vh', background: '#EFF6FF',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: 24, boxSizing: 'border-box',
    }}>

      <div style={{ width: '100%', maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setShowTopicModal(true)}
            style={{ ...btnBase, background: 'white', color: '#1D4ED8' }}
          >
            📚 Topics
          </button>

          {unlockedScenes.length > 1 && (
            <select
              value={selectedScene}
              onChange={e => setSelectedScene(e.target.value)}
              style={{
                border: '2px solid #1D4ED8', borderRadius: 20, padding: '5px 12px',
                fontSize: 13, fontWeight: 700, color: '#1D4ED8', background: 'white',
                fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              {unlockedScenes.map(id => (
                <option key={id} value={id}>
                  {id === 'outdoor'    ? '🌳 Outdoor'    :
                   id === 'beach'      ? '🏖️ Beach'     :
                   id === 'snowy'      ? '❄️ Snowy'      :
                   id === 'city'       ? '🏙️ City'      :
                   id === 'underwater' ? '🐠 Underwater' :
                   id === 'volcano'    ? '🌋 Volcano'    :
                   id === 'arctic'     ? '🧊 Arctic'     : id}
                </option>
              ))}
            </select>
          )}

          <div style={{ flex: 1 }} />

          {unlockedItems.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'stretch', border: '2px solid #1D4ED8', borderRadius: 20, overflow: 'hidden' }}>
              <select
                value={selectedAnim}
                onChange={e => setSelectedAnim(e.target.value)}
                style={{
                  border: 'none', borderRight: '1px solid #1D4ED8',
                  padding: '5px 12px', fontSize: 13, fontWeight: 700,
                  color: '#1D4ED8', background: 'white',
                  fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
                }}
              >
                {unlockedItems.map(u => (
                  <option key={u.id} value={u.id}>{u.icon} {u.label}</option>
                ))}
              </select>
              <button
                onClick={() => selectedAnim && triggerAnim(selectedAnim)}
                style={{
                  border: 'none', background: '#1D4ED8', color: 'white',
                  padding: '5px 14px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Go
              </button>
            </div>
          )}
        </div>

        {/* ── Scene frame ── */}
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '880 / 400',
          borderRadius: 20, border: '5px solid #1D4ED8',
          boxShadow: '0 8px 36px rgba(29,78,216,0.22)',
          overflow: 'visible', background: '#BFDBFE',
        }}>
          <PennyScene commandAnim={commandAnim} isPaused={loading} talking={loading} scene={selectedScene || undefined} />

          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 30 }}>
            <PennyBubble
              english={pennyText} spanish={pennySpanish}
              hint={pennyHint} hintSpanish={pennyHintSpanish}
              response={pennyResponse} responseSpanish={pennyResponseSpanish}
              loading={loading}
            />
          </div>

          <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 30 }}>
            <SantiagoBubble
              value={input}
              onChange={setInput}
              onSubmit={handleAnswer}
              disabled={loading || currentQuestion?.photoType === 'pick'}
            />
          </div>

          {/* Type 2: photo-name — single image, Santiago types the word */}
          {currentQuestion?.hasPhoto && currentQuestion.photoType === 'name' && (
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
              <div style={{ background: 'white', borderRadius: 16, border: '3px solid #1D4ED8', padding: 8 }}>
                <img
                  src={
                    currentLesson?.imageMap?.[currentQuestion.answer]
                    ?? `/santiago-learns-english/chat-with-penny/images/${currentQuestion.topic}/${currentQuestion.answer?.replace(/\s+/g, '-')}.jpg`
                  }
                  alt=""
                  style={{ width: 220, height: 220, objectFit: 'cover', borderRadius: 10, display: 'block' }}
                />
              </div>
            </div>
          )}

          {/* Type 1: photo-pick — 6-image grid, Santiago clicks the right one */}
          {currentQuestion?.hasPhoto && currentQuestion.photoType === 'pick' && (
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
              <PhotoQuestion
                key={currentQuestion.id}
                resetSignal={attemptKey}
                question={currentQuestion}
                topicVocab={currentTopicVocab}
                lesson={currentLesson}
                onCorrect={async () => { await handleCorrect(''); }}
                onWrong={(clickedWord) => {
                  triggerAnim(WRONG_ANIM);
                  const sp = currentLesson?.spanishVocab?.[currentQuestion.answer] ?? currentQuestion.answer;
                  setPennyResponse(null);
                  setPennyResponseSpanish(null);
                  setPennyText(`Not quite! Find the ${currentQuestion.answer}!`);
                  setPennySpanish(`¡No exactamente! ¡Encuentra ${sp}!`);
                  setPennyHint(null);
                  setPennyHintSpanish(null);
                  if (!questionLoggedRef.current) {
                    questionLoggedRef.current = true;
                    fetch('/api/penny/log', {
                      method:  'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        questionId:    currentQuestion.id,
                        questionText:  currentQuestion.text,
                        topic:         currentQuestion.topic,
                        topicGroup:    currentQuestion.group,
                        questionType:  1,
                        answerGiven:   clickedWord ?? '',
                        correct:       false,
                        gradingMethod: 'static',
                        responseGiven: `Not quite! Find the ${currentQuestion.answer}!`,
                        responseType:  'static',
                      }),
                    }).catch(() => {});
                  }
                  // Show red border briefly, then clear selection — same photos stay in same spots
                  setTimeout(() => setAttemptKey(k => k + 1), 800);
                }}
              />
            </div>
          )}
        </div>

        {/* ── Unlock notification ── */}
        {newUnlock && (
          <div style={{
            textAlign: 'center', padding: '10px 20px',
            background: '#FEF3C7', border: '2px solid #F59E0B',
            borderRadius: 14, fontSize: 15, fontWeight: 800, color: '#92400E',
          }}>
            {newUnlock.icon} New animation unlocked: <strong>{newUnlock.label}</strong>!
          </div>
        )}

        {/* ── No topics warning ── */}
        {activeTopics.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '10px 20px',
            background: '#FEE2E2', border: '2px solid #EF4444',
            borderRadius: 14, fontSize: 14, fontWeight: 700, color: '#991B1B',
          }}>
            No topics selected! Open 📚 Topics and pick at least one.
          </div>
        )}

        {/* ── Character labels + voice toggle ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 6%' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#3B82F6' }}>🐧 PENNY</span>
          <button
            onClick={() => setVoiceEnabled(v => !v)}
            style={{
              fontSize: 11, fontWeight: 700, padding: '3px 10px',
              borderRadius: 20, border: '2px solid #D1D5DB',
              background: voiceEnabled ? '#DBEAFE' : '#F3F4F6',
              color: voiceEnabled ? '#1D4ED8' : '#9CA3AF',
              cursor: 'pointer',
            }}
          >
            {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
          </button>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#3B82F6' }}>SANTIAGO ✏️</span>
        </div>
      </div>

      {/* ── Topics Modal ── */}
      {showTopicModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeTopicModal(); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            background: 'white', borderRadius: 20, border: '3px solid #1D4ED8',
            padding: '24px 28px', width: '90%', maxWidth: 720,
            maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 12px 48px rgba(29,78,216,0.18)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1D4ED8' }}>📚 Topics</div>
              <button
                onClick={() => closeTopicModal()}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6B7280', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => setActiveTopics(LESSONS.map(l => l.id))}
                style={{ ...btnBase,
                  background: activeTopics.length === LESSONS.length ? '#1D4ED8' : 'white',
                  color:      activeTopics.length === LESSONS.length ? 'white'   : '#6B7280',
                  borderColor:activeTopics.length === LESSONS.length ? '#1D4ED8' : '#D1D5DB',
                  fontSize: 12, padding: '5px 14px' }}
              >
                Select All
              </button>
              <button
                onClick={() => setActiveTopics([])}
                style={{ ...btnBase,
                  background: activeTopics.length === 0 ? '#1D4ED8' : 'white',
                  color:      activeTopics.length === 0 ? 'white'   : '#6B7280',
                  borderColor:activeTopics.length === 0 ? '#1D4ED8' : '#D1D5DB',
                  fontSize: 12, padding: '5px 14px' }}
              >
                Clear All
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 24px' }}>
              {Object.entries(TOPIC_GROUPS).map(([group, lessons]) => (
                <div key={group} style={{ marginBottom: 18 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: '#6B7280',
                    letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8,
                  }}>
                    {group}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px' }}>
                    {lessons.map(lesson => {
                      const on = activeTopics.includes(lesson.id);
                      return (
                        <label key={lesson.id} style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
                          border: `1.5px solid ${on ? '#1D4ED8' : '#E5E7EB'}`,
                          background: on ? '#EFF6FF' : 'white',
                          fontSize: 13, fontWeight: 600,
                          color: on ? '#1D4ED8' : '#6B7280',
                          userSelect: 'none',
                        }}>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggleTopic(lesson.id)}
                            style={{ display: 'none' }}
                          />
                          {lesson.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => closeTopicModal()}
                style={{ ...btnBase, background: '#1D4ED8', color: 'white', fontSize: 14, padding: '8px 24px' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
