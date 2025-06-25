import React, { useState } from 'react';
import CalendarApp from './CalendarApp';
import Schedules from './Schedules';
import Settings from './Settings';
import './styles.css';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleAuthToggle = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="layout">
      <aside className="nav-panel">
        <div className="brand">EventPilot</div>
        <nav>
          <ul>
            <li
              onClick={() => setCurrentTab('dashboard')}
              className={currentTab === 'dashboard' ? 'active' : ''}
            >
              Calendar
            </li>
            <li
              onClick={() => setCurrentTab('schedules')}
              className={currentTab === 'schedules' ? 'active' : ''}
            >
              My Schedules

            </li>
            <li
              onClick={() => setCurrentTab('settings')}
              className={currentTab === 'settings' ? 'active' : ''}
            >
              Settings
            </li>
          </ul>
        </nav>

        <footer>
          <div className="user-info-row">
            <div className="user-initials">{isLoggedIn ? 'A' : '—'}</div>
            <button className="auth-btn" onClick={handleAuthToggle}>
              {isLoggedIn ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </footer>
      </aside>

      <main className="calendar-content">
        {currentTab === 'dashboard' && <CalendarApp />}
        {currentTab === 'schedules' && <Schedules />}
        {currentTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;



