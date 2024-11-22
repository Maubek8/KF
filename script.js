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

let currentQuestion = 0; // Índice da pergunta atual
const scores = {}; // Armazena as notas para cada tópico
let resultChart; // Armazena a instância do gráfico

// Adiciona eventos após o DOM estar carregado
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startEvaluation);
    document.getElementById('result-button').addEventListener('click', generateResults);

    // Evento para fechar o modal
    document.getElementById('overlay').addEventListener('click', closeModal);
});

// Inicia a avaliação e mostra a primeira pergunta
function startEvaluation() {
    const name = document.getElementById('name').value.trim();
    if (!name) {
        alert("Por favor, insira seu nome completo.");
        return;
    }
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    loadQuestion();
}

// Carrega a pergunta atual
function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const topic = topics[currentQuestion];

    questionContainer.innerHTML = `
        <h3>${topic.name}</h3>
        <p>${topic.description}</p>
        <input type="number" min="1" max="10" value="${scores[topic.name] || 5}" onchange="updateScore('${topic.name}', this.value)">
    `;

    document.getElementById('prev-button').style.display = currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('next-button').style.display = currentQuestion < topics.length - 1 ? 'block' : 'none';
    document.getElementById('result-button').style.display = currentQuestion === topics.length - 1 ? 'block' : 'none';
}

// Avança para a próxima pergunta
function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

// Retorna para a pergunta anterior
function prevQuestion() {
    currentQuestion--;
    loadQuestion();
}

// Atualiza a nota do tópico atual
function updateScore(topic, value) {
    scores[topic] = Number(value);
}

// Gera os resultados e exibe no modal
function generateResults() {
    const name = document.getElementById('name').value;
    const resultModal = document.getElementById('result-modal');
    const overlay = document.getElementById('overlay');
    const userNameDisplay = document.getElementById('userName');

    // Atualiza o nome do usuário no modal
    userNameDisplay.textContent = name;

    // Prepara os dados do gráfico
    const ctx = document.getElementById('resultChart').getContext('2d');
    const chartData = {
        labels: topics.map(topic => topic.name),
        datasets: [{
            label: 'Círculo da Performance',
            data: topics.map(topic => scores[topic.name] || 0),
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            borderColor: 'rgba(255, 215, 0, 1)',
            pointBackgroundColor: 'rgba(255, 215, 0, 1)',
            pointBorderColor: '#fff',
        }]
    };

    // Verifica se o gráfico já existe e o destrói antes de criar um novo
    if (resultChart) {
        resultChart.destroy();
    }

    // Renderiza o gráfico de radar
    resultChart = new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        color: '#fff', // Cor dos valores na escala radial
                        backdropColor: 'rgba(0, 0, 0, 0)' // Remove fundo dos ticks
                    },
                    pointLabels: {
                        color: '#fff',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)' // Cor das linhas da grade
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.2)' // Cor das linhas radiais
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Mostra o modal
    overlay.style.display = 'block';
    resultModal.style.display = 'block';
}

// Fecha o modal
function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('result-modal').style.display = 'none';
}
