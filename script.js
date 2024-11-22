document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const overlay = document.getElementById('overlay');
    const infoButton = document.querySelector('.button.secondary');
    const resultButton = document.getElementById('result-button');

    // Adicionar eventos aos botões
    if (startButton) {
        startButton.addEventListener('click', startEvaluation);
    }

    if (infoButton) {
        infoButton.addEventListener('click', toggleExplanation);
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    if (resultButton) {
        resultButton.addEventListener('click', generateResults);
    }
});

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
    { name: "Tempo/Intensidade de treino", description: "Avalie sua rotina de treinos." },
];

let currentQuestion = 0; // Índice da pergunta atual
const scores = {}; // Armazena as respostas
let resultChart; // Referência ao gráfico de radar

// Mostrar/Esconder explicação
function toggleExplanation() {
    const explanation = document.getElementById('explanation');
    if (!explanation) {
        console.error("Elemento com ID 'explanation' não encontrado.");
        return;
    }

    // Alterna entre 'block' e 'none'
    if (explanation.style.display === 'none' || explanation.style.display === '') {
        explanation.style.display = 'block';
    } else {
        explanation.style.display = 'none';
    }
}

// Iniciar a avaliação
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

// Carregar a pergunta atual
function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const topic = topics[currentQuestion];
    questionContainer.innerHTML = `
        <h3>${topic.name}</h3>
        <p>${topic.description}</p>
        <input type="number" min="1" max="10" placeholder="Insira um número de 1 a 10" 
            value="${scores[topic.name] || ''}" onchange="updateScore('${topic.name}', this.value)">
    `;

    const inputField = questionContainer.querySelector('input');
    inputField.focus();
    inputField.addEventListener('keypress', handleEnterKey);

    document.getElementById('prev-button').style.display = currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('next-button').style.display = currentQuestion < topics.length - 1 ? 'block' : 'none';
    document.getElementById('result-button').style.display = currentQuestion === topics.length - 1 ? 'block' : 'none';
}

// Atualizar pontuação
function updateScore(topic, value) {
    const parsedValue = parseInt(value, 10);
    if (parsedValue < 1 || parsedValue > 10) {
        alert("Por favor, insira um valor entre 1 e 10.");
        return;
    }
    scores[topic] = parsedValue;
}

// Próxima pergunta
function nextQuestion() {
    if (currentQuestion < topics.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
}

// Pergunta anterior
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// Lógica para pressionar Enter para avançar
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        if (currentQuestion < topics.length - 1) {
            nextQuestion();
        } else {
            generateResults();
        }
    }
}
function generateResults() {
    const chartData = topics.map(topic => scores[topic.name] || 0);

    // Gráfico de Radar
    const radarCanvas = document.getElementById('resultChart');
    if (!radarCanvas) {
        console.error("Canvas com ID 'resultChart' não encontrado.");
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
                    borderColor: 'rgba(255, 215, 0, 1)',
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

    // Gráfico de Barras
    const improvementBarsContainer = document.getElementById('improvement-bars');
    if (!improvementBarsContainer) {
        console.error("Elemento com ID 'improvement-bars' não encontrado.");
        return;
    }
    improvementBarsContainer.innerHTML = ''; // Limpa barras anteriores
    topics.forEach((topic, index) => {
        const score = chartData[index];
        const improvement = 100 - score * 10;
        const improvementItem = `
            <div class="improvement-item">
                <p>${topic.name}: ${improvement}%</p>
                <progress value="${improvement}" max="100"></progress>
            </div>
        `;
        improvementBarsContainer.innerHTML += improvementItem;
    });

    // Exibir o modal
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('result-modal').style.display = 'block';
}


// Fechar modal de resultados
function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('result-modal').style.display = 'none';
}

// Gerar PDF dos resultados
function downloadPDF() {
    const pdf = new jsPDF();
    const radarCanvas = document.getElementById('resultChart');

    if (!radarCanvas) {
        console.error("Canvas com ID 'resultChart' não encontrado.");
        return;
    }

    // Adiciona o gráfico de radar
    const radarImage = radarCanvas.toDataURL('image/png');
    pdf.text("Círculo da Performance - Resultados", 10, 10);
    pdf.addImage(radarImage, 'PNG', 10, 20, 180, 180);

    // Adiciona as barras de potencial de melhora
    const improvementBarsContainer = document.getElementById('improvement-bars');
    let yPosition = 220;

    if (improvementBarsContainer) {
        const improvementItems = improvementBarsContainer.querySelectorAll('.improvement-item');
        improvementItems.forEach(item => {
            const text = item.querySelector('p').innerText;
            pdf.text(text, 10, yPosition);
            yPosition += 10;
        });
    } else {
        console.error("Elemento com ID 'improvement-bars' não encontrado.");
    }

    // Salva o PDF
    pdf.save('circulo_performance.pdf');
}
