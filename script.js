document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos
    const startButton = document.getElementById('start-button');
    const infoButton = document.getElementById('info-button');
    const closeButton = document.getElementById('close-modal');
    const printButton = document.getElementById('print-page');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const resultButton = document.getElementById('result-button');
    const explanation = document.getElementById('explanation');
    const questionSection = document.getElementById('question-section');
    const loginSection = document.getElementById('login-section');
    const questionContainer = document.getElementById('question-container');
    const overlay = document.getElementById('overlay');
    const resultModal = document.getElementById('result-modal');
    const improvementBars = document.getElementById('improvement-bars');

    // Tópicos para a avaliação
    const topics = [
        { 
            name: "Sono", 
            description: `
                Avalie sua qualidade de sono com base na duração, consistência e sensação de descanso ao acordar.
                <span class="examples">
                    1 para: Noites mal dormidas, insônia ou menos de 4 horas de sono. <br>
                    10 para: Sono regular de 7 a 9 horas, acordando revigorado diariamente.
                </span>
            `
        },
        { 
            name: "Endurance", 
            description: `
                Avalie sua resistência física durante atividades de longa duração.
                <span class="examples">
                    1 para: Dificuldade extrema em manter atividades como caminhadas leves. <br>
                    10 para: Capacidade de correr ou realizar atividades intensas por longos períodos sem fadiga excessiva.
                </span>
            `
        },
        { 
            name: "Treinamento Força", 
            description: `
                Avalie sua força muscular com base na capacidade de realizar exercícios como levantamento de peso ou movimentos intensos.
                <span class="examples">
                    1 para: Não conseguir levantar ou mover objetos moderadamente pesados. <br>
                    10 para: Alta força muscular, levantando ou executando exercícios pesados com facilidade.
                </span>
            `
        },
        { 
            name: "Forma física/peso", 
            description: `
                Avalie sua composição corporal e peso em relação ao seu objetivo.
                <span class="examples">
                    1 para: Forma física significativamente longe do ideal, com desconforto constante. <br>
                    10 para: Peso e composição corporal alinhados com seus objetivos, sem desconforto.
                </span>
            `
        },
        { 
            name: "Etilismo/Tabagismo", 
            description: `
                Avalie seu consumo de álcool e tabaco.
                <span class="examples">
                    1 para: Consumo excessivo e regular, prejudicando a saúde. <br>
                    10 para: Ausência total de consumo ou ingestão muito moderada sem impacto na saúde.
                </span>
            `
        },
        { 
            name: "Espiritualidade", 
            description: `
                Avalie sua conexão espiritual ou mental com algo maior.
                <span class="examples">
                    1 para: Nenhuma prática ou sentimento de equilíbrio e propósito. <br>
                    10 para: Forte conexão espiritual ou prática que traz equilíbrio e paz.
                </span>
            `
        },
        { 
            name: "Ansiedade", 
            description: `
                Avalie o nível de ansiedade no seu dia a dia.
                <span class="examples">
                    1 para: Ansiedade intensa que interfere em todas as áreas da vida. <br>
                    10 para: Níveis muito baixos de ansiedade ou completa tranquilidade.
                </span>
            `
        },
        { 
            name: "Hidratação", 
            description: `
                Avalie sua ingestão diária de água.
                <span class="examples">
                    1 para: Consumo inferior a 500ml por dia. <br>
                    10 para: Ingestão de 2 litros ou mais por dia, ajustada à sua rotina.
                </span>
            `
        },
        { 
            name: "Frutas/Verduras", 
            description: `
                Avalie a inclusão de frutas e verduras em sua dieta diária.
                <span class="examples">
                    1 para: Consumo quase inexistente ou menos de 1 porção diária. <br>
                    10 para: Consumo diário de 5 porções ou mais, incluindo variedade.
                </span>
            `
        },
        { 
            name: "Industrializados/Gordura", 
            description: `
                Avalie o consumo de alimentos ultraprocessados e gorduras ruins.
                <span class="examples">
                    1 para: Alta dependência de fast food e snacks industrializados. <br>
                    10 para: Dieta composta majoritariamente por alimentos naturais e saudáveis.
                </span>
            `
        },
        { 
            name: "Energia/Vitalidade", 
            description: `
                Avalie seu nível de energia ao longo do dia.
                <span class="examples">
                    1 para: Sentir-se constantemente fatigado e sem disposição. <br>
                    10 para: Energia elevada e consistente ao longo do dia, sem episódios de fadiga.
                </span>
            `
        },
        { 
            name: "Tempo/Intensidade de treino", 
            description: `
                Avalie sua rotina de treinos quanto à duração e intensidade.
                <span class="examples">
                    1 para: Treinos inexistentes ou realizados de forma muito esporádica. <br>
                    10 para: Treinos regulares, equilibrados e alinhados com seus objetivos.
                </span>
            `
        }
    ];

     let currentQuestion = 0;
    const scores = {};
    let radarChart;

    // Função: Inicia a avaliação
    startButton.addEventListener('click', () => {
        const nameInput = document.getElementById('name').value.trim();
        if (!nameInput) {
            alert('Por favor, insira seu nome completo.');
            return;
        }
        loginSection.classList.add('hidden');
        questionSection.classList.remove('hidden');
        loadQuestion();
    });

    // Função: Alterna a explicação
    infoButton.addEventListener('click', () => {
        explanation.classList.toggle('hidden');
    });

    // Função: Carrega a pergunta atual
    function loadQuestion() {
        const topic = topics[currentQuestion];
        questionContainer.innerHTML = `
            <h3>${topic.name}</h3>
            <p>${topic.description}</p>
            <input type="number" id="question-input" min="1" max="10" placeholder="Insira um número de 1 a 10"
                value="${scores[topic.name] || ''}">
        `;
        const questionInput = document.getElementById('question-input');
        questionInput.focus();
        questionInput.addEventListener('change', () => {
            scores[topic.name] = parseInt(questionInput.value, 10) || 0;
        });

        // Atualiza visibilidade dos botões
        prevButton.classList.toggle('hidden', currentQuestion === 0);
        nextButton.classList.toggle('hidden', currentQuestion === topics.length - 1);
        resultButton.classList.toggle('hidden', currentQuestion !== topics.length - 1);
    }

    // Função: Próxima pergunta
    nextButton.addEventListener('click', () => {
        if (currentQuestion < topics.length - 1) {
            currentQuestion++;
            loadQuestion();
        }
    });

    // Função: Pergunta anterior
    prevButton.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion();
        }
    });

    // Função: Gera resultados
    resultButton.addEventListener('click', () => {
        generateResults();
        resultModal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    });

    // Função: Fecha modal de resultados
    closeButton.addEventListener('click', () => {
        resultModal.classList.add('hidden');
        overlay.classList.add('hidden');
    });

    // Função: Gera os resultados e gráfico
    function generateResults() {
        const chartData = topics.map(t => scores[t.name] || 0);
        const ctx = document.getElementById('resultChart').getContext('2d');

        if (radarChart) radarChart.destroy();
        radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: topics.map(t => t.name),
                datasets: [{
                    data: chartData,
                    label: 'Resultados',
                    backgroundColor: 'rgba(255,215,0,0.5)',
                    borderColor: '#FFD700',
                }],
            },
            options: {
                scales: {
                    r: { beginAtZero: true, max: 10 },
                },
            },
        });

        // Atualiza barras de potencial de melhora
        improvementBars.innerHTML = `
            <h3>Potencial de Melhora</h3>
        `;
        topics.forEach((t, i) => {
            const score = chartData[i];
            const improvement = 100 - score * 10;
            improvementBars.innerHTML += `
                <div class="improvement-item">
                    <p>${t.name}</p>
                    <progress value="${improvement}" max="100"></progress>
                    <span>${improvement}%</span>
                </div>`;
        });
    }

    // Função: Imprime resultados
    printButton.addEventListener('click', () => {
        window.print();
    });

    // Função: Alterna entre perguntas com Enter
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const questionInput = document.getElementById('question-input');
            if (questionInput && questionSection && !questionSection.classList.contains('hidden')) {
                if (currentQuestion < topics.length - 1) {
                    nextButton.click();
                } else if (currentQuestion === topics.length - 1) {
                    resultButton.click();
                }
            }
        }
    });
});
