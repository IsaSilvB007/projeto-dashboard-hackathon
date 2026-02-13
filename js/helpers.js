export const sortCountriesList = (countries) => (
  countries.sort(function(a,b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  })
);

export const getCountriesByRegion = (countries) => (
  countries.reduce((acc, country) => {
    const region = country.region;
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {})
);

export const getPopulationByRegion = (countries) => (
  countries.reduce((acc, country) => {
    const region = country.region;
    acc[region] = (acc[region] || 0) + country.population;
    return acc;
  }, {})
);

export const filterCountries = (inputValue, selectValue, countries) => {
  if (inputValue === '' && selectValue === 'all') {
    return countries;
  } else {
    return countries.filter(country => 
      country.name.toLowerCase().includes(inputValue) && 
      (selectValue !== 'all' ? country.region === selectValue : true)
    );
  }
}

export const toggleChartLoading = (wrapperId, isLoading) => {
  const wrapper = document.getElementById(wrapperId);
  const loader = wrapper.querySelector('.loader');
  const canvas = wrapper.querySelector('canvas');

  if (isLoading) {
    loader.classList.remove('hidden');
    canvas.classList.add('hidden');
  } else {
    loader.classList.add('hidden');
    canvas.classList.remove('hidden');
  }
};