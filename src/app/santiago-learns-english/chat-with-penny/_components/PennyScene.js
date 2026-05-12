'use client';

import { useState, useEffect, useRef } from 'react';

/* ── CSS ────────────────────────────────────────────────────────────────────── */
const css = `
  .penguin-wrap {
    animation: breathe 3.5s ease-in-out infinite;
    transform-origin: bottom center;
    display: inline-block;
    line-height: 0;
  }
  @keyframes breathe {
    0%,100% { transform: scaleY(1) scaleX(1); }
    50%      { transform: scaleY(1.018) scaleX(0.992); }
  }
  #eye-left, #eye-right {
    transform-box: fill-box;
    transform-origin: center;
  }
  .blinking #eye-left,
  .blinking #eye-right {
    animation: blink 0.18s ease-in-out forwards;
  }
  @keyframes blink {
    0%,100% { transform: scaleY(1); }
    45%     { transform: scaleY(0.06); }
  }
  #beak-upper { transform-box: fill-box; transform-origin: center bottom; }
  #beak-lower { transform-box: fill-box; transform-origin: center top; }
  .talking #beak-upper { animation: beak-up 0.13s ease-in-out infinite alternate; }
  .talking #beak-lower { animation: beak-dn 0.13s ease-in-out infinite alternate; }
  @keyframes beak-up { to { transform: translateY(-5px); } }
  @keyframes beak-dn { to { transform: translateY(4px); } }

  #head-group {
    transform-box: fill-box;
    transform-origin: center bottom;
  }
  @keyframes look-around {
    0%   { transform: rotate(0deg);   }
    22%  { transform: rotate(-13deg); }
    52%  { transform: rotate(12deg);  }
    76%  { transform: rotate(-5deg);  }
    100% { transform: rotate(0deg);   }
  }
  .looking #head-group { animation: look-around 3s ease-in-out forwards; }

  #wing-left  { transform-box: fill-box; transform-origin: top right; }
  #wing-right { transform-box: fill-box; transform-origin: top left;  }

  @keyframes wing-wave {
    0%   { transform: rotate(0deg);   }
    10%  { transform: rotate(95deg);  }
    25%  { transform: rotate(75deg);  }
    40%  { transform: rotate(98deg);  }
    55%  { transform: rotate(72deg);  }
    70%  { transform: rotate(95deg);  }
    84%  { transform: rotate(45deg);  }
    100% { transform: rotate(0deg);   }
  }
  .waving #wing-left { animation: wing-wave 4s ease-in-out forwards; }

  @keyframes flap-wings {
    0%,100% { transform: rotate(0deg);   }
    25%     { transform: rotate(-38deg); }
    75%     { transform: rotate(22deg);  }
  }
  .flapping #wing-left  { animation: flap-wings 0.3s ease-in-out 10 forwards; }
  .flapping #wing-right { animation: flap-wings 0.3s ease-in-out 10 reverse forwards; }

  @keyframes happy-bounce {
    0%   { transform: translateY(0);     }
    18%  { transform: translateY(-24px); }
    34%  { transform: translateY(3px);   }
    48%  { transform: translateY(-15px); }
    60%  { transform: translateY(0);     }
    72%  { transform: translateY(-8px);  }
    82%  { transform: translateY(0);     }
    100% { transform: translateY(0);     }
  }
  .bouncing { animation: happy-bounce 2.2s ease-in-out forwards; }

  @keyframes shimmy {
    0%,100% { transform: translateX(0);     }
    12%     { transform: translateX(-11px); }
    30%     { transform: translateX(11px);  }
    48%     { transform: translateX(-8px);  }
    65%     { transform: translateX(8px);   }
    80%     { transform: translateX(-4px);  }
    92%     { transform: translateX(3px);   }
  }
  .shimmying { animation: shimmy 2.8s ease-in-out forwards; }

  #sunglasses-group { display: block; }
  @keyframes magic-anim {
    0%   { transform: translate(0,0)    rotate(0deg);  }
    8%   { transform: translate(0,-10px) rotate(-4deg); }
    20%  { transform: translate(6px,-14px) rotate(4deg); }
    36%  { transform: translate(-5px,-10px) rotate(-3deg); }
    52%  { transform: translate(5px,-12px) rotate(3deg); }
    68%  { transform: translate(-4px,-8px) rotate(-2deg); }
    84%  { transform: translate(2px,-6px) rotate(2deg); }
    100% { transform: translate(0,0)    rotate(0deg);  }
  }
  .magicking { animation: magic-anim 8s ease-in-out forwards; }

  @keyframes squat-down {
    0%   { transform: translateY(0)    scaleY(1);    }
    40%  { transform: translateY(10px) scaleY(0.88); }
    65%  { transform: translateY(12px) scaleY(0.86); }
    100% { transform: translateY(0)    scaleY(1);    }
  }
  .squatting { animation: squat-down 1.0s ease-in-out forwards; transform-origin: bottom center; }

  @keyframes egg-pop {
    0%   { transform: scale(0);    opacity: 0; }
    70%  { transform: scale(1.12); opacity: 1; }
    100% { transform: scale(1);    opacity: 1; }
  }
  .egg-appear { animation: egg-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards; transform-origin: bottom center; }

  @keyframes egg-wobble-anim {
    0%,100% { transform: rotate(0deg);  }
    30%     { transform: rotate(-7deg); }
    70%     { transform: rotate(7deg);  }
  }
  .egg-wobble { animation: egg-wobble-anim 0.5s ease-in-out 6 forwards; transform-origin: bottom center; }

  @keyframes egg-shake-anim {
    0%,100% { transform: rotate(0deg) translateX(0);     }
    30%     { transform: rotate(-13deg) translateX(-4px); }
    70%     { transform: rotate(13deg)  translateX(4px);  }
  }
  .egg-shake { animation: egg-shake-anim 0.18s ease-in-out infinite; transform-origin: bottom center; }

  @keyframes egg-disappear {
    0%   { transform: scale(1);                    opacity: 1; }
    100% { transform: scale(0.2) translateY(20px); opacity: 0; }
  }
  .egg-gone { animation: egg-disappear 0.35s ease-in forwards; transform-origin: bottom center; }

  @keyframes penny-egg-right {
    0%   { transform: translateX(0);    }
    22%  { transform: translateX(18px) rotate(-4deg); }
    44%  { transform: translateX(40px) rotate(4deg);  }
    66%  { transform: translateX(56px) rotate(-3deg); }
    84%  { transform: translateX(63px) rotate(2deg);  }
    100% { transform: translateX(65px) rotate(0deg);  }
  }
  .penny-egg-right { animation: penny-egg-right 0.9s ease-in-out forwards; transform-origin: bottom center; }

  @keyframes penny-egg-return {
    0%   { transform: translateX(65px) rotate(0deg);  }
    18%  { transform: translateX(50px) rotate(4deg);  }
    36%  { transform: translateX(34px) rotate(-4deg); }
    54%  { transform: translateX(18px) rotate(3deg);  }
    72%  { transform: translateX(7px)  rotate(-2deg); }
    88%  { transform: translateX(2px)  rotate(1deg);  }
    100% { transform: translateX(0)    rotate(0deg);  }
  }
  .penny-egg-return { animation: penny-egg-return 3.5s ease-in-out forwards; transform-origin: bottom center; }

  @keyframes baby-hatch-and-go {
    0%   { transform: scale(0) translateY(20px) translateX(0);    opacity: 0; }
    9%   { transform: scale(1.1) translateY(-5px) translateX(0);  opacity: 1; }
    14%  { transform: scale(1) translateY(0) translateX(0);        opacity: 1; }
    22%  { transform: translateX(0)    rotate(0deg);  }
    35%  { transform: translateX(-30px) rotate(-5deg); }
    48%  { transform: translateX(-65px) rotate(5deg);  }
    62%  { transform: translateX(-105px) rotate(-5deg); }
    74%  { transform: translateX(-142px) rotate(4deg);  opacity: 1; }
    88%  { transform: translateX(-184px) rotate(-4deg); opacity: 0.6; }
    100% { transform: translateX(-225px) rotate(3deg);  opacity: 0; }
  }
  .baby-hatch-and-go { animation: baby-hatch-and-go 3.5s ease-in-out forwards; transform-origin: bottom center; }

  @keyframes fly-away-anim {
    0%   { transform: translate(0, 0)          rotate(0deg);   }
    8%   { transform: translate(30px, -55px)   rotate(-10deg); }
    20%  { transform: translate(100px, -180px) rotate(-16deg); }
    38%  { transform: translate(255px, -440px) rotate(-22deg); opacity: 1; }
    40%  { transform: translate(268px, -470px) rotate(-25deg); opacity: 0; }
    41%  { transform: translate(860px, 0)      rotate(0deg);   opacity: 0; }
    45%  { transform: translate(860px, 0)      rotate(0deg);   opacity: 1; }
    52%  { transform: translate(710px, 0)      rotate(-12deg); }
    58%  { transform: translate(565px, 0)      rotate(12deg);  }
    64%  { transform: translate(430px, 0)      rotate(-12deg); }
    70%  { transform: translate(305px, 0)      rotate(11deg);  }
    76%  { transform: translate(196px, 0)      rotate(-10deg); }
    82%  { transform: translate(108px, 0)      rotate(9deg);   }
    88%  { transform: translate(44px, 0)       rotate(-7deg);  }
    94%  { transform: translate(11px, 0)       rotate(4deg);   }
    100% { transform: translate(0, 0)          rotate(0deg);   }
  }
  .flyingaway {
    animation: fly-away-anim 10s linear forwards;
    transform-origin: bottom center;
  }
  .flyingaway #wing-left  { animation: flap-wings 0.25s ease-in-out 16 forwards; }
  .flyingaway #wing-right { animation: flap-wings 0.25s ease-in-out 16 reverse forwards; }

  #foot-right { transform-box: fill-box; transform-origin: top right; }
  @keyframes kick-foot {
    0%   { transform: rotate(0deg);   }
    18%  { transform: rotate(85deg);  }
    40%  { transform: rotate(155deg); }
    56%  { transform: rotate(35deg);  }
    68%  { transform: rotate(0deg);   }
    100% { transform: rotate(0deg);   }
  }
  .kicking .penguin-svg #foot-right { animation: kick-foot 7s linear forwards; }
  @keyframes kick-anim {
    0%   { transform: translate(0, 0)         rotate(0deg);   }
    10%  { transform: translate(-8px, 0)      rotate(-10deg); }
    35%  { transform: translate(68px, -58px)  rotate(10deg);  }
    46%  { transform: translate(85px, -65px)  rotate(13deg);  }
    56%  { transform: translate(66px, 5px)    rotate(4deg);   }
    61%  { transform: translate(58px, 0)      rotate(0deg);   }
    68%  { transform: translate(46px, 0)      rotate(-11deg); }
    74%  { transform: translate(31px, 0)      rotate(11deg);  }
    80%  { transform: translate(18px, 0)      rotate(-9deg);  }
    86%  { transform: translate(9px, 0)       rotate(8deg);   }
    92%  { transform: translate(3px, 0)       rotate(-4deg);  }
    97%  { transform: translate(1px, 0)       rotate(2deg);   }
    100% { transform: translate(0, 0)         rotate(0deg);   }
  }
  .kicking { animation: kick-anim 7s linear forwards; transform-origin: bottom center; }

  @keyframes sleep-anim {
    0%   { transform: translate(0,0)    rotate(0deg);   }
    10%  { transform: translate(0,0)    rotate(-5deg);  }
    18%  { transform: translate(0,0)    rotate(3deg);   }
    26%  { transform: translate(0,0)    rotate(-7deg);  }
    36%  { transform: translate(6px,0)  rotate(62deg);  }
    46%  { transform: translate(10px,0) rotate(76deg);  }
    66%  { transform: translate(10px,0) rotate(76deg);  }
    75%  { transform: translate(4px,0)  rotate(18deg);  }
    83%  { transform: translate(-3px,0) rotate(-10deg); }
    91%  { transform: translate(1px,0)  rotate(4deg);   }
    100% { transform: translate(0,0)    rotate(0deg);   }
  }
  .sleeping { animation: sleep-anim 7s ease-in-out forwards; transform-origin: bottom center; }
  @keyframes head-nod {
    0%   { transform: rotate(0deg);  }
    10%  { transform: rotate(18deg); }
    18%  { transform: rotate(-6deg); }
    26%  { transform: rotate(24deg); }
    36%  { transform: rotate(0deg);  }
    100% { transform: rotate(0deg);  }
  }
  .sleeping .penguin-svg #head-group { animation: head-nod 7s ease-in-out forwards; }
  @keyframes z-float {
    0%   { transform: translateY(0)     translateX(0);    opacity: 0; }
    8%   { opacity: 0.9; }
    100% { transform: translateY(-85px) translateX(16px); opacity: 0; }
  }
  .z-letter {
    position: absolute; font-size: 22px; font-weight: 900; color: #7C3AED;
    pointer-events: none; user-select: none;
    animation: z-float 2.2s ease-in infinite;
  }

  @keyframes backflip-anim {
    0%   { transform: translate(0,0)          rotate(0deg);    }
    8%   { transform: translate(-5px,-30px)   rotate(-45deg);  }
    22%  { transform: translate(-16px,-82px)  rotate(-140deg); }
    38%  { transform: translate(-24px,-96px)  rotate(-240deg); }
    52%  { transform: translate(-28px,-58px)  rotate(-315deg); }
    63%  { transform: translate(-26px,-12px)  rotate(-360deg); }
    73%  { transform: translate(-18px,4px)    rotate(-360deg); }
    83%  { transform: translate(-9px,0)       rotate(-360deg); }
    92%  { transform: translate(-2px,0)       rotate(-360deg); }
    100% { transform: translate(0,0)          rotate(-360deg); }
  }
  .backflipping { animation: backflip-anim 3.5s linear forwards; transform-origin: center center; }

  #pp-wing-left  { transform-box: fill-box; transform-origin: top right; }
  #pp-wing-right { transform-box: fill-box; transform-origin: top left;  }
  @keyframes pinkpenny-walk {
    0%   { transform: translate(640px,0) rotate(0deg);   }
    4%   { transform: translate(548px,0) rotate(10deg);  }
    8%   { transform: translate(452px,0) rotate(-10deg); }
    12%  { transform: translate(352px,0) rotate(10deg);  }
    17%  { transform: translate(240px,0) rotate(-9deg);  }
    21%  { transform: translate(140px,0) rotate(8deg);   }
    25%  { transform: translate(52px,0)  rotate(-5deg);  }
    27%  { transform: translate(10px,0)  rotate(2deg);   }
    28%  { transform: translate(0,0)     rotate(0deg);   }
    72%  { transform: translate(0,0)     rotate(0deg);   }
    76%  { transform: translate(55px,0)  rotate(10deg);  }
    81%  { transform: translate(134px,0) rotate(-10deg); }
    86%  { transform: translate(222px,0) rotate(10deg);  }
    91%  { transform: translate(318px,0) rotate(-9deg);  }
    96%  { transform: translate(408px,0) rotate(8deg);   }
    100% { transform: translate(480px,0) rotate(-7deg);  }
  }
  .holdingpenny { animation: pinkpenny-walk 14s linear forwards; }
  @keyframes penny-hold-wing {
    0%,27%  { transform: rotate(0deg);   }
    35%     { transform: rotate(-45deg); }
    72%     { transform: rotate(-45deg); }
    80%     { transform: rotate(0deg);   }
    100%    { transform: rotate(0deg);   }
  }
  .holding .penguin-svg #wing-right { animation: penny-hold-wing 14s linear forwards; }
  @keyframes pp-hold-left-wing {
    0%,27%  { transform: rotate(0deg);  }
    35%     { transform: rotate(75deg); }
    72%     { transform: rotate(75deg); }
    80%     { transform: rotate(0deg);  }
    100%    { transform: rotate(0deg);  }
  }
  .holdingpenny #pp-wing-left { animation: pp-hold-left-wing 14s linear forwards; }
  @keyframes heart-float {
    0%   { transform: translateY(0)     translateX(0);    opacity: 0; }
    8%   { opacity: 0.92; }
    100% { transform: translateY(-88px) translateX(10px); opacity: 0; }
  }
  .heart-floater {
    position: absolute; font-size: 18px; pointer-events: none; user-select: none;
    animation: heart-float 2.5s ease-in infinite;
  }

  @keyframes bird-fly {
    0%   { transform: translateX(0);       }
    100% { transform: translateX(-1000px); }
  }
  .bird   { animation: bird-fly 14s linear infinite; }
  .bird-2 { animation: bird-fly 10s linear infinite; animation-delay: -4s; }
  .bird-3 { animation: bird-fly 18s linear infinite; animation-delay: -9s; }

  @keyframes wave-slide {
    0%   { transform: translateX(0);      }
    100% { transform: translateX(-880px); }
  }
  .wave-anim   { animation: wave-slide 10.5s linear infinite; }
  .wave-anim-2 { animation: wave-slide 15s   linear infinite; animation-delay: -5.4s; }

  @keyframes snow-drop {
    0%   { transform: translateY(-30px) translateX(0);    opacity: 0; }
    10%  { opacity: 0.9; }
    85%  { opacity: 0.8; }
    100% { transform: translateY(430px) translateX(28px); opacity: 0; }
  }
  .flake { animation-name: snow-drop; animation-timing-function: linear; animation-iteration-count: infinite; }

  @keyframes snowman-wink {
    0%, 78%, 100% { transform: scaleY(1);    }
    85%           { transform: scaleY(0.05); }
  }
  #sm-eye-r { transform-box: fill-box; transform-origin: center; animation: snowman-wink 5s ease-in-out infinite; }

  @keyframes person-stroll {
    0%   { transform: translateX(960px);  }
    100% { transform: translateX(-140px); }
  }
  .city-person   { animation: person-stroll 18s linear infinite; }
  .city-person-2 { animation: person-stroll 26s linear infinite; animation-delay: -12s; }

  @keyframes fish-swim {
    0%   { transform: translateX(960px); }
    100% { transform: translateX(-80px); }
  }
  .fish-1 { animation: fish-swim 14s linear infinite; }
  .fish-2 { animation: fish-swim 21s linear infinite; animation-delay: -8s;  }
  .fish-3 { animation: fish-swim 11s linear infinite; animation-delay: -3s;  }
  .fish-4 { animation: fish-swim 17s linear infinite; animation-delay: -13s; }
`;

