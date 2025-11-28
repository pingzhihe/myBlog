---
title: "Week2"
---

# N-gram Language Models

## 1. Overview

Language models are used to determine the quality of text and measure how fluent a sentence is. They are essential in applications like speech recognition (e.g., distinguishing "recognise speech" from "wreck a nice beach"), query completion, and text generation (e.g., ChatGPT).

## 2. Joint Probabilities
The goal is to compute the probability of a sequence of words, $P(w_1,w_2,\dots,w_m)$. Using the chain rule, this joint probability is converted into conditional probabilities:

$$
P(w_1,w_2,\dots,w_m) = P(w_1)P(w_2|w_1)P(w_3|w_1,w_2)\dots P(w_m|w_1,w_2,\dots,w_{m-1})
$$


## 3. The markov assumption
To make the computation feasible, the Markov assumption approximates the probability of a word based on the previous $n -1$ words:

$$
P(w_i | w_1,\dots,w_{i-1} \approx P(w_i | w_{i-n+1} \dots w_{i-1}))
$$

When $n = 1$ , a unigram model 
$
P(w_1, w_2, \dots w_m) = \prod_{i=1}^m P(w_i)
$
The dog **barks**

When $n = 2$ , a bigram model
$
P(w_1, w_2, \dots w_m) = \prod_{i = 1}^{m} P(w_i| w_{i-1})
$
The *dog* **barks**


When $n = 3 $ , a trigram model
$
P(w_1, w_2, \dots w_m) = \prod_{i = 1}^{m} P(w_i| w_{i-2} w_{i-1})
$
*The dog* **barks**

## 4. Maximum Likelihood Estimation, MLE

Probabilities are estimated using counts from a corpus:
- Unigram： $P(w_i) = \frac{C{(w_i)}}{M}$ (where $M$ is the total number of words)
- Bigram: $P(w_i| w_{i-1}) = \frac{C(w_{i-1}, w_i)}{C(w_i)}$ 
- N-gram : $P(w_i| w_{i−n+1},\dots ,w_{i−1}) =  \frac{C(w_{i−n+1},\dots ,w_{i−1})}{C(w_{i−n+1},\dots ,w_{i})} $

## 5. Book-ending Sequences
Special tags `<s>` and `</s>` denote the start and end of a sentence, respectively,aiding probability calculations (e.g., $P(yes∣<s>,<s>)$ ).


## 6. Smoothing
Smoothing assigns probability to unseen n-grams to avoid zero probabilities. Common techniques include:
- **Laplacian (Add-one) Smoothing:**
- **Add-k Smoothing**
- **Absolute Discounting**
- **Kneser-Ney Smoothing**

### 6.1 **Laplacian**
(Add-one) Smoothing: Adds 1 to all counts, e.g.,

$$
P_{add1} (w_i| w_{i-1}) = \frac{C(w_{i-1},w_i)+1} {C(w_{i-1}) + \vert V \vert} \text{(Where |V| is vocabulary size)}
$$


### 6.2 **Add k Smoothing**:
Adds a fraction $k$,($k$ < 1) e.g., 

$$ 
P_{\text{addk}} (w_i| w_{i-1}) = \frac{C(w_{i-1},w_i) + k}{C(w_{i-1} + k \vert V \vert)} 

$$


### 6.3 Absolute Discounting
Substracts a fixed amount from observed counts and redistributes to unseen n-grams.

### 6.4 Kneser-Ney Smoothing
Using continuation probabilities based on gthe versatility of lower-order n-grams.



# Text classification

## 1.Fundamentals of Classification
Classification involves predicting a class label $c$ from a fixed set of classes $C = \{c_1, c_2, \ldots, c_k\}$ for a given input document $d$,
which is often represented as a vector of features.
It differs from **regression** (which predicts continuous outputs) and **ranking** (which predicts ordinal outputs).

## 2. Text Classification Tasks

Common text calssification tasks include:
- **Topic Classification** : Categorizing text by topic (e.g.,"acquisitions", "earnings").

-  **Sentiment Analysis**: Dtermine sentiment ploarity (e.g., positive, negative, neutral).

- **Native-Lenaguage Identification** :Identifying the author's native language.

- **Natural-Language Inference**: Determining relationships between sentences (e.g., entailment, contradiction, neutral).

- **Automatic Fact-Checking** and **Paraphrase Detecting** : Other specialized tasks
    Note: input may vary in length, from long documents to short sentences or tweets.


## 3. Build a Text Classifier
steps to build a text Classifier
1. Identify a task of interest
2. Collect an appropriate corpus
3. Carry out annotation (label the data)
4. Select features (e.g., n-grams, word overlap)
5. Choose a machine learning algorithm
6. Train the model the tune hyper-parameter using held-out development data.
7. Repeat ealier steps as needed to improve performance
8. Train the final model
9. Evaluate the model on held-out test data

## 4. (Algorithms for Classification)

### 4.1 Navie Bayes
Uses Baye's law to find the class with the highest posterior probability.

$$
P(c_n| f_1, \dots f_m) \propto P(c_n) \prod_{i=1}^{m} P(f_i|c_n)

$$

- Assumes features are independent.
- **Pros**: Fast to train and classify, robust (low variance), good for low-datas situations
- **Cons**: Independence assumption rarely holds, lower accuracy in many cases, requires smoothing for unseen features.

### 4.2 Logistic regression
A linear model using *softmax* to produce probabilities

$$
P(c_n | f_1, \dots , f_m) = \frac{1}{Z} \text{exp} (\sum_{i = 0}^{m} w_i f_i)
$$

- **Pros**: Handles correlated features well, better performance than Naive Bayes in many cases.

- **Cons**: Slow to train, requires frature scaling, needs regualrzation to prevent overfitting, data hungry.


### 4.3 Support Vector Machines, SVM
Finds the hyperplane that separates classes with the maximum margin.
**Pros**: Fast, accurate, works well with large feature sets, suppors non-linearity via kernel trick.

**Cons**: Multiclass classification is complex

### 4.4 KNN

### 4.5 Decision Tree

### 4.6 Random Forest


### 4.7 Nural Networks
Layers of interconnected nodes (input, hidden, output) with activation functions.

**Pros**: Extremely powerful, minimal feature engineering, dominant in NLP.

**Cons**: Complex, slow to train, many hyper-parameters, prone to overfitting.


## 5. Hyper-parameter Tuning
- Use a development set or $k$-fold cross-vaildation to tune hyper-parameters (e.g., tree depth, regualarization strength).

- Regualrization prevents overfitting by penalizing model complexity.

## 6 A final word
Many algorithms are available, but annotation quality, dataset size, and feature selection often matter more than the choice of algorithm for good performance.
