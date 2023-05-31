import React, { useEffect, useState, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { useContext } from 'react'
import { UserContext } from '../Contexts/UserContext';
import 'chart.js/auto';

const Tiempo = (props) => {

    const fecha_actual = new Date();
    // const fecha_actual = new Date("Fri Mar 03 2023 05:00:44");
    const horas_hoy = fecha_actual.getHours();

    const [texto_tiempo, setTexto_tiempo] = useState("");


    const [temperatura, setTemperatura] = useState("");
    const [precipitacion, setPrecipitacion] = useState("");
    const [nubosidad, setNubosidad] = useState("");
    const [lluviaxhoras, setLluviaXHoras] = useState("");

    const img_nubosidad = useRef(null);
    const img_lluvia = useRef(null);

    Chart.register(...registerables);
    // const grafica_tiempo = useRef(null);
    // const [chart_tiempo, setChart_tiempo] = useState(null);
    let ctx = null;
    const grafica_tiempo2 = useRef(null);
    const [chart_tiempo2, setChart_tiempo2] = useState(null);
    // const grafica_tiempo3 = useRef(null);
    // const [chart_tiempo3, setChart_tiempo3] = useState(null);

    let datos = [];

    const nubosidades = ['0-25', '25-50', '50-75', '75-100'];
    const nubosidades_colores = ['white', '#bdbdbd', '#78909c', '#263238'];

    const color_dia = 'white';
    const color_noche = '#e6e6e6';
    const colores_columnas = Array(8).fill(color_noche).concat(Array(14).fill(color_dia).concat(Array(10).fill(color_noche).concat(Array(14).fill(color_dia).concat(Array(10).fill(color_noche).concat(Array(14).fill(color_dia))))));

    const estilo_1linea = {
        color: "white",
        backgroundColor: "DodgerBlue",
        padding: "5px",
        'fontSize': "22px",
        fontFamily: "Sans-Serif"
    };

    const estilo_centradoimagen = {
        position: 'relative',
        top: '50%',
        left: '50%',
        // transform: translate('-50%', '-50%'),
    };

    const estilo_micro = {
        'fontSize': "7px",
        fontFamily: "Sans-Serif"
    };

    // const grados_opuestos = (grados) => {
    //     grados += 180;
    //     if (grados >= 360) {
    //         grados -= 360;
    //     }
    //     return grados;
    // }



    const recolectar_tiempo = () => {

        fetch(props.url)
            .then((respuesta) => {
                return respuesta.json()
            })
            .then((data) => {
                console.log("fetch Tiempo...");
                console.log(data);

                datos = data.hourly;
                // datos.time = datos.time.map(v => v.slice(8, 10) + '-' + v.slice(11, 13) + "h");


                datos.time = datos.time.map(v => v.slice(11, 13) + "h");

                datos.colores_nubosidad = datos.cloudcover.map(nubosidad => nubosidades_colores[Math.ceil(nubosidad / 25) - 1]);
                datos.colores_columnas = colores_columnas;

                let temperatura = datos.temperature_2m[horas_hoy];
                let precipitacion = datos.precipitation_probability[horas_hoy];
                let nubosidad = datos.cloudcover[horas_hoy];
                let lluvia = datos.rain[horas_hoy];

                // function getDireccion(angle) {
                //     var direcciones = ['Norte', 'Nordés', 'Este', 'Sudeste', 'Sur', 'Sureste', 'Oeste', 'Noroeste'];
                //     var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
                //     return direcciones[index];
                // }

                // texto_tiempo = temperatura + "ᵒ - Nubosidad: " + nubosidad + "% - Precipitación: " + precipitacion + "% ";
                // texto_tiempo = "--";

                if (nubosidad > 30) {
                    img_nubosidad.current.src = "imagenes/nubes.png";
                } else if (nubosidad > 5) {
                    img_nubosidad.current.src = "imagenes/solynubes.png";
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
                // setPrecipitacion(precipitacion);
                setPrecipitacion(lluvia);
                setNubosidad(nubosidad);
                setLluviaXHoras(lluviaxhoras);

                // makeChart_tiempo();
                makeChart_tiempo2();
                // makeChart_tiempo3();


            })
    }



    recolectar_tiempo();

    // function makeChart_tiempo() {
    //     ctx = grafica_tiempo.current;
    //     if (chart_tiempo) {
    //         setChart_tiempo(null);
    //     }
    //     setChart_tiempo(new Chart(ctx, {
    //         type: 'bar',
    //         data: {
    //             labels: datos.time.slice(horas_hoy, 73),
    //             datasets: [
    //                 {
    //                     yAxisID: 'y_lluvia',

    //                     data: datos.rain.slice(horas_hoy, 73),
    //                 },
    //                 {
    //                     type: 'bar',
    //                     data: Array(datos.time.slice(horas_hoy, 73).length).fill(5),
    //                     yAxisID: 'y_dianoche',
    //                     backgroundColor: datos.colores_columnas.slice(horas_hoy, 73),
    //                     barPercentage: 1,
    //                     categoryPercentage: 1,
    //                 },
    //             ],
    //         },
    //         options: {
    //             events: [],
    //             backgroundColor: "blue",

    //             // backgroundColor: "#b9bbc2", // de las barras
    //             // backgroundColor: datos.colores.slice(horas_hoy, 73),
    //             plugins: {
    //                 legend: {
    //                     display: false,
    //                     labels: {
    //                         color: 'grey'
    //                     }
    //                 }
    //             },
    //             scales: {
    //                 x: {
    //                     ticks: {
    //                         maxRotation: 0,
    //                         minRotation: 0
    //                     }
    //                 },
    //                 y_lluvia: {
    //                     title: {
    //                         display: false,
    //                         text: 'Período (s)',
    //                     },
    //                     grid: {
    //                         display: false,
    //                     },
    //                     display: true,
    //                     position: 'right',
    //                     max: 2,
    //                     min: 0,
    //                 },
    //                 y_dianoche: {
    //                     display: false,
    //                 },
    //             }
    //         }
    //     }));
    // }

    function makeChart_tiempo2() {
        ctx = grafica_tiempo2.current;
        if (chart_tiempo2) {
            setChart_tiempo2(null);
        }
        setChart_tiempo2(new Chart(ctx, {
            data: {
                labels: datos.time.slice(horas_hoy, 73),
                datasets: [
                    {
                        type: 'line',
                        yAxisID: 'y_temperatura',
                        borderWidth: 1,
                        pointBackgroundColor: 'red',
                        data: datos.temperature_2m.slice(horas_hoy, 73),
                    },
                    {
                        type: 'bar',
                        yAxisID: 'y_nublado',
                        borderWidth: 0,
                        data: Array(datos.cloudcover.slice(horas_hoy, 73).length).fill(100),
                        backgroundColor: datos.colores_nubosidad.slice(horas_hoy, 73),
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                    {
                        type: 'bar',
                        yAxisID: 'y_lluvia',

                        data: datos.rain.slice(horas_hoy, 73),
                    },
                    // {
                    //     type: 'bar',
                    //     data: Array(datos.time.slice(horas_hoy, 73).length).fill(5),
                    //     yAxisID: 'y_dianoche',
                    //     backgroundColor: datos.colores_columnas.slice(horas_hoy, 73),
                    //     barPercentage: 1,
                    //     categoryPercentage: 1,
                    // },
                ],
            },
            options: {
                events: [],
                backgroundColor: "blue",

                // backgroundColor: "#b9bbc2", // de las barras
                // backgroundColor: datos.colores.slice(horas_hoy, 73),
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: 'grey'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0
                        }
                    },
                    y_temperatura: {
                        title: {
                            display: false,
                            text: 'grados',
                        },
                        grid: {
                            display: false,
                        },
                        display: true,
                        position: 'left',
                        max: 40,
                        min: 0,
                    },
                    y_nublado: {
                        title: {
                            display: false,
                            text: '%',
                        },
                        grid: {
                            display: false,
                        },
                        display: false,
                        position: 'left',
                        max: 100,
                        min: 0,
                    },
                    y_lluvia: {
                        title: {
                            display: false,
                            text: 'mm',
                        },
                        grid: {
                            display: false,
                        },
                        display: true,
                        position: 'right',
                        max: 2,
                        min: 0,
                    },
                    y_dianoche: {
                        display: false,
                    },
                }
            }
        }));
    }

    // function makeChart_tiempo3() {
    //     ctx = grafica_tiempo3.current;
    //     if (chart_tiempo3) {
    //         setChart_tiempo3(null);
    //     }
    //     setChart_tiempo3(new Chart(ctx, {
    //         data: {
    //             labels: datos.time.slice(horas_hoy, 73),
    //             datasets: [
    //                 {
    //                     type: 'line',
    //                     yAxisID: 'y_temperatura',
    //                     borderWidth: 1,
    //                     pointBackgroundColor: 'red',
    //                     data: datos.temperature_2m.slice(horas_hoy, 73),
    //                 },
    //                 {
    //                     type: 'bar',
    //                     data: Array(datos.time.slice(horas_hoy, 73).length).fill(5),
    //                     yAxisID: 'y_dianoche',
    //                     backgroundColor: datos.colores_columnas.slice(horas_hoy, 73),
    //                     barPercentage: 1,
    //                     categoryPercentage: 1,
    //                 },
    //             ],
    //         },
    //         options: {
    //             events: [],
    //             backgroundColor: "blue",

    //             // backgroundColor: "#b9bbc2", // de las barras
    //             // backgroundColor: datos.colores.slice(horas_hoy, 73),
    //             plugins: {
    //                 legend: {
    //                     display: false,
    //                     labels: {
    //                         color: 'grey'
    //                     }
    //                 }
    //             },
    //             scales: {
    //                 x: {
    //                     ticks: {
    //                         maxRotation: 0,
    //                         minRotation: 0
    //                     }
    //                 },
    //                 y_temperatura: {
    //                     title: {
    //                         display: false,
    //                         text: 'grados',
    //                     },
    //                     grid: {
    //                         display: false,
    //                     },
    //                     display: true,
    //                     position: 'left',
    //                     max: 40,
    //                     min: 0,
    //                 },
    //                 y_dianoche: {
    //                     display: false,
    //                 },
    //             }
    //         }
    //     }));
    // }

    return (
        <>
            <div className="card m-2" style={{ width: "100%", }}>
                <table cellSpacing="0" cellPadding="0">
                    <tbody>
                        <tr>
                            <td style={{ width: "20%", }} colSpan="2">
                                <img src='imagenes/tiempo_redondo.png' style={{ width: "3rem", }} />
                            </td>
                            <td>
                                <div style={estilo_1linea} colSpan="2">{temperatura + "ᵒ "}</div>
                            </td>
                            <td>
                                <img src='imagenes/sol.png' ref={img_nubosidad} style={{ width: "3rem", }} />
                            </td>
                            <td>
                                <img src='imagenes/seco.png' ref={img_lluvia} style={{ height: "3rem", width: "3rem", }} />
                            </td>

                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                {nubosidad}%
                            </td>
                            <td>
                                {/* {precipitacion + "% "} */}
                                {precipitacion + "mm "}
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="card m-2" style={{ width: "100%", }}>
                temperatura, lluvia y nubosidad
                <canvas ref={grafica_tiempo2}></canvas>

            </div>
            {/* <div className="card m-2" style={{ width: "100%", }}>
                grafica tiempo 3
                <canvas ref={grafica_tiempo3}></canvas>

            </div><div className="card m-2" style={{ width: "100%", }}>
                grafica tiempo
                <canvas ref={grafica_tiempo}></canvas>

            </div> */}
        </>
    );


};

export default Tiempo