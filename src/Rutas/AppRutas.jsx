import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mar from "../Paginas/Mar";
import Playas from "../Paginas/Playas";
import BarraMenu from "../components/BarraMenu";
import ElTiempo from "../Paginas/ElTiempo";
import Localizador from "../components/Localizador";

const AppRutas = () => {
  return (
    <Router>
      <BarraMenu />
      <Localizador />
      <div className="container-fluid text-center contenido">
        <Routes>
          <Route exact path="/mar" element={<Mar />} />
          <Route exact path="/playas" element={<Playas />} />

          <Route exact path="/el_tiempo" element={<ElTiempo />} />
          <Route path="*" element={<Mar />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRutas;
