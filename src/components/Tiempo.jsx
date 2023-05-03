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
    const [cielo, setcielo] = useState("");
    const [lluviaxhoras, setLluviaXHoras] = useState("");

    const img_cielo = useRef(null);
    const img_lluvia = useRef(null);

    Chart.register(...registerables);
    // const grafica_tiempo = useRef(null);
    // const [chart_tiempo, setChart_tiempo] = useState(null);
    let ctx = null;
    const grafica_tiempo2 = useRef(null);
    const [chart_tiempo2, setChart_tiempo2] = useState(null);
    // const grafica_tiempo3 = useRef(null);
    // const [chart_tiempo3, setChart_tiempo3] = useState(null);


    const cieloes = ['Despejado', 'Poco nuboso', 'Muy nuboso', 'Cubierto', 'Nubes altas'];
    const cieloes_colores = ['white', '#bdbdbd', '#78909c', '#263238', '#E4E4E4'];

    let datos = [];

    datos.etiquetas = ['00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h', '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h', '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'];

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

                console.log("fetch Tiempo lluvia...AEMET");
                console.log(data);
                // console.log(data[0].prediccion.dia[0].precipitacion);
                // console.log(data[0].prediccion.dia[0].precipitacion.map(({ value, periodo }) => value));

                let lluvia_ahora;
                let temperatura_ahora;
                let cielo_ahora;

                fetch(data.datos)
                    .then((respuesta) => {
                        return respuesta.json()
                    })
                    .then((data) => {
                        console.log("fetch Tiempo lluvia...AEMET - exito");
                        // console.log(data[0].prediccion.dia[0].precipitacion);
                        // console.log(data[0].prediccion.dia[0].precipitacion.map(({ value, periodo }) => value));

                        // lluvia2 = data[0].prediccion.dia[0].precipitacion.map(({ value, periodo }) => value);
                        // etiquetas2 = data[0].prediccion.dia[0].precipitacion.map(({ value, periodo }) => periodo);

                        debugger;

                        lluvia_ahora = data[0].prediccion.dia[0].precipitacion.find(item => item.periodo == horas_hoy).value;
                        temperatura_ahora = data[0].prediccion.dia[0].temperatura.find(item => item.periodo == horas_hoy).value;
                        cielo_ahora = data[0].prediccion.dia[0].estadoCielo.find(item => item.periodo == horas_hoy).value;

                        switch (cielo_ahora) {
                            case "11":
                            case "11n":
                                img_cielo.current.src = "imagenes/cielo_despejado.png";
                            case "12n":
                            case "12":
                                img_cielo.current.src = "imagenes/cielo_poco_nuboso.png";
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
                            case "46":
                            case "46n":
                                img_cielo.current.src = "imagenes/cielo_cubierto_lluvia_escasa.png";
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



                        debugger;

                        let valores_hoy = data[0].prediccion.dia[0].precipitacion.map(({ value, periodo }) => value);
                        let valores_manana = data[0].prediccion.dia[1].precipitacion.map(({ value, periodo }) => value);
                        let valores_pasado = data[0].prediccion.dia[2].precipitacion.map(({ value, periodo }) => value);
                        let prediccion_desde = parseInt(data[0].prediccion.dia[0].precipitacion[0].periodo);
                        datos.lluvia = Array(prediccion_desde).fill(0).concat(valores_hoy.concat(valores_manana.concat(valores_pasado)));

                        valores_hoy = data[0].prediccion.dia[0].temperatura.map(({ value, periodo }) => value);
                        valores_manana = data[0].prediccion.dia[1].temperatura.map(({ value, periodo }) => value);
                        valores_pasado = data[0].prediccion.dia[2].temperatura.map(({ value, periodo }) => value);
                        datos.temperatura = Array(prediccion_desde).fill(0).concat(valores_hoy.concat(valores_manana.concat(valores_pasado)));

                        valores_hoy = data[0].prediccion.dia[0].estadoCielo.map(({ value, periodo }) => value);
                        valores_manana = data[0].prediccion.dia[1].estadoCielo.map(({ value, periodo }) => value);
                        valores_pasado = data[0].prediccion.dia[2].estadoCielo.map(({ value, periodo }) => value);
                        datos.cielo = Array(prediccion_desde).fill(0).concat(valores_hoy.concat(valores_manana.concat(valores_pasado)));

                        datos.colores_cielo = datos.cielo.map(cielo => {
                            switch (cielo) {
                                case "11":
                                case "11n":
                                    return cieloes_colores[0];
                                    break;
                                case "12n":
                                case "12":
                                    return cieloes_colores[1];
                                    break;
                                case "14n":
                                case "14":
                                    return cieloes_colores[1];
                                    break;
                                case "15":
                                case "15n":
                                    return cieloes_colores[2];
                                    break;
                                case "16":
                                case "16n":
                                    return cieloes_colores[3];
                                    break;
                                case "17n":
                                case "17":
                                    return cieloes_colores[4];
                                    break;
                                case "46":
                                case "46n":
                                    return cieloes_colores[3];
                                    break;
                                default:
                                    return 'white';
                            }
                        });

                        console.log(datos)
                        // setLluviaXHoras(lluviaxhoras);

                        setTemperatura(temperatura_ahora);
                        // setPrecipitacion(precipitacion);
                        setPrecipitacion(lluvia_ahora);
                        setcielo(cielo_ahora);

                        // // makeChart_tiempo();
                        makeChart_tiempo2();
                        // makeChart_tiempo3();

                    });

                // datos.time = datos.time.map(v => v.slice(11, 13) + "h");

                // datos.colores_cielo = datos.cloudcover.map(cielo => cieloes_colores[Math.ceil(cielo / 25) - 1]);
                // datos.colores_columnas = colores_columnas;

                // let temperatura = datos.temperature_2m[horas_hoy];
                // let precipitacion = datos.precipitation_probability[horas_hoy];
                // let cielo = datos.cloudcover[horas_hoy];
                // let lluvia = datos.rain[horas_hoy];

                // // function getDireccion(angle) {
                // //     var direcciones = ['Norte', 'Nordés', 'Este', 'Sudeste', 'Sur', 'Sureste', 'Oeste', 'Noroeste'];
                // //     var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
                // //     return direcciones[index];
                // // }

                // // texto_tiempo = temperatura + "ᵒ - cielo: " + cielo + "% - Precipitación: " + precipitacion + "% ";
                // // texto_tiempo = "--";

                // if (cielo > 30) {
                //     img_cielo.current.src = "imagenes/nubes.png";
                // } else if (cielo > 5) {
                //     img_cielo.current.src = "imagenes/solynubes.png";
                // }



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
        debugger;
        setChart_tiempo2(new Chart(ctx, {
            data: {
                labels: datos.etiquetas.slice(horas_hoy, 73),
                datasets: [
                    {
                        type: 'line',
                        yAxisID: 'y_temperatura',
                        borderWidth: 1,
                        pointBackgroundColor: 'red',
                        data: datos.temperatura.slice(horas_hoy, 73),
                    },
                    {
                        type: 'bar',
                        yAxisID: 'y_cielo',
                        borderWidth: 0,
                        data: Array(datos.cielo.slice(horas_hoy, 73).length).fill(100),
                        backgroundColor: datos.colores_cielo.slice(horas_hoy, 73),
                        barPercentage: 1,
                        categoryPercentage: 1,
                    },
                    {
                        type: 'bar',
                        yAxisID: 'y_lluvia',

                        data: datos.lluvia.slice(horas_hoy, 73),
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
                    y_cielo: {
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
                    // y_dianoche: {
                    //     display: false,
                    // },
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
                                <img src='imagenes/sol.png' colSpan="2" ref={img_cielo} style={{ width: "5rem", }} />
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
                                {/* cod {cielo} */}
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
                temperatura, lluvia y cielo
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

// datos.lluvia =
//     Array(prediccion_desde).fill(0).concat(
//         valores_hoy.concat(
//             valores_manana.concat(valores_pasado)));