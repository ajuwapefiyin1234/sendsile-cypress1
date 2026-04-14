import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
  } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );

const labels = ["MON", "TUE", "WED", "THU", "FRI"];

 const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        drawOnChartArea: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        drawOnChartArea: true,
      },
    },
  },
};

 const data = {
  labels,
  datasets: [
    {
      type: "line",
      label: "Aggregate",
      data: [40, 60, 30, 80, 65],
      fill: true, // Set to true to create an area chart
      backgroundColor: "rgba(49, 200, 89, 0.5)", // Semi-transparent fill color
      borderColor: "#31C859",
      borderWidth: 2,
      pointBackgroundColor: "#31C859",
      pointBorderColor: "#fff",
      tension: 0.1, // Smoothing the line 0.4 is perfect
    },
  ],
};

const AreaChart = () => {
  return <Line data={data} options={options} />;
};

export default AreaChart;
