import { getCountriesByRegion, getPopulationByRegion } from './helpers.js';
import { mockData } from './mock.js';
import { renderCountriesList } from './ui.js';
import { sortCountriesList } from './helpers.js';
import { regionColors, translatedRegions } from './constants.js';

// Essa parte é temporária e simula os dados recuperados na session storage
const newData = mockData.map(country => ({
  name: country.translations.por.common,
  region: country.region.toLowerCase(),
  population: country.population,
  flag: country.flags.svg,
  cca3: country.cca3
}));
const countries = sortCountriesList(newData);

renderCountriesList(countries, '#countries-list');

const countryChart = document.getElementById('countryChart');
const populationChart = document.getElementById('populationChart');

const countriesByRegion = getCountriesByRegion(countries);
const populationByRegion = getPopulationByRegion(countries);

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

const createChart = (chartElement, type, data, options) => {
  new Chart(chartElement, {
    type: type,
    data: {
      labels: Object.keys(data).map(region => translatedRegions[region]),
      datasets: [{
        label: 'Quantidade de Países por Região',
        data: Object.keys(data).map(region => data[region]),
        backgroundColor: regionColors,
        borderWidth: 1
      }]
    },
    options: options
  });
}

createChart(countryChart, 'bar', countriesByRegion, barOptions);
createChart(populationChart, 'pie', populationByRegion, pieOptions);