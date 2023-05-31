import React, { useEffect, useState, useRef } from "react";
import Marea from "../components/Marea";
import MareaGrafica from "../components/MareaGrafica";
import Oleaje from "../components/Oleaje";
import Tiempo from "../components/Tiempo";
import Viento from "../components/Viento";
import DynamicChart from "../components/pruebas/DynamicChart";
import { useContext } from "react";
import { UserContext } from "../Contexts/UserContext";

const Mar = () => {
  const fecha_actual = new Date();
  // const fecha_actual = new Date("Wed Feb 26 2023 22:30:44");

  const { localizacion_estado } = useContext(UserContext);

  // const { value, value2 } = React.useContext(MyContext);
  const [localizacion, setLocalizacion] = localizacion_estado;

  const url_json_oleaje =
    "https://marine-api.open-meteo.com/v1/marine?latitude=" +
    localizacion.latitud +
    "&longitude=" +
    localizacion.longitud +
    "&hourly=wave_height,wave_direction,wave_period&timezone=Europe%2FBerlin";

  const url_json_viento =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    localizacion.latitud +
    "&longitude=" +
    localizacion.longitud +
    "&hourly=windspeed_10m,winddirection_10m&timezone=Europe%2FBerlin";

  const url_json_mareas =
    "https://ideihm.covam.es/api-ihm/getmarea?request=gettide&id=" +
    localizacion.estacion +
    "&format=json";

  const url_json_mareas_meteogalicia =
    "https://servizos.meteogalicia.gal/apiv4/getTidesInfo?coords=" +
    localizacion.longitud +
    "," +
    localizacion.latitud +
    "&API_KEY=WN7oiatPXPsG1C91GdPM7a60a9qTx9MD7SfIV0HUlI0z16elB8NZj76Qsi4WMTPi";

  // const url_rss_mareas_meteogalicia = "https://servizos.meteogalicia.gal/mgrss/predicion/rssMareas.action?data=21/04/2023&idPorto=1";

  // const url_rss_mareas_meteogalicia = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fservizos.meteogalicia.gal%2Fmgrss%2Fpredicion%2FrssMareas.action%3Fdata%3D21%2F04%2F2023%26idPorto%3D1";

  return (
    <div>
      {/* <DynamicChart /> */}
      <Marea url={url_json_mareas} />
      {/* <MareaGrafica url={url_json_mareas} /> */}
      <Oleaje url={url_json_oleaje} />
      <Viento url={url_json_viento} />
      <br></br>
    </div>
  );
};

export default Mar;
