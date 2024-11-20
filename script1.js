console.log("Script carregado com sucesso");

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
    const data = {
        labels: topics,
        datasets: [{
            label: 'Círculo da Performance',
            data: Object.values(scores),
            fill: true,
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            borderColor: 'rgba(255, 215, 0, 1)',
            pointBackgroundColor: 'rgba(255, 215, 0, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 215, 0, 1)'
        }]
    };
    if (window.radarChart) window.radarChart.destroy();
    window.radarChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2
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
}

function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('result-modal').style.display = 'none';
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const canvas = document.getElementById('resultChart');
    const name = document.getElementById('userName').textContent;
    
    pdf.setFontSize(16);
    pdf.text(`Círculo da Performance - ${name}`, 10, 20);
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 30, 190, 190);
    
    pdf.setFontSize(12);
    pdf.text('Análise do Gráfico:', 10, 230);
    pdf.text('As áreas mais próximas do centro representam pontos a serem otimizados.', 10, 240);
    pdf.text('Quanto mais fora do centro, melhor o desempenho no tópico específico.', 10, 250);
    
    pdf.save('circulo-da-performance.pdf');
}

function shareChart() {
    alert("Compartilhar gráfico em breve!");
}

window.onload = loadQuestions;
