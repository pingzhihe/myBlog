---
title: "Week5"
---

# Transformer and Word Embedding

# Transformer and Attention

## 1.Background and motivation

### 1.1 RNN Limitations
In traditional Recurrent Neural Networks (RNN) or LSTM models, the sequence is processed one token at a time: the $t$-th token connot be processed until $(t-1)$-th token is finished. This captures sequential information but leads to 2 major drawbacks:
1. **Non-parallelizable**: Slow training speed.
2. **Long-range dependency problem**: It becomes difficult for RNNs to propagate information from distant positions in the sequence effectively.

### 1.2 The Emgergence of the Transformer
In 2017, Vaswani et al. introduced the Transformer architecture in the paper [**Attention is All You Need**](https://arxiv.org/abs/1706.03762), revolutionizing Natural Language Processing (NLP) and deep learning. The key innovation in the Transformer is the **Self-Attention Mechanism**, which captures dependencies across all positions in a sequence **In parallel**, without relying on recurrent structures.


## 2. Fundamentals of Attention
### 2.1 Concept of Attention
The core idea of Attention is that when the model focuses on a particular target word (or position), it should "attend" to the most relevant parts of the input sequence, assigning higher weights to those relevant elements.
- A simple analogy: When we read, we tent to focus more on words or sentences most relevant to the question at hand.

### 2.2 The introduction of Query, Key， and Value
Practically, **each token** is projected into three different vector spaces:
- **Query (Q)**: "What am I looking for?
- **Key (K)**: "What features do I have for retrival?"
- **Value (V)** "What content do I actually carry?"

In Self-Attention, every token in the sequence serves as a Query, Key, Value. Each token compares itself to others, resulting in distinct attention weights.

## 3. Self-Attention Formula Derivation
### 3.1 Basic From
The most common form is **Scaled Dot-Product Attention**. The core formula is:
$$
\text{Attention}(Q,K,V) = \text{softmax}(\frac{Q K^T}{\sqrt{d_k}})V
$$

- $Q\in \mathbb{R}^{n \times d_k}$：Matrix containing all Query vectors (where $n$ is the sequence length, and $d_k$ is the dimension of each vector)
- $K \in \mathbb{R}^{n \times d_k}$: Matrix containing all Key vectors 
- $V \in \mathbb{R}^{n \times d_v}$: Matrix cotaining all Value vectors (often $d_v$ = $d_k$)
- $QK^T \in \mathbb{R} ^{n \times n}$： Computes pairwise similarity (dot-product) among tokens.
- $\sqrt{d_k}$: A scaling factor to prevent large dot-product values from destabilizing gradients.


### 3.2 Step-by-step Derivation

#### 1. **Compute similarity scores**:
$$
\text{Scores} = QK^T
$$
This step produces the "matching" degree of each token against all others.

#### 2. **Scaling**:
$$
\text{ScaledScores} = \frac{\text{Scores}}{\sqrt{d_k}}
$$
Prevents overly large inner product values, ensuringt gradient stability.

####


## 4. Mutl-Head Attention
### 4.1 Why Muti-Head?
Words in a sentence can relate to each other across multiple dimensions (syntax, semantics, context). A **Single attention head** may struggle to attend to all these facets simultaneously. Hence, **Multi-Head Attention** is introduced. Multiple heads perform separate projections and attentions in parallel, and their outputs are concatenated and linearly transfromed, capturing richer relationships.

### 4.2 Multi-Head Formula
