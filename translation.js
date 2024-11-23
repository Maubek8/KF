const apiKey = 'AIzaSyAC1Be5oZMO9WO21qzuaGuKjl3FnVLzg3Y'; // Substitua pela sua chave da Google Translation API

async function changeLanguage() {
    const selectedLanguage = document.getElementById('language').value; // Captura o idioma selecionado
    const elementsToTranslate = document.querySelectorAll('.translatable'); // Todos os elementos com a classe 'translatable'
    const textsToTranslate = Array.from(elementsToTranslate).map(el => el.innerText);

    try {
        // Chamada à API de tradução
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: textsToTranslate, // Textos a serem traduzidos
                target: selectedLanguage, // Idioma de destino
            }),
        });

        const data = await response.json();

        if (data && data.data && data.data.translations) {
            const translations = data.data.translations;

            // Substituir o texto traduzido nos elementos
            elementsToTranslate.forEach((el, index) => {
                if (translations[index]) {
                    el.innerText = translations[index].translatedText;
                }
            });
        } else {
            console.error('Erro na resposta da API:', data);
        }
    } catch (error) {
        console.error('Erro ao traduzir:', error);
    }
}
