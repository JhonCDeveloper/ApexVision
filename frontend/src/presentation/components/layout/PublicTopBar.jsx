import React from 'react';
import ApexLogo from '../ui/ApexLogo.jsx';

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const parent = el.closest('.s-stage');
  if (parent) {
    const offset = el.getBoundingClientRect().top - parent.getBoundingClientRect().top + parent.scrollTop - 20;
    parent.scrollTo({ top: offset, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
  }
};

const PublicTopBar = ({ onHome, onSection }) => {
  window.useLang(); const L = window.L;
  const goSection = (id) => {
    if (typeof onSection === 'function') {
      onSection(id);
    } else {
      scrollToSection(id);
    }
  };
  const linkStyle = { padding: '8px 16px', fontSize: 12.5, color: 'var(--ink-60)', borderRadius: 999, letterSpacing: '0.04em', cursor: 'pointer', transition: 'color 150ms' };
  return (
  <div className="s-topbar">
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={onHome}>
      <ApexLogo size={38} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.18em', color: 'var(--ink-90)' }}>APEX</div>
        <div style={{ fontSize: 9, letterSpacing: '0.28em', color: 'var(--ink-50)', marginTop: 1 }}>VISION</div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 4 }}>
      <a onClick={() => goSection('how-it-works')} style={linkStyle} className="hover-link">
        {L('Cómo funciona', 'How it works')}
      </a>
      <a onClick={() => goSection('para-empresas')} style={linkStyle} className="hover-link">
        {L('Para empresas', 'For teams')}
      </a>
      <a onClick={() => goSection('precios')} style={linkStyle} className="hover-link">
        {L('Precios', 'Pricing')}
      </a>
    </div>
    <div style={{ width: 120 }} />
  </div>
  );
};

export default PublicTopBar;
