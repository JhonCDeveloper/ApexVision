import React from 'react';

const ApexLogo = ({ size = 36 }) => {
  // Rounded equilateral triangle path centered at (50, 50)
  // Vertices: top(50,10), bottom-right(84,68), bottom-left(16,68)
  // Rounded corners via quadratic beziers
  const SHAPE = "M44,21 Q50,10 56,21 C64,36 80,61 81,63 Q87,73 75,73 L25,73 Q13,73 19,63 C20,61 36,36 44,21 Z";
  const cx = 50, cy = 52;
  const rings = 9;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ display: 'block' }}>
      {Array.from({ length: rings }, (_, i) => {
        const s = 1 - i * (0.82 / (rings - 1));
        const tx = cx * (1 - s);
        const ty = cy * (1 - s);
        const opacity = 0.9 - i * 0.07;
        return (
          <path
            key={i}
            d={SHAPE}
            stroke="white"
            strokeWidth={1.1}
            fill="none"
            transform={`translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${s.toFixed(3)})`}
            opacity={opacity.toFixed(2)}
          />
        );
      })}
    </svg>
  );
};

export default ApexLogo;
