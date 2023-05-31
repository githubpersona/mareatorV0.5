import React, { useState, useRef } from "react";
import { registerables } from "chart.js";
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

  const flecha_ola = useRef(null);

  // Chart.register(...registerables);
  const grafica_oleaje = useRef(null);
  const [chart_oleaje, setChart_oleaje] = useState(null);

  // const [chartData, setChartData] = useState({});

  let ctx = null;

  let datos = [];
  // let data_grafica = {};

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

  const recolectar_oleaje = () => {
    let direccion_ola;
    let altura_ola;
    let periodo_ola;

    fetch(props.url)
      .then((respuesta) => {
        return respuesta.json();
      })
      .then((data) => {
        console.log("fetch Oleaje...");

        console.log(data);

        datos = data.hourly;
        // datos.time = datos.time.map(v => v.slice(8, 10) + '-' + v.slice(11, 13) + "h");
        datos.time = datos.time.map((v) => v.slice(11, 13) + "h");

        datos.colores = datos.wave_direction.map(
          (angulo) =>
            direcciones_colores[
              Math.round(((angulo %= 360) < 0 ? angulo + 360 : angulo) / 45) % 8
            ]
        );
        datos.colores_columnas = colores_columnas;

        altura_ola = datos.wave_height[horas_hoy];
        periodo_ola = datos.wave_period[horas_hoy];

        if (configuracion.periodo == 3) {
          direccion_ola = datos.wave_direction[horas_hoy];

          // function getDireccion(angle) {
          //     var direcciones = ['Norte', 'Nordés', 'Este', 'Sudeste', 'Sur', 'Sureste', 'Oeste', 'Noroeste'];
          //     var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
          //     return direcciones[index];
          // }
          setAltura_ola(altura_ola);
          setPeriodo_ola(periodo_ola);
          flecha_ola.current.style.transform =
            "rotate(" + grados_opuestos(direccion_ola) + "deg)";
        }

        // config gráfica
        // let hasta = 73;
        // if (configuracion.periodo != 3) {
        //   hasta = 168;
        // }

        // let data_grafica = {
        //   labels: datos.time.slice(horas_hoy, hasta),
        //   // labelRotation: 37,
        //   datasets: [
        //     {
        //       label: "Oleaje",
        //       type: "line",
        //       data: datos.wave_height.slice(horas_hoy, hasta),
        //       // borderColor: 'blue', // color de linea
        //       pointStyle: "circle",
        //       pointRadius: 3,
        //       yAxisID: "y",
        //       pointBackgroundColor: datos.colores.slice(horas_hoy, hasta),
        //       // backgroundColor: datos.colores_columnas.slice(horas_hoy, 73),
        //       order: 1,
        //     },
        //     {
        //       type: "bar",
        //       data: datos.wave_period.slice(horas_hoy, hasta),
        //       yAxisID: "y1",
        //       backgroundColor: "grey",
        //       barPercentage: 1,
        //       categoryPercentage: 1,
        //       order: 2,
        //     },
        //     {
        //       type: "bar",
        //       data: Array(datos.colores.slice(horas_hoy, hasta).length).fill(6),
        //       // yAxisID: 'y2',
        //       backgroundColor: datos.colores_columnas.slice(horas_hoy, hasta),
        //       barPercentage: 1,
        //       categoryPercentage: 1,
        //       order: 3,
        //     },
        //   ],
        // };

        // makeChart_oleaje(data_grafica);
        // chartData.data = data_grafica;
        // chartData.update();
        makeChart_oleaje();
      });
  };

  useEffect(() => {
    recolectar_oleaje();
  }, []);

  function makeChart_oleaje() {
    let hasta = 73;
    if (configuracion.periodo != 3) {
      hasta = 168;
    }

    ctx = grafica_oleaje.current;
    if (chart_oleaje) {
      setChart_oleaje(null);
    }

    // ctx = grafica_oleaje.current;

    // setChart_oleaje(
    // const newGraficaOleaje = new Chart(ctx, {
    //   data: data_grafica,
    const newGraficaOleaje = new Chart(ctx, {
      data: {
        labels: datos.time.slice(horas_hoy, hasta),
        // labelRotation: 37,
        datasets: [
          {
            label: "Oleaje",
            type: "line",
            data: datos.wave_height.slice(horas_hoy, hasta),
            // borderColor: 'blue', // color de linea
            pointStyle: "circle",
            pointRadius: 3,
            yAxisID: "y",
            pointBackgroundColor: datos.colores.slice(horas_hoy, hasta),
            // backgroundColor: datos.colores_columnas.slice(horas_hoy, 73),
            order: 1,
          },
          {
            type: "bar",
            data: datos.wave_period.slice(horas_hoy, hasta),
            yAxisID: "y1",
            backgroundColor: "grey",
            barPercentage: 1,
            categoryPercentage: 1,
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
      },
      options: {
        events: ["click"],

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
            ticks: {
              maxRotation: 0,
              minRotation: 0,
            },
          },
          y: {
            title: {
              display: false,
              text: "Altura de ola (m)",
            },
            grid: {
              display: false,
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
            min: 7,
          },
          y2: {
            display: false,
            position: "right",
            max: 6,
            min: 0,
          },
        },
      },
      // funciona:

      // borderWidth: 2,

      // options: {
      //     backgroundColor: "blue",
      //     borderColor: 'rgba(128, 128, 128, 0.4)',
      //     responsive: true,
      //     legend: {
      //         position: 'bottom',
      //     },
      //     hover: {
      //         mode: 'label'
      //     },
      //     scales: {
      //         xAxes: [{
      //             display: true,
      //             scaleLabel: {
      //                 display: true,
      //                 labelString: 'horas'
      //             }
      //         }],
      //         yAxes: [{
      //             display: true,
      //             ticks: {
      //                 beginAtZero: true,
      //                 steps: 10,
      //                 stepValue: 5,
      //                 min: 0,
      //                 max: 5
      //             }
      //         }]
      //     }
      // }
    });
    // setChartData(newGraficaOleaje);
  }

  function cabecera() {
    debugger;
    if (configuracion.periodo == 3) {
      return (
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>
                <img src="imagenes/ola_redondo.png" style={{ width: "3rem" }} />
              </td>
              <td>
                <div style={estilo_1linea}>{altura_ola + " m"}</div>
              </td>
              <td>
                <img
                  src="imagenes/flecha_ola.png"
                  ref={flecha_ola}
                  style={{ width: "3rem" }}
                />
              </td>
              <td>
                <div style={estilo_1linea}>{periodo_ola + " s"}</div>
              </td>
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
      <div className="card m-2" style={{ width: "100%" }}>
        {cabecera()}
      </div>
      <div className="card m-2" style={{ width: "100%" }}>
        {/* <Line options={options} data={data_chart} /> */}
        {/* <Chart ref={chartRef} type='bar' data={data_chart} /> */}
        oleaje: altura, período y dirección - a {configuracion.periodo}dias
        <canvas ref={grafica_oleaje}></canvas>
      </div>
    </div>
  );
};

export default Oleaje;
