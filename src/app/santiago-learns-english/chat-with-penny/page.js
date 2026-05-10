'use client';

import { useState, useEffect, useRef } from 'react';
import PennyBubble    from './_components/PennyBubble.js';
import SantiagoBubble from './_components/SantiagoBubble.js';
import PhotoQuestion  from './_components/PhotoQuestion.js';
import PennyScene, { CORRECT_ANIMS, WRONG_ANIM } from './_components/PennyScene.js';
import { LESSONS }    from './_data/lessons.js';
import { ENCOURAGEMENT } from './_data/encouragement.js';
import { pickQuestion }  from './_lib/questionPicker.js';
import { gradeAnswer }   from './_lib/grader.js';
import { speakLive, playRandomEncouragement } from './_lib/tts.js';

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

const btnBase = {
  border: '2px solid #1D4ED8', borderRadius: 20, fontFamily: 'inherit',
  fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '6px 16px',
};

export default function ChatWithPenny() {
  const [activeTopics, setActiveTopics] = useState([]);
  const [currentQuestion, setQuestion]  = useState(null);
  const [pennyText, setPennyText]       = useState("Hi! I'm Penny! 🐧 Let's practice English!");
  const [pennySpanish, setPennySpanish] = useState('¡Hola! Soy Penny! ¡Practiquemos inglés!');
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [phase, setPhase]               = useState('asking');
  const [commandAnim, setCommandAnim]   = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [unlocked, setUnlocked]         = useState([]);
  const [newUnlock, setNewUnlock]       = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedAnim, setSelectedAnim]    = useState('');

  const lastQuestionId = useRef(null);

  function triggerAnim(name) {
    setCommandAnim({ name, ts: Date.now() });
  }

  useEffect(() => {
    setActiveTopics(loadActiveTopics());
    try { setCorrectCount(parseInt(localStorage.getItem(COUNT_KEY) || '0')); } catch {}
    fetchUnlocks();
  }, []);

  useEffect(() => {
    const id = setInterval(fetchUnlocks, 60_000);
    return () => clearInterval(id);
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

  useEffect(() => {
    if (activeTopics.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTopics));
    }
  }, [activeTopics]);

  useEffect(() => {
    if (activeTopics.length && !currentQuestion) askNextQuestion();
  }, [activeTopics]);

  function askNextQuestion() {
    const q = pickQuestion(activeTopics, lastQuestionId.current);
    if (!q) return;
    lastQuestionId.current = q.id;
    setQuestion(q);
    setPennyText(q.text);
    setPennySpanish('');
    triggerAnim('wave');
    setPhase('waiting-answer');
    speakLive(q.text).catch(() => {});
  }

  async function handleAnswer() {
    if (!input.trim() || loading) return;
    const answer = input.trim();
    setInput('');
    setLoading(true);
    setPhase('grading');

    try {
      const activeLabels = LESSONS.filter(l => activeTopics.includes(l.id)).map(l => l.label);
      const result = await gradeAnswer({ question: currentQuestion, answer, activeTopics: activeLabels });

      setPennyText(result.english);
      setPennySpanish(result.spanish);

      if (result.correct) {
        triggerAnim(CORRECT_ANIMS[Math.floor(Math.random() * CORRECT_ANIMS.length)]);
        await playRandomEncouragement(ENCOURAGEMENT.length);

        const newCount = correctCount + 1;
        setCorrectCount(newCount);
        localStorage.setItem(COUNT_KEY, newCount);

        const justUnlocked = UNLOCKABLE.find(u => u.threshold === newCount && !unlocked.includes(u.id));
        if (justUnlocked) {
          setNewUnlock(justUnlocked);
          setTimeout(() => setNewUnlock(null), 4000);
        }
      } else {
        triggerAnim(WRONG_ANIM);
        await speakLive(result.english);
      }

      setPennyText("Do you want to ask me something? 😊");
      setPennySpanish("¿Me quieres preguntar algo?");
      await speakLive("Do you want to ask me something?");
      setPhase('offer-question');

    } catch (err) {
      console.error(err);
      setPennyText("Oops! Something went wrong. Try again!");
      setPhase('waiting-answer');
    } finally {
      setLoading(false);
    }
  }

  async function handleSantiagoQuestion() {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setLoading(true);

    try {
      const activeLabels = LESSONS.filter(l => activeTopics.includes(l.id)).map(l => l.label);
      const result = await gradeAnswer({
        question: { text: '[Santiago is asking Penny a question]', expects: 'open' },
        answer: question,
        activeTopics: activeLabels,
      });
      setPennyText(result.english);
      setPennySpanish(result.spanish);
      await speakLive(result.english);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(askNextQuestion, 1500);
    }
  }

  function skipToNextQuestion() {
    setInput('');
    askNextQuestion();
  }

  function toggleTopic(id) {
    setActiveTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  const currentTopicVocab = currentQuestion
    ? LESSONS.find(l => l.id === currentQuestion.topic)?.vocab ?? []
    : [];

  const unlockedItems = UNLOCKABLE.filter(u => unlocked.includes(u.id));

  return (
    <div style={{
      minHeight: '100vh', background: '#EFF6FF',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: 24, boxSizing: 'border-box',
    }}>

      {/* ── Main column ── */}
      <div style={{ width: '100%', maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Topics button */}
          <button
            onClick={() => setShowTopicModal(true)}
            style={{ ...btnBase, background: 'white', color: '#1D4ED8' }}
          >
            📚 Topics
          </button>

          <div style={{ flex: 1 }} />

          {/* Animation dropdown + Play (only when animations are unlocked) */}
          {unlockedItems.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select
                value={selectedAnim}
                onChange={e => setSelectedAnim(e.target.value)}
                style={{
                  border: '2px solid #1D4ED8', borderRadius: 20, padding: '5px 12px',
                  fontSize: 13, fontWeight: 700, color: '#1D4ED8', background: 'white',
                  fontFamily: 'inherit', cursor: 'pointer', appearance: 'none',
                  paddingRight: 28,
                }}
              >
                {unlockedItems.map(u => (
                  <option key={u.id} value={u.id}>{u.icon} {u.label}</option>
                ))}
              </select>
              <button
                onClick={() => selectedAnim && triggerAnim(selectedAnim)}
                style={{ ...btnBase, background: '#1D4ED8', color: 'white' }}
              >
                ▶ Play
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
          <PennyScene commandAnim={commandAnim} isPaused={loading} talking={loading} />

          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}>
            <PennyBubble english={pennyText} spanish={pennySpanish} loading={loading} />
          </div>

          <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 10 }}>
            <SantiagoBubble
              value={input}
              onChange={setInput}
              onSubmit={phase === 'offer-question' ? handleSantiagoQuestion : handleAnswer}
              disabled={loading || phase === 'asking' || phase === 'grading'}
            />
          </div>

          {currentQuestion?.hasPhoto && phase === 'waiting-answer' && (
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
              <PhotoQuestion
                question={currentQuestion}
                topicVocab={currentTopicVocab}
                onCorrect={() => handleAnswer()}
                onWrong={() => handleAnswer()}
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

        {/* ── Skip / Next button ── */}
        {phase === 'offer-question' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={skipToNextQuestion} style={{ ...btnBase, background: 'white', color: '#1D4ED8' }}>
              ➡ Next Question
            </button>
          </div>
        )}

        {/* ── Character labels ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 6%' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#3B82F6' }}>🐧 PENNY</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#3B82F6' }}>SANTIAGO ✏️</span>
        </div>
      </div>

      {/* ── Topics Modal ── */}
      {showTopicModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowTopicModal(false); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            background: 'white', borderRadius: 20, border: '3px solid #1D4ED8',
            padding: '24px 28px', width: '90%', maxWidth: 480,
            maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 12px 48px rgba(29,78,216,0.18)',
          }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1D4ED8' }}>📚 Topics</div>
              <button
                onClick={() => setShowTopicModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6B7280', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Select All / Clear All */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => setActiveTopics(LESSONS.map(l => l.id))}
                style={{ ...btnBase, background: '#1D4ED8', color: 'white', fontSize: 12, padding: '5px 14px' }}
              >
                Select All
              </button>
              <button
                onClick={() => setActiveTopics([])}
                style={{ ...btnBase, background: 'white', color: '#6B7280', borderColor: '#D1D5DB', fontSize: 12, padding: '5px 14px' }}
              >
                Clear All
              </button>
            </div>

            {/* Topic groups */}
            {Object.entries(TOPIC_GROUPS).map(([group, lessons]) => (
              <div key={group} style={{ marginBottom: 18 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#6B7280',
                  letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8,
                }}>
                  {group}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px' }}>
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

            {/* Done button */}
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowTopicModal(false)}
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
