export function evalScore(e) {
  let raw = (typeof e?.score === 'number') ? e.score
          : (e?.score && typeof e.score === 'object' ? e.score.overall : undefined);
  if (raw == null) raw = e?.overall_score;
  if (raw == null || isNaN(raw)) return null;
  return Math.round(raw > 1 ? raw : raw * 100);
}

export const statusLabel = { pending: 'Pendiente', processing: 'Procesando', completed: 'Completado', failed: 'Error' };
export const statusColor = { pending: 'var(--ink-40)', processing: '#f9d45b', completed: '#9ef5be', failed: '#fca5a5' };
