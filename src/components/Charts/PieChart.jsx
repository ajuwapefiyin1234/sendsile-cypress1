import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data = {
  labels: ['Vegetable', 'Fruits', 'Oil & Spices', 'Foodstuffs'],
  datasets: [
    {
      data: [30, 15, 20, 35],
      backgroundColor: ['#070602', '#FC7900', '#FFA900', '#36A70A'],
      hoverOffset: 32,
      offset: [4, 8, 4, 8],
      borderWidth: 2,
      borderColor: '#fff',
    },
  ],
};

const options = {
  plugins: {
    legend: {
      display: false,
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
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            label += context.parsed + '%';
          }
          return label;
        },
      },
    },
    datalabels: {
      color: 'white',
      formatter: (value, context) => {
        const label = context.chart.data.labels[context.dataIndex];
        return `${value}%\n${label}`;
      },
      font: {
        size: 12,
        weight: 'bold',
      },
      align: 'center',
      anchor: 'center',
      textAlign: 'center',
      padding: {
        top: 5,
      },
    },
  },
};

const PieChart = () => {
  return (
    <div style={{ maxWidth: '233.53px', maxHeight: '228.97px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