/* ── Scenes ─────────────────────────────────────────────────────────────────── */

function OutdoorScene() {
  return (
    <svg viewBox="0 0 880 400" preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="od-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1565C0"/>
          <stop offset="55%"  stopColor="#42A5F5"/>
          <stop offset="100%" stopColor="#BBDEFB"/>
        </linearGradient>
      </defs>
      <rect width="880" height="400" fill="url(#od-sky)"/>
      <g className="bird" style={{ willChange:'transform' }}>
        <path d="M876,88 Q884,81 892,88 Q900,81 908,88" fill="none" stroke="#0D3A7A" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <g className="bird-2" style={{ willChange:'transform' }}>
        <path d="M896,118 Q903,112 910,118 Q917,112 924,118" fill="none" stroke="#0D3A7A" strokeWidth="2" strokeLinecap="round"/>
      </g>
      <g className="bird-3" style={{ willChange:'transform' }}>
        <path d="M910,100 Q916,94 922,100 Q928,94 934,100" fill="none" stroke="#0D3A7A" strokeWidth="1.8" strokeLinecap="round"/>
      </g>
      <path d="M0,262 Q80,215 190,240 Q310,268 440,212 Q565,158 690,222 Q790,265 880,232 L880,400 L0,400Z" fill="#81C784"/>
      <rect x="28" y="240" width="11" height="50" rx="2" fill="#5D4037"/>
      <ellipse cx="34" cy="226" rx="22" ry="28" fill="#2E7D32"/>
      <rect x="842" y="245" width="11" height="45" rx="2" fill="#5D4037"/>
      <ellipse cx="848" cy="232" rx="20" ry="25" fill="#388E3C"/>
      <ellipse cx="440" cy="340" rx="340" ry="80" fill="#66BB6A"/>
      <path d="M0,330 Q220,310 440,330 Q660,350 880,330 L880,400 L0,400Z" fill="#4CAF50"/>
      <ellipse cx="200" cy="180" rx="62" ry="62" fill="#FFF176" opacity="0.92"/>
      <ellipse cx="200" cy="180" rx="50" ry="50" fill="#FFD740"/>
    </svg>
  );
}

