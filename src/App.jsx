import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ClientCRM from './components/ClientCRM/ClientCRM';
import RnDTracker from './components/RnDTracker/RnDTracker';
import Marketing from './components/Marketing/Marketing';
import Finance from './components/Finance/Finance';
import Management from './components/Management/Management';
import TaskManagement from './components/TaskManagement/TaskManagement';
import Teams from './components/Teams/Teams';
import Pikachu from './components/Pikachu/Pikachu';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get their data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              uid: firebaseUser.uid,
              ...userDoc.data()
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loader"></div>
        <p>Loading NXRA Portal...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

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
            <Link to="/dashboard" className="nav-link">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Dashboard</span>
            </Link>
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
            <Link to="/tasks" className="nav-link">
              <span className="nav-icon">✓</span>
              <span className="nav-text">Tasks</span>
            </Link>
            <Link to="/teams" className="nav-link">
              <span className="nav-icon">👥</span>
              <span className="nav-text">Teams</span>
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
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Logout
            </button>
            <p className="version">v2.0.0</p>
          </div>
        </nav>

        <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/clients" element={<ClientCRM />} />
            <Route path="/rnd" element={<RnDTracker />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/tasks" element={<TaskManagement user={user} />} />
            <Route path="/teams" element={<Teams user={user} />} />
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
