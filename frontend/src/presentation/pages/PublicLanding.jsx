import React from 'react';
import SIcon from '../components/ui/SIcon.jsx';

const FEATURES = [
  { icon: 'body',    title: ['Lenguaje corporal', 'Body language'],   desc: ['Postura, gestos, contacto visual y presencia evaluados fotograma a fotograma.', 'Posture, gestures, eye contact and presence evaluated frame by frame.'] },
  { icon: 'wave',    title: ['Análisis de voz', 'Voice analysis'],      desc: ['Velocidad, tono, pausas estratégicas, muletillas y claridad del discurso.', 'Pace, tone, strategic pauses, filler words and speech clarity.'] },
  { icon: 'brain',   title: ['Sugerencias con IA', 'AI suggestions'],   desc: ['Recomendaciones concretas y personalizadas para mejorar en tu próxima presentación.', 'Concrete, personalized recommendations to improve in your next presentation.'] },
];

const PublicLanding = ({ onStart }) => {
  window.useLang(); const L = window.L;
  return (
  <div className="s-stage">
    <div className="s-wrap" style={{ maxWidth: 860 }}>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '72px 0 56px' }}>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.3em', color: 'var(--ink-40)', textTransform: 'uppercase', marginBottom: 20 }}>
          {L('Apex Vision · Evaluación comercial con IA', 'Apex Vision · AI sales evaluation')}
        </div>
        <h1 style={{ fontSize: 54, fontWeight: 200, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 22 }}>
          {L('Grábate.', 'Record yourself.')}<br/>{L('Mejora tu pitch.', 'Improve your pitch.')}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-70)', maxWidth: '48ch', margin: '0 auto 36px', lineHeight: 1.65 }}>
          {L('Presenta tu producto, servicio o idea y recibe un análisis detallado de tu comunicación: cuerpo, voz y discurso.', 'Present your product, service or idea and get a detailed analysis of your communication: body, voice and delivery.')}
        </p>
        <button className="btn btn-primary" onClick={onStart}
          style={{ padding: '16px 34px', fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', gap: 10 }}>
          <SIcon name="mic" size={14} /> {L('Evaluar mi pitch — es gratis', 'Evaluate my pitch — it\'s free')}
        </button>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-30)', marginTop: 18, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {L('Sin instalación · Resultados en segundos · Tu video es privado', 'No install · Results in seconds · Your video is private')}
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 56 }}>
        {FEATURES.map(f => (
          <div key={f.title[0]} className="glass card-hover" style={{ padding: '26px 22px', textAlign: 'center' }}>
            <div style={{ marginBottom: 14, color: 'var(--ink-60)' }}>
              <SIcon name={f.icon} size={26} stroke={1.2} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.005em' }}>{L(f.title[0], f.title[1])}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-50)', lineHeight: 1.6 }}>{L(f.desc[0], f.desc[1])}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" className="glass" style={{ padding: '32px 36px', marginBottom: 56 }}>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.22em', color: 'var(--ink-50)', textTransform: 'uppercase', marginBottom: 28, textAlign: 'center' }}>
          {L('Cómo funciona', 'How it works')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            ['01', L('Eliges el escenario', 'Pick the scenario'),   L('Seleccionas el tipo de pitch que quieres practicar.', 'Choose the type of pitch you want to practice.')],
            ['02', L('Te grabas', 'Record yourself'),             L('Usamos tu cámara y micrófono — nada se sube sin tu ok.', 'We use your camera and mic — nothing is uploaded without your ok.')],
            ['03', L('IA analiza', 'AI analyzes'),            L('Pose, voz, gestos faciales y discurso en segundos.', 'Pose, voice, facial gestures and delivery in seconds.')],
            ['04', L('Mejoras', 'You improve'),               L('Métricas claras y sugerencias accionables para la próxima vez.', 'Clear metrics and actionable tips for next time.')],
          ].map(([n, t, d]) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div className="mono" style={{ fontSize: 28, fontWeight: 200, color: 'var(--ink-20)', letterSpacing: '-0.02em', marginBottom: 10 }}>{n}</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, letterSpacing: '-0.005em' }}>{t}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-50)', lineHeight: 1.55 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA BOTTOM */}
      <div style={{ textAlign: 'center', paddingBottom: 56 }}>
        <p style={{ fontSize: 14, color: 'var(--ink-50)', marginBottom: 20 }}>
          {L('¿Listo para ver cómo te comunicas realmente?', 'Ready to see how you really communicate?')}
        </p>
        <button className="btn btn-primary" onClick={onStart}
          style={{ padding: '16px 34px', fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', gap: 10 }}>
          <SIcon name="sparkle" size={14} /> {L('Empezar ahora', 'Start now')}
        </button>
      </div>

      {/* PARA EMPRESAS */}
      <div id="para-empresas" className="glass" style={{ padding: '40px 44px', marginBottom: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
        <div>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.28em', color: 'var(--ink-40)', textTransform: 'uppercase', marginBottom: 14 }}>
            {L('Para empresas', 'For teams')}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 200, letterSpacing: '-0.02em', marginBottom: 14, lineHeight: 1.2 }}>
            {L('Evalúa a todo tu equipo comercial desde un solo lugar', 'Evaluate your whole sales team from one place')}
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--ink-50)', lineHeight: 1.65, marginBottom: 24 }}>
            {L('Con el panel de administración puedes ver el rendimiento de cada vendedor, detectar quién necesita coaching y medir la mejora en el tiempo con métricas reales.', 'With the admin panel you can see each seller\'s performance, spot who needs coaching and measure improvement over time with real metrics.')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {[
              L('Dashboard de equipo con score por vendedor', 'Team dashboard with score per seller'),
              L('Mapa de habilidades: confianza, voz, lenguaje corporal', 'Skill map: confidence, voice, body language'),
              L('Sugerencias de coaching generadas por IA', 'AI-generated coaching suggestions'),
              L('Reportes exportables por período', 'Exportable reports by period'),
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--ink-70)' }}>
                <SIcon name="check" size={14} />
                {f}
              </div>
            ))}
          </div>
          <a href="Apex Vision Console.html" className="btn btn-primary" style={{ display: 'inline-flex', padding: '13px 24px', fontSize: 12.5, letterSpacing: '0.12em', textTransform: 'uppercase', gap: 8, textDecoration: 'none' }}>
            <SIcon name="arrow" size={13} /> {L('Ver panel de administración', 'Open admin panel')}
          </a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: L('Score promedio del equipo', 'Team average score'), value: '78', unit: '/100', delta: L('+4 vs mes anterior', '+4 vs last month') },
            { label: L('Evaluaciones este mes', 'Evaluations this month'),     value: '156', unit: '',     delta: L('↑ 22% participación', '↑ 22% participation') },
            { label: L('Vendedores activos', 'Active sellers'),         value: '8',  unit: '/8',   delta: L('100% activos esta semana', '100% active this week') },
          ].map(({ label, value, unit, delta }) => (
            <div key={label} className="glass" style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-40)', marginBottom: 6, letterSpacing: '0.04em' }}>{label}</div>
              <div style={{ fontSize: 28, fontWeight: 200, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {value}<span style={{ fontSize: 13, color: 'var(--ink-40)', marginLeft: 4 }}>{unit}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{delta}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRECIOS */}
      <div id="precios" style={{ marginBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.28em', color: 'var(--ink-40)', textTransform: 'uppercase', marginBottom: 14 }}>
            {L('Precios', 'Pricing')}
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 200, letterSpacing: '-0.02em', marginBottom: 12 }}>
            {L('Planes que escalan con tu equipo', 'Plans that scale with your team')}
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--ink-50)', maxWidth: 540, margin: '0 auto', lineHeight: 1.65 }}>
            {L('Sin contratos largos. Cancela cuando quieras. Margen real para invertir en tus vendedores.', 'No long contracts. Cancel anytime. Real margin to invest in your sellers.')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {/* STARTER */}
          <div className="glass" style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.22em', color: 'var(--ink-50)', textTransform: 'uppercase', marginBottom: 8 }}>
              Starter
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 200, letterSpacing: '-0.02em' }}>$39</span>
              <span style={{ fontSize: 13, color: 'var(--ink-50)', marginLeft: 6 }}>{L('USD / usuario / mes', 'USD / user / month')}</span>
            </div>
            <div className="mono" style={{ fontSize: 11, color: '#9ef5be', letterSpacing: '0.12em', marginBottom: 18 }}>
              {L('✦ 600 tokens incluidos / mes', '✦ 600 tokens included / month')}
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-50)', lineHeight: 1.6, marginBottom: 20 }}>
              {L('Para equipos pequeños que arrancan a medir el desempeño comercial.', 'For small teams starting to measure sales performance.')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, flex: 1 }}>
              {[
                L('~120 evaluaciones / mes (5 tokens c/u)', '~120 evaluations / month (5 tokens each)'),
                L('Análisis de voz, lenguaje corporal y ritmo', 'Voice, body-language and pacing analysis'),
                L('Score con recomendaciones de IA', 'Score with AI recommendations'),
                L('Historial individual y exportación CSV', 'Individual history and CSV export'),
                L('Recarga +500 tokens por $5 USD', 'Top up +500 tokens for $5 USD'),
                L('Soporte por email', 'Email support'),
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--ink-70)' }}>
                  <SIcon name="check" size={13} /> {f}
                </div>
              ))}
            </div>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {L('Empezar gratis · 50 tokens', 'Start free · 50 tokens')}
            </button>
          </div>

          {/* GROWTH (highlighted) */}
          <div className="glass" style={{
            padding: '20px 28px 32px', display: 'flex', flexDirection: 'column',
            border: '1px solid rgba(120,255,180,0.35)',
            background: 'linear-gradient(180deg, rgba(120,255,180,0.06), rgba(255,255,255,0.02))',
          }}>
            <div style={{
              alignSelf: 'flex-end', marginBottom: 16,
              fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(120,255,180,0.18)', color: '#9ef5be',
              border: '1px solid rgba(120,255,180,0.4)',
            }}>
              {L('Más elegido', 'Most popular')}
            </div>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.22em', color: 'var(--ink-50)', textTransform: 'uppercase', marginBottom: 8 }}>
              Growth
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 200, letterSpacing: '-0.02em' }}>$89</span>
              <span style={{ fontSize: 13, color: 'var(--ink-50)', marginLeft: 6 }}>{L('USD / usuario / mes', 'USD / user / month')}</span>
            </div>
            <div className="mono" style={{ fontSize: 11, color: '#9ef5be', letterSpacing: '0.12em', marginBottom: 18 }}>
              {L('✦ 2,000 tokens incluidos / mes', '✦ 2,000 tokens included / month')}
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-50)', lineHeight: 1.6, marginBottom: 20 }}>
              {L('Para equipos en crecimiento que necesitan coaching personalizado y reportes profundos.', 'For growing teams that need personalized coaching and deep reports.')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, flex: 1 }}>
              {[
                L('~400 evaluaciones / mes', '~400 evaluations / month'),
                L('Plan de coaching IA por vendedor (20 tokens)', 'AI coaching plan per seller (20 tokens)'),
                L('Dashboard de equipo con tendencias', 'Team dashboard with trends'),
                L('Reportes PDF/CSV automáticos', 'Automatic PDF/CSV reports'),
                L('Análisis con OpenAI/Groq (modelo premium)', 'OpenAI/Groq analysis (premium model)'),
                L('Tokens no usados se acumulan', 'Unused tokens roll over'),
                L('Soporte prioritario', 'Priority support'),
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--ink-70)' }}>
                  <SIcon name="check" size={13} /> {f}
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {L('Empezar prueba · 200 tokens', 'Start trial · 200 tokens')}
            </button>
          </div>

          {/* ENTERPRISE */}
          <div className="glass" style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.22em', color: 'var(--ink-50)', textTransform: 'uppercase', marginBottom: 8 }}>
              Enterprise
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 200, letterSpacing: '-0.02em' }}>{L('A medida', 'Custom')}</span>
              <div style={{ fontSize: 12, color: 'var(--ink-50)', marginTop: 4 }}>{L('desde 50+ usuarios', 'from 50+ users')}</div>
            </div>
            <div className="mono" style={{ fontSize: 11, color: '#9ef5be', letterSpacing: '0.12em', marginBottom: 18 }}>
              {L('✦ Pool de tokens compartido', '✦ Shared token pool')}
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-50)', lineHeight: 1.6, marginBottom: 20 }}>
              {L('Para organizaciones grandes con requerimientos de compliance e integraciones.', 'For large organizations with compliance and integration requirements.')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, flex: 1 }}>
              {[
                L('Tokens ilimitados o pool dedicado', 'Unlimited tokens or dedicated pool'),
                L('Multi-tenant con roles avanzados', 'Multi-tenant with advanced roles'),
                L('SSO (Google, Azure AD, Okta)', 'SSO (Google, Azure AD, Okta)'),
                L('Retención de datos personalizada', 'Custom data retention'),
                L('Integraciones (Salesforce, HubSpot)', 'Integrations (Salesforce, HubSpot)'),
                L('SLA 99.9% y soporte dedicado', 'SLA 99.9% and dedicated support'),
                L('Onboarding del equipo incluido', 'Team onboarding included'),
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--ink-70)' }}>
                  <SIcon name="check" size={13} /> {f}
                </div>
              ))}
            </div>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {L('Contactar ventas', 'Contact sales')}
            </button>
          </div>
        </div>

        {/* Tabla de costos por token */}
        <div className="glass" style={{ marginTop: 28, padding: '28px 32px' }}>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.22em', color: 'var(--ink-50)', textTransform: 'uppercase', marginBottom: 18, textAlign: 'center' }}>
            {L('Cómo se consumen los tokens', 'How tokens are spent')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { label: L('Evaluación de pitch', 'Pitch evaluation'),     value: '5 tokens',  desc: L('$0.05 USD por video analizado', '$0.05 USD per analyzed video') },
              { label: L('Plan de coaching IA', 'AI coaching plan'),     value: '20 tokens', desc: L('$0.20 USD análisis del equipo con OpenAI/Groq', '$0.20 USD team analysis with OpenAI/Groq') },
              { label: L('Reporte PDF / CSV', 'PDF / CSV report'),       value: L('Gratis', 'Free'),    desc: L('sin costo en tokens', 'no token cost') },
              { label: L('Recarga adicional', 'Extra top-up'),       value: '$10 / 1k',  desc: L('+1.000 tokens por $10 USD (sin vencimiento)', '+1,000 tokens for $10 USD (no expiry)') },
            ].map(({ label, value, desc }) => (
              <div key={label}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink-50)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 300, letterSpacing: '-0.01em', marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-40)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--glass-border)', textAlign: 'center', fontSize: 12, color: 'var(--ink-50)' }}>
            <strong style={{ color: 'var(--ink-80)' }}>1 token = $0.01 USD</strong> · {L('Pagas solo por lo que usas · Margen bruto del producto: 85%', 'Pay only for what you use · Product gross margin: 85%')}
          </div>
        </div>
      </div>

    </div>
  </div>
  );
};

export default PublicLanding;
