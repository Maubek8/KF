// Lista de tópicos com explicações associadas
const topics = [
    { 
        name: "Sono", 
        description: "Avalie a qualidade e duração do seu sono. Nota 1: Sono interrompido e curto. Nota 10: Sono reparador de 7-9 horas." 
    },
    { 
        name: "Endurance", 
        description: "Avalie sua capacidade de realizar atividades físicas prolongadas. Nota 1: Baixa resistência. Nota 10: Alta resistência." 
    },
    { 
        name: "Treinamento Força", 
        description: "Avalie sua força muscular durante atividades. Nota 1: Pouca força ou nenhum treino. Nota 10: Treino regular e força elevada." 
    },
    { 
        name: "Forma física/peso", 
        description: "Avalie sua satisfação com seu peso e composição corporal. Nota 1: Muito insatisfeito. Nota 10: Muito satisfeito." 
    },
    { 
        name: "Etilismo/Tabagismo", 
        description: "Avalie seu consumo de álcool e tabaco. Nota 1: Consumo diário elevado. Nota 10: Não consome ou raramente consome." 
    },
    { 
        name: "Espiritualidade", 
        description: "Avalie sua conexão com valores ou práticas espirituais. Nota 1: Desconexão. Nota 10: Alta conexão e equilíbrio." 
    },
    { 
        name: "Ansiedade", 
        description: "Avalie seu nível de ansiedade no dia a dia. Nota 1: Alta ansiedade. Nota 10: Ansiedade sob controle." 
    },
    { 
        name: "Hidratação", 
        description: "Avalie sua ingestão diária de água. Nota 1: Menos de 500ml/dia. Nota 10: 2-3L/dia." 
    },
    { 
        name: "Frutas/Verduras", 
        description: "Avalie seu consumo diário de frutas e verduras. Nota 1: Nenhuma porção. Nota 10: Mais de 5 porções/dia." 
    },
    { 
        name: "Industrializados/Gordura", 
        description: "Avalie seu consumo de alimentos ultraprocessados. Nota 1: Consumo frequente. Nota 10: Consumo mínimo ou nenhum." 
    },
    { 
        name: "Energia/Vitalidade", 
        description: "Avalie sua disposição ao longo do dia. Nota 1: Cansaço constante. Nota 10: Alta energia e vitalidade." 
    },
    { 
        name: "Tempo/Intensidade de treino", 
        description: "Avalie sua rotina de treinos. Nota 1: Irregular ou inexistente. Nota 10: Treinos regulares e consistentes." 
    }
];

let currentQuestion = 0; // Índice da pergunta atual
const scores = {}; // Armazena as notas para cada tópico

// Adiciona eventos após o DOM estar carregado
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startEvaluation);

    const explanationButton = document.getElementById('toggle-explanation');
    if (explanationButton) {
        explanationButton.addEventListener('click', toggleExplanation);
    }
});

// Mostra/Esconde a explicação inicial
function toggleExplanation() {
    const explanation = document.getElementById('explanation');
    explanation.style.display = explanation.style.display === 'none' ? 'block' : 'none';
}

// Inicia a avaliação e mostra a primeira pergunta
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

// Carrega a pergunta atual
function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const topic = topics[currentQuestion];
    
    questionContainer.innerHTML = `
        <h3>${topic.name}</h3>
        <p>${topic.description}</p>
        <input type="number" min="1" max="10" value="${scores[topic.name] || 5}" onchange="updateScore('${topic.name}', this.value)">
    `;

    // Configura a visibilidade dos botões de navegação
    document.getElementById('prev-button').style.display = currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('next-button').style.display = currentQuestion < topics.length - 1 ? 'block' : 'none';
    document.getElementById('result-button').style.display = currentQuestion === topics.length - 1 ? 'block' : 'none';
}

// Avança para a próxima pergunta
function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

// Retorna para a pergunta anterior
function prevQuestion() {
    currentQuestion--;
    loadQuestion();
}

// Atualiza a nota do tópico atual
function updateScore(topic, value) {
    scores[topic] = Number(value);
}
