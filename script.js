document.addEventListener("DOMContentLoaded", loadQuestions);

const topics = [
    "Sono", "Endurance", "Treinamento Força", "Forma física/peso",
    "Etilismo/Tabagismo", "Espiritualidade", "Ansiedade", "Hidratação",
    "Frutas/Verduras", "Industrializados/Gordura", "Energia/Vitalidade", "Tempo/Intensidade de treino"
];

const scores = {};

function loadQuestions() {
    const questionDiv = document.getElementById('questions');
    topics.forEach(topic => {
        const question = document.createElement('div');
        question.className = 'question';
        question.innerHTML = `
            <label>${topic}:</label>
            <input type="number" min="1" max="10" value="5" onchange="updateScore('${topic}', this.value)">
        `;
        questionDiv.appendChild(question);
        scores[topic] = 5;
    });
}

function openForm() {
    const name = document.getElementById('name').value;
    if (!name.trim()) {
        alert("Por favor, insira seu nome completo.");
        return;
    }
    document.getElementById('form-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
}

function updateScore(topic, value) {
    scores[topic] = Number(value);
}

function generateResults() {
    const name = document.getElementById('name').value;
    document.getElementById('userName').textContent = name;
    createRadarChart();
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('result-modal').style.display = 'block';
}

function createRadarChart() {
    const ctx = document.getElementById('resultChart').getContext('2d');
    // Aqui vem o código para criar o gráfico de radar com Chart.js
}

function downloadPDF() {
    // Função de download de PDF com jsPDF
}

function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('result-modal').style.display = 'none';
}
