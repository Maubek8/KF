document.addEventListener('DOMContentLoaded', () => {
    // Botões e elementos principais
    const startButton = document.getElementById('start-button');
    const infoButton = document.getElementById('info-button');
    const overlay = document.getElementById('overlay');
    const closeButton = document.getElementById('close-modal');
    const downloadButton = document.getElementById('download-pdf');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const resultButton = document.getElementById('result-button');

    // Tópicos para avaliação
    const topics = [
        { name: "Sono", description: "Avalie sua qualidade de sono." },
        { name: "Endurance", description: "Avalie sua resistência física." },
        { name: "Treinamento Força", description: "Avalie sua força muscular." },
        { name: "Forma física/peso", description: "Avalie seu peso e composição corporal." },
        { name: "Etilismo/Tabagismo", description: "Avalie seu consumo de álcool/tabaco." },
        { name: "Espiritualidade", description: "Avalie sua conexão espiritual." },
        { name: "Ansiedade", description: "Avalie seu nível de ansiedade." },
        { name: "Hidratação", description: "Avalie sua ingestão de água." },
        { name: "Frutas/Verduras", description: "Avalie seu consumo de frutas e verduras." },
        { name: "Industrializados/Gordura", description: "Avalie seu consumo de alimentos processados." },
        { name: "Energia/Vitalidade", description: "Avalie sua energia diária." },
        { name: "Tempo/Intensidade de treino", description: "Avalie sua rotina de treinos." }
    ];

    let currentQuestion = 0; // Índice da pergunta atual
    const scores = {}; // Respostas armazenadas
    let resultChart; // Gráfico de radar

    // Adicionar eventos aos botões
    startButton.addEventListener('click', startEvaluation);
    infoButton.addEventListener('click', toggleExplanation);
    closeButton.addEventListener('click', closeModal);
    downloadButton.addEventListener('click', downloadPDF);
    nextButton.addEventListener('click', nextQuestion);
    prevButton.addEventListener('click', prevQuestion);
    resultButton.addEventListener('click', generateResults);

    // Alternar explicação
    function toggleExplanation() {
        const explanation = document.getElementById('explanation');
        explanation.classList.toggle('hidden');
    }

    // Iniciar avaliação
    function startEvaluation() {
        const name = document.getElementById('name').value.trim();
        if (!name) {
            alert("Por favor, insira seu nome completo.");
            return;
        }
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('question-section').classList.remove('hidden');
        loadQuestion();
    }

    // Carregar pergunta atual
    function loadQuestion() {
        const questionContainer = document.getElementById('question-container');
        const topic = topics[currentQuestion];
        questionContainer.innerHTML = `
            <h3>${topic.name}</h3>
            <p>${topic.description}</p>
            <input type="number" min="1" max="10" placeholder="Insira um número de 1 a 10"
                value="${scores[topic.name] || ''}" onchange="updateScore('${topic.name}', this.value)">
        `;

        // Atualizar visibilidade dos botões
        prevButton.classList.toggle('hidden', currentQuestion === 0);
        nextButton.classList.toggle('hidden', currentQuestion === topics.length - 1);
        resultButton.classList.toggle('hidden', currentQuestion !== topics.length - 1);
    }

    // Atualizar pontuação
    window.updateScore = function (topic, value) {
        const parsedValue = parseInt(value, 10);
        if (parsedValue < 1 || parsedValue > 10) {
            alert("Por favor, insira um valor entre 1 e 10.");
            return;
        }
        scores[topic] = parsedValue;
    };

    // Navegar entre perguntas
    function nextQuestion() {
        if (currentQuestion < topics.length - 1) {
            currentQuestion++;
            loadQuestion();
        }
    }

    function prevQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion();
        }
    }
});
// Gerar resultados
function generateResults() {
    const chartData = topics.map(topic => scores[topic.name] || 0);

    // Configurar gráfico de radar
    const radarCanvas = document.getElementById('resultChart');
    if (!radarCanvas) {
        console.error("Canvas do gráfico não encontrado.");
        return;
    }
    const radarContext = radarCanvas.getContext('2d');
    if (resultChart) resultChart.destroy();

    resultChart = new Chart(radarContext, {
        type: 'radar',
        data: {
            labels: topics.map(topic => topic.name),
            datasets: [
                {
                    label: 'Desempenho Atual',
                    data: chartData,
                    backgroundColor: 'rgba(255, 215, 0, 0.4)',
                    borderColor: 'rgba(255, 215, 0, 1)'
                }
            ]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: { stepSize: 2 }
                }
            }
        }
    });

    // Exibir modal de resultados
    document.getElementById('overlay').classList.remove('hidden');
    document.getElementById('result-modal').classList.remove('hidden');
}

// Fechar modal
function closeModal() {
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('result-modal').classList.add('hidden');
}

// Gerar PDF
function downloadPDF() {
    const pdf = new jsPDF();
    const radarCanvas = document.getElementById('resultChart');

    if (!radarCanvas) {
        console.error("Canvas não encontrado para gerar o PDF.");
        return;
    }

    // Adicionar gráfico de radar ao PDF
    const radarImage = radarCanvas.toDataURL('image/png');
    pdf.text("Círculo da Performance - Resultados", 10, 10);
    pdf.addImage(radarImage, 'PNG', 10, 20, 180, 180);

    // Adicionar melhorias
    const improvementBars = document.getElementById('improvement-bars');
    let yPosition = 220;
    if (improvementBars && improvementBars.children.length > 0) {
        const items = improvementBars.querySelectorAll('.improvement-item');
        items.forEach(item => {
            const text = item.querySelector('p').innerText;
            pdf.text(text, 10, yPosition);
            yPosition += 10;
        });
    }

    // Salvar PDF
    pdf.save('resultados.pdf');
}
