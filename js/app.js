import { getCountriesByRegion, getPopulationByRegion, toggleChartLoading } from './helpers.js';
import { renderCountriesList, renderCountryDetails, renderTableSkeleton, renderWeatherList } from './ui.js';
import { createMainPageChart, renderWeatherChart } from './chart.js';
import { countryService } from './service.js';


const init = async () => {
  const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
  const isDetailPage = window.location.pathname.endsWith('detalhes.html');

  if (isHomePage) {
    const tableBody = '#countries-list';
    renderTableSkeleton(tableBody);
    toggleChartLoading('wrapper-country', true);
    toggleChartLoading('wrapper-population', true);
  
    try {
      const countries = await countryService.getAll();
      if(countries === null) throw new Error("Falha ao carregar dados dos países.");
  
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
  }

  if (isDetailPage) {
    try {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const country = await countryService.getDetails(urlParams.get('code'));
      
      renderCountryDetails(country, '#country-details');
      renderWeatherList(country, '#country-details');

      country.weather.forEach(weather => {
        const element = document.getElementById(`forecast-chart-${weather.city.toLowerCase().trim()}`);
        if (element) {
          renderWeatherChart(element, weather.forecast);
        }
      })
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }
};

init();



