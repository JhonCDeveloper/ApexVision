import React from 'react';

const ScoreRing = ({ score }) => {
  const r = 22, circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  return (
    <svg width={56} height={56} viewBox="0 0 56 56">
      <circle cx={28} cy={28} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={4}/>
      <circle cx={28} cy={28} r={r} fill="none" stroke="#9ef5be" strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform="rotate(-90 28 28)" style={{transition:'stroke-dashoffset 600ms ease'}}/>
      <text x={28} y={33} textAnchor="middle" fontSize={13} fontWeight={300} fill="white">{score}</text>
    </svg>
  );
};

export default ScoreRing;
