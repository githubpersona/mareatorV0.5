import React, { useEffect, useState, useRef } from "react";
import Localizador from "../Components/Localizador";
import Tiempo from "../Components/Tiempo";
import { useContext } from "react";
import { UserContext } from "../Contexts/UserContext";
import Viento from "../Components/Viento";
// import { createLogger } from 'video.js/dist/types/utils/log';

const ElTiempo = () => {
  const fecha_actual = new Date();
  // const fecha_actual = new Date("Wed Feb 26 2023 22:30:44");

  const { localizacion_estado } = useContext(UserContext);

  // const { value, value2 } = React.useContext(MyContext);
  const [localizacion, setLocalizacion] = localizacion_estado;
  const { graficar_estado } = useContext(UserContext);

  const [graficar, setGraficar] = graficar_estado;

  useEffect(() => {
    // This function will be executed after rendering
    setGraficar(new Date());
  }, []);

  const url_json_openmeteo =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    localizacion.latitud +
    "&longitude=" +
    localizacion.longitud +
    "&hourly=temperature_2m,precipitation_probability,rain,cloudcover,windspeed_10m&timezone=Europe%2FBerlin";
  // console.log(url_json_openmeteo);
  const url_json_aemet =
    "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/" +
    localizacion.id_municipio +
    "/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzb3ljYXJsb3NuaWV2ZXNAcHJvdG9ubWFpbC5jb20iLCJqdGkiOiI0NzUxNmY0Zi1iYmVhLTQ1MzYtYmU5Mi1hYzQ2ZDgzNzVhNGYiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTY3OTE1MjQ1NCwidXNlcklkIjoiNDc1MTZmNGYtYmJlYS00NTM2LWJlOTItYWM0NmQ4Mzc1YTRmIiwicm9sZSI6IiJ9.8yuNoZeP4QYgtnq8ivQSUmpP6h768fl7N68D4CNagyo";
  // console.log(url_json_aemet);

  const url_json_viento =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    localizacion.latitud +
    "&longitude=" +
    localizacion.longitud +
    "&hourly=windspeed_10m,winddirection_10m&timezone=Europe%2FBerlin";

  return (
    <>
      <Tiempo url_aemet={url_json_aemet} url_openmeteo={url_json_openmeteo} />
      <Viento url={url_json_viento} />
      <br></br>
    </>
  );
};

export default ElTiempo;
