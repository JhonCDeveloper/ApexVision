import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// 1. Exponer React globalmente para compatibilidad temporal con los componentes JSX antiguos
window.React = React;

// 2. Cargar infraestructura
import './infrastructure/api/api-client.js';
import './infrastructure/i18n.js';
import './presentation/components/particles.js';

import './presentation/pages/seller-home.jsx';
import './presentation/pages/seller-record.jsx';
import './presentation/pages/seller-results.jsx';
import './presentation/pages/seller-live.jsx';
import './presentation/pages/seller-billing.jsx';
import './presentation/pages/seller-app.jsx';
import './presentation/pages/admin-app.jsx';

// 4. Cargar enrutador
import AppRouter from './presentation/routes/AppRouter.jsx';

// 5. Montar aplicación SPA
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);
