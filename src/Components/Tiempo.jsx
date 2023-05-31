import React, { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useContext } from "react";
import { UserContext } from "../Contexts/UserContext";
import "chart.js/auto";

const Tiempo = (props) => {
  const fecha_actual = new Date();
  // const fecha_actual = new Date("Fri Mar 03 2023 05:00:44");
  const horas_hoy = fecha_actual.getHours();

  const { configuracion_estado } = useContext(UserContext);
  const [configuracion, setConfiguracion] = configuracion_estado;

  const [temperatura, setTemperatura] = useState("");
  const [precipitacion, setPrecipitacion] = useState("");
  const [lluvia, setLluvia] = useState("");

  const [lluviaxhoras, setLluviaXHoras] = useState("");
  const [cielo, setCielo] = useState("");

  const img_cielo = useRef(null);
  const img_lluvia = useRef(null);

  Chart.register(...registerables);
  let ctx = null;
  const grafica = useRef(null);
  const [chart_tiempo2, setChart_tiempo2] = useState(null);

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

  // AEMET divide así los datos de probabilidad
  const franjas_dia = [
    { label: "8", range: [0, 10] },
    { label: "14", range: [11, 16] },
    { label: "20", range: [17, 23] },
  ];

  // const cieloes = [
  //   "Despejado",
  //   "Poco nuboso",
  //   "Muy nuboso",
  //   "Cubierto",
  //   "Nubes altas",
  // ];
  const cielo_colores = ["white", "#bdbdbd", "#78909c", "#263238", "#E4E4E4"];
  const cieloes = ["0-25", "25-50", "50-75", "75-100"];
  const cieloes_colores = ["white", "#bdbdbd", "#78909c", "#263238"];

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

  let datos_aemet = [];
  let datos_openmeteo = [];
  let datos = [];

  const estilo_1linea = {
    color: "grey",
    fontWeight: "bold",
    fontSize: "26px",
    fontFamily: "Sans-Serif",
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

  function convertValueToRange(value) {
    if (value >= 0 && value <= 100) {
      if (value > 75) {
        return 1;
      } else if (value > 50) {
        return 0.5;
      } else {
        return 0;
      }
    } else {
      return null; // or handle out-of-range values as per your requirements
    }
  }

  const recolectar_tiempo = () => {
    let url = "";
    if (configuracion.periodo == 2) {
      url = props.url_aemet;
      fetch(url)
        .then((respuesta) => {
          return respuesta.json();
        })
        .then((data) => {
          console.log("fetch Tiempo lluvia...AEMET 1 - éxito");
          console.log("acceso AEMET: " + url);

          // console.log(data);
          // // console.log(data[0].prediccion.dia[0].precipitacion);
          // console.log(data.datos);

          // console.log(data[0].prediccion.dia[0].precipitacion.map(({ value, periodo }) => value));

          let lluvia_ahora;
          let temperatura_ahora;
          let cielo_ahora;
          let prediccion_desde;
          const url2 = data.datos;

          fetch(url2)
            .then((respuesta) => {
              return respuesta.json();
            })
            .then((data) => {
              console.log("fetch Tiempo lluvia...AEMET 2 - exito");

              console.log("datos AEMET: " + url2);

              console.log(data);

              if (configuracion.periodo == 2 || configuracion.periodo == 7) {
                datos.colores_columnas = [
                  ...colores_columnas,
                  ...colores_columnas,
                  ...colores_columnas,
                ];
                lluvia_ahora = data[0].prediccion.dia[0].precipitacion.find(
                  (item) => item.periodo == horas_hoy
                ).value;
                temperatura_ahora = data[0].prediccion.dia[0].temperatura.find(
                  (item) => item.periodo == horas_hoy
                ).value;
                cielo_ahora = data[0].prediccion.dia[0].estadoCielo.find(
                  (item) => item.periodo == horas_hoy
                ).value;

                switch (cielo_ahora) {
                  case "11":
                  case "11n":
                    img_cielo.current.src = "imagenes/cielo_despejado.png";
                  case "12n":
                  case "12":
                    img_cielo.current.src = "imagenes/cielo_poco_nuboso.png";
                    break;
                  case "13n":
                  case "13":
                    img_cielo.current.src =
                      "imagenes/cielo_intervalos_nubosos.png";
                    break;
                  case "14n":
                  case "14":
                    img_cielo.current.src = "imagenes/cielo_nuboso.png";
                    break;
                  case "15":
                  case "15n":
                    img_cielo.current.src = "imagenes/cielo_muy_nuboso.png";
                    break;
                  case "16":
                  case "16n":
                    img_cielo.current.src = "imagenes/cielo_cubierto.png";
                    break;
                  case "17n":
                  case "17":
                    img_cielo.current.src = "imagenes/cielo_nubes_altas.png";
                    break;
                  case "24n":
                  case "24":
                    img_cielo.current.src =
                      "imagenes/cielo_nuboso_con_lluvia.png";
                    break;
                  case "43n":
                  case "43":
                    img_cielo.current.src =
                      "imagenes/cielo_intervalos_nubosos_con_lluvia_escasa.png";
                    break;
                  case "46":
                  case "46n":
                    img_cielo.current.src =
                      "imagenes/cielo_cubierto_lluvia_escasa.png";
                    break;
                  case "54":
                  case "54n":
                    img_cielo.current.src =
                      "imagenes/cielo_cubierto_con_tormenta.png";
                    break;
                  case "81":
                  case "81n":
                    img_cielo.current.src = "imagenes/cielo_niebla.png";
                    break;
                  case "82":
                  case "82n":
                    img_cielo.current.src = "imagenes/cielo_bruma.png";
                    break;
                }

                if (lluvia_ahora > 0.8) {
                  img_lluvia.current.src = "imagenes/lluvia_mucha.png";
                } else if (lluvia_ahora > 0.5) {
                  img_lluvia.current.src = "imagenes/lluvia_media.png";
                } else if (lluvia_ahora > 0) {
                  img_lluvia.current.src = "imagenes/lluvia_poca.png";
                } else if (lluvia_ahora == 0) {
                  img_lluvia.current.src = "imagenes/seco.png";
                }
              }

              // console.log("datos_aemet");
              // console.log(datos_aemet);

              datos.etiquetas = etiquetas;

              let valores_hoy = [];
              let valores_manana = [];
              let valores_pasado = [];

              valores_hoy = data[0].prediccion.dia[0].precipitacion.map(
                ({ value, periodo }) => value
              );
              valores_manana = data[0].prediccion.dia[1].precipitacion.map(
                ({ value, periodo }) => value
              );
              valores_pasado = data[0].prediccion.dia[2].precipitacion.map(
                ({ value, periodo }) => value
              );
              prediccion_desde = parseInt(
                data[0].prediccion.dia[0].precipitacion[0].periodo
              );
              datos.lluvia = Array(prediccion_desde)
                .fill(0)
                .concat(
                  valores_hoy.concat(valores_manana.concat(valores_pasado))
                );

              // ARREGLO: cambiar el valor 'Ip' por 0.05mm

              var targetValues = ["Ip"];
              var newValue = "0.05";

              for (var i = 0; i < datos.lluvia.length; i++) {
                if (targetValues.includes(datos.lluvia[i])) {
                  datos.lluvia[i] = newValue; // Replace with the new value
                }
              }

              let probabilidad_franja = 0;
              datos.lluvia_aprox = datos.lluvia;
              for (let y = 0; y < 3; y++) {
                // para los 3 días
                probabilidad_franja = convertValueToRange(
                  data[0].prediccion.dia[0].probPrecipitacion[y]
                );
                for (let i = 0; i < 10; i++) {
                  // recorremos las horas de cada franja del dia
                  datos.lluvia_aprox[y * 24 + i] =
                    parseFloat(datos.lluvia[y * 24 + i]) + probabilidad_franja;
                  // convertValueToRange(data[0].prediccion.dia[0].probPrecipitacion[y]);
                }
                for (let i = 10; i < 17; i++) {
                  // recorremos las horas de cada franja del dia
                  datos.lluvia_aprox[y * 24 + i] =
                    parseFloat(datos.lluvia[y * 24 + i]) + probabilidad_franja;
                  // convertValueToRange(data[0].prediccion.dia[0].probPrecipitacion[y]);
                }
                for (let i = 17; i <= 23; i++) {
                  // recorremos las horas de cada franja del dia
                  datos.lluvia_aprox[y * 24 + i] =
                    parseFloat(datos.lluvia[y * 24 + i]) + probabilidad_franja; // convertValueToRange(data[0].prediccion.dia[0].probPrecipitacion[y]);
                }
              }

              // -- ARREGLO: cambiar el valor 'Ip' por 0.05mm

              // datos.lluvia_aprox = datos.lluvia;

              // valores_hoy = data[0].prediccion.dia[0].probPrecipitacion.map(
              //   ({ value, periodo }) => value
              // );
              // valores_manana = data[0].prediccion.dia[1].probPrecipitacion.map(
              //   ({ value, periodo }) => value
              // );
              // valores_pasado = data[0].prediccion.dia[2].probPrecipitacion.map(
              //   ({ value, periodo }) => value
              // );
              // datos.probabilidad_precipitacion = Array(prediccion_desde)
              //   .fill(0)
              //   .concat(
              //     valores_hoy.concat(valores_manana.concat(valores_pasado))
              //   );

              valores_hoy = data[0].prediccion.dia[0].temperatura.map(
                ({ value, periodo }) => value
              );
              valores_manana = data[0].prediccion.dia[1].temperatura.map(
                ({ value, periodo }) => value
              );
              valores_pasado = data[0].prediccion.dia[2].temperatura.map(
                ({ value, periodo }) => value
              );
              datos.temperatura = Array(prediccion_desde)
                .fill(0)
                .concat(
                  valores_hoy.concat(valores_manana.concat(valores_pasado))
                );

              valores_hoy = data[0].prediccion.dia[0].estadoCielo.map(
                ({ value, periodo }) => value
              );
              valores_manana = data[0].prediccion.dia[1].estadoCielo.map(
                ({ value, periodo }) => value
              );
              valores_pasado = data[0].prediccion.dia[2].estadoCielo.map(
                ({ value, periodo }) => value
              );
              datos.cielo = Array(prediccion_desde)
                .fill(0)
                .concat(
                  valores_hoy.concat(valores_manana.concat(valores_pasado))
                );

              datos.colores_cielo = datos.cielo.map((cielo) => {
                switch (cielo) {
                  case "11":
                  case "11n":
                    return cielo_colores[0];
                    break;
                  case "12n":
                  case "12":
                    return cielo_colores[1];
                    break;
                  case "14n":
                  case "14":
                    return cielo_colores[1];
                    break;
                  case "15":
                  case "15n":
                    return cielo_colores[2];
                    break;
                  case "16":
                  case "16n":
                    return cielo_colores[3];
                    break;
                  case "17n":
                  case "17":
                    return cielo_colores[4];
                    break;
                  case "46":
                  case "46n":
                    return cielo_colores[3];
                    break;
                  default:
                    return "white";
                }
              });

              // datos.etiquetas = etiquetas;
              // datos.dias = dias;

              console.log(datos);

              setLluviaXHoras(lluviaxhoras);

              setTemperatura(temperatura_ahora);
              setPrecipitacion(lluvia_ahora);

              // recibo datos_aemet de openmeteo, para completar la predicción de las 48h hasta 7 días que da openmeteo (aunque la grafica corte en 3)
              makeChart_tiempo2();
            });
        });
    } else {
      url = props.url_openmeteo;

      fetch(url)
        .then((respuesta) => {
          return respuesta.json();
        })
        .then((data) => {
          console.log("fetch Tiempo OpenMeteo... exito");
          console.log("fetch Tiempo OpenMeteo: " + url);

          console.log(data);

          datos = data.hourly;
          // datos.time = datos.time.map(v => v.slice(8, 10) + '-' + v.slice(11, 13) + "h");

          datos.time = datos.time.map((v) => v.slice(11, 13) + "h");

          datos.colores_cielo = datos.cloudcover.map(
            (cielo) => cieloes_colores[Math.ceil(cielo / 25) - 1]
          );
          datos.colores_columnas = [
            ...colores_columnas,
            ...colores_columnas,
            ...colores_columnas,
          ];
          datos.etiquetas = etiquetas;
          // datos.lluvia = datos.rain;
          // datos.lluvia = datos.rain;

          datos.lluvia_aprox = [];
          datos.lluvia_aprox = datos.rain.map((lluvia, indice) => {
            return (
              lluvia +
              convertValueToRange(datos.precipitation_probability[indice])
            );
          });
          // console.log(datos);

          datos.temperatura = datos.temperature_2m;
          // datos.cielo = datos.cloudcover;
          // datos.precipitacion = datos.precipitation_probability;

          let temperatura = datos.temperature_2m[horas_hoy];
          let precipitacion = datos.precipitation_probability[horas_hoy];
          let cielo = datos.cloudcover[horas_hoy];
          let lluvia =
            datos.rain[horas_hoy] +
            convertValueToRange(datos.precipitation_probability[horas_hoy]);

          // function getDireccion(angle) {
          //     var direcciones = ['Norte', 'Nordés', 'Este', 'Sudeste', 'Sur', 'Sureste', 'Oeste', 'Noroeste'];
          //     var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
          //     return direcciones[index];
          // }

          // texto_tiempo = temperatura + "ᵒ - cielo: " + cielo + "% - Precipitación: " + precipitacion + "% ";
          // texto_tiempo = "--";

          if (cielo > 30) {
            img_cielo.current.src = "imagenes/nubes.png";
          } else if (cielo > 5) {
            img_cielo.current.src = "imagenes/solynubes.png";
          }

          if (lluvia > 0.5) {
            img_lluvia.current.src = "imagenes/lluvia_mucha.png";
          } else if (lluvia > 0.2) {
            img_lluvia.current.src = "imagenes/lluvia_media.png";
          } else if (lluvia > 0) {
            img_lluvia.current.src = "imagenes/lluvia_poca.png";
          } else if (lluvia == 0) {
            img_lluvia.current.src = "imagenes/seco.png";
          }

          setTemperatura(temperatura);
          setPrecipitacion(precipitacion);
          setLluvia(lluvia);
          setCielo(cielo);
          setLluviaXHoras(lluviaxhoras);

          console.log(datos);
          // makeChart_tiempo();
          makeChart_tiempo2();
          // makeChart_tiempo3();
        });
    }
  };

  // recolectar_tiempo();

  const { graficar_estado } = useContext(UserContext);

  useEffect(() => {
    recolectar_tiempo();
  }, [graficar_estado]);

  function makeChart_tiempo2() {
    let hasta = 49;
    if (configuracion.periodo != 2) {
      hasta = 168;
    }

    ctx = grafica.current;

    const nuevosDatos = {
      labels: datos.etiquetas.slice(horas_hoy, hasta),
      datasets: [
        {
          type: "line",
          yAxisID: "y_temperatura",
          borderWidth: 2,
          borderColor: "red",
          pointRadius: 0,
          data: datos.temperatura.slice(horas_hoy, hasta),
        },
        // {
        //   type: "line",
        //   xAxisID: "x_temperatura",
        //   data: datos.temperatura.slice(horas_hoy, hasta),
        // },
        {
          type: "line",
          yAxisID: "y_cielo",
          pointStyle: "rectRounded",
          pointRadius: 2,
          borderColor: "blue",
          borderWidth: 0,
          data: Array(datos.etiquetas.slice(horas_hoy, hasta).length).fill(99),
          backgroundColor: datos.colores_cielo.slice(horas_hoy, hasta),
        },
        // {
        //   type: "bar",
        //   yAxisID: "y_cielo",
        //   borderWidth: 0,
        //   data: Array(datos.cielo.slice(horas_hoy, hasta).length).fill(100),
        //   backgroundColor: datos.colores_cielo.slice(horas_hoy, hasta),
        //   barPercentage: 1,
        //   categoryPercentage: 1,
        // },
        {
          type: "bar",
          yAxisID: "y_lluvia",
          borderWidth: 0,
          backgroundColor: "blue",
          data: datos.lluvia_aprox.slice(horas_hoy, hasta),
          barPercentage: 1,
          categoryPercentage: 1,
        },
        // {
        //   type: "line",
        //   yAxisID: "y_lluvia",
        //   borderWidth: 0,
        //   pointStyle: "circle",
        //   pointRadius: 3,
        //   borderColor: "blue",
        //   data: datos.lluvia.slice(horas_hoy, hasta),
        // },
        // {
        //   type: "bar",
        //   yAxisID: "y_lluvia",
        //   data: datos.lluvia.slice(horas_hoy, hasta),
        // },
        {
          type: "bar",
          data: Array(datos.etiquetas.slice(horas_hoy, hasta).length).fill(5),
          yAxisID: "y_dianoche",
          backgroundColor: datos.colores_columnas.slice(horas_hoy, hasta),
          barPercentage: 1,
          categoryPercentage: 1,
        },
      ],
    };

    const nuevasOpciones = {
      events: [],
      backgroundColor: "blue",

      // backgroundColor: "#b9bbc2", // de las barras
      // backgroundColor: datos_aemet.colores.slice(horas_hoy, 73),
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
        y_temperatura: {
          title: {
            display: false,
            text: "grados",
          },
          grid: {
            display: false,
          },
          display: true,
          position: "left",
          max: 40,
          min: 0,
        },
        y_cielo: {
          title: {
            display: false,
            text: "%",
          },
          grid: {
            display: false,
          },
          display: false,
          position: "left",
          max: 100,
          min: 0,
        },
        y_lluvia: {
          title: {
            display: false,
            text: "mm",
          },
          grid: {
            display: false,
          },
          display: false,
          position: "right",
          max: 2,
          min: 0,
        },
        y_dianoche: {
          display: false,
        },
      },
    };

    parametrosGrafica.data = nuevosDatos;
    parametrosGrafica.options = nuevasOpciones;
    parametrosGrafica.update();
  }

  function cabecera() {
    if (configuracion.periodo == 2 || configuracion.periodo == 7) {
      return (
        <>
          <table className="tabla_barrainfo">
            <tr>
              <td rowSpan={2}>
                <img src="imagenes/tiempo_redondo.png" />
                <br></br>
                Tiempo
              </td>
              <td>Temperatura</td>
              <td style={{ verticalAlign: "top" }}>
                Cielo
                <br></br>
              </td>
              <td>Lluvia</td>
            </tr>
            <tr>
              <td>
                <span style={estilo_1linea}>{temperatura + "ᵒ"}</span>
              </td>
              <td style={{ verticalAlign: "top" }}>
                <img src="imagenes/sol.png" ref={img_cielo} height={50} />
              </td>
              <td>
                <img src="imagenes/seco.png" ref={img_lluvia} height={50} />
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
    <>
      <div
        className="alert alert-info m-1"
        style={{ padding: "3px", width: "100%" }}
      >
        {cabecera()}
      </div>
      <div className="card m-0" style={{ width: "100%" }}>
        {/* temperatura, lluvia y cielo - a {configuracion.periodo}dias */}
        <canvas ref={grafica}></canvas>
      </div>
    </>
  );
};

export default Tiempo;