function BeachScene() {
  const wv1 = 'M0,242 Q55,230 110,242 Q165,254 220,242 Q275,230 330,242 Q385,254 440,242 Q495,230 550,242 Q605,254 660,242 Q715,230 770,242 Q825,254 880,242 Q935,230 990,242 Q1045,254 1100,242 Q1155,230 1210,242 Q1265,254 1320,242 Q1375,230 1430,242 Q1485,254 1540,242 Q1595,230 1650,242 Q1705,254 1760,242';
  const wv2 = 'M0,260 Q55,250 110,260 Q165,270 220,260 Q275,250 330,260 Q385,270 440,260 Q495,250 550,260 Q605,270 660,260 Q715,250 770,260 Q825,270 880,260 Q935,250 990,260 Q1045,270 1100,260 Q1155,250 1210,260 Q1265,270 1320,260 Q1375,250 1430,260 Q1485,270 1540,260 Q1595,250 1650,260 Q1705,270 1760,260';
  return (
    <svg viewBox="0 0 880 400" preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="bch-sky"  x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0277BD"/>
          <stop offset="50%"  stopColor="#29B6F6"/>
          <stop offset="100%" stopColor="#B3E5FC"/>
        </linearGradient>
        <linearGradient id="bch-sea"  x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0288D1"/>
          <stop offset="100%" stopColor="#01579B"/>
        </linearGradient>
        <linearGradient id="bch-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FFF176"/>
          <stop offset="100%" stopColor="#F9A825"/>
        </linearGradient>
      </defs>
      <rect width="880" height="400" fill="url(#bch-sky)"/>
      <rect y="232" width="880" height="168" fill="url(#bch-sea)"/>
      <g className="wave-anim" style={{ willChange:'transform' }}>
        <path d={wv1} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="4" strokeLinecap="round"/>
      </g>
      <g className="wave-anim-2" style={{ willChange:'transform' }}>
        <path d={wv2} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round"/>
      </g>
      <path d="M0,348 Q220,338 440,348 Q660,358 880,348 L880,400 L0,400Z" fill="url(#bch-sand)"/>
      <path d="M0,350 Q110,344 220,350 Q330,356 440,350 Q550,344 660,350 Q770,356 880,350" fill="rgba(255,255,255,0.55)"/>
      <g className="fish-1" opacity="0.88" style={{ willChange:'transform' }}>
        <ellipse cx="0" cy="292" rx="12" ry="7" fill="#FFB74D"/>
        <polygon points="12,286 22,292 12,298" fill="#FF8A65"/>
        <circle cx="-6" cy="290" r="2.5" fill="white"/>
        <circle cx="-6.5" cy="290" r="1.2" fill="#1a1a2e"/>
      </g>
      <g className="fish-2" opacity="0.82" style={{ willChange:'transform' }}>
        <ellipse cx="0" cy="316" rx="10" ry="6" fill="#4DD0E1"/>
        <polygon points="10,310 19,316 10,322" fill="#26C6DA"/>
        <circle cx="-5" cy="314" r="2" fill="white"/>
        <circle cx="-5.5" cy="314" r="1" fill="#1a1a2e"/>
      </g>
      <g className="fish-3" opacity="0.80" style={{ willChange:'transform' }}>
        <ellipse cx="0" cy="280" rx="9" ry="5" fill="#FFF176"/>
        <polygon points="9,275 17,280 9,285" fill="#F9A825"/>
        <circle cx="-4" cy="278" r="1.8" fill="white"/>
      </g>
      <g className="fish-4" opacity="0.74" style={{ willChange:'transform' }}>
        <ellipse cx="0" cy="334" rx="11" ry="6.5" fill="#F48FB1"/>
        <polygon points="11,328 20,334 11,340" fill="#F06292"/>
        <circle cx="-5" cy="332" r="2.2" fill="white"/>
      </g>
      <ellipse cx="356" cy="366" rx="9" ry="5" fill="#F4C06A" stroke="#C8860A" strokeWidth="1.5" transform="rotate(-20 356 366)"/>
      <ellipse cx="710" cy="370" rx="7" ry="4" fill="#FFCC80" stroke="#C8860A" strokeWidth="1.5" transform="rotate(15 710 370)"/>
    </svg>
  );
}

