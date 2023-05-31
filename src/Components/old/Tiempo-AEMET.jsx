import React, { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useContext } from "react";
import { UserContext } from "../../Contexts/UserContext";
import "chart.js/auto";

const Tiempo = (props) => {
  const fecha_actual = new Date();
  // const fecha_actual = new Date("Fri Mar 03 2023 05:00:44");
  const horas_hoy = fecha_actual.getHours();

  const { configuracion_estado } = useContext(UserContext);
  const [configuracion, setConfiguracion] = configuracion_estado;

  const [temperatura, setTemperatura] = useState("");
  const [precipitacion, setPrecipitacion] = useState("");
  const [lluviaxhoras, setLluviaXHoras] = useState("");

  const img_cielo = useRef(null);
  const img_lluvia = useRef(null);

  Chart.register(...registerables);
  let ctx = null;
  const grafica_tiempo2 = useRef(null);
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

  const cieloes = [
    "Despejado",
    "Poco nuboso",
    "Muy nuboso",
    "Cubierto",
    "Nubes altas",
  ];
  const cielo_colores = ["white", "#bdbdbd", "#78909c", "#263238", "#E4E4E4"];

  let etiquetas = [
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
  ];
  let etiquetas_tmp = [
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
  ];
  var num = 6;
  for (var i = 0; i < num; i++) {
    etiquetas = etiquetas.concat(etiquetas_tmp);
  }

  let dias = [
    "", // "00h",
    "", // "01h",
    "", // "02h",
    "", // "03h",
    "", // "04h",
    "", // "05h",
    "", // "06h",
    "", // "07h",
    "", // "08h",
    "", // "09h",
    "", // "10h",
    "", // "11h",
    "21", // "12h",
    "", // "13h",
    "", // "14h",
    "", // "15h",
    "", // "16h",
    "", // "17h",
    "", // "18h",
    "", // "19h",
    "", // "20h",
    "", // "21h",
    "", // "22h",
    "", // "23h",
  ];
  let dias_tmp = [
    "", // "00h",
    "", // "01h",
    "", // "02h",
    "", // "03h",
    "", // "04h",
    "", // "05h",
    "", // "06h",
    "", // "07h",
    "", // "08h",
    "", // "09h",
    "", // "10h",
    "", // "11h",
    "21", // "12h",
    "", // "13h",
    "", // "14h",
    "", // "15h",
    "", // "16h",
    "", // "17h",
    "", // "18h",
    "", // "19h",
    "", // "20h",
    "", // "21h",
    "", // "22h",
    "", // "23h",
  ];
  var num = 6;
  for (var i = 0; i < num; i++) {
    dias = dias.concat(dias_tmp);
  }

  let datos_aemet = [];
  let datos_openmeteo = [];
  let datos = [];

  const estilo_1linea = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "5px",
    fontSize: "22px",
    fontFamily: "Sans-Serif",
  };

  const recolectar_tiempo = () => {
    fetch(props.url)
      .then((respuesta) => {
        return respuesta.json();
      })
      .then((data) => {
        // console.log("fetch Tiempo lluvia...AEMET");
        // console.log(data);
        // // console.log(data[0].prediccion.dia[0].precipitacion);
        // console.log(data.datos);

        // console.log(data[0].prediccion.dia[0].precipitacion.map(({ value, periodo }) => value));

        let lluvia_ahora;
        let temperatura_ahora;
        let cielo_ahora;
        let prediccion_desde;

        fetch(data.datos)
          .then((respuesta) => {
            return respuesta.json();
          })
          .then((data) => {
            // console.log("fetch Tiempo lluvia...AEMET - exito");
            // console.log(data);

            if (configuracion.periodo == 3 || configuracion.periodo == 7) {
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

            datos_aemet.etiquetas = etiquetas;

            let valores_hoy = data[0].prediccion.dia[0].precipitacion.map(
              ({ value, periodo }) => value
            );
            let valores_manana = data[0].prediccion.dia[1].precipitacion.map(
              ({ value, periodo }) => value
            );
            let valores_pasado = data[0].prediccion.dia[2].precipitacion.map(
              ({ value, periodo }) => value
            );
            prediccion_desde = parseInt(
              data[0].prediccion.dia[0].precipitacion[0].periodo
            );
            datos_aemet.lluvia = Array(prediccion_desde)
              .fill(0)
              .concat(
                valores_hoy.concat(valores_manana.concat(valores_pasado))
              );

            valores_hoy = data[0].prediccion.dia[0].temperatura.map(
              ({ value, periodo }) => value
            );
            valores_manana = data[0].prediccion.dia[1].temperatura.map(
              ({ value, periodo }) => value
            );
            valores_pasado = data[0].prediccion.dia[2].temperatura.map(
              ({ value, periodo }) => value
            );
            datos_aemet.temperatura = Array(prediccion_desde)
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
            datos_aemet.cielo = Array(prediccion_desde)
              .fill(0)
              .concat(
                valores_hoy.concat(valores_manana.concat(valores_pasado))
              );

            datos_aemet.colores_cielo = datos_aemet.cielo.map((cielo) => {
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

            setLluviaXHoras(lluviaxhoras);

            setTemperatura(temperatura_ahora);
            setPrecipitacion(lluvia_ahora);

            // recibo datos_aemet de openmeteo, para completar la predicción de las 48h hasta 7 días que da openmeteo (aunque la grafica corte en 3)

            const desde = prediccion_desde + 47;

            fetch(props.url2)
              .then((respuesta) => {
                return respuesta.json();
              })
              .then((data) => {
                // console.log("fetch Tiempo lluvia... openmeteo - exito");
                // console.log(data);

                datos_openmeteo = data.hourly;

                datos_openmeteo.lluvia = datos_openmeteo.rain;
                datos_openmeteo.temperatura = datos_openmeteo.temperature_2m;
                datos_openmeteo.cielo = datos_openmeteo.cloudcover;
                datos_openmeteo.etiquetas = etiquetas;

                datos_openmeteo.colores_cielo = datos_openmeteo.cloudcover.map(
                  (nubosidad) => {
                    let indice = 0;
                    if (nubosidad != 0) {
                      indice = Math.ceil(nubosidad / 25) - 1;
                    }
                    return cielo_colores[indice];
                  }
                );

                datos.temperatura = datos_aemet.temperatura.concat(
                  datos_openmeteo.temperatura.slice(desde)
                );
                datos.lluvia = datos_aemet.lluvia.concat(
                  datos_openmeteo.lluvia.slice(desde)
                );
                datos.cielo = datos_aemet.cielo.concat(
                  datos_openmeteo.cielo.slice(desde)
                );
                datos.colores_cielo = datos_aemet.colores_cielo.concat(
                  datos_openmeteo.colores_cielo.slice(desde)
                );
                datos.etiquetas = etiquetas;
                datos.dias = dias;

                console.log("datos finales:");
                console.log(datos);

                makeChart_tiempo2();
              });
          });
      });
  };

  recolectar_tiempo();

  function makeChart_tiempo2() {
    let hasta = 73;
    if (configuracion.periodo != 3) {
      hasta = 168;
    }

    ctx = grafica_tiempo2.current;
    if (chart_tiempo2) {
      setChart_tiempo2(null);
    }
    debugger;
    setChart_tiempo2(
      new Chart(ctx, {
        data: {
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
            {
              type: "line",
              yAxisID: "y_cielo",
              pointStyle: "rectRounded",
              pointRadius: 2,
              borderColor: "blue",
              borderWidth: 0,
              data: Array(datos.cielo.slice(horas_hoy, hasta).length).fill(99),
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
              data: datos.lluvia.slice(horas_hoy, hasta),
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
              data: Array(datos.etiquetas.slice(horas_hoy, hasta).length).fill(
                5
              ),
              yAxisID: "y_dianoche",
              backgroundColor: datos.colores_columnas.slice(horas_hoy, hasta),
              barPercentage: 1,
              categoryPercentage: 1,
            },
          ],
        },
        options: {
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
              position: "top",

              ticks: {
                maxRotation: 0,
                minRotation: 0,
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
              display: true,
              position: "right",
              max: 2,
              min: 0,
            },
            y_dianoche: {
              display: false,
            },
          },
        },
      })
    );
  }

  function cabecera() {
    debugger;
    if (configuracion.periodo == 3 || configuracion.periodo == 7) {
      return (
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }} colSpan="2">
                <img
                  src="imagenes/tiempo_redondo.png"
                  style={{ width: "3rem" }}
                />
              </td>
              <td>
                <div style={estilo_1linea} colSpan="2">
                  {temperatura + "ᵒ "}
                </div>
              </td>
              <td>
                <img
                  src="imagenes/sol.png"
                  colSpan="2"
                  ref={img_cielo}
                  style={{ width: "5rem" }}
                />
              </td>
              <td>
                <img
                  src="imagenes/seco.png"
                  ref={img_lluvia}
                  style={{ height: "3rem", width: "3rem" }}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{precipitacion + "mm "}</td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return "";
    }
  }

  return (
    <>
      <div className="card m-2" style={{ width: "100%" }}>
        {cabecera()}
      </div>

      <div className="card m-2" style={{ width: "100%" }}>
        temperatura, lluvia y cielo - a {configuracion.periodo}dias
        <canvas ref={grafica_tiempo2}></canvas>
      </div>
    </>
  );
};

export default Tiempo;
