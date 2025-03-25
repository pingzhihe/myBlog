---
title: "Week3"
---
# Part of Speech Tagging

## What is a POS tagging?
- a label assigned to a word in a sentence indicate its grammatical role.



## Assumptions that go into a Hidden Markov Model
- **Markov assumption**: The current state (POS tag) depends only on the previous state.
- **Output independence**：The obserced word depends only on the current state(tag), not on other words or states.
- **Stationary** Transition and emission probabilities do not change over time.

## Time complexity of the Viterbi algorithm
$ O(T \times N^2) $ where:
T = length of the sequence (number of words)
N = number of possible tags

Its practical for POS tagging since the number of tags (N) is small (N $\lt$ 50 for most languages) 


## Example
<img src={require('./image.png').default} alt="Hmm example" width="600" />

### Answer
#### Initial state distribution:
$$
 \pi(\text{JJ})=0.3,\quad \pi(\text{NNS})=0.4,\quad \pi(\text{VBP})=0.3 
$$

The transition probability matrix:
$$
A=\begin{pmatrix}
p(\text{JJ}\to\text{JJ}) & p(\text{JJ}\to\text{NNS}) & p(\text{JJ}\to\text{VBP})\\[5mm]
p(\text{NNS}\to\text{JJ}) & p(\text{NNS}\to\text{NNS}) & p(\text{NNS}\to\text{VBP})\\[5mm]
p(\text{VBP}\to\text{JJ}) & p(\text{VBP}\to\text{NNS}) & p(\text{VBP}\to\text{VBP})
\end{pmatrix}
=
\begin{pmatrix}
0.4 & 0.5 & 0.1\\[3mm]
0.1 & 0.4 & 0.5\\[3mm]
0.4 & 0.5 & 0.1
\end{pmatrix}
$$

The emission probability matrix (with the observed vocabulary $\{ \text{silver, wheels, turn}\}$) is：
$$
\begin{aligned}
&p(\text{silver}|\text{JJ})=0.8,\quad p(\text{wheels}|\text{JJ})=0.1,\quad p(\text{turn}|\text{JJ})=0.1,\\[5mm]
&p(\text{silver}|\text{NNS})=0.3,\quad p(\text{wheels}|\text{NNS})=0.4,\quad p(\text{turn}|\text{NNS})=0.3,\\[5mm]
&p(\text{silver}|\text{VBP})=0.1,\quad p(\text{wheels}|\text{VBP})=0.3,\quad p(\text{turn}|\text{VBP})=0.6.
\end{aligned}
$$

#### Viterbi Algorithm for “silver wheels turn”

Let the observation sequence be 
$$
O = (\text{silver}, \text{wheels}, \text{turn}),
$$
and let the hidden state sequence be 
$$
(s_1, s_2, s_3) \in \{\text{JJ}, \text{NNS}, \text{VBP}\}^3.
$$

#### 

$$
\delta_1(\text{JJ})
= \pi(\text{JJ}) \times p(\text{silver}|\text{JJ})
= 0.3 \times 0.8 
= 0.24.
$$