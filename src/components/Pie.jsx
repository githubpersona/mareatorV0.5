import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../Contexts/UserContext';
import { useState } from 'react';

const Pie = (props) => {

    function emptyCache() {
        if ('caches' in window) {
            caches.keys().then((names) => {
                // Delete all the cache files
                names.forEach(name => {
                    caches.delete(name);
                })
            });

            // Makes sure the page reloads. Changes are only visible after you refresh.
            window.location.reload(true);
        }
    }

    // const { direccion } = useContext(UserContext);;
const { localizacion_estado } = useContext(UserContext);
const { configuracion_estado } = useContext(UserContext);


const [localizacion, setLocalizacion] = localizacion_estado;
const [configuracion, setConfiguracion] = configuracion_estado;


    const url_web_oleaje = "https://open-meteo.com/en/docs/marine-weather-api#latitude=" + localizacion.latitud + "&longitude=" + localizacion.longitud + "&hourly=wave_height,wave_period";
    const url_json_oleaje = "https://marine-api.open-meteo.com/v1/marine?latitude=" + localizacion.latitud + "&longitude=" + localizacion.longitud + "&hourly=wave_height,wave_direction,wave_period";

    const url_json_viento = "https://api.open-meteo.com/v1/forecast?latitude=" + localizacion.latitud + "&longitude=" + localizacion.longitud + "&hourly=windspeed_10m,winddirection_10m&timezone=Europe%2FBerlin";

    const url_json_mareas = "https://ideihm.covam.es/api-ihm/getmarea?request=gettide&id=" + localizacion.estacion + "&format=json";

    // https://open-meteo.com/en/docs#latitude=43.3781&longitude=-8.393&hourly=temperature_2m
    const url_web_tiempo = "https://open-meteo.com/en/docs#latitude=" + localizacion.latitud + "&longitude=" + localizacion.longitud + "&hourly=temperature_2m,precipitation_probability,rain,cloudcover,windspeed_10m&timezone=Europe%2FBerlin";
    const url_json_tiempo = "https://api.open-meteo.com/v1/forecast?latitude=" + localizacion.latitud + "&longitude=" + localizacion.longitud + "&hourly=temperature_2m,precipitation_probability,rain,cloudcover,windspeed_10m&timezone=Europe%2FBerlin";

    return (
        <div className="pie miniletra container">
            {localizacion.direccion} | {localizacion.latitud.toString().slice(0, 4)} ; {localizacion.longitud.toString().slice(0, 4)}
            | La práctica's App |  - <a href='#' onClick={emptyCache}>Ver: {props.version}</a> - {configuracion.periodo}
        </div>
    )
}

export default Pie