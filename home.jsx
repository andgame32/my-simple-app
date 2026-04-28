import { useEffect, useState } from "react";
import api from "../api";

function Home({ onLogout }) {
  const [projects, setProjects] = useState([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("asc");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [newProject, setNewProject] = useState({
    name: "",
    code: "",
    status: "",
    description: "",
    started_at: "",
    ended_at: ""
  });

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
      console.log("API ERROR:", err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, search, direction]);

  const handleCreate = async () => {
    try {
      await api.post("/v1/projects", newProject);

      setShowForm(false);
      setNewProject({
        name: "",
        code: "",
        status: "",
        description: "",
        started_at: "",
        ended_at: ""
      });

      fetchProjects();

    } catch (err) {
      console.log("CREATE ERROR:", err);
    }
  };

  const handleDelete = async (id) => {
      try {
        await api.delete(`/v1/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.log("DELETE ERROR:", err);
      }
    };

    const startEdit = (project) => {
    setEditingId(project.id);
    setEditData({ ...project });
  };

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

      <div className="logo">Proj</div>

      <header className="topbar">
        <nav>
          <span>Карточки</span>
          <span>Аналитика</span>
          <span>Страница 1</span>
          <span>Страница 2</span>
          <span>Страница 3</span>
        </nav>
      </header>

      <aside className="sidebar">

        <button className="btn" onClick={() => setShowForm(!showForm)}>
          Добавить проект
        </button>

        <button
          className="btn"
          onClick={() => setDirection(direction === "asc" ? "desc" : "asc")}
        >
          Сортировка: {direction}
        </button>

        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input"
        />

        {showForm && (
          <div className="form">
            <input placeholder="Название" value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />

            <input placeholder="Код" value={newProject.code}
              onChange={(e) => setNewProject({ ...newProject, code: e.target.value })} />

            <input placeholder="Статус" value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })} />

            <input placeholder="Описание" value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />

            <input type="date" value={newProject.started_at}
              onChange={(e) => setNewProject({ ...newProject, started_at: e.target.value })} />

            <input type="date" value={newProject.ended_at}
              onChange={(e) => setNewProject({ ...newProject, ended_at: e.target.value })} />

            <button className="btn" onClick={handleCreate}>
              Создать
            </button>
          </div>
        )}
        
        <div className="projects">

          {projects.map((p) => (
            <div key={p.id} className="project">

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
                  <div className="project-title">{p.name}</div>

                  <div className="project-details">
                    <p><b>Code:</b> {p.code}</p>
                    <p><b>Status:</b> {p.status}</p>
                    <p><b>Description:</b> {p.description}</p>
                    <p><b>Start:</b> {p.started_at}</p>
                    <p><b>End:</b> {p.ended_at}</p>
                  </div>

                  <div className="project-actions">
                    <button onClick={() => startEdit(p)}>redact</button>
                    <button onClick={() => handleDelete(p.id)}>delete</button>
                  </div>
                </>
              )}

            </div>
          ))}

        </div>


      </aside>

      <main className="content">
        <h1>Главная</h1>
      </main>

    </div>
  );
}

export default Home;
