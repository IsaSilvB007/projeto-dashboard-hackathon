import { translatedRegions } from "./constants.js";

export const renderCountriesList = (countries, elementId) => {
  const element = document.querySelector(elementId);

  const html = countries.map(country => `
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
          <img src="assets/icons/external-link.svg" alt="" class="icon-svg" />
        </a>
      </td>
    </tr>
  `).join('');

  element.innerHTML = html;
}