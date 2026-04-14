import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        generateLabels: (chart) => {
          const { data } = chart;
          return data.datasets.map((dataset, i) => ({
            text: dataset.label,
            fillStyle: dataset.backgroundColor,
            strokeStyle: dataset.borderColor,
            lineWidth: 0,
            hidden: !chart.isDatasetVisible(i),
            index: i,
            pointStyle: 'circle',
          }));
        },
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: 'white',
      titleColor: 'black',
      bodyColor: 'black',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      padding: 10,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += '₦' + context.parsed.y + 'K';
          }
          return label;
        },
      },
    },
    datalabels: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Remove vertical grid lines on the x-axis
      },
      border: {
        color: '#F3F3F5', // Set the x-axis border color
        width: 0.5, // Set the x-axis border thickness
      },
    },
    y: {
      min: 0,
      beginAtZero: false,
      grid: {
        drawOnChartArea: true,
        color: '#F3F3F5', // Change the y grid color
        lineWidth: 0.5, // Reduce the size of the grid lines
      },
      border: {
        display: false, // Remove y-axis line
      },
    },
  },
  barPercentage: 0.6, // Reduce the width of the bars
  categoryPercentage: 0.7, // Increase the spacing between bars
};

const data = {
  labels,
  datasets: [
    {
      type: 'bar',
      label: 'Income',
      data: [500, 800, 120, 249, 605, 569, 329],
      fill: false,
      backgroundColor: '#00070C',
      borderRadius: 30,
      borderSkipped: 'top bottom',
    },
    {
      type: 'bar',
      label: 'Settlement',
      data: [200, 349, 769, 123, 581, 329, 150],
      fill: false,
      backgroundColor: '#FFA900',
      borderRadius: 30,
      borderSkipped: 'top bottom',
    },
  ],
};

const BarChart = () => {
  return <Bar data={data} options={options} />;
};

export default BarChart;
