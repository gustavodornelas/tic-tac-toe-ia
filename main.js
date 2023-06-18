// Constantes para representar o jogo da velha
// Valores retirados apos normalizar a base de dados
const EMPTY = 1;
const PLAYER_X = 0;
const PLAYER_O = 0.5;

// Constantes para treinar a IA
const K = 3; // Melhor valor de K
const dataFileUrl = 'tic-tac-toe.data'; // Base de dados

//Iniciando o jogo
let board = [];
let turnerOrder;
resetBoard();

console.log(board);

// Carregar dados do arquivo .data
function loadDataFile(fileUrl) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', fileUrl);
        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = xhr.responseText.split('\n'); // Separa os valores da linha em um vetor
                const features = [];
                const labels = [];
                for (let i = 0; i < data.length; i++) { // Organiza os valores da linha em Features (Valores) e Labels (Resultado)
                    const row = data[i].trim().split(',');
                    const feature = row.slice(0, -1).map(parseFloat);
                    const label = row.slice(-1)[0];
                    features.push(feature);
                    labels.push(label);
                }
                resolve({ features, labels });
            } else {
                reject(Error(`Failed to load data file: ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => {
            reject(Error('Failed to load data file'));
        };
        xhr.send();
    });
}

// Treinando a IA no modelo KNN
function trainKNN(features, labels) {
    const knn = new KNNClassifier(K);
    knn.train(features, labels);
    return knn;
}

// Prever o vencedor usando o modelo treinado
function predictWinner() {
    loadDataFile(dataFileUrl)
        .then(data => {
            const model = trainKNN(data.features, data.labels); // Treinando a IA com o algoritmo de KNN
            console.log("Model: ", model);

            const feature = board.flat(); // Converte o tabuleiro em um array 1D
            const predictedWinner = model.predict([feature]);

            const details = document.getElementById('game-details');
            const lastsPredicts = document.getElementById('lastsPredicts');

            const textDetails = "Player X ganhou ou empatou o jogo: " + predictedWinner;
            details.innerHTML = textDetails;
            lastsPredicts.innerHTML += textDetails + "<br>";

            console.log('Predicted winner:', predictedWinner[0]);
            console.log(board);
        })
        .catch(error => {
            console.error(error);
        });
}

// Função para atualizar a IU com o estado atual da placa
function updateUI() {

    const cells = document.getElementsByClassName('game-cell');

    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (board[x][y] == EMPTY) {
                cells[x * 3 + y].innerText = " ";
            } else if (board[x][y] == 0) {
                cells[x * 3 + y].innerText = "X";
            } else if (board[x][y] == 0.5) {
                cells[x * 3 + y].innerText = "O";
            }
        }
    }

    // Valida e exibe a quantidade de rodadas do jogo
    if (turnerOrder <= 9) {
        const details = document.getElementById('game-details');
        const textDetails = "Turno " + turnerOrder;
        console.log(textDetails);
        details.innerHTML = textDetails;
    } else {
        predictWinner();
    }
}

// Função para fazer um movimento no tabuleiro do jogo da velha
function makeMove(x, y) {

    if (board[x][y] === EMPTY) {
        if (turnerOrder % 2 != 0) {
            board[x][y] = PLAYER_X;
        } else {
            board[x][y] = PLAYER_O;
        }
        
        turnerOrder++;
        updateUI();
    }
}

function resetBoard() {
    board = [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];

    turnerOrder = 1;
    updateUI();
}

function clearPredicts() {
    lastsPredicts = document.getElementById('lastsPredicts');
    lastsPredicts.innerHTML = "";
}