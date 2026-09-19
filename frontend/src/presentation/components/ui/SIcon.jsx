import React from 'react';

const SIcon = ({ name, size = 16, stroke = 1.4 }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case 'home':      return <svg {...p}><path d="M3 11l9-8 9 8M5 9v11h5v-7h4v7h5V9"/></svg>;
    case 'mic':       return <svg {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>;
    case 'video':     return <svg {...p}><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 7l-6 5 6 5z"/></svg>;
    case 'close':     return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'play':      return <svg {...p}><polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/></svg>;
    case 'redo':      return <svg {...p}><path d="M21 12a9 9 0 11-3-6.7L21 8M21 3v5h-5"/></svg>;
    case 'check':     return <svg {...p}><path d="M5 12l5 5 9-12"/></svg>;
    case 'arrow':     return <svg {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'sparkle':   return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5L8 8M16 16l2.5 2.5M5.5 18.5L8 16M16 8l2.5-2.5"/></svg>;
    case 'download':  return <svg {...p}><path d="M12 3v13M6 11l6 6 6-6M4 21h16"/></svg>;
    case 'progress':  return <svg {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    case 'history':   return <svg {...p}><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3M3 4v5h5"/><path d="M12 7v5l3 2"/></svg>;
    case 'body':      return <svg {...p}><circle cx="12" cy="5" r="2"/><path d="M12 7v6M9 13l-2 5M15 13l2 5M9 10h6"/></svg>;
    case 'wave':      return <svg {...p}><path d="M2 12c1.5-3 3-4.5 4-4.5s2.5 3 4 3 2.5-3 4-3 2.5 1.5 4 4.5"/></svg>;
    case 'brain':     return <svg {...p}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.54 3 3 0 0 1 .36-5.44 2.5 2.5 0 0 1 1.14-4.06A2.5 2.5 0 0 1 9.5 2"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.54 3 3 0 0 0-.36-5.44 2.5 2.5 0 0 0-1.14-4.06A2.5 2.5 0 0 0 14.5 2"/></svg>;
    case 'eye':       return <svg {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'eye-off':   return <svg {...p}><path d="M17.94 17.94A10.1 10.1 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
    case 'logout':    return <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    case 'copy':      return <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    case 'user':      return <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    default: return null;
  }
};

export default SIcon;
