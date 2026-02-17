import { CONFIG } from "./config.js";
import { errorAlert, groupWeatherByDays, sortCountriesList } from "./helpers.js";

export const countryService={
  getAll: async()=>{
    try {
      const cachedData = sessionStorage.getItem("allCountries");
      if (cachedData) {
        return JSON.parse(cachedData);
      };

      const res = await fetch(`${CONFIG.COUNTRIES_BASE_URL}/all?fields=name,translations,region,population,flags,cca3`);

      if (!res.ok) {
        throw new Error(`Erro na API: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      
      const countries = sortCountriesList(data.map(country => ({
        name: country.translations?.por?.common || country.name.common,
        region: country.region.toLowerCase(),
        population: country.population,
        flag: country.flags.svg,
        cca3: country.cca3
      })));
      
      sessionStorage.setItem("allCountries", JSON.stringify(countries));
      return countries;
    }catch (error) {
      console.error("Falha ao buscar lista de países:", error.message);

      errorAlert("Não conseguimos obter a lista de países. Deseja tentar novamente?");

      return null;
    }
  },

  getDetails: async(countryCode)=>{
    if(!countryCode) return {erro: "Nenhum código ccs3 fornecido."}

    try{
        let countryData;

        const cachedData = sessionStorage.getItem(countryCode);

        if (cachedData) {
          countryData = JSON.parse(cachedData);
        }
        else {
          const countryResponse = await fetch(`${CONFIG.COUNTRIES_BASE_URL}/alpha/${countryCode}`);
          if(!countryResponse.ok) throw new Error("País não encontrado.");
          const countryArray = await countryResponse.json();
          countryData = countryArray[0];
          sessionStorage.setItem(countryCode, JSON.stringify(countryData));
        }
        
        const capitals = countryData.capital ? countryData.capital : [];

        const weatherPromises = capitals.map(async (city)=> {
          try {
            const weatherRes = await fetch(
              `${CONFIG.WEATHER_BASE_URL}/weather?q=${city}&appid=${CONFIG.WEATHER_API_KEY}&units=metric&lang=pt_br`
            );
            
            if(weatherRes.ok){
              const forecastRes = await fetch(
                `${CONFIG.WEATHER_BASE_URL}/forecast?q=${city}&appid=${CONFIG.WEATHER_API_KEY}&units=metric&lang=pt_br`
              );

              if (forecastRes.ok) {
                const weatherObj = await weatherRes.json();
                const forecastObj = await forecastRes.json();
                const groupedForecast = groupWeatherByDays(forecastObj);
                
                return {
                  city,
                  temperature: Math.round(weatherObj.main.temp)+"°C",
                  description: weatherObj.weather[0].description,
                  forecast: groupedForecast
                };
              }
            }
          }catch(error){
            return null;
          }
          return null;
        });

        const weatherDataArray = (await Promise.all(weatherPromises)).filter(weather => weather !== null);

        const detailsData={
          name: countryData.translations?.por?.common || countryData.name.common,
          nativeName: countryData.name.nativeName ? Object.values(countryData.name.nativeName)[0].common : countryData.name.common,
          flag: countryData.flags.svg,
          capital: capitals.length > 0 ? capitals.join(", ") : "N/A",
          population: countryData.population.toLocaleString('pt-BR'),
          region: countryData.region,
          subRegion: countryData.subregion || "N/A",
          currencies: countryData.currencies ? Object.values(countryData.currencies).map(currencie => currencie.name).join(", ") : "N/A",
          languages: countryData.languages ? Object.values(countryData.languages).join(", ") : "N/A",
          weather: weatherDataArray,
          borders: countryData.borders ? countryData.borders.join(", ") : "N/A",   
        };
        
        return detailsData;
      }catch(error){
        console.error("Falha ao buscar dados de um países:", error.message);

        errorAlert("Não conseguimos obter dados do país. Deseja tentar novamente?");

        return null;
      }
  },
}