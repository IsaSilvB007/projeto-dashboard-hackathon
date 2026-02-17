import { getCountriesByRegion, getPopulationByRegion, toggleChartLoading } from './helpers.js';
//import { mockData } from './mock.js';
import { renderCountriesList, renderTableSkeleton } from './ui.js';
import { sortCountriesList } from './helpers.js';
import { createMainPageChart } from './chart.js';
import { CONFIG } from './config.js';

export const countryService={

  getAll: async()=>{
    try {
      const res = await fetch('https://restcountries.com/v3.1/all?fields=name,translations,region,population,flags,cca3');

      if (!res.ok) {
        throw new Error(`Erro na API: ${res.status} - ${res.statusText}`);
      }
      const data = await res.json();
      return data;

      }catch (error) {
      console.error("Falha ao buscar lista de países:", error.message);
      return { erro: true, mensagem: error.message };
    }
  },

  getDetails: async(nomePais)=>{
    
    const apiClimaKey = CONFIG.API_CLIMA_KEY;

  if(!nomePais) return {erro: "Nenhum nome fornecido"}

  try{
      const resPais = await fetch(`https://restcountries.com/v3.1/name/${nomePais}`);
      if(!resPais.ok) throw new Error("País não encontrado.");
      const objPais = await resPais.json();
      const p=objPais[0];
      console.log(p);

      const capital = p.capital ? p.capital[0] : null;
      let dadosClima = {temperatura: "" , descricao: "" }
      if(capital){
        const resClima = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiClimaKey}&units=metric&lang=pt_br`);
        if(resClima.ok){
        const objClima = await resClima.json();
        dadosClima={
          temperatura: Math.round(objClima.main.temp)+"°C",
          descricao: objClima.weather[0].description
        };
        console.log(objClima);
      }
    }
      const objDados={
        nome: p.translations?.por?.common || p.name.common,
        nomeNativo: p.name.nativeName ? Object.values(p.name.nativeName)[0].common : p.name.common,
        bandeira: p.flags.svg,
        capital: capital || "",
        populacao: p.population.toLocaleString('pt-BR'),
        regiao: p.region,
        subRegiao: p.subregion,
        moeda: p.currencies ? Object.values(p.currencies).map(m => m.name).join(", ") : "N/A",
        idiomas: p.languages ? Object.values(p.languages).join(", ") : "N/A",
        clima: dadosClima,
        fronteiras: p.borders || [],   
      };

      sessionStorage.setItem("dadosFinais", JSON.stringify(objDados));
      return objDados;
      
    }catch(error){
      return { erro: error.message };
    }
  },
}
  

const init = async () => {
  const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
  if (!isHomePage) return;

  const tableBody = '#countries-list';

  renderTableSkeleton(tableBody);
  toggleChartLoading('wrapper-country', true);
  toggleChartLoading('wrapper-population', true);

  try {

    //await new Promise(resolve => setTimeout(resolve, 2000));
    const data = await countryService.getAll();
    if(data.erro) throw new Error(data.erro);

    const countries = sortCountriesList(data.map(country => ({
      name: country.translations?.por?.common || country.name.common,
      region: country.region.toLowerCase(),
      population: country.population,
      flag: country.flags.svg,
      cca3: country.cca3
    })));

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



