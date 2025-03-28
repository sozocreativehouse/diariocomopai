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
        { id: 1, question: "Deus falou com você através da nossa plataforma hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 2, question: "Você se considera ansioso?", type: "choice", options: ["Sim", "Não", "Às vezes"] },
        { id: 3, question: "Você se considera uma pessoa deprimida?", type: "choice", options: ["Sim", "Não", "Às vezes"] },
        { id: 4, question: "Como foi sua experiência com Deus hoje?", type: "text" },
        { id: 5, question: "Você sentiu a presença de Deus em sua oração?", type: "choice", options: ["Sim", "Não"] },
        { id: 6, question: "Houve algum momento de inspiração divina para você hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 7, question: "Você compartilhou alguma palavra de fé com alguém hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 8, question: "Você se sentiu desanimado(a) em algum momento hoje?", type: "choice", options: ["Sim", "Não", "Às vezes"] },
        { id: 9, question: "O quanto você se sente conectado(a) com Deus hoje?", type: "choice", options: ["Muito", "Pouco", "Nem um pouco"] },
        { id: 10, question: "Você participou de alguma leitura bíblica hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 11, question: "Você meditou sobre a Palavra de Deus hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 12, question: "Qual foi o versículo que mais impactou você hoje?", type: "text" },
        { id: 13, question: "Você orou sozinho(a) ou em grupo hoje?", type: "choice", options: ["Sozinho(a)", "Em grupo"] },
        { id: 14, question: "Você sente que suas orações foram respondidas hoje?", type: "choice", options: ["Sim", "Não", "Parcialmente"] },
        { id: 15, question: "Você teve dificuldade para manter a fé hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 16, question: "Você se sentiu fortalecido(a) espiritualmente hoje?", type: "choice", options: ["Sim", "Não", "Parcialmente"] },
        { id: 17, question: "Como você descreveria sua jornada espiritual hoje?", type: "text" },
        { id: 18, question: "Você teve algum sonho ou visão que lhe inspirou hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 19, question: "Você sentiu que Deus guiou suas decisões hoje?", type: "choice", options: ["Sim", "Não", "Parcialmente"] },
        { id: 20, question: "Você percebeu alguma mudança positiva em seu comportamento hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 21, question: "Você se dedicou a alguma ação de serviço hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 22, question: "Você sentiu gratidão por algo hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 23, question: "O que você mais agradeceu hoje?", type: "text" },
        { id: 24, question: "Você teve momentos de reflexão profunda hoje?", type: "choice", options: ["Sim", "Não", "Às vezes"] },
        { id: 25, question: "Você participou de algum culto ou reunião virtual hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 26, question: "Você leu algum devocional ou mensagem edificante hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 27, question: "Como você avaliaria seu estado emocional hoje?", type: "choice", options: ["Ótimo", "Bom", "Regular", "Ruim"] },
        { id: 28, question: "Você se sentiu inspirado(a) a ajudar alguém hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 29, question: "Você praticou alguma forma de meditação ou oração silenciosa hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 30, question: "Você sentiu que o Espírito Santo estava presente em suas ações hoje?", type: "choice", options: ["Sim", "Não", "Parcialmente"] },
        { id: 31, question: "Qual o principal aprendizado espiritual que você teve hoje?", type: "text" },
        { id: 32, question: "Você sentiu a paz de Deus em algum momento específico hoje?", type: "choice", options: ["Sim", "Não", "Às vezes"] },
        { id: 33, question: "Você se sentiu motivado(a) a mudar algo em sua vida hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 34, question: "Você compartilhou sua fé com alguém hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 35, question: "Você leu ou ouviu alguma mensagem inspiradora hoje?", type: "choice", options: ["Sim", "Não", "Às vezes"] },
        { id: 36, question: "Você se sentiu renovado(a) espiritualmente hoje?", type: "choice", options: ["Sim", "Não", "Parcialmente"] },
        { id: 37, question: "Você dedicou tempo para refletir sobre sua vida espiritual hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 38, question: "Você sentiu a presença de Deus durante suas atividades diárias hoje?", type: "choice", options: ["Sim", "Não", "Às vezes"] },
        { id: 39, question: "Você experimentou alguma emoção positiva relacionada à sua fé hoje?", type: "choice", options: ["Sim", "Não"] },
        { id: 40, question: "Qual foi o maior desafio espiritual que você enfrentou hoje?", type: "text" }
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