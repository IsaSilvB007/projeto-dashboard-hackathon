import { getCountriesByRegion, getPopulationByRegion, toggleChartLoading } from './helpers.js';
import { mockData } from './mock.js';
import { renderCountriesList, renderTableSkeleton } from './ui.js';
import { sortCountriesList } from './helpers.js';
import { createMainPageChart } from './chart.js';

const init = async () => {
  const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
  if (!isHomePage) return;

  const tableBody = '#countries-list';

  renderTableSkeleton(tableBody);
  toggleChartLoading('wrapper-country', true);
  toggleChartLoading('wrapper-population', true);

  try {
    // Simula um delay de carregamento para API de países enquanto a integração não é feita
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newData = mockData.map(country => ({
      name: country.translations.por.common,
      region: country.region.toLowerCase(),
      population: country.population,
      flag: country.flags.svg,
      cca3: country.cca3
    }));
    const countries = sortCountriesList(newData);

    renderCountriesList(countries, tableBody);

    const countriesByRegion = getCountriesByRegion(countries);
    const populationByRegion = getPopulationByRegion(countries);

    createMainPageChart(document.getElementById('countryChart'), 'bar', countriesByRegion, 'Quantidade de Países por Região');
    createMainPageChart(document.getElementById('populationChart'), 'pie', populationByRegion, 'População por Região');

    toggleChartLoading('wrapper-country', false);
    toggleChartLoading('wrapper-population', false);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
};

init();