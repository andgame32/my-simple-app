import { useEffect, useState } from "react";
import api from "../api";
import "./Home.css";

function Home({ onLogout }) {
  const [projects, setProjects] = useState([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("asc");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // =========================
  // 📦 Загрузка
  // =========================
  const fetchProjects = async () => {
    try {
      const res = await api.get("/v1/projects", {
        params: {
          page,
          per_page: 5,
          q: search,
          sort: "name",
          direction
        }
      });

      setProjects(res.data.data || res.data);

    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, search, direction]);

  // =========================
  // ❌ Удаление
  // =========================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/v1/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  // =========================
  // ✏️ Начать редактирование
  // =========================
  const startEdit = (project) => {
    setEditingId(project.id);
    setEditData({ ...project });
  };

  // =========================
  // 💾 Сохранить
  // =========================
  const saveEdit = async () => {
    try {
      await api.put(`/v1/projects/${editingId}`, editData);

      setEditingId(null);
      setEditData({});
      fetchProjects();

    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  return (
    <div className="layout">

      <aside className="sidebar">

        <button
          className="btn"
          onClick={() => setDirection(direction === "asc" ? "desc" : "asc")}
        >
          Сортировка: {direction}
        </button>

        <input
          className="input"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <div className="projects">

          {projects.map((p) => (
            <div key={p.id} className="project">

              {/* 🔥 ЕСЛИ РЕДАКТИРУЕМ */}
              {editingId === p.id ? (
                <div className="form">

                  <input value={editData.name || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />

                  <input value={editData.code || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, code: e.target.value })
                    }
                  />

                  <input value={editData.status || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                  />

                  <input value={editData.description || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                  />

                  <input type="date" value={editData.started_at || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, started_at: e.target.value })
                    }
                  />

                  <input type="date" value={editData.ended_at || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, ended_at: e.target.value })
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
                  {/* 🔹 Обычный вид */}
                  <div className="project-title">{p.name}</div>

                  {/* 🔥 Hover детали */}
                  <div className="project-details">
                    <p><b>Code:</b> {p.code}</p>
                    <p><b>Status:</b> {p.status}</p>
                    <p><b>Description:</b> {p.description}</p>
                    <p><b>Start:</b> {p.started_at}</p>
                    <p><b>End:</b> {p.ended_at}</p>
                  </div>

                  {/* 🔘 ДЕЙСТВИЯ */}
                  <div className="project-actions">
                    <button onClick={() => startEdit(p)}>✏️</button>
                    <button onClick={() => handleDelete(p.id)}>❌</button>
                  </div>
                </>
              )}

            </div>
          ))}

        </div>

      </aside>

    </div>
  );
}

export default Home;
