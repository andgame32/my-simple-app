import React, { useEffect, useState } from "react";
import axios from "axios";
import "./milestones.css";

const API = "http://localhost:8000/v1/projects/milestones";

export default function Milestones() {
  const [milestones, setMilestones] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [editingId, setEditingId] = useState(null);
  
  const fetchMilestones = async () => {
    try {
      const res = await axios.get(API);
      setMilestones(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
      
        await axios.put(`${API}/${editingId}`, form);
      } else {
      
        await axios.post(API, form);
      }

      setForm({ title: "", description: "", status: "" });
      setEditingId(null);
      fetchMilestones();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchMilestones();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (milestone) => {
    setForm({
      title: milestone.title,
      description: milestone.description,
      status: milestone.status,
    });
    setEditingId(milestone.id);
  };

  return (
    <div className="milestones-page">
      <h2>Milestones</h2>

      <form onSubmit={handleSubmit} className="milestone-form">
        <input
          type="text"
          name="title"
          placeholder="Название этапа"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Описание"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="status"
          placeholder="Статус"
          value={form.status}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Обновить" : "Добавить"}
        </button>
      </form>

      <div className="milestones-list">
        {milestones.map((m) => (
          <div key={m.id} className="milestone-card">
            <h3>{m.title}</h3>
            <p>{m.description}</p>
            <span>{m.status}</span>

            <div className="actions">
              <button onClick={() => handleEdit(m)}>✏️</button>
              <button onClick={() => handleDelete(m.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
