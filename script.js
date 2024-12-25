let perguntasRespostas;

document.getElementById('startQuiz').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = event.target.result;
            perguntasRespostas = parseCSV(data);
            iniciarQuiz();
        };
        reader.readAsText(file);
    } else {
        alert('Por favor, selecione um arquivo CSV.');
    }
});

document.getElementById('nextQuestion').addEventListener('click', iniciarQuiz);

function parseCSV(data) {
    const lines = data.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j].trim();
        }
        result.push(obj);
    }
    return result;
}

function selecionarPergunta(dados) {
    const perguntaCorreta = dados[Math.floor(Math.random() * dados.length)];
    const pergunta = perguntaCorreta.pergunta;
    const respostaCorreta = perguntaCorreta.resposta;

    const respostasErradas = dados.filter(item => item.resposta !== respostaCorreta)
                                   .sort(() => 0.5 - Math.random())
                                   .slice(0, 4);

    const todasRespostas = [...respostasErradas.map(item => item.resposta), respostaCorreta]
                           .sort(() => 0.5 - Math.random());

    return { pergunta, respostaCorreta, todasRespostas };
}

function iniciarQuiz() {
    const { pergunta, respostaCorreta, todasRespostas } = selecionarPergunta(perguntasRespostas);
    document.getElementById('question').innerText = pergunta;
    const answersElement = document.getElementById('answers');
    answersElement.innerHTML = '';
    document.getElementById('result').innerText = '';
    document.getElementById('nextQuestion').style.display = 'none';

    todasRespostas.forEach((resposta, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.innerText = resposta;
        button.addEventListener('click', () => verificarResposta(resposta, respostaCorreta));
        li.appendChild(button);
        answersElement.appendChild(li);
    });
}

function verificarResposta(respostaSelecionada, respostaCorreta) {
    const resultElement = document.getElementById('result');
    if (respostaSelecionada === respostaCorreta) {
        resultElement.innerText = 'Você acertou!';
    } else {
        resultElement.innerText = `Você errou. A resposta correta é: ${respostaCorreta}`;
    }
    document.getElementById('nextQuestion').style.display = 'block';
}
