import { useEffect, useState } from "react";
import api from "../api";

function Milestones({ projectId }) {
  const [milestones, setMilestones] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    status: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // ================= GET =================
  const fetchMilestones = async () => {
    if (!projectId) return;

    try {
      const res = await api.get(`/v1/projects/${projectId}/milestones`);
      setMilestones(res.data.data || res.data);
    } catch (err) {
      console.log("GET ERROR:", err);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      await api.post(
        `/v1/projects/${projectId}/milestones`,
        newMilestone
      );

      setShowForm(false);
      setNewMilestone({
        title: "",
        description: "",
        status: ""
      });

      fetchMilestones();
    } catch (err) {
      console.log("CREATE ERROR:", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/v1/projects/milestones/${id}`);
      fetchMilestones();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  // ================= EDIT =================
  const startEdit = async (id) => {
    try {
      const res = await api.get(`/v1/projects/milestones/${id}`);

      setEditingId(id);
      setEditData(res.data);
    } catch (err) {
      console.log("GET ONE ERROR:", err);
    }
  };

  const saveEdit = async () => {
    try {
      await api.put(
        `/v1/projects/milestones/${editingId}`,
        editData
      );

      setEditingId(null);
      setEditData({});
      fetchMilestones();
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  // ================= UI =================

  return (
    <div className="content">

      <h1>Milestones</h1>

      <button className="btn" onClick={() => setShowForm(!showForm)}>
        Добавить этап
      </button>

      {showForm && (
        <div className="form">
          <input
            placeholder="Название"
            value={newMilestone.title}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, title: e.target.value })
            }
          />

          <input
            placeholder="Описание"
            value={newMilestone.description}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, description: e.target.value })
            }
          />

          <input
            placeholder="Статус"
            value={newMilestone.status}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, status: e.target.value })
            }
          />

          <button className="btn" onClick={handleCreate}>
            Создать
          </button>
        </div>
      )}

      <div className="projects">

        {milestones.map((m) => (
          <div key={m.id} className="project">

            {editingId === m.id ? (
              <div className="form">

                <input
                  value={editData.title || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />

                <input
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />

                <input
                  value={editData.status || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                />

                <button className="btn" onClick={saveEdit}>
                  Сохранить
                </button>

                <button
                  className="btn"
                  onClick={() => setEditingId(null)}
                >
                  Отмена
                </button>

              </div>
            ) : (
              <>
                <div className="project-title">{m.title}</div>

                <div className="project-details">
                  <p><b>Status:</b> {m.status}</p>
                  <p><b>Description:</b> {m.description}</p>
                </div>

                <div className="project-actions">
                  <button onClick={() => startEdit(m.id)}>edit</button>
                  <button onClick={() => handleDelete(m.id)}>delete</button>
                </div>
              </>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default Milestones;
