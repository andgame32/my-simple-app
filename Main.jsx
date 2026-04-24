import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./Home";

// заглушки страниц
const Cards = () => <h2>Карточки</h2>;
const Analytics = () => <h2>Аналитика</h2>;
const Page1 = () => <h2>Страница 1</h2>;
const Page2 = () => <h2>Страница 2</h2>;
const Page3 = () => <h2>Страница 3</h2>;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Cards />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="page1" element={<Page1 />} />
          <Route path="page2" element={<Page2 />} />
          <Route path="page3" element={<Page3 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
