import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mar from "../Paginas/Mar";
import Playas from "../Paginas/Playas";
import BarraMenu from "../Components/BarraMenu";
import ElTiempo from "../Paginas/ElTiempo";
import Localizador from "../Components/Localizador";
import Ayuda from "../Paginas/Ayuda";
import Ahora from "../Paginas/Ahora";

const AppRutas = () => {
  return (
    <Router>
      <BarraMenu />
      <Localizador />
      <div className="container text-center contenido">
        <Routes>
          {/* <Route exact path="/ahora" element={<Ahora />} /> */}

          <Route exact path="/mar" element={<Mar />} />
          {/* <Route exact path="/playas" element={<Playas />} /> */}
          <Route exact path="/el_tiempo" element={<ElTiempo />} />
          <Route exact path="/ayuda" element={<Ayuda />} />

          <Route path="*" element={<Mar />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRutas;
