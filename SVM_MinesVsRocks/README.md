## SVM_MinesVsRocks
Applying a support vector machine to solve a classification problem.

This notebook applies an SVM classifier to the UCI Sonar Dataset. The goal is to distinguish between sonar signals bounced off metal cylinders (mines) and those bounced off rocks. The data is imported directly from the UCI Machine Learning Repository using the ucimlrepo library.

The dataset contains 208 records with 60 numeric attributes representing sonar signal energy in different frequency bands. The data is split into training and test sets (75/25 split), and features are standardized using StandardScaler.

A support vector machine with an RBF kernel (sklearn.svm.SVC) is trained, and hyperparameters (C and gamma) are tuned using GridSearchCV with 5-fold cross-validation. Model performance is evaluated on the test set using accuracy, precision, and recall.

Required libraries: 
ucimlrepo 
pandas 
matplotlib 
scikit-learn
