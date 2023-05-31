import React, { useState, useRef, useEffect } from "react";
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
  const grafica = useRef(null);
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
  const colores_columnas = [
    ...Array(8).fill(color_noche),
    ...Array(14).fill(color_dia),
    ...Array(10).fill(color_noche),
    ...Array(14).fill(color_dia),
    ...Array(10).fill(color_noche),
    ...Array(14).fill(color_dia),
    ...Array(3).fill(color_noche),
  ];

  let fecha = new Date();
  let etiquetas = [];
  let etiqueta_fecha = "";
  let dias_prevision = 7;
  for (let y = 0; y < dias_prevision; y++) {
    for (let i = 0; i < 24; i++) {
      fecha.setDate(fecha_actual.getDate() + y);
      if (i > 4 && i < 22) {
        etiqueta_fecha =
          fecha
            .toLocaleString("es-ES", { weekday: "long" })
            .substring(0, 2)
            .toUpperCase() +
          "." +
          fecha.getDate();
      }
      etiquetas = etiquetas.concat(
        i.toString().padStart(2, "0") + "h" + ";" + etiqueta_fecha
      );
      etiqueta_fecha = "";
    }
  }

  const estilo_1linea = {
    color: "grey",
    fontWeight: "bold",
    fontSize: "26px",
    fontFamily: "Arial",
  };

  const grados_opuestos = (grados) => {
    grados += 180;
    if (grados >= 360) {
      grados -= 360;
    }
    return grados;
  };

  const [parametrosGrafica, setParametrosGrafica] = useState({});

  useEffect(() => {
    const data = {};
    const opciones = {};
    if (grafica && grafica.current) {
      const nuevaInstanciaGrafica = new Chart(grafica.current, {
        type: "line",
        data: data,
        options: opciones,
      });

      setParametrosGrafica(nuevaInstanciaGrafica);
    }
  }, []);

  const recolectar_viento = () => {
    fetch(props.url)
      .then((respuesta) => {
        return respuesta.json();
      })
      .then((data) => {
        // console.log("fetch Viento...");
        // console.log("Array de viento: ");
        // console.log(data.hourly);
        // debugger;
        datos = data.hourly;
        // datos.time = datos.time.map((v) => v.slice(11, 13) + "h");
        datos.etiquetas = etiquetas;

        function getIndiceDireccion(angle) {
          var index =
            Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
          return index;
        }

        datos.colores = datos.winddirection_10m.map(
          (angulo) => direcciones_colores[getIndiceDireccion(angulo)]
        );

        // datos.direcciones = datos.winddirection_10m.map(
        //   (angulo) => direcciones[getIndiceDireccion(angulo)]
        // );

        datos.colores_columnas = colores_columnas;

        if (configuracion.periodo == 2 || configuracion.periodo == 7) {
          let direccion_viento = datos.winddirection_10m[horas_hoy];
          let velocidad_viento = datos.windspeed_10m[horas_hoy];
          setDireccion_viento(
            direcciones[getIndiceDireccion(direccion_viento)]
          );
          setVelocidad_viento(velocidad_viento);
          flecha_viento.current.style.transform =
            "rotate(" + grados_opuestos(direccion_viento) + "deg)";
        }
        datos.colores_columnas = [
          ...colores_columnas,
          ...colores_columnas,
          ...colores_columnas,
        ];
        makeChart_viento();
      });
  };

  const { graficar_estado } = useContext(UserContext);

  useEffect(() => {
    recolectar_viento();
  }, [graficar_estado]);

  function makeChart_viento() {
    let hasta = 49;
    if (configuracion.periodo != 2) {
      hasta = 168;
    }

    ctx = grafica.current;
    if (chart_viento) {
      setChart_viento(null);
    }

    const nuevosDatos = {
      // labels: datos.time.slice(horas_hoy, hasta),
      labels: datos.etiquetas.slice(horas_hoy, hasta),
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
    };

    const nuevasOpciones = {
      events: ["click"],
      // borderWidth: 4,
      responsive: true,
      maintainAspectRatio: false,
      // height: 200, // Specify the desired height here
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
          position: "bottom", // Place the x-axis labels on top
          grid: {
            display: false, // Hide the x-axis grid lines
          },
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            callback: function (label) {
              let etiqueta = this.getLabelForValue(label);
              var horas = etiqueta.split(";")[0];
              return horas;
            },
          },
        },
        x_dias: {
          // Add a second x-axis scale for the bottom labels
          position: "bottom", // Place the x-axis labels on bottom
          grid: {
            display: false, // Hide the x-axis grid lines
          },
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            callback: function (label) {
              let etiqueta = this.getLabelForValue(label);
              var dia = etiqueta.split(";")[1];
              return dia;
            },
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
    };

    parametrosGrafica.data = nuevosDatos;
    parametrosGrafica.options = nuevasOpciones;

    parametrosGrafica.plugins = {
      afterDatasetsDraw: function (chart) {
        var ctx = chart.ctx;

        chart.data.datasets.forEach(function (dataset, datasetIndex) {
          var meta = chart.getDatasetMeta(datasetIndex);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {
              // Draw the value as text on each point
              ctx.fillStyle = "black";
              var fontSize = 12;
              var fontStyle = "bold";
              var fontFamily = "Arial";
              ctx.font = Chart.helpers.fontString(
                fontSize,
                fontStyle,
                fontFamily
              );
              var dataString = dataset.data[index].toString();
              ctx.fillText(dataString, element._model.x, element._model.y - 10);
            });
          }
        });
      },
    };

    parametrosGrafica.update();
  }

  function cabecera() {
    if (configuracion.periodo == 2 || configuracion.periodo == 7) {
      return (
        <>
          <table className="tabla_barrainfo">
            <tr>
              <td rowSpan={2}>
                <img
                  src="imagenes/viento_redondo.png"
                  style={{ width: "2,2rem" }}
                />
                <br></br>
                Viento
              </td>
              <td>
                Velocidad<br></br>
              </td>
              <td style={{ verticalAlign: "top" }}>
                Dirección: {direccion_viento}
                <br></br>
              </td>
              <td rowSpan={2}>
                <img src="imagenes/rosa_colores.png" width="50px"></img>
              </td>
            </tr>
            <tr>
              <td>
                <span style={estilo_1linea}> {velocidad_viento} Km/h</span>
              </td>
              <td style={{ verticalAlign: "top" }}>
                <img
                  src="imagenes/flecha_viento.png"
                  ref={flecha_viento}
                  style={{ width: "3rem" }}
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

  return (
    <div>
      {/* VIENTO */}
      <div
        className="alert alert-info m-1"
        style={{ padding: "3px", width: "100%" }}
      >
        {cabecera()}{" "}
      </div>
      <div className="card m-2" style={{ width: "100%", height: "175px" }}>
        {/* viento y dirección - a {configuracion.periodo}dias */}
        <canvas ref={grafica}></canvas>
      </div>
    </div>
  );
};

export default Viento;