function ClassroomScene() {
  return (
    <svg viewBox="0 0 880 400" preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="cls-wall"  x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FFF9E6"/><stop offset="100%" stopColor="#FFF176"/>
        </linearGradient>
        <linearGradient id="cls-board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2E7D32"/><stop offset="100%" stopColor="#1B5E20"/>
        </linearGradient>
        <linearGradient id="cls-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#BCAAA4"/><stop offset="100%" stopColor="#8D6E63"/>
        </linearGradient>
      </defs>
      <rect width="880" height="400" fill="url(#cls-wall)"/>
      <rect x="225" y="78" width="430" height="205" rx="8" fill="url(#cls-board)" stroke="#4E342E" strokeWidth="8"/>
      <rect x="225" y="275" width="430" height="14" rx="4" fill="#4E342E"/>
      <text x="440" y="148" textAnchor="middle" fill="white" fontSize="34" fontWeight="900" fontFamily="Arial" opacity="0.92">Hello! / ¡Hola!</text>
      <line x1="270" y1="170" x2="610" y2="170" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
      <text x="440" y="205" textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="22" fontFamily="Arial">A B C  ·  1 2 3</text>
      <rect y="308" width="880" height="92" fill="url(#cls-floor)"/>
      {[110,220,330,440,550,660,770].map((x,i) => (
        <line key={i} x1={x} y1="308" x2={x} y2="400" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
      ))}
      <rect x="308" y="280" width="264" height="30" rx="4" fill="#795548" stroke="#4E342E" strokeWidth="2"/>
      <rect x="338" y="308" width="10" height="28" rx="3" fill="#5D4037"/>
      <rect x="542" y="308" width="10" height="28" rx="3" fill="#5D4037"/>
      <circle cx="540" cy="277" r="10" fill="#E53935"/>
      <path d="M540,268 Q543,263 547,265" fill="none" stroke="#33691E" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function SnowyScene() {
  const flakes = [
    {cx:75,cy:-12,r:5,dur:'4.2s',delay:'0s'},{cx:195,cy:-22,r:4,dur:'5.1s',delay:'-1.5s'},
    {cx:345,cy:-6,r:6,dur:'3.8s',delay:'-0.8s'},{cx:475,cy:-16,r:3,dur:'4.6s',delay:'-2.3s'},
    {cx:598,cy:-9,r:5,dur:'4.0s',delay:'-1.1s'},{cx:718,cy:-19,r:4,dur:'5.5s',delay:'-3.0s'},
    {cx:818,cy:-11,r:6,dur:'3.5s',delay:'-0.5s'},{cx:148,cy:-26,r:3,dur:'4.8s',delay:'-2.8s'},
    {cx:548,cy:-13,r:4,dur:'4.3s',delay:'-1.7s'},{cx:668,cy:-7,r:5,dur:'5.0s',delay:'-3.5s'},
    {cx:420,cy:-18,r:3,dur:'4.4s',delay:'-0.3s'},{cx:260,cy:-10,r:4,dur:'3.9s',delay:'-2.0s'},
  ];
  return (
    <svg viewBox="0 0 880 400" preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="sn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#78909C"/><stop offset="55%" stopColor="#B0BEC5"/><stop offset="100%" stopColor="#ECEFF1"/>
        </linearGradient>
      </defs>
      <rect width="880" height="400" fill="url(#sn-sky)"/>
      <path d="M0,272 Q105,218 222,248 Q362,282 502,220 Q632,168 762,234 Q832,265 880,240 L880,400 L0,400Z" fill="white"/>
      <path d="M0,318 Q122,290 252,308 Q392,328 532,292 Q662,262 782,298 Q838,315 880,298 L880,400 L0,400Z" fill="white" opacity="0.9"/>
      <rect y="357" width="880" height="43" fill="white"/>
      <polygon points="30,325 65,232 100,325"  fill="#1B5E20"/>
      <polygon points="40,282 65,218 90,282"   fill="#2E7D32"/>
      <polygon points="50,252 65,205 80,252"   fill="#388E3C"/>
      <rect x="60" y="322" width="10" height="22" rx="2" fill="#4E342E"/>
      <polygon points="782,320 820,224 858,320" fill="#1B5E20"/>
      <polygon points="792,278 820,210 848,278" fill="#2E7D32"/>
      <polygon points="802,248 820,192 838,248" fill="#388E3C"/>
      <rect x="815" y="317" width="10" height="22" rx="2" fill="#4E342E"/>
      <circle cx="440" cy="280" r="30" fill="white" stroke="#90A4AE" strokeWidth="2"/>
      <circle cx="440" cy="238" r="23" fill="white" stroke="#90A4AE" strokeWidth="2"/>
      <circle cx="440" cy="203" r="17" fill="white" stroke="#90A4AE" strokeWidth="2"/>
      <circle cx="434" cy="199" r="3" fill="#37474F"/>
      <circle id="sm-eye-r" cx="446" cy="199" r="3" fill="#37474F"/>
      <path d="M434,208 Q440,214 446,208" fill="none" stroke="#37474F" strokeWidth="2" strokeLinecap="round"/>
      <polygon points="440,203 449,205 440,207" fill="#FF7043"/>
      <path d="M422,218 Q440,224 458,218 Q458,228 440,230 Q422,228 422,218Z" fill="#E53935"/>
      <path d="M417,232 Q402,218 386,210" fill="none" stroke="#4E342E" strokeWidth="4" strokeLinecap="round"/>
      <path d="M463,232 Q478,218 494,210" fill="none" stroke="#4E342E" strokeWidth="4" strokeLinecap="round"/>
      {flakes.map((f,i) => (
        <circle key={i} className="flake" cx={f.cx} cy={f.cy} r={f.r}
          fill="white" opacity="0.88"
          style={{ animationDuration:f.dur, animationDelay:f.delay }}/>
      ))}
    </svg>
  );
}

function CityScene() {
  const windows = [
    [108,165],[113,180],[128,165],[128,180],[218,150],[218,165],[228,150],[228,165],[238,150],
    [338,170],[338,185],[353,170],[353,185],[453,180],[463,180],[453,195],[463,195],
    [523,158],[523,173],[533,158],[533,173],[578,172],[588,172],[578,187],[588,187],
    [648,162],[658,162],[648,177],[658,177],[703,188],[713,188],[703,203],
    [763,158],[773,158],[763,173],[823,175],[833,175],[823,190],[833,190],
  ];
  return (
    <svg viewBox="0 0 880 400" preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id="cty-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1A1A2E"/>
          <stop offset="50%"  stopColor="#4A3F6B"/>
          <stop offset="100%" stopColor="#8B5A9A"/>
        </linearGradient>
      </defs>
      <rect width="880" height="400" fill="url(#cty-sky)"/>
      {[40,125,245,385,505,645,765,862,92,305,455,625,802].map((x,i) => (
        <circle key={i} cx={x} cy={18+(i%5)*16} r={i%3===0?1.8:1.1} fill="white" opacity={0.4+(i%4)*0.15}/>
      ))}
      {[
        [0,185,58],[55,202,43],[95,158,68],[160,178,48],[205,142,78],
        [280,192,53],[330,162,63],[390,147,53],[440,172,73],[510,150,58],
        [565,167,78],[640,158,53],[690,182,68],[755,150,58],[812,170,68],
      ].map(([x,y,w],i) => (
        <rect key={i} x={x} y={y} width={w} height={400-y} fill="#0D0D1A" opacity="0.88"/>
      ))}
      {windows.map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="8" height="7" rx="1"
          fill={i%5===0?'#FFD54F':i%3===0?'#E3F2FD':'#FFF9C4'}
          opacity={0.72+(i%4)*0.07}/>
      ))}
      <rect y="342" width="880" height="58" fill="#1C1C1C"/>
      <rect y="338" width="880" height="8" fill="#333"/>
      <g className="city-person" style={{ willChange:'transform' }}>
        <ellipse cx="0" cy="324" rx="9" ry="11" fill="#111"/>
        <rect x="-8" y="334" width="16" height="22" rx="4" fill="#111"/>
        <rect x="-8" y="354" width="6" height="16" rx="3" fill="#111"/>
        <rect x="2"  y="354" width="6" height="16" rx="3" fill="#111"/>
      </g>
      <g className="city-person-2" style={{ willChange:'transform' }}>
        <ellipse cx="0" cy="316" rx="7" ry="9" fill="#0a0a0a" opacity="0.75"/>
        <rect x="-6" y="324" width="12" height="17" rx="3" fill="#0a0a0a" opacity="0.75"/>
        <rect x="-6" y="339" width="4" height="12" rx="2" fill="#0a0a0a" opacity="0.75"/>
        <rect x="2"  y="339" width="4" height="12" rx="2" fill="#0a0a0a" opacity="0.75"/>
      </g>
    </svg>
  );
}

