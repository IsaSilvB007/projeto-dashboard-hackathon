// Pega toda a parte de endereços da URL atual
const parametros = new URLSearchParams(window.location.search);

// Procura especificamente pelo valor que está depois de "code="
const codigoPais = parametros.get('code');

// Mostra no console para ver se funcionou
console.log("O código do país capturado é:", codigoPais);

// Criamos a "receita" para buscar os dados
async function buscarDadosDoPais(codigo) {
    try {
        // Fazendo a "ligação" para a API usando o código capturado
        const resposta = await fetch(`https://restcountries.com/v3.1/alpha/${codigo}`);

        // Transformando a resposta em algo que o JS entenda (JSON)
        const dados = await resposta.json();

        // O dado vem dentro de uma lista [], pegamos o primeiro item [0]
        const pais = dados[0];

        // Pegando os elementos do HTML pelo ID
        const flagImg = document.getElementById('country-flag');
        const countryName = document.getElementById('country-name');
        const countryCapital = document.getElementById('country-capital');
        const countryPop = document.getElementById('country-population');

        // Preenchendo com os dados da API
        flagImg.src = pais.flags.svg;
        flagImg.alt = `Bandeira de ${pais.name.common}`;
        countryName.textContent = pais.translations.por.common;

        // Guardamos a capital em uma variável para usar no clima depois
        const capital = pais.capital ? pais.capital[0] : null;
        countryCapital.textContent = `Capital: ${capital || 'Não informada'}`;
        countryPop.textContent = `População: ${pais.population.toLocaleString('pt-BR')}`;

        console.log("Dados completos do país encontrados:", pais);

        // --- CORREÇÃO: Chamando a função de clima aqui dentro ---
        if (capital) {
            buscarClima(capital);
        } else {
            document.getElementById('loading-clima').textContent = "Clima indisponível (sem capital).";
        }

    } catch (erro) {
        console.error("Ops! Algo de errado na busca:", erro);
    }
}

// Agora, pedimos para a receita ser executada usando o nosso código
if (codigoPais) {
    buscarDadosDoPais(codigoPais);
}

async function buscarClima(capital) {
    const loadingClima = document.getElementById('loading-clima');
    const conteudoClima = document.getElementById('conteudo-clima');

    try {
        // Mostra loading para testar visual
        loadingClima.style.display = 'block';
        conteudoClima.style.display = 'none';

        // Simula um atraso de 1,5s para simular busca
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Objeto Ficticio (Mock) imitando a resposta da API
        const dadosSimulados = {
            main: { temp: 24.5 },
            // CORREÇÃO: mudei de 'descripition' para 'description'
            weather: [{ description: "Céu limpo com poucas nuvens" }]
        };

        // Preenche o HTML com dados falsos
        document.getElementById('temp-atual').textContent = `Temperatura: ${Math.round(dadosSimulados.main.temp)}°C`;
        // CORREÇÃO: mudei para bater com o nome certo 'description'
        document.getElementById('condicao-clima').textContent = `Condição: ${dadosSimulados.weather[0].description}`; 

        // Esconde o Loading e mostra o resultado
        loadingClima.style.display = 'none';
        conteudoClima.style.display = 'block';

        renderizarGrafico();

        console.log("Simulação de clima concluída para:", capital);
    } catch (erro) {
        console.error("Erro na simulação:", erro);
        loadingClima.textContent = "Erro na Simulação";
    }
}

function renderizarGrafico() {
    const ctx = document.getElementById('previsaoChart').getContext('2d');

    //Dados fictícios para os próximos 5 dias
    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
    const temperaturas = [22, 24, 23, 25, 22];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperatura (°C)',
                data: temperaturas,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderWidth: 3,
                fill: true, // Cria a área sombreada abaixo da linha
                tension: 0.3 // Deixa a linha elegante em curva
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false // Melhor para temperaturas
                }
            }
        }
    });
}