import React from "react";
import AppRutas from "./Rutas/AppRutas";
import Pie from "./Components/Pie";
import { useState } from "react";
import { UserContext } from "./Contexts/UserContext";
import { DatosLocalizacion } from "./Helpers/DatosLocalizacion";
import { Configuracion } from "./Helpers/Configuracion";

const App = () => {
  const version = "0.6.2 ge";
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
  const configuracion_temp = JSON.parse(
    localStorage.getItem("configuracion_local")
  );

  const [localizacion_estado, setLocalizacionEstado] = useState(local_temp);
  const [configuracion_estado, setConfiguracionEstado] =
    useState(configuracion_temp);
  const [graficar_estado, setGraficarEstado] = useState(new Date());
  const [mareas_estado, setMareasEstado] = useState();

  return (
    <UserContext.Provider
      value={{
        localizacion_estado: [localizacion_estado, setLocalizacionEstado],
        configuracion_estado: [configuracion_estado, setConfiguracionEstado],
        graficar_estado: [graficar_estado, setGraficarEstado],
        mareas_estado: [mareas_estado, setMareasEstado],
      }}
    >
      <AppRutas />
      <Pie version={version} />
    </UserContext.Provider>
  );
};

export default App;
