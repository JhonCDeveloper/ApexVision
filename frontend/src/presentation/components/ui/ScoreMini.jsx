import React from 'react';

const ScoreMini = ({ scores }) => {
  if (scores.length < 2) return null;
  const W = 160, H = 44, pad = 6;
  const lo = Math.max(0, Math.min(...scores) - 8);
  const hi = Math.min(100, Math.max(...scores) + 8);
  const range = hi - lo || 1;
  const xs = scores.map((_, i) => pad + (i / (scores.length - 1)) * (W - pad * 2));
  const ys = scores.map(s => H - pad - ((s - lo) / range) * (H - pad * 2));
  const last = scores[scores.length - 1];
  const prev = scores[scores.length - 2];
  const color = last > prev ? '#9ef5be' : last < prev ? '#fca5a5' : 'rgba(255,255,255,0.35)';
  const area = `M${xs[0]},${H} ` + xs.map((x, i) => `L${x},${ys[i]}`).join(' ') + ` L${xs[xs.length-1]},${H} Z`;
  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sg)" />
      <path d={xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r={3} fill="var(--glass-bg)" stroke={color} strokeWidth={1.5} />)}
    </svg>
  );
};

export default ScoreMini;
