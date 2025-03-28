document.addEventListener('DOMContentLoaded', function () {
    const versiculoElement = document.getElementById('versiculo');
    const reflexaoElement = document.getElementById('reflexao');
    const aplicacaoElement = document.getElementById('aplicacao');
    const desafioElement = document.getElementById('desafio');
    const oracaoElement = document.getElementById('oracao');
    const headerTitle = document.querySelector('header h1');
    const temaHeaderElement = document.getElementById('tema-header');

    function exibirVersiculo(versiculoData) {
        headerTitle.textContent = versiculoData.titulo;
        temaHeaderElement.textContent = versiculoData.tema;
        versiculoElement.textContent = versiculoData.versiculo;
        reflexaoElement.textContent = versiculoData.reflexao;
        aplicacaoElement.innerHTML = versiculoData.aplicacao.split('. ').map(item => `<li>${item}</li>`).join('');
        desafioElement.textContent = versiculoData.desafio;
        oracaoElement.textContent = versiculoData.oracao;
    }

    function selecionarVersiculoSequencial(versiculos) {
        const hoje = new Date().toLocaleDateString();
        const savedData = sessionStorage.getItem('versiculoData');
        let index = 0;
        if (savedData) {
            try {
                const dataObj = JSON.parse(savedData);
                if (dataObj.date === hoje) {
                    index = dataObj.index;
                } else {
                    index = (dataObj.index + 1) % versiculos.length;
                }
            } catch (error) {
                console.error('Erro ao fazer parsing do sessionStorage:', error);
                index = 0;
            }
        }
        sessionStorage.setItem('versiculoData', JSON.stringify({ date: hoje, index: index }));
        exibirVersiculo(versiculos[index]);
    }

    fetch('index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo');
            }
            return response.json();
        })
        .then(versiculos => {
            if (versiculos && Array.isArray(versiculos) && versiculos.length > 0) {
                selecionarVersiculoSequencial(versiculos);
            } else {
                throw new Error('Nenhum versículo encontrado no arquivo JSON.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar index.json:', error);
            versiculoElement.textContent = 'Erro ao carregar os versículos.';
        });

    const perguntas = [
        { id: 1, question: "Como foi sua experiência com Deus hoje? Nos conte como a palavra tocou seu coração.", type: "text" },
        { id: 2, question: "Deus falou com você através desta mensagem? Compartilhe o que sentiu.", type: "text" },
        { id: 3, question: "Qual foi o versículo que mais te impactou hoje? Como ele se conectou com sua vida?", type: "text" },
        { id: 4, question: "Você teve algum momento de inspiração divina hoje? Descreva esse instante.", type: "text" },
        { id: 5, question: "Como você descreveria sua jornada espiritual hoje? O que aprendeu de importante?", type: "text" },
        { id: 6, question: "De que forma você percebeu a presença de Deus em suas atividades diárias?", type: "text" },
        { id: 7, question: "Qual ensinamento da Bíblia ficou mais presente em seu coração hoje? Explique.", type: "text" },
        { id: 8, question: "Que palavra de fé você gostaria de compartilhar com alguém? Nos conte.", type: "text" },
        { id: 9, question: "Como a leitura de hoje influenciou seus pensamentos e sentimentos?", type: "text" },
        { id: 10, question: "Em que momento você sentiu uma conexão especial com o divino? Detalhe a experiência.", type: "text" },
        { id: 11, question: "O que mais te emocionou durante sua oração hoje? Descreva essa emoção.", type: "text" },
        { id: 12, question: "Qual foi o maior desafio espiritual que você enfrentou hoje e como superou? Compartilhe sua experiência.", type: "text" }
    ];

    function exibirPerguntas() {
        const hoje = new Date().toLocaleDateString();
        const savedPerguntas = sessionStorage.getItem('answeredPerguntas');
        let answered = [];
        if (savedPerguntas) {
            try {
                const obj = JSON.parse(savedPerguntas);
                if (obj.date === hoje) {
                    answered = obj.ids;
                }
            } catch (error) {
                console.error('Erro ao parsear answeredPerguntas:', error);
            }
        }
        const perguntasDisponiveis = perguntas.filter(q => !answered.includes(q.id));
        const numeroPerguntas = Math.min(3, perguntasDisponiveis.length);
        const perguntasSelecionadas = [];
        while (perguntasSelecionadas.length < numeroPerguntas) {
            const indiceAleatorio = Math.floor(Math.random() * perguntasDisponiveis.length);
            const pergunta = perguntasDisponiveis[indiceAleatorio];
            if (!perguntasSelecionadas.find(q => q.id === pergunta.id)) {
                perguntasSelecionadas.push(pergunta);
            }
        }
        const container = document.getElementById('perguntasContainer');
        container.innerHTML = '';
        perguntasSelecionadas.forEach(pergunta => {
            const div = document.createElement('div');
            div.classList.add('pergunta-item');

            const label = document.createElement('label');
            label.setAttribute('for', `pergunta_${pergunta.id}`);
            label.textContent = pergunta.question;
            div.appendChild(label);

            if (pergunta.type === "text") {
                const textarea = document.createElement('textarea');
                textarea.id = `pergunta_${pergunta.id}`;
                textarea.name = pergunta.question;
                textarea.required = true;
                div.appendChild(textarea);
            } else if (pergunta.type === "choice") {
                pergunta.options.forEach((opcao, index) => {
                    const radioContainer = document.createElement('div');
                    radioContainer.classList.add('radio-group');
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.id = `pergunta_${pergunta.id}_opcao_${index}`;
                    radio.name = pergunta.question;
                    radio.value = opcao;
                    radio.required = true;
                    const radioLabel = document.createElement('label');
                    radioLabel.setAttribute('for', radio.id);
                    radioLabel.textContent = opcao;
                    radioContainer.appendChild(radio);
                    radioContainer.appendChild(radioLabel);
                    div.appendChild(radioContainer);
                });
            }
            container.appendChild(div);
        });
    }

    const perguntasForm = document.getElementById('perguntasForm');
    perguntasForm.addEventListener('submit', function (event) {
        const inputs = perguntasForm.querySelectorAll('[id^="pergunta_"]');
        const respondedIds = [];
        inputs.forEach(input => {
            const id = parseInt(input.id.split('_')[1]);
            respondedIds.push(id);
        });
        const hoje = new Date().toLocaleDateString();
        const savedPerguntas = sessionStorage.getItem('answeredPerguntas');
        let answered = { date: hoje, ids: [] };
        if (savedPerguntas) {
            try {
                const obj = JSON.parse(savedPerguntas);
                if (obj.date === hoje) {
                    answered = obj;
                }
            } catch (error) {
                console.error('Erro ao parsear answeredPerguntas:', error);
            }
        }
        answered.ids = Array.from(new Set(answered.ids.concat(respondedIds)));
        sessionStorage.setItem('answeredPerguntas', JSON.stringify(answered));
    });

    exibirPerguntas();
});