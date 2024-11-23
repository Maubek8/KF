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

    let currentQuestion = 0;
    const scores = {};
    let radarChart;

    // Adiciona eventos principais
    startButton.addEventListener('click', startEvaluation);
    infoButton.addEventListener('click', toggleExplanation);
    closeButton.addEventListener('click', closeModal);
    downloadButton.addEventListener('click', downloadPDF);
    nextButton.addEventListener('click', nextQuestion);
    prevButton.addEventListener('click', prevQuestion);
    resultButton.addEventListener('click', generateResults);

    // Lógica para capturar o botão Enter
    document.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;
        if (event.key === 'Enter') {
            if (activeElement === document.getElementById('name') && !document.getElementById('login-section').classList.contains('hidden')) {
                startEvaluation();
            } else if (document.getElementById('question-section') && !document.getElementById('question-section').classList.contains('hidden')) {
                handleEnterKey();
            }
        }
    });

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
            <input type="number" id="question-input" min="1" max="10" placeholder="Insira um número de 1 a 10"
                value="${scores[topic.name] || ''}">
        `;
        const questionInput = document.getElementById('question-input');
        questionInput.focus(); // Garantir foco no campo de entrada
        questionInput.addEventListener('change', () => updateScore(topic.name, questionInput.value));

        prevButton.classList.toggle('hidden', currentQuestion === 0);
        nextButton.classList.toggle('hidden', currentQuestion === topics.length - 1);
        resultButton.classList.toggle('hidden', currentQuestion !== topics.length - 1);
    }

    function updateScore(topic, value) {
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 10) {
            alert("Por favor, insira um valor entre 1 e 10.");
            return;
        }
        scores[topic] = parsedValue;
    }

    function handleEnterKey() {
        const questionInput = document.getElementById('question-input');
        if (currentQuestion < topics.length - 1) {
            updateScore(topics[currentQuestion].name, questionInput.value);
            nextQuestion();
        } else if (currentQuestion === topics.length - 1) {
            generateResults();
        }
        questionInput.focus(); // Garante que o cursor continue no input
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
        const chartData = topics.map(t => scores[t.name] || 0);
        const ctx = document.getElementById('resultChart').getContext('2d');
        if (radarChart) radarChart.destroy();
        radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: topics.map(t => t.name),
                datasets: [{ data: chartData, label: 'Resultados', backgroundColor: 'rgba(255,215,0,0.5)', borderColor: '#FFD700' }]
            },
            options: { scales: { r: { beginAtZero: true, max: 10 } } }
        });

        const improvementBars = document.getElementById('improvement-bars');
        improvementBars.innerHTML = '';
        topics.forEach((t, i) => {
            const score = chartData[i];
            const improvement = 100 - score * 10;
            improvementBars.innerHTML += `
                <div class="improvement-item">
                    <p>${t.name}: ${improvement}%</p>
                    <progress value="${improvement}" max="100"></progress>
                </div>`;
        });

        document.getElementById('overlay').classList.remove('hidden');
        document.getElementById('result-modal').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('overlay').classList.add('hidden');
        document.getElementById('result-modal').classList.add('hidden');
    }

    function downloadPDF() {
        const pdf = new jsPDF();
        const canvas = document.getElementById('resultChart');
        const imgData = radarChart.toBase64Image();
        pdf.text("Resultados do Círculo da Performance", 10, 10);
        pdf.addImage(imgData, 'PNG', 10, 20, 180, 100);
        pdf.save('Resultados.pdf');
    }
});
