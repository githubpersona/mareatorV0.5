import React, { useEffect, useState, useRef } from 'react'
import Cargando from '../components/Cargando';
import MareasAhora from '../components/MareasAhora';
import OleajeAhora from '../components/OleajeAhora';
import TiempoAhora from '../components/TiempoAhora';
import VientoAhora from '../components/VientoAhora';
import { useContext } from 'react'
import { UserContext } from '../Contexts/UserContext';


const MarAhora = () => {

    const fecha_actual = new Date();
    // const fecha_actual = new Date("Wed Feb 26 2023 22:30:44");

    const { localizacion } = useContext(UserContext);
    
    const url_web_oleaje = "https://open-meteo.com/en/docs/marine-weather-api#latitude=" + localizacion.latitud + "&longitude=" + localizacion.longitud + "&hourly=wave_height,wave_period";
    const url_json_oleaje = "https://marine-api.open-meteo.com/v1/marine?latitude=" + localizacion.latitud + "&longitude=" + localizacion.longitud + "&hourly=wave_height,wave_direction,wave_period";

    const url_json_viento = "https://api.open-meteo.com/v1/forecast?latitude=" + localizacion.latitud + "&longitude=" + localizacion.longitud + "&hourly=windspeed_10m,winddirection_10m&timezone=Europe%2FBerlin";

    const url_json_mareas = "https://ideihm.covam.es/api-ihm/getmarea?request=gettide&id=" + localizacion.estacion + "&format=json";

    // https://open-meteo.com/en/docs#latitude=43.3781&longitude=-8.393&hourly=temperature_2m
    const url_web_tiempo = "https://open-meteo.com/en/docs#latitude=" + localizacion.latitud + "&longitude=" + localizacion.longitud + "&hourly=temperature_2m,precipitation_probability,rain,cloudcover,windspeed_10m&timezone=Europe%2FBerlin";
    const url_json_tiempo = "https://api.open-meteo.com/v1/forecast?latitude=" + localizacion.latitud + "&longitude=" + localizacion.longitud + "&hourly=temperature_2m,precipitation_probability,rain,cloudcover,windspeed_10m&timezone=Europe%2FBerlin";

    return (
        <div>

            <OleajeAhora url={url_json_oleaje} />
            <VientoAhora url={url_json_viento} />
            <MareasAhora url={url_json_mareas} />
            <TiempoAhora url={url_json_tiempo} />

            <small className="mouse">
                Fuentes:
                <br />
                <a href={url_web_oleaje} target="_blank">Oleaje: Marine API de Open Meteo</a> -
                <a href={url_json_oleaje} target="_blank">json</a>
                <br />
                <a href="" target="_blank">Viento: API de Open Meteo</a> -
                <a href={url_json_viento} target="_blank">json</a>
                <br />
                <a href="" target="_blank">Mareas: Instituto Hidrogŕafco de la Marina</a> -
                <a href={url_json_mareas} target="_blank">json</a>
                <br />
                <a href={url_web_tiempo} target="_blank">Tiempo: Weather API de Open Meteo</a> -
                <a href={url_json_tiempo} target="_blank">json</a>
                <br />

                Otras:
                <a href="https://www.accuweather.com/es/es/a-coru%C3%B1a/307767/current-weather/307767" target="_blank">Accuweather</a>
                <br />
                GEO: lat: {localizacion.latitud} - long: {localizacion.longitud}
            </small>
        </div>
    );


};

export default MarAhora

{/* <p style={{ 'color': 'red' }}>{texto_oleaje} */ }

{/* <script>
document.getElementById("direccion_oleaje").style.transform =
  "rotate(70deg)";
</script> */}

// ALGORITMO DE BÚSQUEDA DE MAREA DE REFERENCIA:

// for (let i = puntos_marea_gmt.length - 1; i >= 0; i--) {
//                         marea = puntos_marea_gmt[i].tipo;
//                         hora = puntos_marea_gmt[i].hora;
//                         altura = puntos_marea_gmt[i].altura;
//                         console.log("Marea " + marea + " a las " + hora + ", de altura " + altura + "m. ");
//                         fecha_marea.setHours(hora.substring(0, 2), hora.substring(3, 5), 0);

