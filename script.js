// Lista de tópicos com descrições e objetivos
const topics = [
    { name: "Sono", description: "Avalie a qualidade e duração do seu sono. Nota 1: Sono interrompido e curto. Nota 10: Sono reparador de 7-9 horas." },
    { name: "Endurance", description: "Avalie sua capacidade de realizar atividades físicas prolongadas. Nota 1: Baixa resistência. Nota 10: Alta resistência." },
    { name: "Treinamento Força", description: "Avalie sua força muscular durante atividades. Nota 1: Pouca força ou nenhum treino. Nota 10: Treino regular e força elevada." },
    { name: "Forma física/peso", description: "Avalie sua satisfação com seu peso e composição corporal. Nota 1: Muito insatisfeito. Nota 10: Muito satisfeito." },
    { name: "Etilismo/Tabagismo", description: "Avalie seu consumo de álcool e tabaco. Nota 1: Consumo diário elevado. Nota 10: Não consome ou raramente consome." },
    { name: "Espiritualidade", description: "Avalie sua conexão com valores ou práticas espirituais. Nota 1: Desconexão. Nota 10: Alta conexão e equilíbrio." },
    { name: "Ansiedade", description: "Avalie seu nível de ansiedade no dia a dia. Nota 1: Alta ansiedade. Nota 10: Ansiedade sob controle." },
    { name: "Hidratação", description: "Avalie sua ingestão diária de água. Nota 1: Menos de 500ml/dia. Nota 10: 2-3L/dia." },
    { name: "Frutas/Verduras", description: "Avalie seu consumo diário de frutas e verduras. Nota 1: Nenhuma porção. Nota 10: Mais de 5 porções/dia." },
    { name: "Industrializados/Gordura", description: "Avalie seu consumo de alimentos ultraprocessados. Nota 1: Consumo frequente. Nota 10: Consumo mínimo ou nenhum." },
    { name: "Energia/Vitalidade", description: "Avalie sua disposição ao longo do dia. Nota 1: Cansaço constante. Nota 10: Alta energia e vitalidade." },
    { name: "Tempo/Intensidade de treino", description: "Avalie sua rotina de treinos. Nota 1: Irregular ou inexistente. Nota 10: Treinos regulares e consistentes." }
];

// Variáveis globais
let currentQuestion = 0; // Índice da pergunta atual
const scores = {}; // Armazena as notas para cada tópico
let resultChart; // Armazena a instância do gráfico

// Eventos configurados após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startEvaluation);
    document.getElementById('overlay').addEventListener('click', closeModal); // Fecha ao clicar no fundo escuro
});

// Função para exibir ou ocultar a explicação
function toggleExplanation() {
    const explanation = document.getElementById('explanation');
    explanation.style.display = explanation.style.display === 'none' ? 'block' : 'none';
}

// Inicia a avaliação e mostra a primeira pergunta
function startEvaluation() {
    const name = document.getElementById('name').value.trim();
    if (!name) {
        alert("Por favor, insira seu nome completo.");
        return;
    }

    // Oculta a tela inicial e exibe a seção de perguntas
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';

    // Carrega a primeira pergunta
    loadQuestion();
}

// Carrega a pergunta atual
function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const topic = topics[currentQuestion];

    // Atualiza o conteúdo do contêiner de perguntas
    questionContainer.innerHTML = `
        <h3>${topic.name}</h3>
        <p>${topic.description}</p>
        <input type="number" min="1" max="10" value="${scores[topic.name] || 5}" 
            onchange="updateScore('${topic.name}', this.value)">
    `;

    // Atualiza a visibilidade dos botões
    document.getElementById('prev-button').style.display = currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('next-button').style.display = currentQuestion < topics.length - 1 ? 'block' : 'none';
    document.getElementById('result-button').style.display = currentQuestion === topics.length - 1 ? 'block' : 'none';
}

// Atualiza a pontuação para o tópico atual
function updateScore(topic, value) {
    const parsedValue = parseInt(value, 10);
    if (parsedValue < 1 || parsedValue > 10) {
        alert("Por favor, insira um valor entre 1 e 10.");
        return;
    }
    scores[topic] = parsedValue;
}

// Avança para a próxima pergunta
function nextQuestion() {
    if (currentQuestion < topics.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
}

// Retorna para a pergunta anterior
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// Gera os resultados e exibe o gráfico de radar
function generateResults() {
    const name = document.getElementById('name').value.trim();
    if (!name) {
        alert("Por favor, insira seu nome.");
        return;
    }

    // Atualiza o nome do usuário no modal
    document.getElementById('userName').textContent = name;

    // Prepara os dados para o gráfico
    const chartData = topics.map(topic => scores[topic.name] || 0);

    // Obtém o contexto do canvas
    const ctx = document.getElementById('resultChart').getContext('2d');

    // Destroi o gráfico existente, se houver, para evitar conflitos
    if (resultChart) {
        resultChart.destroy();
    }

    // Cria o gráfico de radar
    resultChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: topics.map(topic => topic.name),
            datasets: [{
                label: 'Círculo da Performance',
                data: chartData,
                backgroundColor: 'rgba(255, 215, 0, 0.4)',
                borderColor: 'rgba(255, 215, 0, 1)',
                pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                pointBorderColor: '#fff',
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        color: '#fff',
                        backdropColor: 'rgba(0, 0, 0, 0)' // Remove fundo dos ticks
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Exibe o modal com o gráfico
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('result-modal').style.display = 'block';
}

// Fecha o modal
function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('result-modal').style.display = 'none';
}
