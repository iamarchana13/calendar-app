import React, { useState } from 'react';
import eventsData from './events.json';
import dayjs from 'dayjs';

const Schedules = () => {
  const now = dayjs();
  const [view, setView] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(now.month());
  const [selectedYear, setSelectedYear] = useState(now.year());

  const events = eventsData;

  const filtered = events.filter((e) => {
    const eventDate = dayjs(e.date);
    if (view === 'weekly') return eventDate.isSame(now, 'week');
    if (view === 'yearly') return eventDate.year() === selectedYear;
    return (
      eventDate.month() === selectedMonth && eventDate.year() === selectedYear
    );
  });

  return (
    <div className="schedules-container">
      <h2 className="schedules-title">📅 Schedules</h2>

      <div className="view-switch">
        {['monthly', 'weekly', 'yearly'].map((type) => (
          <button
            key={type}
            className={view === type ? 'active' : ''}
            onClick={() => setView(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {(view === 'monthly' || view === 'yearly') && (
        <div className="dropdowns">
          {view === 'monthly' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {dayjs().month(i).format('MMMM')}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 101 }, (_, i) => {
              const year = 1950 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      )}

      <ul className="schedule-list">
        {filtered.length > 0 ? (
          filtered.map((e, idx) => (
            <li key={idx} className="schedule-item">
              <span className="event-title">{e.title}</span> – {e.date} | {e.startTime}–{e.endTime}
            </li>
          ))
        ) : (
          <p className="no-events">No events in this view.</p>
        )}
      </ul>
    </div>
  );
};

export default Schedules;
