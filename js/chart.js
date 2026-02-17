import { regionColors, translatedRegions } from './constants.js';

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const barOptions = {
  ...commonOptions,
  scales: {
    y: { beginAtZero: true }
  }
};

const pieOptions = {
  ...commonOptions,
  plugins: {
    legend: {
      position: 'bottom',
    }
  }
};

const getLineOptions = (minTemp, maxTemp) => ({
  ...commonOptions,
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: `Mín: ${minTemp}°C | Máx: ${maxTemp}°C`
      }
    }
  }
});

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
    options: type === 'bar' ? barOptions : pieOptions,
  });
}

export const renderWeatherChart = (chartElement, data) => {
  new Chart(chartElement, {
    type: 'line',
    data: {
      labels:  Object.keys(data),
      datasets: [{
        label: 'Temperatura (°C)',
        data: Object.keys(data).map(day => data[day]),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: getLineOptions(Math.min(...Object.values(data)), Math.max(...Object.values(data))),
  });
}