class KNNClassifier {


    // Recebe um valor de K e inicia as features e labels vazias
    constructor(k) {
        this.k = k;
        this.features = [];
        this.labels = [];
    }

    // Armazena as features e labels da base de dados
    train(features, labels) {
        this.features = features;
        this.labels = labels;
    }


    // Supoe o resultado com base em distancia euclideana entre o tabuleiro atual e todas as possibilidades da base de dados
    predict(features) {

        const predictions = [];

        for (let i = 0; i < features.length; i++) {
            const distances = [];

            for (let j = 0; j < this.features.length; j++) {
                const distance = this.euclideanDistance(features[i], this.features[j]);
                distances.push({ distance, label: this.labels[j] });
            }

            // Ordena as distancias da menor para a maior
            distances.sort((a, b) => a.distance - b.distance);
            const kNearest = distances.slice(0, this.k);
            const labelCounts = {};

            for (let j = 0; j < kNearest.length; j++) {
                const label = kNearest[j].label;
                
                if (labelCounts[label] === undefined) {
                    labelCounts[label] = 0;
                }

                labelCounts[label]++;
            }

            const predictedLabel = Object.keys(labelCounts).reduce((a, b) => labelCounts[a] > labelCounts[b] ? a : b);
            
            predictions.push(predictedLabel);
        }
        return predictions;
    }

    euclideanDistance(a, b) {
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
            sum += (a[i] - b[i]) ** 2;
        }
        return Math.sqrt(sum);
    }
}