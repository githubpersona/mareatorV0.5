document.addEventListener("DOMContentLoaded", function () {
  Chart.plugins.register({
    afterDatasetsDraw: function (chart) {
      var ctx = chart.ctx;

      chart.data.datasets.forEach(function (dataset, datasetIndex) {
        var meta = chart.getDatasetMeta(datasetIndex);
        if (!meta.hidden) {
          meta.data.forEach(function (element, index) {
            // Draw the value as text on each point
            ctx.fillStyle = "black";
            var fontSize = 12;
            var fontStyle = "bold";
            var fontFamily = "Arial";
            ctx.font = Chart.helpers.fontString(
              fontSize,
              fontStyle,
              fontFamily
            );
            var dataString = dataset.data[index].toString();
            ctx.fillText(dataString, element._model.x, element._model.y - 10);
          });
        }
      });
    },
  });

  var ctx = document.getElementById("myChart").getContext("2d");

  var chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Data",
          data: [10, 20, 15, 30, 25, 40, 35],
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
});
