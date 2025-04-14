---
title: "Week6"
---

# Pretrained Models and Large Language Models

## Pretrained Word Vectors
- Pretrained word vectors are useful
- For NLP models, the first layer can be initialised with pretrained word embeddings instead of initialised with random weights.
- Easy performance gain across a range of NLP tasks

## Pretrained Models
- Even with pretrained word embeddings, most of the network weights are still randomlt initialised
- Can we go one step further? Why not use **Whole pertrained network** for downstream tasks.


## GPT-1
- A transformer-based language model
- Pretraining objective: next word prediction

### Training/Model Details
- Subword tokenisation: byte-pair encoding
- 12 layers of transformeer (110M parameters)
- Pretraining corpus: [**BookCorpus**](https://paperswithcode.com/dataset/bookcorpus)
    - 7k unique books of varying genres; long strtches of contiguous text


### Adapt To Downstream Tasks
- Given pretrained GPT, how do we use it for downstream tasks?
- For classification tasks， add an additional classification layer after processing the whole input.
    - Classification layer is randomly initialised
- Continue training **the whole network** using the downstream task dataset
    - AKA 'fine-tuning'

### Fine-tuning: Sentiment Classification
- Initialise a classification layer ($W_y$), and use last word's output ($h_n$)
- $P(y|x) = \text{softmax}(h_y W_y)$
- Train Instance: `<s>` I love pizza! `<e>` = positive
- Loss = log(0.4)

### Fine-tuning: Question Answering
<img src={require('@site/static/img/NLP/week6/gpt-ft.png').default} alt="GPT Fine Tuning" />


## BERT
[BERT: Bidirectional Encoder Representation from Transformers](https://arxiv.org/abs/1810.04805)
- Uses **bidirectional** self-attention instead 
- That is, each target word attends to **both** left and right context words to build its contextual representation

<img src={require('@site/static/img/NLP/week6/bertvsgpt.png').default} alt="GPT VS BERT" />

### Objective: Masked Word Prediction

### Training/Model Details
- Subword tokenisaton: WordPiece
- BERT-base: 12 layers of transformers (110M)
- BERT-large: 24 layers of transformers (340M)
- BERT is pretrained in Wikipedia + BookCorpus
- Training taks multiple GPUs over several days

### Adapt To Downstream tasks
- Given pretrained BERTm how do we use it for downstream tasks?
- Same as GPT add a classification layer
    - But in this case, we use a special first token ([CLS])

### Encoder
- BERT's bidirectional transformer is also called a **transformer encoder**
- Each output word is conditioned on bidirectional context (bidirectional attention)
- Better contextual representation
- Unable to generate text post-training
    - Doesn't work for generation tasks, e.g., machine translation

### Decoder
- GPT's unidirectional tgransformer is also called a **transformer decoder**
- Each output is conditioned on only left context words (unidirectionl attention)
- Works on both classification and generation tasks
- But performance on classification is not as good as encoder models

### Encoder-Decoder
- How can we marry the benefits of encoder (strong classification performance but can't do generation) and decoder
(poor classification performance but can do generation)?
- Combine them!
- Use an encoder to process an input
- Use an decoder to generate the output


## T5
[Text-to-text Transfer Transformer](https://jmlr.org/papers/volume21/20-074/20-074.pdf)
- Pretraining objective: span corruption

### Other Alternative Objectives
- Prefix language model
    - cows love to $\rightarrow$ eat grass
- Masked language model
    - cows `<M> <M>` eat grass $\rightarrow$ cows love to eat grass
- Shuffling:
    - grass cows to love eat $\rightarrow$ cows love to eat grass

- Drop tokens:
    - Cows love grass $\rightarrow$ to eat


#  Large Language Model
