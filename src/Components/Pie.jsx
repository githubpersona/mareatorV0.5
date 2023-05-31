import React from "react";
import { useContext } from "react";
import { UserContext } from "../Contexts/UserContext";

const Pie = (props) => {
  function borrarCache() {
    if ("caches" in window) {
      caches.keys().then((names) => {
        // Delete all the cache files
        names.forEach((name) => {
          caches.delete(name);
        });
      });
      // Makes sure the page reloads. Changes are only visible after you refresh.
      window.location.reload(true);
    }
  }

  const { localizacion_estado } = useContext(UserContext);
  const [localizacion, setLocalizacion] = localizacion_estado;

  return (
    <div className="pie miniletra container">
      {/* {localizacion.direccion} | {localizacion.latitud.toString().slice(0, 4)} ;{" "}
      {localizacion.longitud.toString().slice(0, 4)}|  */}
      La práctica's App | -{" "}
      <a href="#" onClick={borrarCache}>
        Ver: {props.version}
      </a>
      {" | "}
      <a href="/ayuda">
        <img src="imagenes/ayuda.png" height={"20px"} />
      </a>
    </div>
  );
};

export default Pie;