//                         if (fecha_marea > fecha_actual) {
//                             // console.log("Fecha actual menor que:  " + fecha_marea.toString());
//                             indice_marea_referencia = i;
//                             // setFecha_marea_referencia(fecha_marea);
//                             fecha_marea_referencia = new Date(fecha_marea);
//                             console.log("si " + fecha_marea_referencia.toString());
//                         };
//                     }

//                     hourDiff = Math.abs((fecha_marea_referencia - fecha_actual) / 1000 / 60 / 60);

//                     console.log("i" + indice_marea_referencia);

//                     if ((puntos_marea_gmt[indice_marea_referencia].tipo).localeCompare("pleamar") == 0) {
//                         estado_marea_actual = "subiendo";
//                         nivel_marea_actual = 6 - hourDiff;
//                     } else {
//                         estado_marea_actual = "bajando";
//                         nivel_marea_actual = hourDiff;
//                     }

// if (fecha_actual > fecha_marea) { // Si la hora actual es mayor que la última marea, tomaremos como referencia esta última
//     fecha_marea_referencia = fecha_marea;

//     let diferencia_fecha = (fecha_actual - fecha_marea_referencia);

//     // console.log(diferencia_fecha);
//     // console.log(milisegundos_intermarea / 6);
//     // hora = puntos_marea_gmt[1].hora;
//     // fecha_marea.setHours(hora.substring(0, 2), hora.substring(3, 5), 0);
//     // hora2 = puntos_marea_gmt[2].hora;
//     // fecha_marea_2.setHours(hora2.substring(0, 2), hora2.substring(3, 5), 0);
//     // let intermarea = (fecha_marea_2 - fecha_marea);

//     nivel_marea = Math.round((diferencia_fecha / (milisegundos_intermarea / 6)) * 10) / 10;
//     if (String(puntos_marea_gmt[indice_marea_referencia].tipo).localeCompare("pleamar")) {
//         estado_marea_actual = "subiendo";
//     } else {
//         estado_marea_actual = "bajando";
//         nivel_marea = 6 - nivel_marea;
//     }

// } else { // Si no, buscamos la marea inmediatamente superior y la tomamos de referencia
//     for (let i = 0; i < puntos_marea_gmt.length; i++) {
//         marea = puntos_marea_gmt[i].tipo;
//         hora = puntos_marea_gmt[i].hora;
//         altura = puntos_marea_gmt[i].altura;
//         // console.log("Marea " + marea + " a las " + hora + ", de altura " + altura + "m. ");

//         // console.log(hora);
//         fecha_marea.setHours(hora.substring(0, 2), hora.substring(3, 5), 0);
//         // console.log(parseInt(hora.substring(0, 2)));
//         // console.log(fecha_marea);
//         // console.log(fecha_actual);

//         if (fecha_marea < fecha_actual) {
//             console.log("first");
//             indice_marea_referencia = i;
//             fecha_marea_referencia = fecha_marea;
//         };

//     }
//     // console.log(String(puntos_marea_gmt[indice_marea_referencia].tipo).localeCompare("pleamar"));
//     let diferencia_fecha = (fecha_marea_referencia - fecha_actual);

//     // console.log(diferencia_fecha);
//     // console.log(milisegundos_intermarea / 6);
//     // hora = puntos_marea_gmt[1].hora;
//     // fecha_marea.setHours(hora.substring(0, 2), hora.substring(3, 5), 0);
//     // hora2 = puntos_marea_gmt[2].hora;
//     // fecha_marea_2.setHours(hora2.substring(0, 2), hora2.substring(3, 5), 0);
//     // let intermarea = (fecha_marea_2 - fecha_marea);

//     nivel_marea = Math.round((diferencia_fecha / (milisegundos_intermarea / 6)) * 10) / 10;
//     if (String(puntos_marea_gmt[indice_marea_referencia].tipo).localeCompare("pleamar")) {
//         estado_marea_actual = "subiendo";
//         nivel_marea = 6 - nivel_marea;
//     } else {
//         estado_marea_actual = "bajando";
//     }
// }

// function msToTime(duration) {
//     var milliseconds = Math.floor((duration % 1000) / 100),
//     seconds = Math.floor((duration / 1000) % 60),
//     minutes = Math.floor((duration / (1000 * 60)) % 60),
//     hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

//   hours = (hours < 10) ? "0" + hours : hours;
//   minutes = (minutes < 10) ? "0" + minutes : minutes;
//   seconds = (seconds < 10) ? "0" + seconds : seconds;

//   return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
// }
// console.log(msToTime(300000))