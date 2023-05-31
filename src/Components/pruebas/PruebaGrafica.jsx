import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useContext } from "react";
import { UserContext } from "../../Contexts/UserContext";
import "chart.js/auto";

const PruebaGrafica = (props) => {
  const grafica = useRef(null);
  const [chart, setChart] = useState(null);

  const grafica2 = useRef(null);
  const [chart2, setChart2] = useState(null);

  Chart.register(...registerables);

  const { localizacion, setLocalizacion } = useContext(UserContext);

  const url_json_tiempo_lluvia =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    localizacion.latitud +
    "&longitude=" +
    localizacion.longitud +
    "&hourly=rain&timezone=Europe%2FBerlin";

  // const url_aemet = "https://opendata.aemet.es/opendata/sh/35043832";

  const url_aemet =
    "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/15048/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzb3ljYXJsb3NuaWV2ZXNAcHJvdG9ubWFpbC5jb20iLCJqdGkiOiI0NzUxNmY0Zi1iYmVhLTQ1MzYtYmU5Mi1hYzQ2ZDgzNzVhNGYiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTY3OTE1MjQ1NCwidXNlcklkIjoiNDc1MTZmNGYtYmJlYS00NTM2LWJlOTItYWM0NmQ4Mzc1YTRmIiwicm9sZSI6IiJ9.8yuNoZeP4QYgtnq8ivQSUmpP6h768fl7N68D4CNagyo";

  // this.grafica = React.createRef();

  // this.grafica = null;
  // this.setGraficaRef = element => { this.grafica = element; };

  // let chart = null;

  let lluvia = null;
  let lluvia2 = null;

  let ctx = null;

  // useEffect(() => {
  //     ctx = grafica.current;
  //   });

  const etiquetas = [
    "00h",
    "01h",
    "02h",
    "03h",
    "04h",
    "05h",
    "06h",
    "07h",
    "08h",
    "09h",
    "10h",
    "11h",
    "12h",
    "13h",
    "14h",
    "15h",
    "16h",
    "17h",
    "18h",
    "19h",
    "20h",
    "21h",
    "22h",
    "23h",
    "24h",
  ];
  let etiquetas2 = [];

  // useEffect(() => {
  fetch(url_json_tiempo_lluvia)
    // fetch('https://api.open-meteo.com/v1/forecast?latitude=53.33&longitude=-6.25&hourly=rain&forecast_days=1&start_date=2023-03-18&end_date=2023-03-18&timezone=Europe%2FBerlin')
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((data) => {
      console.log("fetch Tiempo lluvia...");
      let datos = data.hourly;
      // console.log(datos);

      lluvia = datos.rain;

      // setTexto_tiempo(texto_tiempo);
    });
  //   }, [url_json_tiempo_lluvia])

  fetch(url_aemet)
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((data) => {
      console.log("fetch Tiempo lluvia...AEMET");
      console.log(data);
      // console.log(data[0].prediccion.dia[0].precipitacion);
      // console.log(data[0].prediccion.dia[0].precipitacion.map(({ value, periodo }) => value));

      fetch(data.datos)
        .then((respuesta) => {
          return respuesta.json();
        })
        .then((data) => {
          console.log("fetch Tiempo lluvia...AEMET - exito");
          console.log(data[0].prediccion.dia[0].precipitacion);
          console.log(
            data[0].prediccion.dia[0].precipitacion.map(
              ({ value, periodo }) => value
            )
          );

          lluvia2 = data[0].prediccion.dia[0].precipitacion.map(
            ({ value, periodo }) => value
          );
          etiquetas2 = data[0].prediccion.dia[0].precipitacion.map(
            ({ value, periodo }) => periodo
          );
          console.log(etiquetas2);
        });
    });

  //     const getLluvia = () => {
  //         debugger;
  //         fetch(url_json_tiempo_lluvia)
  //         // fetch('https://api.open-meteo.com/v1/forecast?latitude=53.33&longitude=-6.25&hourly=rain&forecast_days=1&start_date=2023-03-18&end_date=2023-03-18&timezone=Europe%2FBerlin')
  //         .then((respuesta) => {
  //             return respuesta.json()
  //         })
  //         .then((data) => {
  //             console.log("fetch Tiempo lluvia...");
  // debugger;
  //             let datos = data.hourly;
  //             // console.log(datos);

  //             lluvia = (datos.rain);

  //             // setTexto_tiempo(texto_tiempo);
  //         });
  //     }

  //     // getLluvia();

  // const ctx = grafica.current;

  //     if(chart){
  //         chart.clear();
  //         chart.destroy();
  //     }
  //     chart = new Chart(ctx, {
  //         type: 'bar',
  //         data: {
  //             labels: etiquetas,
  //             datasets: [
  //                 {
  //                     data: lluvia,
  //                 },
  //             ],
  //         },
  //     });
  // }
  function makeChart() {
    debugger;
    // useEffect(() => {
    ctx = grafica.current;
    // let chart;
    debugger;
    if (chart) {
      // chart.clear();
      // chart.destroy();
      setChart(null);
    }
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            data: lluvia,
          },
        ],
      },
    });
    //   }, [])
  }

  function makeChart_aemet() {
    debugger;
    // useEffect(() => {
    ctx = grafica2.current;
    // let chart;
    debugger;
    if (chart2) {
      // chart.clear();
      // chart.destroy();
      setChart2(null);
    }
    chart2 = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas2,
        datasets: [
          {
            data: lluvia2,
          },
        ],
      },
    });
    //   }, [])
  }

  return (
    <>
      {/* <div>
            <h1>Lluvia por horas según OpenMeteo</h1>
            <canvas ref={grafica}></canvas>
            <button onClick={makeChart}>grafica</button>
        </div> */}
      <div>
        <h1>Lluvia por horas según AEMET</h1>
        <canvas ref={grafica2}></canvas>
        <button onClick={makeChart_aemet}>grafica</button>
      </div>
    </>
  );
};

export default PruebaGrafica;
