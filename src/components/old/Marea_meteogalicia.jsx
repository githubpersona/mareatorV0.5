import React, { useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js'
import 'chart.js/auto';

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

    Chart.register(...registerables);
    const grafica_marea = useRef(null);
    const [chart_marea, setChart_marea] = useState(null);
    let ctx = null;

    const estilo_1linea = {
        color: "white",
        backgroundColor: "DodgerBlue",
        padding: "5px",
        'fontSize': "22px",
        fontFamily: "Sans-Serif"
    };

    const recolectar_mareas = () => {

        // fetch(props.url)
        //     .then(response => response.text())
        // .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        // .then((data) => {
        //     console.log("fetch Mareas de meteogalicia...");

        //     console.log(data);
        // })

        fetch(props.url).then((res) => {
            res.text().then((htmlTxt) => {
                // var domParser = new DOMParser()
                // let doc = domParser.parseFromString(htmlTxt, 'text/html')
                // var feedUrl = doc.querySelector('link[type="application/rss+xml"]').href
                console.log("fetch Mareas de meteogalicia...");
                console.log(htmlTxt)
            })
        }).catch(() => console.error('Error in fetching the website'))


        // fetch(props.url)
        //     .then((respuesta) => {
        //         return respuesta.json()
        //     })
        //     .then((data) => {
        //         console.log("fetch Mareas de meteogalicia...");

        //         console.log(data);
        //     });

    }

    recolectar_mareas();


    return (
        <>
            <div className="card m-2" style={{ width: "100%", }}>

            </div>

        </>

    );

}

export default Marea