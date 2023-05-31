import React, { useState, useRef } from 'react'


const OleajeAhora = (props) => {

    const fecha_actual = new Date();

    const [altura_ola, setAltura_ola] = useState("");
    const [periodo_ola, setPeriodo_ola] = useState("");

    const flecha_ola = useRef(null);

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

    const recolectar_oleaje = () => {

        fetch(props.url)
            .then((respuesta) => {
                return respuesta.json()
            })
            .then((data) => {
                console.log("fetch Oleaje...");

                console.log(data);

                let texto_oleaje = "";
                let datos = data.hourly;

                let direccion_ola = datos.wave_direction[fecha_actual.getHours() - 1];
                let altura_ola = datos.wave_height[fecha_actual.getHours() - 1];
                let periodo_ola = datos.wave_period[fecha_actual.getHours() - 1];


                function getDireccion(angle) {
                    var direcciones = ['Norte', 'Nordés', 'Este', 'Sudeste', 'Sur', 'Sureste', 'Oeste', 'Noroeste'];
                    var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
                    return direcciones[index];
                }

                texto_oleaje = direccion_ola + "ᵒ ( " + getDireccion(direccion_ola) + altura_ola + "m - " + periodo_ola + "s ";

                flecha_ola.current.style.transform = "rotate(" + grados_opuestos(direccion_ola) + "deg)";

                setAltura_ola(altura_ola);
                setPeriodo_ola(periodo_ola);

                // setTexto_oleaje(texto_oleaje);
            })
    }

    recolectar_oleaje();

    return (
        <div>
            <div className="card m-2" style={{ width: "100%", }}>
                <table cellSpacing="0" cellPadding="0">
                    <tbody>
                        <tr>
                            <td style={{ width: "20%", }}>
                                <img src='imagenes/ola_redondo.png' style={{ width: "4rem", }} />
                            </td>
                            <td>
                                <div style={estilo_1linea}>{altura_ola + " m"}</div>
                            </td>
                            <td>
                                <img src='imagenes/flecha_ola.png' ref={flecha_ola} style={{ width: "4rem", }} />
                            </td>
                            <td>
                                <div style={estilo_1linea}>{periodo_ola + " s"}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OleajeAhora