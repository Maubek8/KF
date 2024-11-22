function generateResults() {
    const name = document.getElementById('name').value;
    const resultModal = document.getElementById('result-modal');
    const overlay = document.getElementById('overlay');
    const userNameDisplay = document.getElementById('userName');

    // Atualiza o nome do usuário no modal
    userNameDisplay.textContent = name;

    // Prepara os dados do gráfico
    const ctx = document.getElementById('resultChart').getContext('2d');
    const chartData = {
        labels: topics.map(topic => topic.name),
        datasets: [{
            label: 'Círculo da Performance',
            data: topics.map(topic => scores[topic.name] || 0),
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            borderColor: 'rgba(255, 215, 0, 1)',
            pointBackgroundColor: 'rgba(255, 215, 0, 1)',
            pointBorderColor: '#fff',
        }]
    };

    // Destroi o gráfico existente antes de criar um novo
    if (window.resultChart) {
        window.resultChart.destroy();
    }

    // Renderiza o gráfico de radar
    window.resultChart = new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        color: '#fff',
                        backdropColor: 'rgba(0, 0, 0, 0)'
                    },
                    pointLabels: {
                        color: '#fff',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.2)'
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

    // Mostra o modal
    overlay.style.display = 'block';
    resultModal.style.display = 'block';
}

function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('result-modal').style.display = 'none';
}
