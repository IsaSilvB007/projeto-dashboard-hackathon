//Pega toda a parte de endereços da URL atual
const parametros = new URLSearchParams(window.location.search);

//Procura especificamente pelo valor que está depois de "code="
const codigoPais = parametros.get('code');

//Mostra no console para ver se funcionou
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
        countryName.textContent = pais.name.common;
        countryCapital.textContent = `Capital: ${pais.capital ? pais.capital[0] : 'Não informada'}`
        countryPop.textContent = `População: ${pais.population.toLocaleString('pt-BR')}`

        console.log("Dados completos do país encontrados:", pais);

    } catch (erro) {
        console.error("Ops! Algo de errado na busca:", erro);
    }
}

// Agora, pedimos para a receita ser executada usando o nosso código
if (codigoPais) {
    buscarDadosDoPais(codigoPais);
}