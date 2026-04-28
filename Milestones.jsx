import { useEffect, useState } from "react";
import api from "../api";

function Home({ onLogout }) {
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);

  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    description: "",
    status: ""
  });

  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

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

  // ================= PROJECTS =================

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
  };

  const handleDelete = async (id) => {
    await api.delete(`/v1/projects/${id}`);
    fetchProjects();
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setEditData({ ...project });
  };

  const saveEdit = async () => {
    await api.put(`/v1/projects/${editingId}`, editData);
    setEditingId(null);
    setEditData({});
    fetchProjects();
  };

  // ================= MILESTONES =================

  const fetchMilestones = async (code) => {
    const res = await api.get(`/v1/projects/${code}/milestones`);
    setMilestones(res.data.data || res.data);
  };

  const selectProject = (project) => {
    setSelectedProject(project);
    fetchMilestones(project.code); // 🔥 ключевой момент
  };

  const createMilestone = async () => {
    await api.post(
      `/v1/projects/${selectedProject.code}/milestones`,
      milestoneForm
    );

    setMilestoneForm({ title: "", description: "", status: "" });
    setShowMilestoneForm(false);
    fetchMilestones(selectedProject.code);
  };

  const deleteMilestone = async (id) => {
    await api.delete(`/v1/projects/milestones/${id}`);
    fetchMilestones(selectedProject.code);
  };

  const startEditMilestone = (m) => {
    setEditingMilestoneId(m.id);
    setMilestoneForm(m);
  };

  const saveMilestone = async () => {
    await api.put(
      `/v1/projects/milestones/${editingMilestoneId}`,
      milestoneForm
    );

    setEditingMilestoneId(null);
    setMilestoneForm({ title: "", description: "", status: "" });
    fetchMilestones(selectedProject.code);
  };

  // ================= UI =================

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
            <input placeholder="Название"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />

            <input placeholder="Код"
              value={newProject.code}
              onChange={(e) => setNewProject({ ...newProject, code: e.target.value })} />

            <button className="btn" onClick={handleCreate}>
              Создать
            </button>
          </div>
        )}

        <div className="projects">

          {projects.map((p) => (
            <div key={p.id} className="project">

              <div className="project-title">{p.name}</div>

              <div className="project-actions">
                <button onClick={() => selectProject(p)}>
                  выбрать
                </button>
                <button onClick={() => startEdit(p)}>edit</button>
                <button onClick={() => handleDelete(p.id)}>delete</button>
              </div>

            </div>
          ))}

        </div>

      </aside>

      {/* ================= MILESTONES ================= */}
      <main className="content">

        {!selectedProject ? (
          <h1>Выберите проект</h1>
        ) : (
          <>
            <h1>{selectedProject.name}</h1>

            <button
              className="btn"
              onClick={() => setShowMilestoneForm(!showMilestoneForm)}
            >
              Добавить этап
            </button>

            {showMilestoneForm && (
              <div className="form">
                <input
                  placeholder="Название"
                  value={milestoneForm.title}
                  onChange={(e) =>
                    setMilestoneForm({ ...milestoneForm, title: e.target.value })
                  }
                />

                <input
                  placeholder="Описание"
                  value={milestoneForm.description}
                  onChange={(e) =>
                    setMilestoneForm({ ...milestoneForm, description: e.target.value })
                  }
                />

                <input
                  placeholder="Статус"
                  value={milestoneForm.status}
                  onChange={(e) =>
                    setMilestoneForm({ ...milestoneForm, status: e.target.value })
                  }
                />

                <button onClick={createMilestone}>Создать</button>
              </div>
            )}

            <div className="projects">
              {milestones.map((m) => (
                <div key={m.id} className="project">

                  {editingMilestoneId === m.id ? (
                    <div className="form">
                      <input
                        value={milestoneForm.title}
                        onChange={(e) =>
                          setMilestoneForm({ ...milestoneForm, title: e.target.value })
                        }
                      />

                      <input
                        value={milestoneForm.description}
                        onChange={(e) =>
                          setMilestoneForm({ ...milestoneForm, description: e.target.value })
                        }
                      />

                      <input
                        value={milestoneForm.status}
                        onChange={(e) =>
                          setMilestoneForm({ ...milestoneForm, status: e.target.value })
                        }
                      />

                      <button onClick={saveMilestone}>Сохранить</button>
                    </div>
                  ) : (
                    <>
                      <div className="project-title">{m.title}</div>
                      <p>{m.description}</p>
                      <p>{m.status}</p>

                      <div className="project-actions">
                        <button onClick={() => startEditMilestone(m)}>
                          edit
                        </button>
                        <button onClick={() => deleteMilestone(m.id)}>
                          delete
                        </button>
                      </div>
                    </>
                  )}

                </div>
              ))}
            </div>
          </>
        )}

      </main>

    </div>
  );
}

export default Home;
