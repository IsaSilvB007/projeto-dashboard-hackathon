const urlParams = new URLSearchParams(window.location.search);
const countryCode = urlParams.get('code');

async function fetchCountryData(code) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        const data = await response.json();
        const country = data[0];

        // Bandeira e Nome
        document.getElementById('country-flag').src = country.flags.svg;
        document.getElementById('country-name').textContent = country.translations.por.common;
        
        // Nome Nativo
        const nativeNameObj = country.name.nativeName;
        const nativeName = nativeNameObj ? Object.values(nativeNameObj)[0].common : country.name.common;
        document.getElementById('native-name').textContent = nativeName;

        // Capital e População
        const capital = country.capital ? country.capital[0] : null;
        document.getElementById('country-capital').textContent = capital || 'Não informada';
        document.getElementById('country-population').textContent = country.population.toLocaleString('pt-BR');
        
        // Sub-região
        document.getElementById('sub-region').textContent = country.subregion || 'N/A';

        // Moedas
        const currencies = country.currencies ? 
            Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A';
        document.getElementById('currencies').textContent = currencies;

        // Idiomas
        const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
        document.getElementById('languages').textContent = languages;

        // Fronteiras
        const borders = country.borders ? country.borders.join(', ') : 'Nenhuma';
        document.getElementById('borders').textContent = borders;

        if (capital) {
            fetchWeather(capital);
        } else {
            document.getElementById('weather-loading').textContent = "Clima indisponível.";
        }
    } catch (error) {
        console.error("Erro ao buscar país:", error);
    }
}

async function fetchWeather(capital) {
    const loading = document.getElementById('weather-loading');
    const content = document.getElementById('weather-content');

    try {
        loading.style.display = 'block';
        content.style.display = 'none';

        await new Promise(r => setTimeout(r, 1000));

        const mockWeather = {
            main: { temp: 25 },
            weather: [{ description: "céu limpo" }]
        };

        document.getElementById('current-temp').textContent = `${mockWeather.main.temp}°C`;
        document.getElementById('weather-condition').textContent = mockWeather.weather[0].description;

        loading.style.display = 'none';
        content.style.display = 'block';

        renderChart();
    } catch (error) {
        loading.textContent = "Erro ao carregar clima.";
    }
}

function renderChart() {
    const ctx = document.getElementById('forecast-chart').getContext('2d');
    
    if (window.myChart) { window.myChart.destroy(); }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
            datasets: [{
                label: 'Temperatura (°C)',
                data: [22, 24, 23, 25, 22],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Mín: 22°C | Máx: 25°C'
                    }
                }
            }
        }
    });
}

if (countryCode) { fetchCountryData(countryCode); }