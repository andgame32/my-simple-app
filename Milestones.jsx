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

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("asc");

  const [showForm, setShowForm] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

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
    fetchProjects();
  };

  // ================= MILESTONES =================

  const fetchMilestones = async (projectCode) => {
    try {
      const res = await api.get(`/v1/projects/${projectCode}/milestones`);
      setMilestones(res.data.data || res.data);
    } catch (err) {
      console.log("MILESTONE ERROR:", err);
    }
  };

  const selectProject = (project) => {
    setSelectedProject(project);
    fetchMilestones(project.code); // 🔥 используем code
  };

  const createMilestone = async () => {
    if (!selectedProject) return;

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
        </nav>
      </header>

      {/* SIDEBAR */}
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
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />
            <input placeholder="Код"
              value={newProject.code}
              onChange={(e) =>
                setNewProject({ ...newProject, code: e.target.value })
              }
            />
            <button className="btn" onClick={handleCreate}>
              Создать
            </button>
          </div>
        )}

        {/* СПИСОК ПРОЕКТОВ */}
        <div className="projects">
          {projects.map((p) => (
            <div
              key={p.id}
              className={`project ${selectedProject?.id === p.id ? "active" : ""}`}
              onClick={() => selectProject(p)}
            >
              <div className="project-title">{p.name}</div>
              <div className="project-actions">
                <button onClick={(e) => { e.stopPropagation(); startEdit(p); }}>
                  edit
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}>
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="content">

        {!selectedProject ? (
          <h2>Выберите проект</h2>
        ) : (
          <>
            <h2>{selectedProject.name} — Milestones</h2>

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

                <button className="btn" onClick={createMilestone}>
                  Создать
                </button>
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

                      <button onClick={saveMilestone}>save</button>
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
