document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const infoButton = document.getElementById('info-button');
    const closeButton = document.getElementById('close-modal');
    const downloadButton = document.getElementById('download-pdf');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const resultButton = document.getElementById('result-button');

    const topics = [
    { 
        name: "Sono", 
        description: "Avalie sua qualidade de sono com base na duração, consistência e sensação de descanso ao acordar. \n1 para: Noites mal dormidas, insônia ou menos de 4 horas de sono. \n10 para: Sono regular de 7 a 9 horas, acordando revigorado diariamente."
    },
    { 
        name: "Endurance", 
        description: "Avalie sua resistência física durante atividades de longa duração. \n1 para: Dificuldade extrema em manter atividades como caminhadas leves. \n10 para: Capacidade de correr ou realizar atividades intensas por longos períodos sem fadiga excessiva." 
    },
    { 
        name: "Treinamento Força", 
        description: "Avalie sua força muscular com base na capacidade de realizar exercícios como levantamento de peso ou movimentos intensos. \n1 para: Não conseguir levantar ou mover objetos moderadamente pesados. \n10 para: Alta força muscular, levantando ou executando exercícios pesados com facilidade."
    },
    { 
        name: "Forma física/peso", 
        description: "Avalie sua composição corporal e peso em relação ao seu objetivo. \n1 para: Forma física significativamente longe do ideal, com desconforto constante. \n10 para: Peso e composição corporal alinhados com seus objetivos, sem desconforto." 
    },
    { 
        name: "Etilismo/Tabagismo", 
        description: "Avalie seu consumo de álcool e tabaco. \n1 para: Consumo excessivo e regular, prejudicando a saúde. \n10 para: Ausência total de consumo ou ingestão muito moderada sem impacto na saúde."
    },
    { 
        name: "Espiritualidade", 
        description: "Avalie sua conexão espiritual ou mental com algo maior. \n1 para: Nenhuma prática ou sentimento de equilíbrio e propósito. \n10 para: Forte conexão espiritual ou prática que traz equilíbrio e paz." 
    },
    { 
        name: "Ansiedade", 
        description: "Avalie o nível de ansiedade no seu dia a dia. \n1 para: Ansiedade intensa que interfere em todas as áreas da vida. \n10 para: Níveis muito baixos de ansiedade ou completa tranquilidade." 
    },
    { 
        name: "Hidratação", 
        description: "Avalie sua ingestão diária de água. \n1 para: Consumo inferior a 500ml por dia. \n10 para: Ingestão de 2 litros ou mais por dia, ajustada à sua rotina." 
    },
    { 
        name: "Frutas/Verduras", 
        description: "Avalie a inclusão de frutas e verduras em sua dieta diária. \n1 para: Consumo quase inexistente ou menos de 1 porção diária. \n10 para: Consumo diário de 5 porções ou mais, incluindo variedade." 
    },
    { 
        name: "Industrializados/Gordura", 
        description: "Avalie o consumo de alimentos ultraprocessados e gorduras ruins. \n1 para: Alta dependência de fast food e snacks industrializados. \n10 para: Dieta composta majoritariamente por alimentos naturais e saudáveis." 
    },
    { 
        name: "Energia/Vitalidade", 
        description: "Avalie seu nível de energia ao longo do dia. \n1 para: Sentir-se constantemente fatigado e sem disposição. \n10 para: Energia elevada e consistente ao longo do dia, sem episódios de fadiga." 
    },
    { 
        name: "Tempo/Intensidade de treino", 
        description: "Avalie sua rotina de treinos quanto à duração e intensidade. \n1 para: Treinos inexistentes ou realizados de forma muito esporádica. \n10 para: Treinos regulares, equilibrados e alinhados com seus objetivos." 
    }
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
