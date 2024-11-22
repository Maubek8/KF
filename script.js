/* Global Styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9; /* Fundo claro */
    color: #333;
}

/* Cabeçalho */
.header {
    text-align: center;
    padding: 20px;
    background-color: #FFD700; /* Fundo amarelo */
    color: #000; /* Texto preto */
    margin-bottom: 20px;
}

.header img {
    width: 80px; /* Logo proporcional */
    margin-bottom: 10px;
}

.header h1 {
    margin: 10px 0;
    font-size: 24px;
    color: #000; /* Texto preto */
}

.header .powered-by {
    font-size: 14px;
    color: #333; /* Texto cinza */
    margin-top: 5px;
}

/* Container principal */
.container {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 600px;
}

/* Seções */
.card {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f8f9fa; /* Fundo leve */
}

/* Grupo de Input */
.input-group {
    margin: 20px 0;
}

.input-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
}

.input-group input {
    width: calc(100% - 20px);
    max-width: 400px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

/* Botões */
.button {
    padding: 10px 20px;
    margin: 10px;
    border: none;
    border-radius: 5px;
    background-color: #FFD700; /* Fundo amarelo */
    color: #333; /* Texto preto */
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.button.secondary {
    background-color: #6c757d; /* Cinza escuro */
    color: #fff;
}

.button:hover {
    background-color: #e6c200; /* Amarelo mais escuro */
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
}

/* Modal */
#result-modal {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 90%;
    max-width: 600px;
    z-index: 1000;
    overflow-y: auto;
    max-height: 80%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

#overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
}

/* Estilos do Gráfico */
canvas {
    margin: 20px auto;
    display: block;
}

/* Estilos para as Barras de Potencial de Melhora */
.improvement-bars {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
}

.improvement-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.improvement-item p {
    margin: 0;
    font-size: 14px;
    flex: 1;
    color: #333; /* Texto cinza */
}

.improvement-item progress {
    flex: 2;
    height: 20px;
    border: none;
    border-radius: 10px;
    overflow: hidden;
    background-color: #f3f3f3;
}

.improvement-item progress::-webkit-progress-bar {
    background-color: #f3f3f3;
    border-radius: 10px;
}

.improvement-item progress::-webkit-progress-value {
    background-color: #FFD700; /* Amarelo */
    border-radius: 10px;
}

.improvement-item progress::-moz-progress-bar {
    background-color: #FFD700; /* Amarelo */
}

/* Responsividade */
@media (max-width: 768px) {
    .container {
        width: 95%;
        padding: 15px;
    }

    .header img {
        width: 60px; /* Reduz tamanho da logo */
    }

    .header h1 {
        font-size: 20px;
    }

    .header .powered-by {
        font-size: 12px;
    }

    .button {
        font-size: 12px;
        padding: 8px 16px;
    }

    #result-modal {
        width: 95%;
        max-height: 80%;
    }

    canvas {
        max-width: 100%;
        height: auto;
    }
}
