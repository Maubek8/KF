console.log("Script carregado com sucesso");

const topics = [
       "Sono": "Avalie a qualidade e duração do seu sono. Nota 1: Sono interrompido e curto. Nota 10: Sono reparador de 7-9 horas.",
    "Endurance": "Avalie sua capacidade de realizar atividades físicas prolongadas. Nota 1: Baixa resistência. Nota 10: Alta resistência.",
    "Treinamento Força": "Avalie sua força muscular durante atividades. Nota 1: Pouca força ou nenhum treino. Nota 10: Treino regular e força elevada.",
    "Forma física/peso": "Avalie sua satisfação com seu peso e composição corporal. Nota 1: Muito insatisfeito. Nota 10: Muito satisfeito.",
    "Etilismo/Tabagismo": "Avalie seu consumo de álcool e tabaco. Nota 1: Consumo diário elevado. Nota 10: Não consome ou raramente consome.",
    "Espiritualidade": "Avalie sua conexão com valores ou práticas espirituais. Nota 1: Desconexão. Nota 10: Alta conexão e equilíbrio.",
    "Ansiedade": "Avalie seu nível de ansiedade no dia a dia. Nota 1: Alta ansiedade. Nota 10: Ansiedade sob controle.",
    "Hidratação": "Avalie sua ingestão diária de água. Nota 1: Menos de 500ml/dia. Nota 10: 2-3L/dia.",
    "Frutas/Verduras": "Avalie seu consumo diário de frutas e verduras. Nota 1: Nenhuma porção. Nota 10: Mais de 5 porções/dia.",
    "Industrializados/Gordura": "Avalie seu consumo de alimentos ultraprocessados. Nota 1: Consumo frequente. Nota 10: Consumo mínimo ou nenhum.",
    "Energia/Vitalidade": "Avalie sua disposição ao longo do dia. Nota 1: Cansaço constante. Nota 10: Alta energia e vitalidade.",
    "Tempo/Intensidade de treino": "Avalie sua rotina de treinos. Nota 1: Irregular ou inexistente. Nota 10: Treinos regulares e consistentes."
};

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
    alert("Função de download ainda não implementada.");
}

function shareChart() {
    alert("Compartilhar gráfico em breve!");
}

window.onload = loadQuestions;
