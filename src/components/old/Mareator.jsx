import AppRutas from "../../Rutas/AppRutas";

const Mareator = () => {
  return (
    <div>
      <AppRutas />
    </div>
  );
};

export default Mareator;

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
