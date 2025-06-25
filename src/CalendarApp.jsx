import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import AddEventForm from './AddEventForm';
import eventsData from './events.json';
import './styles.css';

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState('monthly');
  const [events, setEvents] = useState(eventsData);
  const [showConflict, setShowConflict] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [conflictDates, setConflictDates] = useState([]);

  const isConflict = (eventsForDay) => {
    const sorted = [...eventsForDay].sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].endTime > sorted[i + 1].startTime) {
        return true;
      }
    }
    return false;
  };

  const findConflictDates = useCallback(() => {
    const grouped = events.reduce((acc, e) => {
      if (!acc[e.date]) acc[e.date] = [];
      acc[e.date].push(e);
      return acc;
    }, {});

    const dates = [];
    Object.entries(grouped).forEach(([date, eventsForDate]) => {
      if (isConflict(eventsForDate)) {
        dates.push(date);
      }
    });
    return dates;
  }, [events]);

  useEffect(() => {
    const conflictSetting = localStorage.getItem('conflictDetection') === 'true';
    setShowConflict(conflictSetting);
  }, []);

  useEffect(() => {
    const newConflictDates = findConflictDates();
    setConflictDates(newConflictDates);
  }, [findConflictDates]);

  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]);
    setShowAddForm(false);
  };

  const handleDeleteEvent = (eventToDelete) => {
    const updatedEvents = events.filter(
      (e) =>
        !(
          e.title === eventToDelete.title &&
          e.date === eventToDelete.date &&
          e.startTime === eventToDelete.startTime &&
          e.endTime === eventToDelete.endTime
        )
    );
    setEvents(updatedEvents);
  };

  const generateDates = () => {
    if (viewMode === 'yearly') {
      return Array.from({ length: 12 }, (_, i) =>
        currentDate.startOf('year').add(i, 'month')
      );
    }

    let start =
      viewMode === 'monthly'
        ? currentDate.startOf('month').startOf('week')
        : currentDate.startOf('week');

    let end =
      viewMode === 'monthly'
        ? currentDate.endOf('month').endOf('week')
        : currentDate.endOf('week');

    const dates = [];
    let date = start;
    while (date.isBefore(end) || date.isSame(end, 'day')) {
      dates.push(date);
      date = date.add(1, 'day');
    }
    return dates;
  };

  const groupedEvents = events.reduce((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  const goToPrevious = () => {
    setCurrentDate(currentDate.subtract(1, viewMode));
  };

  const goToNext = () => {
    setCurrentDate(currentDate.add(1, viewMode));
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
  };

  return (
    <div className="calendar-app">
      <header className="calendar-top">
        <div className="calendar-title">
          <p className="current-date-details">
            {dayjs().format('dddd, DD MMM YYYY')}
          </p>
        </div>

        <div className="calendar-actions">
          <button onClick={goToPrevious}>&lt;</button>

          <div className="month-year-group" style={{ display: 'flex', gap: '10px' }}>
            <select
              value={currentDate.month()}
              onChange={(e) => setCurrentDate(currentDate.month(parseInt(e.target.value)))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>
                  {dayjs().month(i).format('MMMM')}
                </option>
              ))}
            </select>

            <select
              value={currentDate.year()}
              onChange={(e) => setCurrentDate(currentDate.year(parseInt(e.target.value)))}
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

          <button onClick={goToNext}>&gt;</button>
          <button onClick={goToToday}>Today</button>

          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>

          <button className="add-event-btn" onClick={() => setShowAddForm(!showAddForm)}>
            + Add Event
          </button>
        </div>

        {showAddForm && (
          <div className="dropdown-form">
            <AddEventForm onAdd={handleAddEvent} />
          </div>
        )}
      </header>

      {showConflict && conflictDates.length > 0 && (
        <div className="conflict-summary">
          {conflictDates.map((date, idx) => (
            <div key={idx} className="conflict-alert">
              Overlapping events on {dayjs(date).format('DD MMM YYYY')}
            </div>
          ))}
        </div>
      )}

      <section className="calendar-view">
        {viewMode !== 'yearly' && (
          <div className="weekdays">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="weekday">
                {dayjs().day(i).format('ddd')}
              </div>
            ))}
          </div>
        )}

        {viewMode !== 'yearly' ? (
          <div className="days-grid">
            {generateDates().map((date, i) => {
              const dateStr = date.format('YYYY-MM-DD');
              const dayEvents = groupedEvents[dateStr] || [];
              const hasConflict = conflictDates.includes(dateStr);

              return (
                <div
                  key={i}
                  className={`day-cell ${dayjs().isSame(date, 'day') ? 'highlight' : ''} ${hasConflict ? 'conflict-day' : ''}`}
                >
                  <div className="date-label">{date.date()}</div>

                  {hasConflict && (
                    <div className="conflict-message">Overlapping events</div>
                  )}

                  <div className="event-list">
                    {dayEvents.map((ev, idx) => (
                      <div
                        key={idx}
                        className="event-tag"
                        style={{
                          borderLeft: `5px solid ${ev.color || '#3b82f6'}`,
                          background: '#f1f5f9',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          position: 'relative',
                          paddingRight: '20px',
                        }}
                        title={`${ev.title} (${ev.startTime} - ${ev.endTime})`}
                      >
                        <div className="event-title">{ev.title}</div>
                        <div className="time-text">
                          {ev.startTime} - {ev.endTime}
                        </div>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteEvent(ev)}
                          title="Delete event"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="year-grid">
            {generateDates().map((month, idx) => (
              <div key={idx} className="month-box">
                {month.format('MMMM')}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CalendarApp;
