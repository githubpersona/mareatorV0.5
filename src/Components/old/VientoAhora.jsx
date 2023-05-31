import React, { useState, useRef } from 'react'

const VientoAhora = (props) => {

    const fecha_actual = new Date();
    // const fecha_actual = new Date("Wed Feb 26 2023 22:30:44");

    const [velocidad_viento, setVelocidad_viento] = useState("");

    const flecha_viento = useRef(null);

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

    const grados_opuestos = (grados) => {
        grados += 180;
        if (grados >= 360) {
            grados -= 360;
        }
        return grados;
    }

    const recolectar_viento = () => {

        fetch(props.url)
            .then((respuesta) => {
                return respuesta.json()
            })
            .then((data) => {
                console.log("fetch Viento...");

                console.log("Array de viento: ");

                console.log(data.hourly);

                let texto_viento = "";
                let datos = data.hourly;
                // console.log(datos);

                // let direcciones_ola = datos.windspeed_10m;
                // let alturas_ola = datos.winddirection_10;

                // let direccion_viento = datos.winddirection_10[fecha_actual.getHours() - 1];
                // let velocidad_viento = datos.wave_height[fecha_actual.getHours() - 1];
                // debugger;
                let direccion_viento = datos.winddirection_10m[fecha_actual.getHours() - 1];
                let velocidad_viento = datos.windspeed_10m[fecha_actual.getHours() - 1];

                // debugger;
                function getDireccion(angle) {
                    var direcciones = ['Norte', 'Nordés', 'Este', 'Sudeste', 'Sur', 'Sureste', 'Oeste', 'Noroeste'];
                    var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
                    return direcciones[index];
                }

                texto_viento = direccion_viento + "ᵒ ( " + getDireccion(direccion_viento) + " ) " + velocidad_viento + "Km/h ";

                setVelocidad_viento(velocidad_viento);

                flecha_viento.current.style.transform = "rotate(" + grados_opuestos(direccion_viento) + "deg)";

                // setTexto_viento(texto_viento);
            })
    }

    recolectar_viento();

    return (
        <div>

            {/* VIENTO */}
            <div className="card m-2" style={{ width: "100%", }}>
                <table cellSpacing="0" cellPadding="0">
                    <tbody>

                        <tr>
                            <td style={{ width: "20%", }}>
                                <img src='imagenes/viento_redondo.png' style={{ width: "4rem", }} />
                            </td>
                            <td>
                                <div style={estilo_1linea}>{velocidad_viento + " Km/h"}</div>
                            </td>
                            <td>
                                <img src='imagenes/flecha_viento.png' ref={flecha_viento} style={{ width: "4rem", }} />
                            </td>
                            <td>

                            </td>
                        </tr>
                    </tbody>

                </table>

            </div>
        </div >
    );


};

export default VientoAhora