import React from "react";
import { NavLink } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../Contexts/UserContext";

const BarraMenu = () => {
  const { configuracion_estado } = useContext(UserContext);
  const [configuracion, setConfiguracion] = configuracion_estado;

  const { graficar_estado } = useContext(UserContext);
  const [graficar, setGraficar] = graficar_estado;

  let btn_periodo;

  function restringir(restringir_a) {
    let configuracion_temp = configuracion;
    configuracion_temp.periodo = restringir_a;
    btn_periodo = document.getElementById("2d");
    btn_periodo.className = "nav-link";
    btn_periodo = document.getElementById("7d");
    btn_periodo.className = "nav-link";
    btn_periodo = document.getElementById(restringir_a + "d");
    btn_periodo.className = "nav-link active";
    setConfiguracion(configuracion_temp);
    localStorage.setItem(
      "configuracion_local",
      JSON.stringify(configuracion_temp)
    );
    setGraficar(new Date());
  }

  useEffect(() => {
    // This function will be executed after rendering
    restringir(configuracion.periodo);
  }, []);

  return (
    <nav className="navbar navbar-expand navbar-dark bg-info me-auto cabecera">
      <table
        cellSpacing="0"
        cellPadding="0"
        style={{ width: "100%", height: "5em" }}
      >
        <tbody>
          <tr>
            <td align="center">
              <img src="imagenes/surf.png" width="20px"></img>
            </td>
            <td width={"100px"}>
              <h2
                className="navbar-brand "
                href="#"
                style={{
                  margin: 0,
                }}
              >
                &nbsp;Mareatorr
              </h2>
            </td>
            <td></td>
            <td>
              <div id="navbarSupportedContent">
                <ul class="nav nav-pills">
                  <li className="navbar-item">
                    <a
                      class="nav-link"
                      id="2d"
                      href="#"
                      onClick={() => restringir(2)}
                    >
                      2d
                    </a>
                  </li>
                  <li className="navbar-item">
                    <a
                      class="nav-link"
                      id="7d"
                      href="#"
                      onClick={() => restringir(7)}
                    >
                      7d
                    </a>
                  </li>
                </ul>
              </div>
            </td>
            <td>
              <div id="navbarSupportedContent">
                <ul class="nav nav-pills">
                  <li className="navbar-item">
                    <NavLink className="nav-link" aria-current="page" to="/hoy">
                      0 <span className="sr-only"></span>
                    </NavLink>
                  </li>
                  <li className="navbar-item">
                    <NavLink className="nav-link" aria-current="page" to="/mar">
                      Mar <span className="sr-only"></span>
                    </NavLink>
                  </li>
                  <li className="navbar-item">
                    <NavLink
                      className="nav-link"
                      aria-current="page"
                      to="/el_tiempo"
                    >
                      El tiempo <span className="sr-only"></span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </nav>
  );
};

export default BarraMenu;
