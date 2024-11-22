document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const overlay = document.getElementById('overlay');
    const resultButton = document.getElementById('result-button');
    const questionInput = document.querySelector('#question-container input');

    if (startButton) {
        startButton.addEventListener('click', startEvaluation);
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    if (resultButton) {
        resultButton.addEventListener('click', generateResults);
    }
});

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

let currentQuestion = 0;
const scores = {};
let resultChart;

function toggleExplanation() {
    const explanation = document.getElementById('explanation');
    explanation.style.display = explanation.style.display === 'none' ? 'block' : 'none';
}

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

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        if (currentQuestion < topics.length - 1) {
            nextQuestion();
        } else {
            generateResults();
        }
    }
}

function updateScore(topic, value) {
    const parsedValue = parseInt(value, 10);
    if (parsedValue < 1 || parsedValue > 10) {
        alert("Por favor, insira um valor entre 1 e 10.");
        return;
    }
    scores[topic] = parsedValue;
}

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

function generateResults() {
    const chartData = topics.map(topic => scores[topic.name] || 0);
    const improvementList = document.getElementById('improvement-list');
    improvementList.innerHTML = topics.map((topic, index) => `
        <li>${topic.name}: ${100 - chartData[index] * 10}% de potencial de melhora</li>
    `).join('');

    const ctx = document.getElementById('resultChart').getContext('2d');
    if (resultChart) resultChart.destroy();
    resultChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: topics.map(topic => topic.name),
            datasets: [{
                label: 'Círculo da Performance',
                data: chartData,
                backgroundColor: 'rgba(255, 215, 0, 0.4)',
                borderColor: 'rgba(255, 215, 0, 1)',
            }]
        },
        options: {
            scales: { r: { beginAtZero: true, max: 10 } },
            plugins: { legend: { display: false } }
        }
    });

    document.getElementById('overlay').style.display = 'block';
    document.getElementById('result-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('result-modal').style.display = 'none';
}

function downloadPDF() {
    const pdf = new jsPDF();
    const canvas = document.getElementById('resultChart');
    const imgData = canvas.toDataURL('image/png');
    pdf.text("Círculo da Performance - Resultados", 10, 10);
    pdf.addImage(imgData, 'PNG', 10, 20, 180, 180);
    pdf.save('circulo_performance.pdf');
}
