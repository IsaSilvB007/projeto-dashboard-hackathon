import { translatedRegions } from "./constants.js";

export const renderCountriesList = (countries, elementId) => {
  const element = document.querySelector(elementId);

  const html = countries.length ? 
  countries.map(country => `
    <tr>
      <td>
        <div class="country-info">
          <img src="${country.flag}" alt="Bandeira de ${country.name}" class="flag-icon" />
          <span class="country-name">${country.name}</span>
        </div>
      </td>
      <td><span class="badge">${translatedRegions[country.region]}</span></td>
      <td class="text-right">
        <a href="detalhes.html?code=${country.cca3}" class="btn-detail" title="Ver detalhes do ${country.name}" aria-label="Detalhes">
          <img src="./assets/icons/external-link.svg" alt="" class="icon-svg" />
        </a>
      </td>
    </tr>
  `).join('') : 
  ` 
    <tr role="status" aria-live="polite">
      <td colspan="3" class="text-center">
        Nenhum país encontrado para a busca realizada.
      </td>
    </tr>
  `;

  element.innerHTML = html;
}

export const renderTableSkeleton = (elementId, rows = 5) => {
  const element = document.querySelector(elementId);
  const skeletonRow = `
    <tr>
      <td>
        <div class="country-info">
          <div class="skeleton flag-skeleton"></div>
          <div class="skeleton td-skeleton" style="width: 120px;"></div>
        </div>
      </td>
      <td><div class="skeleton td-skeleton" style="width: 80px;"></div></td>
      <td class="text-right"><div class="skeleton td-skeleton" style="width: 20px; float: right;"></div></td>
    </tr>
  `;
  
  element.innerHTML = skeletonRow.repeat(rows);
};

export const renderCountryDetails = (country, elementId) => {
  const element = document.querySelector(elementId);

  const html = `
    <img src="${country.flag}" alt="Bandeira de ${country.name}" id="country-flag" />
    <div class="country-info">
      <h2 id="country-name">${country.name}</h2>
      
      <div class="info-columns">
        <div class="info-col">
          <p><strong>Nome Nativo:</strong> <span id="native-name">${country.nativeName}</span></p>
          <p><strong>Capital:</strong> <span id="country-capital">${country.capital}</span></p>
          <p><strong>População:</strong> <span id="country-population">${country.population}</span></p>
          <p><strong>Sub-região:</strong> <span id="sub-region">${country.subRegion}</span></p>
        </div>
        <div class="info-col">
          <p><strong>Moedas:</strong> <span id="currencies">${country.currencies}</span></p>
          <p><strong>Idiomas:</strong> <span id="languages">${country.languages}</span></p>
          <p><strong>Fronteiras:</strong> <span id="borders">${country.borders}</span></p>
        </div>
      </div>
    </div>
  `;

  element.innerHTML = html;
}

export const renderWeatherList = (country, elementId) => {
  const element = document.querySelector(elementId);

  const html = country.weather.length ? 
  country.weather.map(weather => `
    <div class="weather-wrapper">
      <section class="weather-card">
        <h3>Clima em ${weather.city}</h3>
        <div id="weather-content"">
          <p id="current-temp">${weather.temperature}</p>
          <p id="weather-condition">${weather.description}</p>
        </div>
      </section>

      <section class="forecast-card">
        <h3>Previsão dos próximos dias em ${weather.city}</h3>
        <div class="chart-container">
          <canvas id="forecast-chart-${weather.city.toLowerCase().trim()}"></canvas>
        </div>
      </section>
    </div>
  `).join('') : '';

  element.insertAdjacentHTML('afterend', html);
}