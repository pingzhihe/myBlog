 Can the joint probability distribution described by any undirected probabilistic graphical model be expressed as a directed probabilistic graphical model? Explain why or why not?
- DPGM: capture asymmetric conditional independence based on the direction of edges. They are suitable for scenarios where causal or directional relationships are well-defined.
- UPGM: capture symmetric conditional independence relationships. They are particularly suitable for situations where the direction of influence between variables is unclear or bidirectional.

Why are vanishing gradients a more pressing concern for recurrent neural networks (RNNs) than for other neural architectures?
- RNNs handle data in sequences, passing information from one time step to the next. Gradients must flow back through many time steps during training, causing them to diminish exponentially. (BPTT)
- RNNs use the same weights at each time step.
This repetition leads to the multiplication of small gradient values repeatedly, making them vanish. 
- RNNs aim to learn relationships between distant elements in a sequence.
Vanishing gradients make it difficult for the network to capture these long-range dependencies effectively.

Solve
- **LTSM**
Long Short-Term Memory (LSTM) networks are a special type of Recurrent Neural Network (RNN) designed to effectively handle the vanishing gradient problem
LSTMs use three types of gates to regulate the flow of information:

Forget Gate:

Decides what information to discard from the cell state.
Uses a sigmoid activation to output values between 0 and 1, effectively "forgetting" irrelevant information.

Input Gate:

Determines what new information to add to the cell state.
Combines sigmoid and tanh activations to update the cell state with relevant data.

Output Gate:

Controls what information from the cell state is sent to the next hidden state.
Ensures that only important information affects the network's output.

LSTMs have separate memory cells that store information over time, independent of the hidden states.

Why must theevidence becomputed when evaluating a Bayesian posterior , but when maximising the same posterior to find the max a posteriori (MAP) estimate, the evidence can be ignored/cancelled?

$$

P(\theta \mid D) = \frac{P(D \mid \theta) P(\theta)}{P(D)}

$$
- $P(\theta \mid D)$:Probability of pa rameters 𝜃 given data 𝐷
- Likelihood: $P(D \mid \theta)$ Probability of data 𝐷 given parameters 𝜃

When you need the complete posterior distribution to calculate expectations, variances, or other statistical measures, the evidence is essential for accurate normalization.
$$
\theta_{\text{MAP}} = \arg\max_{\theta} \left( P(D \mid \theta) P(\theta) \right)
$$
Do not need compute evidence 