/* ── Characters ─────────────────────────────────────────────────────────────── */

function PenguinSVG({ talking, blinking, looking, waving, flapping }) {
  const cls = ['penguin-svg', talking&&'talking', blinking&&'blinking', looking&&'looking', waving&&'waving', flapping&&'flapping'].filter(Boolean).join(' ');
  return (
    <svg viewBox="0 10 680 720" className={cls}
      style={{ width:210, height:'auto', overflow:'visible', display:'block' }}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pc-bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F472B6"/><stop offset="100%" stopColor="#BE185D"/>
        </linearGradient>
        <linearGradient id="pc-bellyGrad" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#FDF2F8"/><stop offset="100%" stopColor="#FCE7F3"/>
        </linearGradient>
        <linearGradient id="pc-wingL" x1="1" y1="0" x2="0" y2="0.5">
          <stop offset="0%" stopColor="#EC4899"/><stop offset="100%" stopColor="#9D174D"/>
        </linearGradient>
        <linearGradient id="pc-wingR" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#EC4899"/><stop offset="100%" stopColor="#9D174D"/>
        </linearGradient>
        <linearGradient id="pc-beakGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFA726"/><stop offset="100%" stopColor="#E65100"/>
        </linearGradient>
        <linearGradient id="pc-footGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB74D"/><stop offset="100%" stopColor="#D84800"/>
        </linearGradient>
        <linearGradient id="pc-lens" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#2a2a40" stopOpacity="1"/>
          <stop offset="100%" stopColor="#050508" stopOpacity="1"/>
        </linearGradient>
      </defs>
      <path id="foot-left" d="M282,640 C278,648 262,656 246,664 C238,668 234,674 240,678 C248,682 260,678 268,672 C272,682 274,692 282,694 C290,694 294,684 292,672 C298,680 306,686 314,682 C320,678 318,668 310,660 C304,654 296,646 290,638Z" fill="url(#pc-footGrad)"/>
      <path d="M268,656 Q260,666 252,672" fill="none" stroke="#C84B00" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M282,660 Q280,674 280,684" fill="none" stroke="#C84B00" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M294,656 Q302,664 308,672" fill="none" stroke="#C84B00" strokeWidth="1.4" strokeLinecap="round"/>
      <path id="foot-right" d="M398,640 C402,648 418,656 434,664 C442,668 446,674 440,678 C432,682 420,678 412,672 C408,682 406,692 398,694 C390,694 386,684 388,672 C382,680 374,686 366,682 C360,678 362,668 370,660 C376,654 384,646 390,638Z" fill="url(#pc-footGrad)"/>
      <path d="M412,656 Q420,666 428,672" fill="none" stroke="#C84B00" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M398,660 Q400,674 400,684" fill="none" stroke="#C84B00" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M386,656 Q378,664 372,672" fill="none" stroke="#C84B00" strokeWidth="1.4" strokeLinecap="round"/>
      <g id="wing-left">
        <path d="M212,310 C188,320 168,360 162,410 C156,458 166,510 188,538 C200,552 216,558 228,548 C218,520 214,480 218,440 C222,400 232,360 248,330 C236,318 222,308 212,310Z" fill="url(#pc-wingL)"/>
        <path d="M212,310 C200,340 188,390 182,440" fill="none" stroke="#831843" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
      <g id="wing-right">
        <path d="M468,310 C492,320 512,360 518,410 C524,458 514,510 492,538 C480,552 464,558 452,548 C462,520 466,480 462,440 C458,400 448,360 432,330 C444,318 458,308 468,310Z" fill="url(#pc-wingR)"/>
        <path d="M468,310 C480,340 492,390 498,440" fill="none" stroke="#831843" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
      <path id="body" d="M248,330 C228,350 216,390 214,440 C212,490 222,550 248,592 C264,616 290,638 316,644 C326,647 334,648 340,648 C346,648 354,647 364,644 C390,638 416,616 432,592 C458,550 468,490 466,440 C464,390 452,350 432,330 C410,308 375,296 340,296 C305,296 270,308 248,330Z" fill="url(#pc-bodyGrad)"/>
      <path id="belly" d="M290,340 C270,365 262,410 264,458 C266,505 278,552 300,584 C312,600 326,610 340,612 C354,610 368,600 380,584 C402,552 414,505 416,458 C418,410 410,365 390,340 C372,322 308,322 290,340Z" fill="url(#pc-bellyGrad)"/>
      <g id="head-group">
        <path id="head" d="M222,210 C218,248 220,278 230,304 C248,330 290,346 340,346 C390,346 432,330 450,304 C460,278 462,248 458,210 C454,160 410,106 340,106 C270,106 226,160 222,210Z" fill="url(#pc-bodyGrad)"/>
        <path d="M330,110 C326,90 318,76 324,62 C330,50 346,50 350,64 C354,76 348,92 340,108Z" fill="#BE185D"/>
        <path id="face-patch" d="M278,175 C268,195 266,225 272,252 C280,278 306,300 340,302 C374,300 400,278 408,252 C414,225 412,195 402,175 C388,152 312,152 278,175Z" fill="#FDF2F8"/>
        <g id="eye-left">
          <ellipse cx="296" cy="222" rx="28" ry="30" fill="white"/>
          <ellipse cx="296" cy="226" rx="19" ry="21" fill="#1A2E5A"/>
          <ellipse cx="298" cy="228" rx="11" ry="13" fill="#0A1020"/>
          <ellipse cx="303" cy="220" rx="5"  ry="6"  fill="white"/>
          <ellipse cx="291" cy="232" rx="2"  ry="2.5" fill="white" opacity="0.6"/>
        </g>
        <g id="eye-right">
          <ellipse cx="384" cy="222" rx="28" ry="30" fill="white"/>
          <ellipse cx="384" cy="226" rx="19" ry="21" fill="#1A2E5A"/>
          <ellipse cx="386" cy="228" rx="11" ry="13" fill="#0A1020"/>
          <ellipse cx="391" cy="220" rx="5"  ry="6"  fill="white"/>
          <ellipse cx="379" cy="232" rx="2"  ry="2.5" fill="white" opacity="0.6"/>
        </g>
        <g id="sunglasses-group">
          <g id="sunglass-left">
            <rect x="258" y="204" width="72" height="48" rx="8" fill="url(#pc-lens)"/>
            <path d="M266,214 Q282,208 300,213" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.16"/>
            <rect x="258" y="204" width="72" height="48" rx="8" fill="none" stroke="#F5C400" strokeWidth="7"/>
          </g>
          <g id="sunglass-right">
            <rect x="350" y="204" width="72" height="48" rx="8" fill="url(#pc-lens)"/>
            <path d="M358,214 Q374,208 392,213" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.16"/>
            <rect x="350" y="204" width="72" height="48" rx="8" fill="none" stroke="#F5C400" strokeWidth="7"/>
          </g>
          <path d="M330,228 Q340,223 350,228" fill="none" stroke="#F5C400" strokeWidth="5.5" strokeLinecap="round"/>
          <path d="M261,228 Q240,228 222,224" fill="none" stroke="#F5C400" strokeWidth="5.5" strokeLinecap="round"/>
          <rect x="214" y="219" width="12" height="10" rx="3.5" fill="#F5C400"/>
          <path d="M419,228 Q440,228 458,224" fill="none" stroke="#F5C400" strokeWidth="5.5" strokeLinecap="round"/>
          <rect x="454" y="219" width="12" height="10" rx="3.5" fill="#F5C400"/>
        </g>
        <g id="beak">
          <path id="beak-upper" d="M320,272 Q340,268 360,272 Q356,287 340,297 Q324,287 320,272Z" fill="url(#pc-beakGrad)"/>
          <path id="beak-lower" d="M326,284 Q340,296 354,284 Q350,304 340,310 Q330,304 326,284Z" fill="#E65100" opacity="0.85"/>
        </g>
        <path id="mouth" d="M310,316 Q326,332 340,336 Q354,332 370,316" fill="none" stroke="#C84B00" strokeWidth="3.5" strokeLinecap="round"/>
        <ellipse id="blush-left"  cx="264" cy="290" rx="20" ry="13" fill="#FF9090" opacity="0.28"/>
        <ellipse id="blush-right" cx="416" cy="290" rx="20" ry="13" fill="#FF9090" opacity="0.28"/>
      </g>
    </svg>
  );
}

