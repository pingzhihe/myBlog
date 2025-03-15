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
- N-gram : $P(w_i| w_{i−n+1}​,\dots ,w_{i−1}​) =  \frac{C(w_{i−n+1}​,\dots ,w_{i−1})}{C(w_{i−n+1}​,\dots ,w_{i})} $

## 5. Book-ending Sequences
Special tags `<s>` and `</s>` denote the start and end of a sentence, respectively,aiding probability calculations (e.g., $P(yes∣<s>,<s>)$ ).


## 6. Smoothing
Smoothing assigns probability to unseen n-grams to avoid zero probabilities. Common techniques include:
- **Laplacian (Add-one) Smoothing:**
- **Add-k Smoothing**
- **Absolute Discounting**
- **Kneser-Ney Smoothing**

# Text classification
