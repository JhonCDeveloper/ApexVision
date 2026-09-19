import React from 'react';
import SIcon from './SIcon.jsx';

const StepProgress = ({ current, steps = [window.L('Escenario', 'Scenario'), window.L('Grabación', 'Recording'), window.L('Resultados', 'Results')] }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
    {steps.map((label, i) => {
      const step = i + 1;
      const done   = step < current;
      const active = step === current;
      return (
        <React.Fragment key={step}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10.5, fontWeight: 600,
              background: done   ? 'rgba(158,245,190,0.15)' :
                          active ? 'rgba(255,255,255,0.1)'  : 'transparent',
              border: done   ? '1px solid rgba(158,245,190,0.45)' :
                      active ? '1px solid rgba(255,255,255,0.35)' :
                               '1px solid rgba(255,255,255,0.1)',
              color: done   ? '#9ef5be' :
                     active ? 'var(--ink-90)' : 'var(--ink-25)',
              transition: 'all 240ms',
            }}>
              {done ? <SIcon name="check" size={11} stroke={2} /> : step}
            </div>
            <span style={{
              fontSize: 11.5,
              color: active ? 'var(--ink-80)' : done ? 'var(--ink-45)' : 'var(--ink-25)',
              letterSpacing: '0.02em',
              transition: 'color 240ms',
            }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 1, margin: '0 10px',
              background: done ? 'rgba(158,245,190,0.25)' : 'rgba(255,255,255,0.07)',
              transition: 'background 240ms',
            }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default StepProgress;
