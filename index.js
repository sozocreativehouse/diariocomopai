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
        // Aqui, a propriedade "aplicacao" é dividida em linhas usando "\n" e cada linha é renderizada como um card
        aplicacaoElement.innerHTML = versiculoData.aplicacao
            .split('\n')
            .filter(item => item.trim() !== '')
            .map(item => `<div class="aplicacao-card">${item.trim()}</div>`)
            .join('');
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
        { id: 1, question: "Como foi seu dia com Deus? Conta pra gente como a palavra fez seu coração sorrir! 😊", type: "text" },
        { id: 2, question: "Você sentiu o toque de Deus nessa mensagem? Compartilha o que rolou no seu coração! 💖", type: "text" },
        { id: 3, question: "Qual versículo te surpreendeu hoje? Como ele impactou a sua vida? ✨", type: "text" },
        { id: 4, question: "Te rolou algum momento inspirador hoje? Conta mais sobre esse momento especial! 🌟", type: "text" },
        { id: 5, question: "Como foi sua jornada espiritual hoje? Quais aprendizados te deixaram com um sorriso no rosto? 🙂", type: "text" },
        { id: 6, question: "De que jeito você percebeu Deus nas pequenas coisas do seu dia? 🙏", type: "text" },
        { id: 7, question: "Qual ensinamento da Bíblia fez eco no seu coração hoje? Compartilha com a gente! 💬", type: "text" },
        { id: 8, question: "Tem alguma palavra de fé que você gostaria de dividir com seus amigos? Nos conta! 📖", type: "text" },
        { id: 9, question: "Como a leitura de hoje mexeu com seus pensamentos e sentimentos? Fala pra gente! 🤔", type: "text" },
        { id: 10, question: "Você viveu algum momento marcante em que sentiu a presença divina? Detalha essa conexão! ✝️", type: "text" },
        { id: 11, question: "O que te emocionou mais durante sua oração hoje? Conta pra gente essa sensação! ❤️", type: "text" },
        { id: 12, question: "Qual foi o maior desafio espiritual que você enfrentou hoje e como você deu a volta por cima? Compartilha sua história! 🌈", type: "text" }
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
        const perguntaSelecionada = perguntasDisponiveis[Math.floor(Math.random() * perguntasDisponiveis.length)];

        const container = document.getElementById('perguntasContainer');
        container.innerHTML = '';

        if (perguntaSelecionada) {
            const div = document.createElement('div');
            div.classList.add('pergunta-item');

            const label = document.createElement('label');
            label.setAttribute('for', `pergunta_${perguntaSelecionada.id}`);
            label.textContent = perguntaSelecionada.question;
            div.appendChild(label);

            if (perguntaSelecionada.type === "text") {
                const textarea = document.createElement('textarea');
                textarea.id = `pergunta_${perguntaSelecionada.id}`;
                textarea.name = perguntaSelecionada.question;
                textarea.required = true;
                div.appendChild(textarea);
            } else if (perguntaSelecionada.type === "choice") {
                perguntaSelecionada.options.forEach((opcao, index) => {
                    const radioContainer = document.createElement('div');
                    radioContainer.classList.add('radio-group');
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.id = `pergunta_${perguntaSelecionada.id}_opcao_${index}`;
                    radio.name = perguntaSelecionada.question;
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
        }
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
