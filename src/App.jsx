import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ClientCRM from './components/ClientCRM/ClientCRM';
import RnDTracker from './components/RnDTracker/RnDTracker';
import Marketing from './components/Marketing/Marketing';
import Finance from './components/Finance/Finance';
import Management from './components/Management/Management';
import Pikachu from './components/Pikachu/Pikachu';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="app">
        <nav className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h2>NXRA Portal</h2>
            <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
          <div className="nav-links">
            <Link to="/clients" className="nav-link">
              <span className="nav-icon">👥</span>
              <span className="nav-text">Client & CRM</span>
            </Link>
            <Link to="/rnd" className="nav-link">
              <span className="nav-icon">🔬</span>
              <span className="nav-text">R&D Tracker</span>
            </Link>
            <Link to="/marketing" className="nav-link">
              <span className="nav-icon">📱</span>
              <span className="nav-text">Marketing</span>
            </Link>
            <Link to="/finance" className="nav-link">
              <span className="nav-icon">💰</span>
              <span className="nav-text">Finance</span>
            </Link>
            <Link to="/management" className="nav-link">
              <span className="nav-icon">📊</span>
              <span className="nav-text">Management</span>
            </Link>
          </div>
          <div className="sidebar-footer">
            <p>NXRA Portal</p>
            <p className="version">v1.0.0</p>
          </div>
        </nav>

        <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/clients" replace />} />
            <Route path="/clients" element={<ClientCRM />} />
            <Route path="/rnd" element={<RnDTracker />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/management" element={<Management />} />
          </Routes>
        </main>

        {/* Pikachu Chatbot - Floating on all pages */}
        <Pikachu />
      </div>
    </Router>
  );
}

export default App;
