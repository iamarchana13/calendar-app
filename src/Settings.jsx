// src/Settings.jsx
import React, { useEffect, useState } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState('default');

  // On mount, read saved theme
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'default';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  // Apply to <body> and persist
  const applyTheme = (value) => {
    document.body.classList.remove('dark');
    if (value === 'dark') {
      document.body.classList.add('dark');
    }
    // if value is 'light' or 'default', ensure no 'dark' class
  };

  const handleChange = (e) => {
    const next = e.target.value;
    setTheme(next);
    localStorage.setItem('theme', next);
    applyTheme(next);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <div className="setting-item">
        <label>
          <input
            type="radio"
            name="theme"
            value="default"
            checked={theme === 'default'}
            onChange={handleChange}
          />{' '}
          Default
        </label>
      </div>

      <div className="setting-item">
        <label>
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={handleChange}
          />{' '}
          Light Mode
        </label>
      </div>

      <div className="setting-item">
        <label>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={handleChange}
          />{' '}
          Dark Mode
        </label>
      </div>
    </div>
  );
};

export default Settings;
