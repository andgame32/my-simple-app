import { useEffect, useState } from "react";
import api from "../api";
import "./Home.css";

function Home({ onLogout }) {
  const [projects, setProjects] = useState([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("asc");

  const [showForm, setShowForm] = useState(false);

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
          + Добавить проект
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

              <div className="project-title">
                {p.name}
              </div>

              <div className="project-details">
                <p><b>Code:</b> {p.code}</p>
                <p><b>Status:</b> {p.status}</p>
                <p><b>Description:</b> {p.description}</p>
                <p><b>Start:</b> {p.started_at}</p>
                <p><b>End:</b> {p.ended_at}</p>
              </div>

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
