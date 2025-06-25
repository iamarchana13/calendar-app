import React, { useState } from 'react';

const AddEventForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    color: '#3b82f6'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      color: '#3b82f6'
    });
  };

  return (
    <form className="add-event-form" onSubmit={handleSubmit}>
      <label>
        Event Title
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter title"
          required
        />
      </label>

      <label>
        Date
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Start Time
        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        End Time
        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Color
        <input
          type="color"
          name="color"
          value={form.color}
          onChange={handleChange}
        />
      </label>

      <button type="submit" className="ok-button">OK</button>
    </form>
  );
};

export default AddEventForm;
