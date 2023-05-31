import React, { useEffect, useState, useRef } from 'react'
import Cargando from '../Cargando';

const TiempoAhora = (props) => {

    const fecha_actual = new Date();
    // const fecha_actual = new Date("Fri Mar 03 2023 05:00:44");

    const [texto_tiempo, setTexto_tiempo] = useState("");


    const [temperatura, setTemperatura] = useState("");
    const [precipitacion, setPrecipitacion] = useState("");
    const [nubosidad, setNubosidad] = useState("");
    const [lluviaxhoras, setLluviaXHoras] = useState("");

    const img_nubosidad = useRef(null);
    const img_lluvia = useRef(null);

    const [cargando, setCargando] = useState(true);

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

                let datos = data.hourly;
                console.log(datos);

                let temperatura = datos.temperature_2m[fecha_actual.getHours() - 1];
                let precipitacion = datos.precipitation_probability[fecha_actual.getHours() - 1];
                let nubosidad = datos.cloudcover[fecha_actual.getHours() - 1];
                let lluvia = datos.rain[fecha_actual.getHours() - 1];

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
                setPrecipitacion(precipitacion);
                setNubosidad(nubosidad);
                setLluviaXHoras(lluviaxhoras);

                // setTexto_tiempo(texto_tiempo);
            })
    }

    recolectar_tiempo();

    return (
        <>
            <div className="card m-2" style={{ width: "100%", }}>
                <table cellSpacing="0" cellPadding="0">
                    <tbody>
                        <tr>
                            <td style={{ width: "20%", }}>
                                <img src='imagenes/tiempo_redondo.png' style={{ width: "4rem", }} />
                            </td>
                            <td>
                                <div style={estilo_1linea}>{temperatura + "ᵒ "}</div>
                            </td>
                            <td>
                                <img src='imagenes/sol.png' ref={img_nubosidad} style={{ width: "4rem", }} />
                            </td>
                            <td>
                                <img src='imagenes/seco.png' ref={img_lluvia} style={{ width: "4rem", }} />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td>
                                {nubosidad}%
                            </td>
                            <td>
                                {precipitacion + "% "}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </>
    );


};

export default TiempoAhora