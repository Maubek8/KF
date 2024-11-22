document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const infoButton = document.getElementById('info-button');
    const overlay = document.getElementById('overlay');
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

    // Botões e eventos principais
    startButton.addEventListener('click', startEvaluation);
    infoButton.addEventListener('click', toggleExplanation);
    closeButton.addEventListener('click', closeModal);
    downloadButton.addEventListener('click', downloadPDF);
    nextButton.addEventListener('click', nextQuestion);
    prevButton.addEventListener('click', prevQuestion);
    resultButton.addEventListener('click', generateResults);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const questionInput = document.getElementById('question-input');
            if (questionInput && questionInput.value) {
                updateScore(topics[currentQuestion].name, questionInput.value);
                if (currentQuestion < topics.length - 1) {
                    nextQuestion();
                } else {
                    generateResults();
                }
            } else {
                alert("Por favor, insira um valor válido antes de continuar.");
            }
        }
    });

    function toggleExplanation() {
        const explanation = document.getElementById('explanation');
        explanation.classList.toggle('hidden');
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
        questionInput.focus();
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
        const radarCanvas = document.getElementById('resultChart');
        if (!radarCanvas) return;

        const radarContext = radarCanvas.getContext('2d');
        if (radarChart) radarChart.destroy();

        radarChart = new Chart(radarContext, {
            type: 'radar',
            data: {
                labels: topics.map(topic => topic.name),
                datasets: [{
                    label: 'Desempenho Atual',
                    data: chartData,
                    backgroundColor: 'rgba(255, 215, 0, 0.4)',
                    borderColor: 'rgba(255, 215, 0, 1)'
                }]
            },
            options: {
                scales: {
                    r: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } }
                }
            }
        });

        const improvementBars = document.getElementById('improvement-bars');
        improvementBars.innerHTML = '';
        topics.forEach((topic, index) => {
            const score = chartData[index];
            const improvement = 100 - score * 10;
            improvementBars.innerHTML += `
                <div>
                    <p>${topic.name}: ${improvement}%</p>
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
    // Obter os dados do gráfico de radar e das barras de melhoria
    const radarCanvas = document.getElementById('resultChart');
    const improvementBars = document.getElementById('improvement-bars').innerHTML;

    if (!radarCanvas) {
        alert("Gráfico de radar não encontrado.");
        return;
    }

    // Criar nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Falha ao abrir a janela de impressão.");
        return;
    }

    // HTML básico para a janela de impressão
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Resultados do Círculo da Performance</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h2, h3 {
                    text-align: center;
                }
                canvas {
                    display: block;
                    margin: 20px auto;
                }
                .improvement-item {
                    margin: 10px 0;
                }
                progress {
                    width: 100%;
                }
            </style>
        </head>
        <body>
            <h2>Resultados do Círculo da Performance</h2>
            <h3>MK - CARDIOSPORT</h3>
            <canvas id="printChart" width="500" height="500"></canvas>
            <div>
                <h3>Potencial de Melhora</h3>
                ${improvementBars}
            </div>
            <script>
                // Renderizar o gráfico de radar na janela de impressão
                const printCanvas = document.getElementById('printChart');
                const printContext = printCanvas.getContext('2d');
                const chartData = ${JSON.stringify(radarCanvas.getContext('2d').getImageData(0, 0, radarCanvas.width, radarCanvas.height))};

                // Desenhar imagem do gráfico na nova página
                printContext.putImageData(new ImageData(chartData.data, chartData.width, chartData.height), 0, 0);

                // Acionar a impressão
                window.onload = () => window.print();
            </script>
        </body>
        </html>
    `;

    // Adicionar o conteúdo e carregar a nova janela
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}
