import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [ascending, setAscending] = useState(true);

  useEffect(() => {
  axios
    .get("/api/project")
    .then((res) => {
      console.log(res.data); 
      setProjects(res.data);
    })
    .catch((err) => {
      console.error(err);
      setProjects([]); 
    });
}, []);

const filteredProjects = (Array.isArray(projects) ? projects : [])
  .filter((p) =>
    (p?.name || "").toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) =>
    ascending
      ? (a?.name || "").localeCompare(b?.name || "")
      : (b?.name || "").localeCompare(a?.name || "")
  );

  return (
    <div className="layout">

      <div className="logo">Proj</div>

      <header className="topbar">
        <nav>
          <Link to="/">Карточки</Link>
          <Link to="/analytics">Аналитика</Link>
          <Link to="/page1">Страница 1</Link>
          <Link to="/page2">Страница 2</Link>
          <Link to="/page3">Страница 3</Link>
        </nav>
      </header>

      <aside className="sidebar">

        <button className="btn">+ Добавить проект</button>

        <button
          className="btn"
          onClick={() => setAscending(!ascending)}
        >
          Сортировка: {ascending ? "↑" : "↓"}
        </button>

        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />

        <div className="projects">
          {filteredProjects.map((p) => (
            <div key={p.id} className="project">
              {p.name}
            </div>
          ))}
        </div>

      </aside>

      <main className="content">
        <Outlet />
      </main>

    </div>
  );
}

export default Home;
