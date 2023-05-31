import React, { useState, useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import "chart.js/auto";

const MareaGrafica = (props) => {
  const fecha_mañana = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const fecha_mañana_texto = String(
    fecha_mañana.getMonth() +
      1 +
      fecha_mañana.getDate() +
      fecha_mañana.getFullYear()
  );

  let puntos_grafica_marea = {
    horas: [],
    alturas: [],
  };
  let puntos_marea_hoy = [];
  let puntos_marea = [];

  Chart.register(...registerables);
  const grafica_marea = useRef(null);
  const [chart_marea, setChart_marea] = useState(null);
  const [semaforo, setSemaforo] = useState(null);

  let ctx = null;

  const recolectar_marea = (dia) => {
    let fecha_marea,
      hoy = new Date();
    let marea, hora, hora2, altura;

    // Recolectamos los puntos de marea del IHM para el día de HOY
    fetch(props.url)
      .then((respuesta) => {
        return respuesta.json();
      })
      .then((data) => {
        debugger;
        console.log("fetch Mareas...");
        console.log(data);

        let puntos_marea_gmt = data.mareas.datos.marea;
        let puntos_marea = [];

        console.log("puntos_marea_gmt");
        console.log(puntos_marea_gmt);
        // PASAMOS LAS FECHAS DE LOS PUNTOS DE MAREA DE GMT A CEST
        for (let i = puntos_marea_gmt.length - 1; i >= 0; i--) {
          marea = puntos_marea_gmt[i].tipo;
          hora = puntos_marea_gmt[i].hora;
          altura = puntos_marea_gmt[i].altura;
          fecha_marea = new Date(
            Date.UTC(
              hoy.getFullYear(),
              hoy.getMonth(),
              hoy.getDate(),
              hora.substring(0, 2),
              hora.substring(3, 5),
              0,
              0
            )
          );

          puntos_marea = [{ fecha_marea, marea, altura }].concat(puntos_marea); // [ 4, 3, 2, 1 ]
        }
        setSemaforo(1);
        console.log(puntos_marea);
        return puntos_marea;
      });
  };

  const recolectar_mareas = () => {
    let nivel_marea_actual = "desconocido";
    let indice_marea_referencia = 0;
    let estado_marea_actual = "desconocido";

    let marea, hora, hora2, altura;
    let fecha_marea,
      hoy = new Date();
    let hourDiff;

    debugger;
    let flecha_marea_direccion = 0;

    puntos_marea_hoy = recolectar_marea(0);

    console.log("puntos_marea_ hoy");
    console.log(puntos_marea_hoy);

    // fetch(props.url + "&date=20" + fecha_mañana_texto)
    //     .then((respuesta) => {
    //         return respuesta.json()
    //     })
    //     .then((data) => {
    //         console.log("fetch Mareas mañana..");
    //         console.log(data);

    //         // let nivel_marea_actual = "desconocido";
    //         // let indice_marea_referencia = 0;
    //         // let estado_marea_actual = "desconocido";

    //         // let marea, hora, hora2, altura;
    //         // let fecha_marea, hoy = new Date();
    //         // let hourDiff;

    //         // let puntos_marea_gmt = data.mareas.datos.marea;

    //         // let flecha_marea_direccion = 0;

    //         // console.log("puntos_marea_gmt");
    //         // console.log(puntos_marea_gmt);
    //         // // PASAMOS LAS FECHAS DE LOS PUNTOS DE MAREA DE GMT A CEST
    //         // for (let i = puntos_marea_gmt.length - 1; i >= 0; i--) {
    //         //     marea = puntos_marea_gmt[i].tipo;
    //         //     hora = puntos_marea_gmt[i].hora;
    //         //     altura = puntos_marea_gmt[i].altura;
    //         //     // console.log("Marea " + marea + " a las " + hora);
    //         //     fecha_marea = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), hora.substring(0, 2), hora.substring(3, 5), 0, 0));
    //         //     // console.log("fecha_marea : " + fecha_marea);
    //         //     // debugger;
    //         //     // console.log("CEST: " + fecha_marea.toLocaleString('es-ES',));
    //         //     // puntos_marea[i] = fecha_marea;

    //         //     puntos_marea_hoy = [{ fecha_marea, marea, altura }].concat(puntos_marea_hoy); // [ 4, 3, 2, 1 ]
    //         // }
    //     });

    // añado un punto más para terminar la gráfica aproximadamente
    // if (marea == "bajamar") {
    //     altura = 4;
    // } else {
    //     altura = 0;
    // }
    // puntos_marea = puntos_marea_hoy.concat({ fecha_marea, marea, altura });
    // // puntos_marea[puntos_marea.length].altura = altura;

    // console.log("puntos_mareaa")
    // console.log(puntos_marea);

    // debugger;
    // let z = 0;
    // let grados_iniciales = 0;
    // // let i = 0;
    // let hora_inicial = 0;
    // for (let i = 0; i <= puntos_marea.length - 2; i++) {

    //     let a = Math.abs((puntos_marea[i].altura - puntos_marea[i + 1].altura) / 2);

    //     puntos_grafica_marea.horas[z] = hora_inicial + z;
    //     puntos_grafica_marea.alturas[z] = puntos_marea[i].altura;
    //     if (puntos_marea[i].marea == 'bajamar') {
    //         grados_iniciales = 270;
    //     } else {
    //         grados_iniciales = 90;
    //     }
    //     for (let y = 1; y < 179; y++) {
    //         let radianes = (grados_iniciales + y) * Math.PI / 180;
    //         puntos_grafica_marea.horas[z + y] = hora_inicial + z + y;
    //         puntos_grafica_marea.alturas[z + y] = 2.13 + (a * Math.sin(radianes)); // le sumo 2.13 para que siempre estén por encima de 0 y recuperen su valor original
    //     }
    //     z = z + 180;
    // }

    // console.log("puntos grafica marea")
    // console.log(puntos_grafica_marea);

    // // debugger;

    makeChart_marea();
  };

  useEffect(() => {
    recolectar_mareas();
  }, []);

  if (semaforo === null) {
    return <>Still loading...</>;
  }

  function makeChart_marea() {
    ctx = grafica_marea.current;
    if (chart_marea) {
      setChart_marea(null);
    }
    setChart_marea(
      new Chart(ctx, {
        type: "line",
        data: {
          // labels: puntos_grafica_marea.horas.slice(horas_hoy, 73),
          labels: puntos_grafica_marea.horas,

          datasets: [
            {
              data: puntos_grafica_marea.alturas,
              pointStyle: "circle",
              pointRadius: 2,
              pointHoverRadius: 2,
              yAxisID: "y",
              // pointBackgroundColor: datos.colores.slice(horas_hoy, 73),
            },
            // {
            //     type: 'bar',
            //     data: Array(datos.colores.slice(horas_hoy, 73).length).fill(1),
            //     yAxisID: 'y1',
            //     backgroundColor: datos.colores_columnas.slice(horas_hoy, 73),
            //     barPercentage: 1,
            //     categoryPercentage: 1,

            // },
          ],
        },
        options: {
          events: ["click"],
          // borderWidth: 4,
          responsive: true,
          plugins: {
            legend: {
              display: false,
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
                display: true,
                text: "Altura de marea (m)",
              },
              // max: 70,
              // min: 0,
              // ticks: {
              //     stepSize: 5
              // }
            },
            // y1: {
            //     display: false,
            // },
          },
        },
      })
    );
  }

  return (
    <div className="card m-2" style={{ width: "100%" }}>
      <canvas ref={grafica_marea}></canvas>
    </div>
  );
};

export default MareaGrafica;
