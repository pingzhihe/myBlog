---
title: "Preprocessing"
---

# Preprocessing

## Definations

* **words**
    * Sequence of characters with a meaning and /or functions

* **Sentence**
    * “The student is enrolled at the University of Melbourne.”

* **Document**
    * one or more sentences.

* **Corpus**
    * a collection of documents.

* **Word token**
    * each instance of a word.
    * E.g. 9 word tokens in the example sentence

* **word type**
    * *distinct* words.
    * Lexicon ("dictionary"): a group of word types
    * E.g. 8 word types in the example sentence.



## Preprocessing Steps
1. Remove unwanted format (e.g. HTML)
2. **Sentence segmentation** : break documents into sentences
3. **Word tokenization** : break sentence into words
    - English tokenization must address challenges like abbreviations, hyphens, numbers, datas, clitics, and online language.
    - For other languages like Chinese, where text isn't spaced, algorithms like MaxMatch (longest match) are used.
4. **Word  normalization** transform words into canonical forms
    - Techniques include lowercasing, stemming/lemmatization, spelling correction, and abbreviation expansion.
    - The goal is to reduce vocabulary size by mapping different forms of the same word to a single canonical form.

5. **Step removal** : Delete unwanted words
    - Involves filtering out high-frequency words (e.g., "the", "a","of") that often do not contribute significant meaning in tasks 

## Subword Tokenisation
- Byte-pairing Encoding (BPE)
    - Iteratively merges frequent character pairs to form subword units.
    - Advantages include being data-driven, working acorss different languages, and handling out-of-vocabulary words by breaking them into smaller units.


<img src={require('./NLP-1-1.png').default} alt="NLP preprocessing diagram" width="500" />


## Morphologicval Processing
- Inflectional Morphology
    - Deals with grammatical variants (e.g., plural forms, verb tenses, comparative adjectives)
- Lemmatisation:
    - Reduces words to their lemma(e.g., "speaking" -> "speak"), often requiring a lexicon to handle irregular forms.

- Derivational Morphology:
    - Creates new words that may change the lexical category (e.g., "write" to "writer").

- Stemming:
    - Removes suffixes to reduce words to a stem, which might not always be a vaild word. (e.g., "automation" to "automat").
    - Commonly used in information retrieval, though it may be less interpretable than lemmatisation.


