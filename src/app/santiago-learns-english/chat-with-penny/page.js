'use client';

/**
 * chat-with-penny/page.js
 *
 * Main page — wires everything together.
 *
 * Flow:
 *   1. Penny asks a question from the active topics
 *   2. Santiago types an answer (or picks a photo)
 *   3. Claude grades the answer → returns english + spanish response
 *   4. Penny speaks the response (Google TTS)
 *   5. Penny asks if Santiago wants to ask her something
 *   6. Repeat
 */

import { useState, useEffect, useRef } from 'react';
import TopicSelector  from './_components/TopicSelector.js';
import PennyBubble    from './_components/PennyBubble.js';
import SantiagoBubble from './_components/SantiagoBubble.js';
import PhotoQuestion  from './_components/PhotoQuestion.js';
import PennyScene, { CORRECT_ANIMS, WRONG_ANIM } from './_components/PennyScene.js';
import { LESSONS }    from './_data/lessons.js';
import { QUESTIONS }  from './_data/questions.js';
import { ENCOURAGEMENT } from './_data/encouragement.js';
import { pickQuestion }  from './_lib/questionPicker.js';
import { gradeAnswer }   from './_lib/grader.js';
import { speakLive, playRandomEncouragement } from './_lib/tts.js';

const STORAGE_KEY   = 'penny-active-topics';
const COUNT_KEY = 'penny-correct-count';

const UNLOCKABLE = [
  { id: 'flyaway',   threshold: 5,  icon: '🐦', label: 'Fly Away'   },
  { id: 'layegg',    threshold: 10, icon: '🥚', label: 'Lay Egg'    },
  { id: 'holdhands', threshold: 15, icon: '💕', label: 'Hold Hands' },
];

function loadActiveTopics() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return LESSONS.map(l => l.id);
}