function Boy() {
  return (
    <svg viewBox="0 0 180 340" style={{ width:130, height:'auto', display:'block', overflow:'visible' }}
      xmlns="http://www.w3.org/2000/svg">
      {/* Shoes */}
      <ellipse cx="73"  cy="314" rx="21" ry="10" fill="#1A1208"/>
      <ellipse cx="107" cy="314" rx="21" ry="10" fill="#1A1208"/>
      {/* Legs — longer for taller look */}
      <rect x="63" y="226" width="23" height="90" rx="11.5" fill="#1565C0"/>
      <rect x="94" y="226" width="23" height="90" rx="11.5" fill="#1565C0"/>
      {/* Arms */}
      <path d="M52,160 C35,170 28,198 32,220 C34,230 45,232 52,224 C47,206 48,182 55,168Z" fill="#E53935"/>
      <ellipse cx="34" cy="222" rx="12" ry="10" fill="#C88B50" transform="rotate(-10 34 222)"/>
      <path d="M128,160 C145,170 152,198 148,220 C146,230 135,232 128,224 C133,206 132,182 125,168Z" fill="#E53935"/>
      <ellipse cx="146" cy="222" rx="12" ry="10" fill="#C88B50" transform="rotate(10 146 222)"/>
      {/* Shirt — no V-collar */}
      <rect x="52" y="140" width="76" height="88" rx="16" fill="#E53935"/>
      {/* Neck */}
      <rect x="80" y="128" width="20" height="18" rx="9" fill="#C88B50"/>
      {/* Head */}
      <circle cx="90" cy="78" r="52" fill="#C88B50"/>
      {/* Curly hair — 10 curls */}
      <path d="M38,76 C36,58 38,44 44,36 C48,28 54,28 58,34 C60,24 66,18 72,20 C74,12 80,8 88,10 C92,6 98,8 102,14 C108,10 116,14 120,22 C124,20 130,28 136,38 C142,48 144,62 142,76 C128,62 110,54 90,56 C70,58 52,64 38,76Z" fill="#1A1208"/>
      <ellipse cx="42"  cy="42" rx="14" ry="9" fill="#1A1208"/>
      <ellipse cx="54"  cy="32" rx="14" ry="9" fill="#1A1208"/>
      <ellipse cx="66"  cy="24" rx="14" ry="9" fill="#1A1208"/>
      <ellipse cx="78"  cy="18" rx="14" ry="9" fill="#1A1208"/>
      <ellipse cx="90"  cy="14" rx="14" ry="9" fill="#1A1208"/>
      <ellipse cx="100" cy="14" rx="14" ry="9" fill="#1A1208"/>
      <ellipse cx="112" cy="18" rx="14" ry="9" fill="#1A1208"/>
      <ellipse cx="124" cy="24" rx="14" ry="9" fill="#1A1208"/>
      <ellipse cx="136" cy="32" rx="14" ry="9" fill="#1A1208"/>
      <ellipse cx="142" cy="42" rx="12" ry="9" fill="#1A1208"/>
      <path d="M36,40 C40,34 46,32 50,36"     fill="none" stroke="#2D1F0E" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
      <path d="M60,22 C64,16 70,15 74,20"     fill="none" stroke="#2D1F0E" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
      <path d="M82,12 C86,8 92,8 96,12"       fill="none" stroke="#2D1F0E" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
      <path d="M106,12 C110,8 116,10 120,16"  fill="none" stroke="#2D1F0E" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
      <path d="M128,22 C132,16 138,16 140,22" fill="none" stroke="#2D1F0E" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
      {/* Ears */}
      <circle cx="40"  cy="80" r="11" fill="#C88B50"/>
      <circle cx="140" cy="80" r="11" fill="#C88B50"/>
      {/* Eyes */}
      <circle cx="74"  cy="74" r="11"  fill="white"/>
      <circle cx="74"  cy="76" r="7.5" fill="#2C1A00"/>
      <circle cx="79"  cy="71" r="2.5" fill="white"/>
      <circle cx="106" cy="74" r="11"  fill="white"/>
      <circle cx="106" cy="76" r="7.5" fill="#2C1A00"/>
      <circle cx="111" cy="71" r="2.5" fill="white"/>
      {/* Eyebrows */}
      <path d="M64,60 Q74,55 84,59"  fill="none" stroke="#1A1208" strokeWidth="3" strokeLinecap="round"/>
      <path d="M96,59 Q106,55 116,60" fill="none" stroke="#1A1208" strokeWidth="3" strokeLinecap="round"/>
      {/* Nose */}
      <ellipse cx="90" cy="90" rx="8" ry="5" fill="#A8703A" opacity="0.5"/>
      {/* Mouth */}
      <path d="M76,104 Q90,118 104,104" fill="none" stroke="#7A4010" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Shirt number */}
      <text x="90" y="208" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="28" fontWeight="900" fontFamily="Arial">7</text>
    </svg>
  );
}

