const apiKey = 'AIzaSyAC1Be5oZMO9WO21qzuaGuKjl3FnVLzg3Y'; // Substitua pela chave da API gerada

async function translateContent(targetLanguage) {
    const content = document.getElementById('content').innerHTML;

    try {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: content,
                target: targetLanguage,
            }),
        });

        const data = await response.json();
        if (data && data.data && data.data.translations) {
            document.getElementById('content').innerHTML = data.data.translations[0].translatedText;
        } else {
            console.error('Erro na tradução:', data);
        }
    } catch (error) {
        console.error('Erro ao conectar à API de tradução:', error);
    }
}
