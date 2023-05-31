import React, { useState, useRef } from "react";
// import { registerables } from "chart.js";
import Chart from "chart.js/auto";
import { useEffect } from "react";
import { UserContext } from "../Contexts/UserContext";
import { useContext } from "react";

const Oleaje = (props) => {
  const fecha_actual = new Date();
  const horas_hoy = fecha_actual.getHours();

  const { configuracion_estado } = useContext(UserContext);
  const [configuracion, setConfiguracion] = configuracion_estado;

  const [altura_ola, setAltura_ola] = useState("");
  const [periodo_ola, setPeriodo_ola] = useState("");

  // const flecha_ola = useRef(null);

  // Chart.register(...registerables);
  const grafica = useRef(null);
  const [chart_oleaje, setChart_oleaje] = useState(null);
  // const [chartData, setChartData] = useState({});

  // const container = useRef(null);
  const canvasRef = useRef(null);

  let context = null;

  let datos = [];
  // let data_grafica = {};

  const direcciones = [
    { label: "N", range: [0, 22.5], color: "blue" },
    { label: "NE", range: [22.5, 67.5], color: "#007f7f" },
    { label: "E", range: [67.5, 112.5], color: "green" },
    { label: "SE", range: [112.5, 157.5], color: "#7f7f00" },
    { label: "S", range: [157.5, 202.5], color: "red" },
    { label: "SW", range: [202.5, 247.5], color: "#ff6000" },
    { label: "W", range: [247.5, 292.5], color: "orange" },
    { label: "NW", range: [292.5, 337.5], color: "#7f607f" },
    { label: "N", range: [337.5, 360], color: "blue" },
  ];

  // Creo un array de 36h de colores para dia y noche
  const color_dia = "white";
  const color_noche = "#e6e6e6";
  const colores_columnas = [
    ...Array(8).fill(color_noche),
    ...Array(14).fill(color_dia),
    ...Array(10).fill(color_noche),
    ...Array(14).fill(color_dia),
    ...Array(10).fill(color_noche),
    ...Array(14).fill(color_dia),
    ...Array(2).fill(color_noche),
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

  const number = {
    position: "relative",
    top: "10px",
    left: "10px",
    zIndex: "1",
    color: "grey",
    // backgroundColor: "DodgerBlue",
    // padding: "5px",
    fontSize: "24px",
    fontFamily: "Sans-Serif",
  };

  // para girar la flecha hacia donde va
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
    // const numberElement = document.createElement("div");
    // numberElement.classList.add("number");
    // numberElement.innerText = "5";

    // // Append the number element to the container
    // // const container = document.querySelector(".container");
    // container.current.appendChild(numberElement);
  }, []);

  const recolectar_oleaje = () => {
    let direccion_ola;
    let altura_ola;
    let periodo_ola;

    fetch(props.url)
      .then((respuesta) => {
        return respuesta.json();
      })
      .then((data) => {
        console.log("fetch Oleaje... exito");
        console.log("fetch Oleaje OpenMeteo: " + props.url);

        console.log(data);

        datos = data.hourly;
        // datos.time = datos.time.map((v) => v.slice(11, 13) + "h");
        datos.etiquetas = etiquetas;

        let color = "blue";

        datos.colores = datos.wave_direction.map((angulo) => {
          for (const direction of direcciones) {
            if (angulo >= direction.range[0] && angulo < direction.range[1]) {
              return direction.color;
            }
          }
        });

        datos.colores_columnas = colores_columnas;

        altura_ola = datos.wave_height[horas_hoy].toFixed(1);
        periodo_ola = datos.wave_period[horas_hoy].toFixed(1);

        if (configuracion.periodo == 2 || configuracion.periodo == 7) {
          direccion_ola = datos.wave_direction[horas_hoy];
          setAltura_ola(altura_ola);
          setPeriodo_ola(periodo_ola);
          // flecha_ola.current.style.transform =
          //   "rotate(" + grados_opuestos(direccion_ola) + "deg)";
          // flecha_ola.current.style.zIndex = "-1";
          datos.colores_columnas = [
            ...colores_columnas,
            ...colores_columnas,
            ...colores_columnas,
          ];
        }

        // console.log("fetch Oleaje...");
        // console.log(datos);
        graficar_oleaje();
        bolaflechar(altura_ola, direccion_ola);
      });
  };

  const { graficar_estado } = useContext(UserContext);

  useEffect(() => {
    recolectar_oleaje();
  }, [graficar_estado]);

  function graficar_oleaje() {
    let hasta = 49;
    if (configuracion.periodo != 2) {
      hasta = 168;
    }

    context = grafica.current;
    if (chart_oleaje) {
      setChart_oleaje(null);
    }

    const nuevosDatos = {
      // labels: datos.time.slice(horas_hoy, hasta),
      labels: datos.etiquetas.slice(horas_hoy, hasta),
      datasets: [
        {
          label: "Oleaje",
          type: "bar",
          yAxisID: "y",
          data: datos.wave_height.slice(horas_hoy, hasta),
          // pointStyle: "circle",
          // pointRadius: 3,
          // pointBackgroundColor: datos.colores.slice(horas_hoy, hasta),
          backgroundColor: datos.colores.slice(horas_hoy, hasta),
          order: 1,
        },
        {
          label: "Periodo",
          type: "line",
          data: datos.wave_period.slice(horas_hoy, hasta),
          yAxisID: "y1",
          borderWidth: 2,
          borderColor: "purple",
          pointRadius: 0,
          // backgroundColor: "grey",

          // barPercentage: 1,
          // categoryPercentage: 1,
          order: 2,
        },
        {
          type: "bar",
          data: Array(datos.colores.slice(horas_hoy, hasta).length).fill(6),
          // yAxisID: 'y2',
          backgroundColor: datos.colores_columnas.slice(horas_hoy, hasta),
          barPercentage: 1,
          categoryPercentage: 1,
          order: 3,
        },
      ],
    };

    const nuevasOpciones = {
      events: ["click"],
      maintainAspectRatio: false,
      // height: 100, // Specify the desired height here
      // backgroundColor: "#b9bbc2", // de las barras
      // backgroundColor: datos.colores.slice(horas_hoy, 73),
      plugins: {
        legend: {
          display: false,
          labels: {
            color: "grey",
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
            text: "Altura de ola (m)",
          },
          grid: {
            display: true,
          },
          display: true,
          position: "left",
          max: 6,
          min: 0,
          ticks: {
            stepSize: 1,
          },
          backgroundColor: "white",

          // fillColor: "red",
          // strokeColor: "rgba(220,220,220,0.8)",
          // highlightFill: "rgba(220,220,220,0.75)",
          // highlightStroke: "rgba(220,220,220,1)",
        },
        y1: {
          title: {
            display: false,
            text: "Período (s)",
          },
          grid: {
            display: false,
          },
          display: true,
          position: "right",
          max: 15,
          min: 5,
        },
        y2: {
          display: false,
          position: "right",
          max: 6,
          min: 0,
        },
      },
    };

    parametrosGrafica.data = nuevosDatos;
    parametrosGrafica.options = nuevasOpciones;
    parametrosGrafica.update();
  }

  // const tableStyle = {
  //   borderCollapse: "collapse",
  //   width: "100%",
  // };

  // const cellStyle = {
  //   padding: "7",
  //   border: "none",
  //   textAlign: "center",
  // };

  function cabecera() {
    if (configuracion.periodo == 2 || configuracion.periodo == 7) {
      return (
        <>
          <table className="tabla_barrainfo">
            <tr>
              <td rowSpan={2}>
                <img
                  src="imagenes/ola_redondo.png"
                  style={{ width: "2,1rem" }}
                />
                <br></br>
                Oleaje
              </td>
              <td rowSpan={2}>
                <canvas ref={canvasRef} width={70} height={70} />
              </td>
              <td>
                Período<br></br>
              </td>
              <td rowSpan={2}>
                <img src="imagenes/rosa_colores.png" width="50px"></img>
              </td>
            </tr>
            <tr>
              <td>
                <span style={estilo_1linea}> {periodo_ola + " s"}</span>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      backgroundColor: "purple",
                      height: "2px",
                      width: "50px",
                    }}
                  ></div>
                </div>
              </td>
            </tr>
          </table>
        </>
      );
    } else {
      return "";
    }
  }

  function bolaflechar(altura_ola, direccion_ola) {
    // direccion_ola = 18;
    const degrees = direccion_ola;
    let color = "blue";
    // Find the cardinal direction for the given degrees
    for (const direction of direcciones) {
      if (degrees >= direction.range[0] && degrees < direction.range[1]) {
        color = direction.color;
      }
    }
    // const color = direcciones_colores[degreesToNumber(direccion_ola)];
    direccion_ola = grados_opuestos(direccion_ola);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 25;

    // Clear the canvas context
    context.clearRect(0, 0, canvas.width, canvas.height);

    // // Draw the circle
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();

    // Calculate the position of the arrow
    const arrowLength = radius / 2;
    const angle = ((90 - direccion_ola) * Math.PI) / 180; // Convert angle to radians
    const arrowX = centerX + Math.cos(angle) * (radius + arrowLength);
    const arrowY = centerY - Math.sin(angle) * (radius + arrowLength);

    // Draw the arrowhead
    const arrowheadSize = 30;
    const arrowheadAngle = Math.PI / 6; // 30 degrees in radians
    const arrowheadX =
      arrowX - Math.cos(angle + arrowheadAngle) * arrowheadSize;
    const arrowheadY =
      arrowY + Math.sin(angle + arrowheadAngle) * arrowheadSize;
    context.fillStyle = color;

    context.beginPath();
    context.moveTo(arrowX, arrowY);
    context.lineTo(arrowheadX, arrowheadY);
    context.lineTo(
      arrowX - Math.cos(angle - arrowheadAngle) * arrowheadSize,
      arrowY + Math.sin(angle - arrowheadAngle) * arrowheadSize
    );
    context.closePath();
    context.fillStyle = color;
    context.fill();

    // Draw the number
    context.font = "bold 24px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(altura_ola, centerX, centerY);
  }

  return (
    <div>
      <div
        className="alert alert-info m-1"
        style={{ padding: "3px", width: "100%" }}
      >
        {cabecera()}
      </div>
      <div className="card m-2" style={{ width: "100%", height: "200px" }}>
        {/* oleaje: altura, período y dirección - a {configuracion.periodo}dias */}
        <canvas ref={grafica}></canvas>
      </div>
    </div>
  );
};

export default Oleaje;
