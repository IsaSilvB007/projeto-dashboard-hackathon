import { mockData } from './mock.js';
import { renderCountriesList } from './ui.js';
import { filterCountries, sortCountriesList } from './helpers.js';

// Essa parte é temporária e simula os dados recuperados na session storage
const newData = mockData.map(country => ({
  name: country.translations.por.common,
  region: country.region.toLowerCase(),
  population: country.population,
  flag: country.flags.svg,
  cca3: country.cca3
}));
const countries = sortCountriesList(newData);

const searchInput = document.querySelector('#search-input');
const regionSelect = document.querySelector('#region-filter');

searchInput.addEventListener('input', (event) => {
  const inputValue = event.target.value.toLowerCase().trim();
  const selectValue = regionSelect.value;
 
  const filteredCountries = filterCountries(inputValue, selectValue, countries);
  
  renderCountriesList(filteredCountries, '#countries-list');
});

regionSelect.addEventListener('change', (event) => {
  const selectValue = event.target.value.toLowerCase().trim();
  const inputValue = searchInput.value.toLowerCase().trim();
 
  const filteredCountries = filterCountries(inputValue, selectValue, countries);

  renderCountriesList(filteredCountries, '#countries-list');
});