import React, { useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "chart.js/auto";
import { UserContext } from "../Contexts/UserContext";
import { useContext } from "react";

const Viento = (props) => {
  const fecha_actual = new Date();
  // const fecha_actual = new Date("Wed Feb 26 2023 22:30:44");

  const horas_hoy = fecha_actual.getHours();

  const { configuracion_estado } = useContext(UserContext);

  const [configuracion, setConfiguracion] = configuracion_estado;

  const [velocidad_viento, setVelocidad_viento] = useState("");
  const [direccion_viento, setDireccion_viento] = useState("");

  const flecha_viento = useRef(null);

  Chart.register(...registerables);
  const grafica_viento = useRef(null);
  const [chart_viento, setChart_viento] = useState(null);
  let ctx = null;

  let datos = [];

  // const direcciones = ['Norte', 'Nordés', 'Este', 'Sudeste', 'Sur', 'Suroeste', 'Oeste', 'Noroeste'];
  const direcciones = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const direcciones_colores = [
    "blue",
    "#007f7f",
    "green",
    "#7f7f00",
    "red",
    "#ff6000",
    "orange",
    "#7f607f",
  ];
  const color_dia = "white";
  const color_noche = "#e6e6e6";
  const colores_columnas = Array(8)
    .fill(color_noche)
    .concat(
      Array(14)
        .fill(color_dia)
        .concat(
          Array(10)
            .fill(color_noche)
            .concat(
              Array(14)
                .fill(color_dia)
                .concat(
                  Array(10).fill(color_noche).concat(Array(14).fill(color_dia))
                )
            )
        )
    );

  const estilo_1linea = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "5px",
    fontSize: "22px",
    fontFamily: "Sans-Serif",
  };

  const estilo_centradoimagen = {
    position: "relative",
    top: "50%",
    left: "50%",
    // transform: translate('-50%', '-50%'),
  };

  const estilo_micro = {
    fontSize: "7px",
    fontFamily: "Sans-Serif",
  };

  const grados_opuestos = (grados) => {
    grados += 180;
    if (grados >= 360) {
      grados -= 360;
    }
    return grados;
  };

  const recolectar_viento = () => {
    fetch(props.url)
      .then((respuesta) => {
        return respuesta.json();
      })
      .then((data) => {
        console.log("fetch Viento...");

        console.log("Array de viento: ");

        console.log(data.hourly);
        // debugger;
        let texto_viento = "";
        datos = data.hourly;
        datos.time = datos.time.map((v) => v.slice(11, 13) + "h");

        // datos.colores = datos.winddirection_10m.map(angulo => direcciones_colores[Math.round(((angulo %= 360) < 0 ? angulo + 360 : angulo) / 45) % 8]);

        function getIndiceDireccion(angle) {
          var index =
            Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
          return index;
        }

        datos.colores = datos.winddirection_10m.map(
          (angulo) => direcciones_colores[getIndiceDireccion(angulo)]
        );

        datos.direcciones = datos.winddirection_10m.map(
          (angulo) => direcciones[getIndiceDireccion(angulo)]
        );

        datos.colores_columnas = colores_columnas;

        // console.log(datos);

        // let direcciones_ola = datos.windspeed_10m;
        // let alturas_ola = datos.winddirection_10;

        // let direccion_viento = datos.winddirection_10[fecha_actual.getHours() - 1];
        // let velocidad_viento = datos.wave_height[fecha_actual.getHours() - 1];
        // debugger;
        if (configuracion.periodo == 3) {
          let direccion_viento = datos.winddirection_10m[horas_hoy];
          let velocidad_viento = datos.windspeed_10m[horas_hoy];

          // debugger;

          setDireccion_viento(
            direcciones[getIndiceDireccion(direccion_viento)]
          );

          setVelocidad_viento(velocidad_viento);

          flecha_viento.current.style.transform =
            "rotate(" + grados_opuestos(direccion_viento) + "deg)";
        }

        makeChart_viento();
      });
  };

  recolectar_viento();

  function makeChart_viento() {
    let hasta = 73;
    if (configuracion.periodo != 3) {
      hasta = 168;
    }

    ctx = grafica_viento.current;
    if (chart_viento) {
      setChart_viento(null);
    }
    setChart_viento(
      new Chart(ctx, {
        type: "line",
        data: {
          labels: datos.time.slice(horas_hoy, hasta),
          datasets: [
            {
              data: datos.windspeed_10m.slice(horas_hoy, hasta),
              pointStyle: "circle",
              pointRadius: 4,
              pointHoverRadius: 5,
              yAxisID: "y",
              pointBackgroundColor: datos.colores.slice(horas_hoy, hasta),
            },
            {
              type: "bar",
              data: Array(datos.colores.slice(horas_hoy, hasta).length).fill(1),
              yAxisID: "y1",
              backgroundColor: datos.colores_columnas.slice(horas_hoy, hasta),
              barPercentage: 1,
              categoryPercentage: 1,
            },
          ],
        },
        options: {
          events: ["click"],
          // borderWidth: 4,
          responsive: true,
          plugins: {
            legend: {
              display: false,
              labels: {
                color: color_noche,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                maxRotation: 0,
                minRotation: 0,
              },
            },
            y: {
              title: {
                display: false,
                text: "Velocidad del viento (Km/h)",
              },
              max: 50,
              min: 0,
              ticks: {
                stepSize: 10,
              },
            },
            y1: {
              display: false,
            },
          },
        },
      })
    );
  }

  function cabecera() {
    debugger;
    if (configuracion.periodo == 3) {
      return (
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }} rowSpan="2">
                <img
                  src="imagenes/viento_redondo.png"
                  style={{ width: "3rem" }}
                />
              </td>
              <td rowSpan="2">
                <div style={estilo_1linea}>{velocidad_viento + " Km/h"}</div>
              </td>
              <td>
                <img
                  src="imagenes/flecha_viento.png"
                  ref={flecha_viento}
                  style={{ width: "3rem" }}
                />
              </td>
              <td rowSpan="2">
                <img src="imagenes/rosa_colores.png" width="40px"></img>
              </td>
            </tr>
            <tr>
              <td>{direccion_viento}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return "";
    }
  }

  return (
    <div>
      {/* VIENTO */}
      <div className="card m-2" style={{ width: "100%" }}>
        {cabecera()}
      </div>
      <div className="card m-2" style={{ width: "100%" }}>
        viento y dirección - a {configuracion.periodo}dias
        <canvas ref={grafica_viento}></canvas>
      </div>
    </div>
  );
};

export default Viento;
