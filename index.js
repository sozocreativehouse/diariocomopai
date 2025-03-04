document.addEventListener('DOMContentLoaded', function () {
    const versiculoElement = document.getElementById('versiculo');
    const reflexaoElement = document.getElementById('reflexao');
    const aplicacaoElement = document.getElementById('aplicacao');
    const desafioElement = document.getElementById('desafio');
    const oracaoElement = document.getElementById('oracao');
    const headerTitle = document.querySelector('header h1');

    function exibirVersiculo(versiculoData) {
        headerTitle.textContent = versiculoData.titulo;
        versiculoElement.textContent = versiculoData.versiculo;
        reflexaoElement.textContent = versiculoData.reflexao;
        aplicacaoElement.innerHTML = versiculoData.aplicacao.split('. ').map(item => `<li>${item}</li>`).join('');
        desafioElement.textContent = versiculoData.desafio;
        oracaoElement.textContent = versiculoData.oracao;
    }

    function selecionarVersiculoAleatorio(versiculos) {
        const hoje = new Date().toLocaleDateString();
        const versiculoSalvo = localStorage.getItem('versiculoDoDia');
        const dataSalva = localStorage.getItem('dataVersiculo');

        if (versiculoSalvo && dataSalva === hoje) {
            try {
                const versiculo = JSON.parse(versiculoSalvo);
                if (versiculo && typeof versiculo === 'object') {
                    exibirVersiculo(versiculo);
                } else {
                    throw new Error('Dados inválidos no localStorage');
                }
            } catch (error) {
                console.error('Erro ao fazer parsing do versículo salvo:', error);
                // Limpa o localStorage e seleciona um novo versículo
                localStorage.removeItem('versiculoDoDia');
                localStorage.removeItem('dataVersiculo');
                selecionarVersiculoAleatorio(versiculos);
            }
        } else {
            const indiceAleatorio = Math.floor(Math.random() * versiculos.length);
            const versiculoDoDia = versiculos[indiceAleatorio];

            localStorage.setItem('versiculoDoDia', JSON.stringify(versiculoDoDia));
            localStorage.setItem('dataVersiculo', hoje);

            exibirVersiculo(versiculoDoDia);
        }
    }

    fetch('index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo');
            }
            return response.json();
        })
        .then(versiculos => {
            console.log('Versículos carregados:', versiculos); // Log para depuração
            if (versiculos && Array.isArray(versiculos) && versiculos.length > 0) {
                selecionarVersiculoAleatorio(versiculos);
            } else {
                throw new Error('Nenhum versículo encontrado no arquivo JSON.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar index.json:', error);
            versiculoElement.textContent = 'Erro ao carregar os versículos.'; // Mensagem de erro na página
        });
});