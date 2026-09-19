import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const homeTop = () => {
    const stage = document.querySelector('.s-stage');
    if (stage) stage.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const PublicTopBar = window.PublicTopBar;
  const PublicLanding = window.PublicLanding;

  if (!PublicTopBar || !PublicLanding) return null;

  return (
    <div className="s-shell">
      <PublicTopBar onHome={homeTop} onSection={scrollToId} />
      <PublicLanding onStart={() => navigate('/vendedor')} />
    </div>
  );
}

function SellerPage() {
  const SellerApp = window.SellerApp;
  if (!SellerApp) return null;
  return <SellerApp />;
}

function AdminPage() {
  const AdminApp = window.AdminApp;
  if (!AdminApp) return null;
  return <AdminApp />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/vendedor/*" element={<SellerPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
    </Routes>
  );
}
