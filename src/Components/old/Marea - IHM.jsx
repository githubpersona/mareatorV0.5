import React, { useState, useRef } from 'react';
import MareaGrafica from './MareaGrafica';


const Marea = (props) => {

    const fecha_actual = new Date();
    // const fecha_actual = new Date("Wed Feb 26 2023 22:30:44");

    const horas_hoy = fecha_actual.getHours();

    const [altura_marea, setAlturaMarea] = useState("");
    const [hora_marea, setHoraMarea] = useState("");

    const flecha_marea = useRef(null);
    let marea_referencia;

    let puntos_marea = [];
    let puntos_grafica_marea = {
        horas: [],
        alturas: []
    };



    const estilo_1linea = {
        color: "white",
        backgroundColor: "DodgerBlue",
        padding: "5px",
        'fontSize': "22px",
        fontFamily: "Sans-Serif"
    };

    const recolectar_mareas = () => {

        fetch(props.url)
            .then((respuesta) => {
                return respuesta.json()
            })
            .then((data) => {
                // console.log("fetch Mareas...");
                // console.log(data);

                let nivel_marea_actual = "desconocido";
                let indice_marea_referencia = 0;
                let estado_marea_actual = "desconocido";

                let marea, hora, hora2, altura;
                let fecha_marea, hoy = new Date();
                let hourDiff;

                let puntos_marea_gmt = data.mareas.datos.marea;

                let flecha_marea_direccion = 0;

                // console.log("puntos_marea_gmt");
                // console.log(puntos_marea_gmt);
                // PASAMOS LAS FECHAS DE LOS PUNTOS DE MAREA DE GMT A CEST
                for (let i = puntos_marea_gmt.length - 1; i >= 0; i--) {
                    marea = puntos_marea_gmt[i].tipo;
                    hora = puntos_marea_gmt[i].hora;
                    altura = puntos_marea_gmt[i].altura;
                    // console.log("Marea " + marea + " a las " + hora);
                    fecha_marea = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), hora.substring(0, 2), hora.substring(3, 5), 0, 0));
                    // console.log("fecha_marea : " + fecha_marea);
                    // debugger;
                    // console.log("CEST: " + fecha_marea.toLocaleString('es-ES',));
                    // puntos_marea[i] = fecha_marea;

                    puntos_marea = [{ fecha_marea, marea, altura }].concat(puntos_marea); // [ 4, 3, 2, 1 ]
                }

                // console.log("puntos_marea")
                // console.log(puntos_marea);


                // debugger;
                // Obtenemos el objeto date de la marea más tardía
                indice_marea_referencia = puntos_marea.length - 1;
                marea_referencia = puntos_marea[indice_marea_referencia];

                // debugger;


                // // // CALCULAR ESTADO Y NIVEL DE MAREA

                // Si ya pasó la marea más tardía, se calcula con respecto a ésta (M4)
                if (fecha_actual > marea_referencia.fecha_marea) {
                    // console.log("- Ya pasó la tardia, se calcula con respecto a ésta (M4)")
                    hourDiff = Math.abs((marea_referencia.fecha_marea - fecha_actual) / 1000 / 60 / 60);
                    // setFecha_marea_referencia(fecha_marea);

                    if (marea_referencia.marea == "pleamar") {
                        estado_marea_actual = "bajando";
                        nivel_marea_actual = 6 - hourDiff;
                        marea_referencia.marea = "bajamar";
                        flecha_marea_direccion = 180;
                    } else {
                        estado_marea_actual = "subiendo";
                        nivel_marea_actual = hourDiff;
                        marea_referencia.marea = "pleamar";
                    }
                    marea_referencia.fecha_marea.setTime(marea_referencia.fecha_marea.getTime() + (6 * 60 * 60 * 1000));

                    // Si no, buscar la marea inmediatamente superior y calcular con respecto a ésta
                } else {
                    // console.log("- Calculamos la superior")

                    for (let i = puntos_marea.length - 1; i >= 0; i--) {
                        if (puntos_marea[i].fecha_marea > fecha_actual) {
                            // indice_marea_referencia = i;
                            marea_referencia.fecha_marea = puntos_marea[i].fecha_marea;
                            marea_referencia.marea = puntos_marea[i].marea;
                        }
                    }

                    hourDiff = Math.abs((marea_referencia.fecha_marea - fecha_actual) / 1000 / 60 / 60);
                    if (marea_referencia.marea == "pleamar") {
                        estado_marea_actual = "subiendo";
                        nivel_marea_actual = 6 - hourDiff;
                        marea_referencia.marea = "pleamar";

                    } else {
                        estado_marea_actual = "bajando";
                        nivel_marea_actual = hourDiff;
                        marea_referencia.marea = "bajamar";
                        flecha_marea_direccion = 180;
                    }


                }

                nivel_marea_actual = Number.parseFloat(nivel_marea_actual).toFixed(1);

                // debugger;

                flecha_marea.current.style.transform = "rotate(" + flecha_marea_direccion + "deg)";

                flecha_marea.current.height = 50;
                flecha_marea.current.width = 40;

                setAlturaMarea(nivel_marea_actual);
                setHoraMarea(String(marea_referencia.fecha_marea.getHours()).padStart(2, '0') + ":" + String(marea_referencia.fecha_marea.getMinutes()).padStart(2, '0'));
            });

    }

    recolectar_mareas();


    return (
        <>
            <div className="card m-2" style={{ width: "100%", }}>
                {/* {cargando && <Cargando />} */}
                <table cellSpacing="0" cellPadding="0">
                    <tbody>

                        <tr>
                            <td style={{ width: "20%", }}>
                                <img src='imagenes/bola_marea_luna.png' style={{ width: "3rem", }} />
                            </td>
                            <td>
                                <div style={estilo_1linea}>{altura_marea}</div>
                            </td>
                            <td>
                                <img src='imagenes/flecha_marea.png' ref={flecha_marea} style={{ width: "2rem", height: "2rem" }} />
                            </td>
                            <td>
                                <div style={estilo_1linea}>{hora_marea}</div>
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>
            {/* <MareaGrafica punto_marea_fecha1={puntos_marea[0].fecha_marea} punto_marea_altura1={puntos_marea[0].altura} punto_marea_fecha2={puntos_marea[1].fecha_marea} punto_marea_altura2={puntos_marea[1].altura} punto_marea_fecha3={puntos_marea[2].fecha_marea} punto_marea_altura3={puntos_marea[2].altura} /> */}
            <MareaGrafica url={props.url} />
        </>

    );

}

export default Marea