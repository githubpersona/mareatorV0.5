import React from "react";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../Contexts/UserContext";
import { DatosLocalizacion } from "../Helpers/DatosLocalizacion";

const Localizador = () => {
  const { localizacion_estado } = useContext(UserContext);
  const [localizacion, setLocalizacion] = localizacion_estado;

  const [latitud_aqui, setLatitud_aqui] = useState();
  const [longitud_aqui, setLongitud_aqui] = useState();

  const { graficar_estado } = useContext(UserContext);
  const [graficar, setGraficar] = graficar_estado;

  // const [direccion, setDireccion] = useState("");

  // const { direccion, setDireccion } = useContext(UserContext);

  // navigator.geolocation.getCurrentPosition(function (location) {
  //     setLatitud_aqui(location.coords.latitude);
  //     setLongitud_aqui(location.coords.longitude);
  // });

  // fetch("https://nominatim.openstreetmap.org/search.php?q=" + props.latitu>d + "," + props.longitud + "&polygon_geojson=1&format=json")

  let button = 0;

  const getDireccion = (direccion) => {
    fetch(
      "https://geocode.maps.co/reverse?lat=" +
        localizacion.latitud +
        "&lon=" +
        localizacion.longitud
    )
      .then((response) => response.json())
      .then((j) => {
        var array = j.display_name.split(",");
        return (
          array[4] +
          " - " +
          array[3] +
          " - " +
          array[2] +
          " (" +
          localizacion.latitud +
          ", " +
          localizacion.longitud +
          ")"
        );
      });
  };

  function localizar(localizar_a) {
    let localizacion_temp = localizacion;
    let button = 0;
    if (localizar_a == 0) {
      // Coger las coordenadas actuales del GPS
      localizacion_temp.latitud = latitud_aqui;
      localizacion_temp.longitud = longitud_aqui;
      localizacion_temp.direccion = getDireccion();
      setLocalizacion(localizacion_temp);
    } else {
      localizacion_temp = DatosLocalizacion.localizacion[localizar_a - 1];
      setLocalizacion(localizacion_temp);
      for (let i = 1; i <= 5; i++) {
        button = document.getElementById(i);
        button.className = "btn";
      }
      button = document.getElementById(localizar_a);
      button.className = "btn btn-primary";
    }
    localStorage.setItem(
      "localizacion_local",
      JSON.stringify(localizacion_temp)
    );
    setGraficar(new Date());
    // this.addClass("btn-danger"); // PAra cambiar el botón, y quede marcado dónde estamos
  }

  useEffect(() => {
    // This function will be executed after rendering
    localizar(localizacion.id);
  }, []);

  return (
    <>
      <div className="localizador">
        <table
          cellSpacing="0"
          cellPadding="0"
          style={{ width: "100%", height: "2em" }}
        >
          <tbody>
            <tr>
              <td>
                <button
                  type="button"
                  id="5"
                  className="btn"
                  onClick={() => localizar(5)}
                >
                  <div style={{ color: "white" }}>.</div>{" "}
                </button>
              </td>
              <td>
                <button
                  type="button"
                  id="1"
                  className="btn"
                  onClick={() => localizar(1)}
                >
                  Coruña
                </button>
              </td>
              <td>
                <button
                  type="button"
                  id="2"
                  className="btn"
                  onClick={() => localizar(2)}
                >
                  Miño
                </button>
              </td>
              <td>
                <button
                  type="button"
                  id="3"
                  className="btn"
                  onClick={() => localizar(3)}
                >
                  Doniños
                </button>
              </td>
              <td>
                <button
                  type="button"
                  id="4"
                  className="btn"
                  onClick={() => localizar(4)}
                >
                  O Grove
                </button>
              </td>

              {/* <td>
                            <button type="button" className="btn" onClick={() => localizar(0)}>Aquí</button>
                        </td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Localizador;