function GreenPenny() {
  return (
    <svg viewBox="0 10 680 720"
      style={{ width:150, height:'auto', overflow:'visible', display:'block' }}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pp-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E2A4A"/><stop offset="100%" stopColor="#0A0D18"/>
        </linearGradient>
        <linearGradient id="pp-belly" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#E8EDF5"/>
        </linearGradient>
        <linearGradient id="pp-wing" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#1A2440"/><stop offset="100%" stopColor="#07090F"/>
        </linearGradient>
        <linearGradient id="pp-foot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB74D"/><stop offset="100%" stopColor="#D84800"/>
        </linearGradient>
        <linearGradient id="pp-beak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFA726"/><stop offset="100%" stopColor="#E65100"/>
        </linearGradient>
      </defs>
      <path d="M282,640 C278,648 262,656 246,664 C238,668 234,674 240,678 C248,682 260,678 268,672 C272,682 274,692 282,694 C290,694 294,684 292,672 C298,680 306,686 314,682 C320,678 318,668 310,660 C304,654 296,646 290,638Z" fill="url(#pp-foot)"/>
      <path d="M398,640 C402,648 418,656 434,664 C442,668 446,674 440,678 C432,682 420,678 412,672 C408,682 406,692 398,694 C390,694 386,684 388,672 C382,680 374,686 366,682 C360,678 362,668 370,660 C376,654 384,646 390,638Z" fill="url(#pp-foot)"/>
      <path id="pp-wing-left"  d="M212,310 C188,320 168,360 162,410 C156,458 166,510 188,538 C200,552 216,558 228,548 C218,520 214,480 218,440 C222,400 232,360 248,330 C236,318 222,308 212,310Z" fill="url(#pp-wing)"/>
      <path id="pp-wing-right" d="M468,310 C492,320 512,360 518,410 C524,458 514,510 492,538 C480,552 464,558 452,548 C462,520 466,480 462,440 C458,400 448,360 432,330 C444,318 458,308 468,310Z" fill="url(#pp-wing)"/>
      <path d="M248,330 C228,350 216,390 214,440 C212,490 222,550 248,592 C264,616 290,638 316,644 C326,647 334,648 340,648 C346,648 354,647 364,644 C390,638 416,616 432,592 C458,550 468,490 466,440 C464,390 452,350 432,330 C410,308 375,296 340,296 C305,296 270,308 248,330Z" fill="url(#pp-body)"/>
      <path d="M290,340 C270,365 262,410 264,458 C266,505 278,552 300,584 C312,600 326,610 340,612 C354,610 368,600 380,584 C402,552 414,505 416,458 C418,410 410,365 390,340 C372,322 308,322 290,340Z" fill="url(#pp-belly)"/>
      <path d="M222,210 C218,248 220,278 230,304 C248,330 290,346 340,346 C390,346 432,330 450,304 C460,278 462,248 458,210 C454,160 410,106 340,106 C270,106 226,160 222,210Z" fill="url(#pp-body)"/>
      <path d="M278,175 C268,195 266,225 272,252 C280,278 306,300 340,302 C374,300 400,278 408,252 C414,225 412,195 402,175 C388,152 312,152 278,175Z" fill="#E8EDF5"/>
      <ellipse cx="296" cy="222" rx="28" ry="30" fill="white"/>
      <ellipse cx="296" cy="226" rx="19" ry="21" fill="#1A2E5A"/>
      <ellipse cx="298" cy="228" rx="11" ry="13" fill="#0A1020"/>
      <ellipse cx="303" cy="220" rx="5"  ry="6"  fill="white"/>
      <ellipse cx="384" cy="222" rx="28" ry="30" fill="white"/>
      <ellipse cx="384" cy="226" rx="19" ry="21" fill="#1A2E5A"/>
      <ellipse cx="386" cy="228" rx="11" ry="13" fill="#0A1020"/>
      <ellipse cx="391" cy="220" rx="5"  ry="6"  fill="white"/>
      <path d="M320,272 Q340,268 360,272 Q356,287 340,297 Q324,287 320,272Z" fill="url(#pp-beak)"/>
      <path d="M310,316 Q326,332 340,336 Q354,332 370,316" fill="none" stroke="#C84B00" strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  );
}

function EggSVG({ showCracks = false }) {
  return (
    <svg viewBox="0 0 80 104" style={{ width:64, height:'auto', display:'block', overflow:'visible' }}
      xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="58" rx="28" ry="38" fill="#FFF9E6" stroke="#D4A800" strokeWidth="2.5"/>
      {showCracks && <>
        <path d="M34,46 L38,56 L32,62" fill="none" stroke="#C84B00" strokeWidth="2" strokeLinecap="round"/>
        <path d="M46,44 L42,54 L48,60" fill="none" stroke="#C84B00" strokeWidth="2" strokeLinecap="round"/>
      </>}
    </svg>
  );
}

function BabyPenguin() {
  return (
    <svg viewBox="0 0 200 280" style={{ width:76, height:'auto', display:'block', overflow:'visible' }}
      xmlns="http://www.w3.org/2000/svg">
      <path d="M46,145 C34,160 30,185 36,204 C42,214 52,218 58,210 C52,192 50,166 56,150Z" fill="#EC4899"/>
      <path d="M154,145 C166,160 170,185 164,204 C158,214 148,218 142,210 C148,192 150,166 144,150Z" fill="#EC4899"/>
      <ellipse cx="100" cy="185" rx="52" ry="64" fill="#F472B6"/>
      <ellipse cx="100" cy="192" rx="33" ry="48" fill="#FDF2F8"/>
      <circle cx="100" cy="102" r="50" fill="#F472B6"/>
      <ellipse cx="100" cy="110" rx="32" ry="28" fill="#FDF2F8"/>
      <circle cx="85"  cy="102" r="8.5" fill="white"/>
      <circle cx="86"  cy="103" r="5.5" fill="#0A1020"/>
      <circle cx="88"  cy="100" r="2"   fill="white"/>
      <circle cx="115" cy="102" r="8.5" fill="white"/>
      <circle cx="116" cy="103" r="5.5" fill="#0A1020"/>
      <circle cx="118" cy="100" r="2"   fill="white"/>
      <polygon points="94,118 106,118 100,127" fill="#FFA726"/>
      <ellipse cx="82"  cy="246" rx="18" ry="9" fill="#FFB74D" transform="rotate(-12 82 246)"/>
      <ellipse cx="118" cy="246" rx="18" ry="9" fill="#FFB74D" transform="rotate(12 118 246)"/>
    </svg>
  );
}

/* ── Exported component ─────────────────────────────────────────────────────── */

const SCENES = ['outdoor', 'beach', 'classroom', 'snowy', 'city'];

const IDLE_ANIMS    = ['wave', 'bounce', 'shimmy', 'look', 'sleep', 'magic'];
const CORRECT_ANIMS = ['flap', 'bounce', 'backflip'];
const WRONG_ANIM    = 'look';

const ANIM_DURATIONS = {
  wave: 4000, bounce: 2200, shimmy: 2800, look: 3000,
  sleep: 7000, magic: 8000, flap: 3000, backflip: 3500,
  flyaway: 10000, layegg: 12000, holdhands: 14000,
};

export { CORRECT_ANIMS, WRONG_ANIM, SCENES };

