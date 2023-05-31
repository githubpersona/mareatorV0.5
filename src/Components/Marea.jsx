import React, { useState, useRef, useEffect } from "react";
import MareaGrafica from "./MareaGrafica";
import { UserContext } from "../Contexts/UserContext";
import { useContext } from "react";

const Marea = (props) => {
  const fecha_actual = new Date();
  // const fecha_actual = new Date("Sun May 21 2023 02:30:44");

  const { configuracion_estado } = useContext(UserContext);
  const [configuracion, setConfiguracion] = configuracion_estado;

  const { graficar_estado } = useContext(UserContext);

  // const { mareas_estado } = useContext(UserContext);
  // const [mareas, setMareas] = mareas_estado;

  const [altura_marea, setAlturaMarea] = useState("");
  const [hora_marea, setHoraMarea] = useState("");

  const flecha_marea = useRef(null);

  // let puntos_grafica_marea = {
  //   horas: [],
  //   alturas: [],
  // };

  // no he conseguido mover este estilo a un css..........................................
  const estilo_1linea = {
    color: "grey",
    fontWeight: "bold",

    fontSize: "26px",
    fontFamily: "Sans-Serif",
  };
  // no he conseguido mover este estilo a un css..........................................

  // esta función es para poder mostrar o no la cabecera de mareas (en la predicción de 7 días no se muestra)
  function cabecera() {
    if (configuracion.periodo == 2 || configuracion.periodo == 7) {
      return (
        <>
          <table className="tabla_barrainfo">
            <tr>
              <td>Marea</td>
              <td>Punto</td>
              <td>Dirección</td>
              {/* <td rowSpan="2">{hora_marea}</td> */}
              <td rowSpan="2">
                <table className="tabla_barrainfo">
                  {props.marea_actual.puntos_marea.map((marea, index) => {
                    const hora =
                      marea.fecha_marea.getHours().toString().padStart(2, "0") +
                      ":" +
                      marea.fecha_marea
                        .getMinutes()
                        .toString()
                        .padStart(2, "0");

                    return (
                      <tr key={index}>
                        <td className="td_barrainfo">{marea.marea}</td>
                        <td>
                          {hora === props.marea_actual.hora ? (
                            <b>{hora}</b>
                          ) : (
                            hora
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <img
                  src="imagenes/bola_marea_luna.png"
                  style={{ width: "2,2rem" }}
                />
              </td>
              <td style={estilo_1linea}> {altura_marea}</td>
              <td>
                <img
                  src="imagenes/flecha_marea.png"
                  ref={flecha_marea}
                  style={{ width: "2.3rem", height: "2.3rem" }}
                />
              </td>
            </tr>
          </table>
        </>
      );
    } else {
      return "";
    }
  }

  // function grafica() {
  //   debugger;
  //   if (configuracion.periodo == 2) {
  //     return <MareaGrafica url={props.url} />;
  //   } else {
  //     return "";
  //   }
  // }

  useEffect(() => {
    debugger;
    setAlturaMarea(props.marea_actual.nivel);
    setHoraMarea(props.marea_actual.hora);
    // calculamos la rotación de la flecha
    flecha_marea.current.style.transform =
      "rotate(" + props.marea_actual.direccion + "deg)";
    flecha_marea.current.height = 50;
    flecha_marea.current.width = 40;
  }, [props.marea_actual]);

  return (
    <>
      <div
        className="alert alert-info m-1"
        style={{ padding: "3px", width: "100%" }}
      >
        {cabecera()}
      </div>
      {/* altura de mareas - a {configuracion.periodo}dias */}
      {/* <MareaGrafica punto_marea_fecha1={puntos_marea[0].fecha_marea} punto_marea_altura1={puntos_marea[0].altura} punto_marea_fecha2={puntos_marea[1].fecha_marea} punto_marea_altura2={puntos_marea[1].altura} punto_marea_fecha3={puntos_marea[2].fecha_marea} punto_marea_altura3={puntos_marea[2].altura} /> */}
    </>
  );
};

export default Marea;
