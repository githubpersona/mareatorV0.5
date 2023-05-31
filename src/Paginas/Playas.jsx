import React, { useEffect, useState, useRef } from "react";

import VideoJS from "../components/VideoJS";
import videojs from "video.js";

const Playas = () => {
  const playerRef = React.useRef(null);

  let videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "",
        type: "application/x-mpegURL",
      },
    ],
  };

  let bastiagueiro_ops = {
    ...videoJsOptions,
    sources: {
      src: "https://wow.camaramar.com/camaramar/17_bastiagueiro.stream/playlist.m3u8",
      type: 'application/x-mpegURL"},',
    },
  };

  let staCristina_ops = {
    ...videoJsOptions,
    sources: {
      src: "https://wow.camaramar.com/camaramar/51_santacristina.stream/playlist.m3u8",
      type: 'application/x-mpegURL"},',
    },
  };

  let doninos_ops = {
    ...videoJsOptions,
    sources: {
      src: "https://wow.camaramar.com/camaramar/11_doninos.stream/playlist.m3u8",
      type: 'application/x-mpegURL"},',
    },
  };

  let razo_ops = {
    ...videoJsOptions,
    sources: {
      src: "https://wow.camaramar.com/camaramar/5_razo.stream/playlist.m3u8",
      type: 'application/x-mpegURL"},',
    },
  };

  let perbes_ops = {
    ...videoJsOptions,
    sources: {
      src: "https://wow.camaramar.com/camaramar/61_perbes.stream/playlist.m3u8",
      type: 'application/x-mpegURL"},',
    },
  };

  let caion_ops = {
    ...videoJsOptions,
    sources: {
      src: "https://wow.camaramar.com/camaramar/44_caionsurfhouse.stream/playlist.m3u8",
      type: 'application/x-mpegURL"},',
    },
  };

  let baldaio_ops = {
    ...videoJsOptions,
    sources: {
      src: "https://wow.camaramar.com/camaramar/49_baldaio.stream/playlist.m3u8",
      type: 'application/x-mpegURL"},',
    },
  };

  let ondalonga_ops = {
    ...videoJsOptions,
    sources: {
      src: "https://wow.camaramar.com/camaramar/54_cabana.stream/playlist.m3u8",
      type: 'application/x-mpegURL"},',
    },
  };

  let matadero_ops = {
    ...videoJsOptions,
    sources: {
      src: "https://wow.camaramar.com/camaramar/62_matadero.stream/playlist.m3u8",
      type: 'application/x-mpegURL"},',
    },
  };

  let barranan_ops = {
    ...videoJsOptions,
    sources: {
      src: "https://wow.camaramar.com/directo/KFC.stream/playlist.m3u8",
      type: 'application/x-mpegURL"},',
    },
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <>
      <div className="card m-1" style={{ width: "100%", height: "20%" }}>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>Bastiagueiro</td>
            </tr>
            <tr>
              <td>
                <VideoJS
                  options={bastiagueiro_ops}
                  onReady={handlePlayerReady}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card m-1" style={{ width: "100%", height: "20%" }}>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>Doniños</td>
            </tr>
            <tr>
              <td>
                <VideoJS options={doninos_ops} onReady={handlePlayerReady} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card m-1" style={{ width: "100%", height: "20%" }}>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>Santa Cristina</td>
            </tr>
            <tr>
              <td>
                <VideoJS
                  options={staCristina_ops}
                  onReady={handlePlayerReady}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card m-1" style={{ width: "100%", height: "20%" }}>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>Barrañán</td>
            </tr>
            <tr>
              <td>
                <VideoJS options={barranan_ops} onReady={handlePlayerReady} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card m-1" style={{ width: "100%", height: "20%" }}>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>Ondalonga</td>
            </tr>
            <tr>
              <td>
                <VideoJS options={ondalonga_ops} onReady={handlePlayerReady} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card m-1" style={{ width: "100%", height: "20%" }}>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>Matadero</td>
            </tr>
            <tr>
              <td>
                <VideoJS options={matadero_ops} onReady={handlePlayerReady} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card m-1" style={{ width: "100%", height: "20%" }}>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>Razo</td>
            </tr>
            <tr>
              <td>
                <VideoJS options={razo_ops} onReady={handlePlayerReady} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card m-1" style={{ width: "100%", height: "20%" }}>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>Perbes</td>
            </tr>
            <tr>
              <td>
                <VideoJS options={perbes_ops} onReady={handlePlayerReady} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card m-1" style={{ width: "100%", height: "20%" }}>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>Baldaio</td>
            </tr>
            <tr>
              <td>
                <VideoJS options={baldaio_ops} onReady={handlePlayerReady} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card m-1" style={{ width: "100%", height: "20%" }}>
        <table cellSpacing="0" cellPadding="0">
          <tbody>
            <tr>
              <td style={{ width: "20%" }}>caión</td>
            </tr>
            <tr>
              <td>
                <VideoJS options={caion_ops} onReady={handlePlayerReady} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Playas;