export default function ChatWithPenny() {
  const [activeTopics, setActiveTopics]   = useState([]);
  const [currentQuestion, setQuestion]    = useState(null);
  const [pennyText, setPennyText]         = useState("Hi! I'm Penny! 🐧 Let's practice English!");
  const [pennySpanish, setPennySpanish]   = useState('¡Hola! Soy Penny! ¡Practiquemos inglés!');
  const [input, setInput]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [phase, setPhase]                 = useState('asking');
  const [commandAnim, setCommandAnim]     = useState(null);
  const [correctCount, setCorrectCount]   = useState(0);
  const [unlocked, setUnlocked]           = useState([]);
  const [newUnlock, setNewUnlock]         = useState(null);
  // phases: 'asking' | 'waiting-answer' | 'grading' | 'offer-question' | 'waiting-question'

  const lastQuestionId = useRef(null);

  function triggerAnim(name) {
    setCommandAnim({ name, ts: Date.now() });
  }

  // Load saved state on mount
  useEffect(() => {
    setActiveTopics(loadActiveTopics());
    try { setCorrectCount(parseInt(localStorage.getItem(COUNT_KEY) || '0')); } catch {}
    fetchUnlocks();
  }, []);

  // Poll for new unlocks every 60 seconds (Natalie may unlock mid-session)
  useEffect(() => {
    const id = setInterval(fetchUnlocks, 60_000);
    return () => clearInterval(id);
  }, []);

  async function fetchUnlocks() {
    try {
      const res  = await fetch('/api/penny/unlocks');
      const data = await res.json();
      setUnlocked(data.filter(r => r.unlocked).map(r => r.animation_id));
    } catch {}
  }

  // Persist topic selections
  useEffect(() => {
    if (activeTopics.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTopics));
    }
  }, [activeTopics]);

  // Ask first question once topics are loaded
  useEffect(() => {
    if (activeTopics.length && !currentQuestion) {
      askNextQuestion();
    }
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
      const activeLabels = LESSONS
        .filter(l => activeTopics.includes(l.id))
        .map(l => l.label);

      const result = await gradeAnswer({ question: currentQuestion, answer, activeTopics: activeLabels });

      setPennyText(result.english);
      setPennySpanish(result.spanish);

      if (result.correct) {
        // Pick a celebrate animation
        triggerAnim(CORRECT_ANIMS[Math.floor(Math.random() * CORRECT_ANIMS.length)]);
        await playRandomEncouragement(ENCOURAGEMENT.length);

        // Track correct count and check for unlocks
        const newCount = correctCount + 1;
        setCorrectCount(newCount);
        localStorage.setItem(COUNT_KEY, newCount);

        const justUnlocked = UNLOCKABLE.find(
          u => u.threshold === newCount && !unlocked.includes(u.id)
        );
        if (justUnlocked) {
          setNewUnlock(justUnlocked);
          setTimeout(() => setNewUnlock(null), 4000);
        }
      } else {
        triggerAnim(WRONG_ANIM);
        await speakLive(result.english);
      }

      // After responding, offer Santiago the chance to ask a question
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
      const activeLabels = LESSONS
        .filter(l => activeTopics.includes(l.id))
        .map(l => l.label);

      const result = await gradeAnswer({
        question: { text: '[Santiago is asking Penny a question]', expects: 'open' },
        answer:   question,
        activeTopics: activeLabels,
      });

      setPennyText(result.english);
      setPennySpanish(result.spanish);
      await speakLive(result.english);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      // Move to next question
      setTimeout(askNextQuestion, 1500);
    }
  }

  function skipToNextQuestion() {
    setInput('');
    askNextQuestion();
  }

  // Get vocab for the current topic (used by PhotoQuestion)
  const currentTopicVocab = currentQuestion
    ? LESSONS.find(l => l.id === currentQuestion.topic)?.vocab ?? []
    : [];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#EFF6FF',
      display: 'flex',
      gap: 20,
      padding: 24,
      boxSizing: 'border-box',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>

      {/* ── Left: Topic Selector ── */}
      <div style={{ paddingTop: 8 }}>
        <TopicSelector
          activeTopics={activeTopics}
          onChange={setActiveTopics}
        />
      </div>

      {/* ── Center: Scene + Chat ── */}
      <div style={{ flex: 1, maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Scene frame */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '880 / 400',
          borderRadius: 20,
          border: '5px solid #1D4ED8',
          boxShadow: '0 8px 36px rgba(29,78,216,0.22)',
          overflow: 'visible',
          background: '#BFDBFE',
        }}>
          <PennyScene commandAnim={commandAnim} isPaused={loading} talking={loading} />

          {/* Penny bubble */}
          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10 }}>
            <PennyBubble
              english={pennyText}
              spanish={pennySpanish}
              loading={loading}
            />
          </div>

          {/* Santiago bubble */}
          <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 10 }}>
            <SantiagoBubble
              value={input}
              onChange={setInput}
              onSubmit={phase === 'offer-question' ? handleSantiagoQuestion : handleAnswer}
              disabled={loading || phase === 'asking' || phase === 'grading'}
            />
          </div>

          {/* Photo question — shown in the scene when hasPhoto is true */}
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

        {/* Unlock notification */}
        {newUnlock && (
          <div style={{
            textAlign: 'center', padding: '10px 20px',
            background: '#FEF3C7', border: '2px solid #F59E0B',
            borderRadius: 14, fontSize: 15, fontWeight: 800, color: '#92400E',
          }}>
            {newUnlock.icon} New animation unlocked: <strong>{newUnlock.label}</strong>!
          </div>
        )}

        {/* Unlocked animation buttons */}
        {unlocked.length > 0 && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {UNLOCKABLE.filter(u => unlocked.includes(u.id)).map(u => (
              <button key={u.id} onClick={() => triggerAnim(u.id)}
                style={{
                  background: 'white', border: '2px solid #1D4ED8', borderRadius: 20,
                  padding: '6px 18px', fontSize: 14, fontWeight: 700, color: '#1D4ED8',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                {u.icon} {u.label}
              </button>
            ))}
          </div>
        )}

        {/* Skip / Next button */}
        {phase === 'offer-question' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={skipToNextQuestion}
              style={{
                background: 'white', color: '#1D4ED8',
                border: '2px solid #1D4ED8', borderRadius: 20,
                padding: '6px 20px', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              ➡ Next Question
            </button>
          </div>
        )}

        {/* Character labels */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '0 6%',
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#3B82F6' }}>🐧 PENNY</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#3B82F6' }}>SANTIAGO ✏️</span>
        </div>

      </div>
    </div>
  );
}
