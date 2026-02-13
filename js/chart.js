import { regionColors, translatedRegions } from './constants.js';

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true }
  }
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    }
  }
};

export const createMainPageChart = (chartElement, type, data, label) => {
  new Chart(chartElement, {
    type: type,
    data: {
      labels: Object.keys(data).map(region => translatedRegions[region]),
      datasets: [{
        label: label,
        data: Object.keys(data).map(region => data[region]),
        backgroundColor: regionColors,
        borderWidth: 1
      }]
    },
    options: type === 'bar' ? barOptions : pieOptions
  });
}