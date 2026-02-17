import { renderCountriesList } from './ui.js';
import { filterCountries,  } from './helpers.js';
import { countryService } from './service.js';

const searchInput = document.querySelector('#search-input');
const regionSelect = document.querySelector('#region-filter');

searchInput.addEventListener('input', async (event) => {
  try {
    const countries = await countryService.getAll();
    if(countries === null) throw new Error("Falha ao carregar dados dos países.");

    const inputValue = event.target.value.toLowerCase().trim();
    const selectValue = regionSelect.value;
   
    const filteredCountries = filterCountries(inputValue, selectValue, countries);
    
    renderCountriesList(filteredCountries, '#countries-list');
    
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
});

regionSelect.addEventListener('change', async (event) => {
  try {
    const countries = await countryService.getAll();
    if(countries === null) throw new Error("Falha ao carregar dados dos países.");

    const selectValue = event.target.value.toLowerCase().trim();
    const inputValue = searchInput.value.toLowerCase().trim();
    
    const filteredCountries = filterCountries(inputValue, selectValue, countries);
  
    renderCountriesList(filteredCountries, '#countries-list');
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
});