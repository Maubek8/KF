document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const infoButton = document.getElementById('info-button');
    const closeButton = document.getElementById('close-modal');
    const downloadButton = document.getElementById('download-pdf');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const resultButton = document.getElementById('result-button');

    const topics = [
        { name: "Sono", description: "Avalie sua qualidade de sono." },
        { name: "Endurance", description: "Avalie sua resistência física." },
        { name: "Treinamento Força", description: "Avalie sua força muscular." },
        // Outros tópicos...
    ];

    let currentQuestion = 0;
    const scores = {};
    let radarChart;

    startButton.addEventListener('click', startEvaluation);
    infoButton.addEventListener('click', toggleExplanation);
    closeButton.addEventListener('click', closeModal);
    downloadButton.addEventListener('click', downloadPDF);
    nextButton.addEventListener('click', nextQuestion);
    prevButton.addEventListener('click', prevQuestion);
    resultButton.addEventListener('click', generateResults);

    function toggleExplanation() {
        document.getElementById('explanation').classList.toggle('hidden');
    }

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

    function loadQuestion() {
        const questionContainer = document.getElementById('question-container');
        const topic = topics[currentQuestion];
        questionContainer.innerHTML = `
            <h3>${topic.name}</h3>
            <p>${topic.description}</p>
            <input type="number" min="1" max="10" placeholder="Nota de 1 a 10" 
                value="${scores[topic.name] || ''}" onchange="updateScore('${topic.name}', this.value)">
        `;
        prevButton.classList.toggle('hidden', currentQuestion === 0);
        nextButton.classList.toggle('hidden', currentQuestion === topics.length - 1);
        resultButton.classList.toggle('hidden', currentQuestion !== topics.length - 1);
    }

    window.updateScore = function (topic, value) {
        const score = parseInt(value, 10);
        if (isNaN(score) || score < 1 || score > 10) {
            alert("Insira uma nota válida entre 1 e 10.");
            return;
        }
        scores[topic] = score;
    };

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
        const data = topics.map(t => scores[t.name] || 0);
        const ctx = document.getElementById('resultChart').getContext('2d');
        if (radarChart) radarChart.destroy();
        radarChart = new Chart(ctx, {
            type: 'radar',
            data: { labels: topics.map(t => t.name), datasets: [{ data, label: 'Resultados' }] },
        });
        document.getElementById('overlay').classList.remove('hidden');
        document.getElementById('result-modal').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('overlay').classList.add('hidden');
        document.getElementById('result-modal').classList.add('hidden');
    }

    function downloadPDF() {
        alert("Por enquanto, o botão Imprimir só exibe esta mensagem.");
    }
});
