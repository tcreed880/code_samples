import random

class Perceptron:

    def __init__(self, alpha = 0.1, max_epochs = 1000):
        self.alpha = alpha
        self.max_epochs = max_epochs

    def train(self, training_set):
        self.weights = self._initial_weights(len(training_set[0]))
        for i in range(self.max_epochs):
            correct_classifications = 0
            for record in training_set:
                y = record[0]
                y_hat = self.predict(record[1:])
                if y == y_hat: correct_classifications += 1
                self._update_weights(y - y_hat, [1] + record[1:])
            if correct_classifications / len(training_set) == 1.0:
                print(f"Epoch {i} Accuracy: {correct_classifications / len(training_set)}")
                break

    def predict(self, features):
        return self._sign_of(self._dot_product(self.weights, [1] + features))

    def test(self, test_set):
        n_correct = 0
        for record in test_set:
            y_true = record[0]
            y_pred = self.predict(record[1:])
            if y_true == y_pred:
                n_correct += 1
        accuracy = n_correct/ len(test_set)
        return accuracy
            
    def _update_weights(self, error, features):
        self.weights[0] += self.alpha * error
        for i in range(1, len(self.weights)):
            self.weights[i] += self.alpha * error * features[i]

    def _dot_product(self, w, x):
        return sum([w * x for w, x in zip(w, x)])

    def _sign_of(self, value):
        return 1 if value >= 0 else -1

    def _initial_weights(self, length):
        return [random.uniform(0, 1) for _ in range(length)]
        