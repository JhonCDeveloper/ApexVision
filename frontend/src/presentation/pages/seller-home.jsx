import React from 'react';
/* global React, AVSpark */
const { useState, useEffect, useRef } = React;


/* ============================================================
   ICONS
   ============================================================ */
import SIcon from '../components/ui/SIcon.jsx';

/* ============================================================
   APEX VISION LOGO — SVG inline (concentric rounded triangles)
   ============================================================ */
import ApexLogo from '../components/ui/ApexLogo.jsx';

/* ============================================================
   TOPBAR — con logo y nav funcional
   ============================================================ */
import PublicTopBar from '../components/layout/PublicTopBar.jsx';

/* ============================================================
   LANDING — hero público
   ============================================================ */
import PublicLanding, { FEATURES } from './PublicLanding.jsx';

/* ============================================================
   ESCENARIOS
   ============================================================ */
const SCENARIOS = [
  {
    id: 'product-pitch',
    title: 'Pitch de producto',
    description: 'Presenta tu producto o servicio a un cliente potencial.',
    duration: '90 s',
    prompt: 'Presenta tu producto o servicio a un decisor que hoy usa a tu competencia. Tienes 90 segundos para generar interés real.',
    category: 'Pitch · Producto',
  },
  {
    id: 'cold-open',
    title: 'Apertura en frío',
    description: 'Primera llamada o contacto sin contexto previo.',
    duration: '60 s',
    prompt: 'Contacta en frío a un directivo que no te conoce. Genera interés y consigue 15 minutos en su agenda.',
    category: 'Apertura en frío',
  },
  {
    id: 'executive',
    title: 'Presentación ejecutiva',
    description: 'Exposición estructurada ante un panel directivo.',
    duration: '3 min',
    prompt: 'Presenta una propuesta de valor ante un comité de dirección. Justifica el ROI y anticipa objeciones.',
    category: 'Presentación ejecutiva',
  },
  {
    id: 'objection',
    title: 'Manejo de objeciones',
    description: 'Responde la objeción más difícil: precio o timing.',
    duration: '90 s',
    prompt: 'Tu prospecto dice: "Es interesante pero es muy caro y no es el momento". Responde de forma consultiva sin bajar el precio.',
    category: 'Objeciones',
  },
  {
    id: 'free',
    title: 'Pitch libre',
    description: 'Sin restricciones — practica lo que quieras evaluar.',
    duration: 'Libre',
    prompt: 'Usa este espacio para practicar cualquier aspecto de tu comunicación comercial. Sin guión impuesto.',
    category: 'Libre',
  },
];

/* ============================================================
   SELECTOR DE ESCENARIO
   ============================================================ */
const ScenarioSelector = ({ onSelect, onBack }) => {
  window.useLang(); const L = window.L;
  const [selected, setSelected] = useState(null);

  return (
    <div className="s-stage">
      <div className="s-wrap" style={{ maxWidth: 820 }}>

        <div style={{ marginBottom: 32 }}>
          <button className="btn" onClick={onBack} style={{ marginBottom: 22 }}>{L('← Volver', '← Back')}</button>
          <StepProgress current={1} />
          <h2 style={{ fontSize: 34, fontWeight: 200, letterSpacing: '-0.02em', marginBottom: 8 }}>
            {L('¿Qué quieres evaluar?', 'What do you want to practice?')}
          </h2>
          <p style={{ color: 'var(--ink-50)', fontSize: 14 }}>
            {L('Elige el escenario y la IA calibra los parámetros de análisis.', 'Pick a scenario and the AI calibrates the analysis parameters.')}
          </p>
        </div>

        {/* GRID DE ESCENARIOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
          {SCENARIOS.slice(0, 4).map(s => (
            <div
              key={s.id}
              className={`glass scenario-card${selected?.id === s.id ? ' selected' : ''}`}
              onClick={() => setSelected(s)}
              style={{ padding: '18px 20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {selected?.id === s.id && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ef5be', display: 'inline-block', flexShrink: 0 }} />}
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{s.title}</div>
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-40)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', marginLeft: 10 }}>
                  {s.duration}
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-50)', lineHeight: 1.5 }}>{s.description}</div>
            </div>
          ))}
        </div>

        {/* PITCH LIBRE — full width */}
        <div
          className={`glass scenario-card${selected?.id === 'free' ? ' selected' : ''}`}
          onClick={() => setSelected(SCENARIOS[4])}
          style={{
            padding: '18px 20px',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>{SCENARIOS[4].title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-50)' }}>{SCENARIOS[4].description}</div>
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-40)', letterSpacing: '0.12em', textTransform: 'uppercase', marginLeft: 16 }}>
            {SCENARIOS[4].duration}
          </div>
        </div>

        {/* PREVIEW DEL PROMPT */}
        {selected && (
          <div className="glass" style={{ padding: '16px 20px', marginBottom: 24, background: 'rgba(255,255,255,0.06)' }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-40)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
              {L('Prompt de evaluación', 'Evaluation prompt')} · {selected.category}
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-85)', lineHeight: 1.6 }}>{selected.prompt}</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className={`btn${selected ? ' btn-record-ready' : ''}`}
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            style={{
              padding: '14px 28px',
              fontSize: 12.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              opacity: selected ? 1 : 0.38,
              cursor: selected ? 'pointer' : 'default',
              gap: 8,
            }}
          >
            <SIcon name="mic" size={13} /> {L('Comenzar grabación', 'Start recording')}
          </button>
        </div>

      </div>
    </div>
  );
};

/* ============================================================
   STEP PROGRESS — indicador visual de paso X de N
   ============================================================ */
import StepProgress from '../components/ui/StepProgress.jsx';

/* ============================================================
   SELLER DASHBOARD — vista post-login del vendedor
   ============================================================ */
const statusLabel = { pending: 'Pendiente', processing: 'Procesando', completed: 'Completado', failed: 'Error' };
import { SellerDashboard, SellerProgress, SellerCoaching, SellerPlan, SellerSettings, SellerProfile, SellerMainDashboard } from './seller-dashboard/index.jsx';

Object.assign(window, {
  SIcon, ApexLogo, PublicTopBar, PublicLanding, ScenarioSelector, StepProgress,
  SellerDashboard, SellerProgress, SellerCoaching, SellerPlan, SellerSettings, SellerProfile,
  SellerMainDashboard,
  HOME_QUESTION, SCENARIOS, FEATURES,
  SellerTopBar: PublicTopBar,
  SellerHome: PublicLanding,
});
