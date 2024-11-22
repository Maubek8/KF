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

let currentQuestion = 0;
const scores = {};
let resultChart;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startEvaluation);
    document.getElementById('overlay').addEventListener('click', closeModal);
});

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
    document.getElementById('prev-button').style.display = currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('next-button').style.display = currentQuestion < topics.length - 1 ? 'block' : 'none';
    document.getElementById('result-button').style.display = currentQuestion === topics.length - 1 ? 'block' : 'none';
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
    const name = document.getElementById('name').value.trim();
    if (!name) {
        alert("Por favor, insira seu nome.");
        return;
    }
    document.getElementById('userName').textContent = name;
    const chartData = topics.map(topic => scores[topic.name] || 0);
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
                    ticks: { stepSize: 2, color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.2)' }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('result-modal').style.display = 'block';
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const canvas = document.getElementById('resultChart');
    const imgData = canvas.toDataURL('image/png');
    pdf.text(`Resultado do Círculo da Performance - ${document.getElementById('userName').textContent}`, 10, 10);
    pdf.addImage(imgData, 'PNG', 10, 20, 180, 180);
    pdf.text(`Data: ${new Date().toLocaleDateString()}`, 10, 210);
    pdf.save('circulo_performance.pdf');
}
function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('result-modal').style.display = 'none';
}
