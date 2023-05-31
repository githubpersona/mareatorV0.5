import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function DynamicChart() {
  const chartContainer = useRef(null);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Sales",
          data: [10, 20, 30, 40, 50, 60, 70],
          backgroundColor: "#4CAF50",
        },
      ],
    };

    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chart(chartContainer.current, {
        type: "bar",
        data: data,
      });

      setChartData(newChartInstance);
    }
  }, []);

  const handleClick = () => {
    const newData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Sales",
          data: [70, 60, 50, 40, 30, 20, 10],
          backgroundColor: "#2196F3",
        },
      ],
    };

    chartData.data = newData;
    chartData.update();
  };

  return (
    <div>
      <canvas ref={chartContainer} />
      <button onClick={handleClick}>Update Chart</button>
    </div>
  );
}

export default DynamicChart;
