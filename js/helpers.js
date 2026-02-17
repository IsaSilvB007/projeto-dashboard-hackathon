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

export const errorAlert = (text) => {
  Swal.fire({
    title: 'Erro ao carregar dados!',
    text: text,
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, recarregar página',
    cancelButtonText: 'Sair'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload();
    }
  });
}

export const groupWeatherByDays = (forecastData) => {
  const grouped = forecastData.list.reduce((acc, item) => {
    const today = new Date().toISOString().split('T')[0];
    const dateStr = item.dt_txt.split(' ')[0];

    if (dateStr !== today) {
      
      const dayName = new Date(item.dt_txt).toLocaleDateString('pt-BR', { weekday: 'short' });
      
      if (!acc[dayName]) {
        acc[dayName] = { temps: [], total: 0 };
      }

      acc[dayName].temps.push(item.main.temp);
    }
    return acc;
  }, {});

  const result = {};
  for (const day in grouped) {
    const sum = grouped[day].temps.reduce((a, b) => a + b, 0);
    const average = sum / grouped[day].temps.length;
    result[day] = Math.round(average * 10) / 10;
  }

  return result;
};