export default function PennyScene({ commandAnim, isPaused, talking, scene: sceneProp }) {
  const scene = sceneProp;
  const [blinking,     setBlinking]     = useState(false);
  const [activeAnim,   setActiveAnim]   = useState(null);
  const [layEggPhase,  setLayEggPhase]  = useState(0);
  const blinkRef       = useRef(null);
  const animTimerRef   = useRef(null);
  const idleTimerRef   = useRef(null);
  const layEggTimers   = useRef([]);
  const isPausedRef    = useRef(isPaused);
  isPausedRef.current  = isPaused;

  function runAnim(name) {
    clearTimeout(animTimerRef.current);
    clearTimeout(idleTimerRef.current);
    setActiveAnim(name);
    const dur = ANIM_DURATIONS[name] ?? 3000;
    animTimerRef.current = setTimeout(() => {
      setActiveAnim(null);
      scheduleIdle();
    }, dur);
  }

  function scheduleIdle() {
    clearTimeout(idleTimerRef.current);
    if (isPausedRef.current) return;
    const delay = 1000 + Math.random() * 2000; // 1–3 seconds
    idleTimerRef.current = setTimeout(() => {
      if (isPausedRef.current) return;
      runAnim(IDLE_ANIMS[Math.floor(Math.random() * IDLE_ANIMS.length)]);
    }, delay);
  }

  // Auto-blink
  useEffect(() => {
    const doBlink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
      blinkRef.current = setTimeout(doBlink, 2200 + Math.random() * 2000);
    };
    blinkRef.current = setTimeout(doBlink, 1800);
    return () => clearTimeout(blinkRef.current);
  }, []);

  // Start idle cycle on mount
  useEffect(() => {
    scheduleIdle();
    return () => {
      clearTimeout(animTimerRef.current);
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Run command animations (response + unlock buttons)
  // commandAnim = { name, ts } — ts changes even if same name, forcing re-trigger
  useEffect(() => {
    if (!commandAnim?.name) return;
    runAnim(commandAnim.name);
  }, [commandAnim?.ts]);

  // Resume idle when unpaused (grading/speaking ended)
  useEffect(() => {
    if (!isPaused && !activeAnim) scheduleIdle();
  }, [isPaused]);

  // Layegg phase sequencer
  useEffect(() => {
    layEggTimers.current.forEach(clearTimeout);
    layEggTimers.current = [];
    if (activeAnim !== 'layegg') { setLayEggPhase(0); return; }
    // phase 1: Penny squats (immediate)
    setLayEggPhase(1);
    // phase 2: egg appears
    layEggTimers.current.push(setTimeout(() => setLayEggPhase(2), 1200));
    // phase 3: egg wobbles
    layEggTimers.current.push(setTimeout(() => setLayEggPhase(3), 2800));
    // phase 4: egg shakes hard + cracks
    layEggTimers.current.push(setTimeout(() => setLayEggPhase(4), 6500));
    // phase 5: egg gone, baby pops
    layEggTimers.current.push(setTimeout(() => setLayEggPhase(5), 8500));
    // phase 0: cleanup
    layEggTimers.current.push(setTimeout(() => setLayEggPhase(0), 12000));
    return () => { layEggTimers.current.forEach(clearTimeout); };
  }, [activeAnim]);

  const pennyClass = [
    activeAnim === 'bounce'                                          && 'bouncing',
    activeAnim === 'shimmy'                                          && 'shimmying',
    activeAnim === 'flyaway'                                         && 'flyingaway',
    activeAnim === 'sleep'                                           && 'sleeping',
    activeAnim === 'backflip'                                        && 'backflipping',
    activeAnim === 'magic'                                           && 'magicking',
    activeAnim === 'layegg' && layEggPhase === 1                     && 'squatting',
    activeAnim === 'layegg' && layEggPhase >= 2 && layEggPhase <= 4  && 'penny-egg-right',
    activeAnim === 'layegg' && layEggPhase === 5                     && 'penny-egg-return',
    activeAnim === 'holdhands'                                       && 'holding',
  ].filter(Boolean).join(' ');

  return (
    <>
      <style>{css}</style>

      {/* Background — clipped, fades in once scene is known */}
      <div style={{ position:'absolute', inset:0, borderRadius:16, overflow:'hidden', opacity: scene ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        {scene === 'outdoor'   && <OutdoorScene />}
        {scene === 'beach'     && <BeachScene />}
        {scene === 'classroom' && <ClassroomScene />}
        {scene === 'snowy'     && <SnowyScene />}
        {scene === 'city'      && <CityScene />}
      </div>

      {/* Characters — clipped so animations don't overflow */}
      <div style={{ position:'absolute', inset:0, borderRadius:16, overflow:'hidden', zIndex:5 }}>

        {/* Hold-hands partner */}
        {activeAnim === 'holdhands' && (
          <div className="holdingpenny" style={{ position:'absolute', bottom:0, left:'28%' }}>
            <div className="penguin-wrap"><GreenPenny /></div>
          </div>
        )}
        {activeAnim === 'holdhands' && <>
          <span className="heart-floater" style={{ bottom:'54%', left:'20%', animationDelay:'5s',   animationFillMode:'backwards' }}>♥</span>
          <span className="heart-floater" style={{ bottom:'58%', left:'24%', animationDelay:'5.8s', animationFillMode:'backwards' }}>♥</span>
          <span className="heart-floater" style={{ bottom:'52%', left:'28%', animationDelay:'6.6s', animationFillMode:'backwards' }}>♥</span>
        </>}

        {/* Egg — behind Penny (DOM order: before Penny, no explicit z-index) */}
        {activeAnim === 'layegg' && layEggPhase >= 2 && layEggPhase <= 5 && (
          <div
            key={`egg-${layEggPhase}`}
            className={
              layEggPhase === 2 ? 'egg-appear' :
              layEggPhase === 3 ? 'egg-wobble' :
              layEggPhase === 4 ? 'egg-shake'  : 'egg-gone'
            }
            style={{ position:'absolute', bottom:0, left:'calc(6% + 55px)' }}
          >
            <EggSVG showCracks={layEggPhase >= 4} />
          </div>
        )}

        {/* Penny */}
        <div className={pennyClass} style={{ position:'absolute', bottom:'0%', left:'6%' }}>
          <div className="penguin-wrap">
            <PenguinSVG
              talking={talking}
              blinking={blinking}
              looking={activeAnim === 'look'}
              waving={activeAnim === 'wave'}
              flapping={activeAnim === 'flap'}
            />
          </div>
        </div>

        {/* Baby — after Penny in DOM so it renders on top */}
        {activeAnim === 'layegg' && layEggPhase === 5 && (
          <div className="baby-hatch-and-go" style={{ position:'absolute', bottom:0, left:'calc(6% + 55px)' }}>
            <BabyPenguin />
          </div>
        )}

        {/* Santiago */}
        <div style={{ position:'absolute', bottom:'0%', right:'6%' }}>
          <Boy />
        </div>

        {/* Magic sparkles */}
        {activeAnim === 'magic' && <>
          <span className="z-letter" style={{ bottom:'62%', left:'9%',  animationDelay:'0.2s', color:'#7C3AED' }}>✨</span>
          <span className="z-letter" style={{ bottom:'70%', left:'14%', animationDelay:'1.1s', color:'#F59E0B' }}>⭐</span>
          <span className="z-letter" style={{ bottom:'65%', left:'18%', animationDelay:'2.0s', color:'#7C3AED' }}>✨</span>
        </>}

        {/* Zzz */}
        {activeAnim === 'sleep' && <>
          <span className="z-letter" style={{ bottom:'42%', left:'9%',  animationDelay:'0s'   }}>Z</span>
          <span className="z-letter" style={{ bottom:'50%', left:'13%', animationDelay:'0.8s' }}>z</span>
          <span className="z-letter" style={{ bottom:'46%', left:'16%', animationDelay:'1.6s' }}>Z</span>
        </>}

      </div>
    </>
  );
}

