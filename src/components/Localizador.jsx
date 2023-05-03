import React from 'react';
import { useState } from 'react';
import { useContext } from 'react'
import { UserContext } from '../Contexts/UserContext';
import { DatosLocalizacion } from "../Helpers/DatosLocalizacion";


// const Localizador = ({ setLatitud }, { latitud }) => {
const Localizador = () => {

    // const { latitud, setLatitud } = useContext(UserContext);
    // const { longitud, setLongitud } = useContext(UserContext);
    // const { estacion, setEstacion } = useContext(UserContext);

    const { localizacion, setLocalizacion } = useContext(UserContext);

    const [latitud_aqui, setLatitud_aqui] = useState();
    const [longitud_aqui, setLongitud_aqui] = useState();
    // const [direccion, setDireccion] = useState("");

    // const { direccion, setDireccion } = useContext(UserContext);

    navigator.geolocation.getCurrentPosition(function (location) {
        setLatitud_aqui(location.coords.latitude);
        setLongitud_aqui(location.coords.longitude);
    });

    // fetch("https://nominatim.openstreetmap.org/search.php?q=" + props.latitu>d + "," + props.longitud + "&polygon_geojson=1&format=json")

    const getDireccion = (direccion) => {
        fetch("https://geocode.maps.co/reverse?lat=" + localizacion.latitud + "&lon=" + localizacion.longitud)
            .then(response => response.json())
            .then(j => {
                var array = j.display_name.split(',');
                return (array[4] + " - " + array[3] + " - " + array[2] + " (" + localizacion.latitud + ", " + localizacion.longitud + ")");
            });
    }


    // function sayHello(name) {
    //     alert(`hello, ${name}`);
    // }

    function localizar(localizar_a) {
        // console.log(localizar_a);
        debugger;
        let localizacion_temp = localizacion;
        // console.log(DatosLocalizacion.localizacion[localizar_a - 1]);
        if (localizar_a == 0) {
            // let localizacion_temp = localizacion;
            localizacion_temp.latitud = latitud_aqui;
            localizacion_temp.longitud = longitud_aqui;
            localizacion_temp.direccion = getDireccion();
            setLocalizacion(localizacion_temp);
        } else {
            localizacion_temp = DatosLocalizacion.localizacion[localizar_a - 1];
            setLocalizacion(localizacion_temp);
        }
        localStorage.setItem(
            "localizacion_local",
            JSON.stringify(localizacion_temp)
        );
        // this.addClass("btn-danger");
        debugger;
    }

    return (

        <div className="cabecera_botones">
            <table cellSpacing="0" cellPadding="0" style={{ width: "100%", height: "2em", }}>
                <tbody>
                    <tr>
                        <td>
                            <button type="button" id="1" className="btn" onClick={() => localizar(1)}>Coruña</button>
                        </td>
                        <td>
                            <button type="button" className="btn" onClick={() => localizar(2)}>Miño</button>
                        </td>
                        <td>
                            <button type="button" className="btn" onClick={() => localizar(3)}>Doniños</button>
                        </td>
                        <td>
                            <button type="button" className="btn" onClick={() => localizar(5)}>Zarza</button>
                        </td>
                        <td>
                            <button type="button" className="btn" onClick={() => localizar(0)}>Aquí</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Localizador