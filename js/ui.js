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