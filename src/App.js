import React from "react";
import AppRutas from "./Rutas/AppRutas";
import Pie from "./components/Pie";
import { useState } from "react";
import { UserContext } from "./Contexts/UserContext";
import { DatosLocalizacion } from "./Helpers/DatosLocalizacion";
import { Configuracion } from "./Helpers/Configuracion";

const App = () => {
  const version = "0.5.1 3/7";
  if (localStorage.getItem("localizacion_local") === null) {
    localStorage.setItem(
      "localizacion_local",
      JSON.stringify(DatosLocalizacion.localizacion[0])
    );
  }
  if (localStorage.getItem("configuracion_local") === null) {
    localStorage.setItem(
      "configuracion_local",
      JSON.stringify(Configuracion.configuracion[0])
    );
  }
  const local_temp = JSON.parse(localStorage.getItem("localizacion_local"));
  const configuracion_temp = JSON.parse(localStorage.getItem("configuracion_local"));

  const [localizacion_estado, setLocalizacionEstado] = useState(local_temp);
  const [configuracion_estado, setConfiguracionEstado] = useState(configuracion_temp);
  

  return (
    <UserContext.Provider value={{ localizacion_estado: [localizacion_estado, setLocalizacionEstado], configuracion_estado: [configuracion_estado, setConfiguracionEstado] }}>
      <AppRutas />
      <Pie version={version} />
    </UserContext.Provider>
  );

};

export default App;
