---
title: 2. Entanglement, Teleportation and Superdense Coding
sidebar_position: 2
authors: zhihe
tags: [Quantum Computing]
---

# Entanglement of Multi-Qubit Circuits, Teleportation and Superdense Coding

## Bell states
$$
\begin{align}
|\Phi^+ \rangle &= \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle) \quad \\
|\Phi^- \rangle &= \frac{1}{\sqrt{2}} (|00 \rangle - |11\rangle) \newline
|\Psi^+ \rangle &= \frac{1}{\sqrt{2}} (|01 \rangle + | 10\rangle) \quad \\
|\Psi^- \rangle &= \frac{1}{\sqrt{2}} (01 \rangle - |10\rangle)
\end{align}
$$

## Quantum teleportation 
Alice would like to send a qubit’s unknown state $|\psi\rangle = \alpha | 0 \rangle + \beta | 1\rangle$ to Bob

Alice does not know the state $|\psi \rangle$, She cannot describe to Bob. If she **Measure** the qubit, she will collapse it to $|0 \rangle$ or $1 \rangle$.\
Alice only have one qubit in the state $|\psi \rangle$, and from the **no-cloning theorem** , she cannot make extra copies.

**Quantum Solution** \
If Alice and Bob already share entanglement, they can use it to teleport the quantum state.
$$
\begin{align*}
|\psi \rangle |\Phi^+ \rangle &= \alpha |0 \rangle |\Phi^+ \rangle + \beta |1\rangle |\Phi^+ \rangle \\[5pt]
&= \alpha|0\rangle \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle) + \beta|1\rangle \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle) \\[5pt]
&= \frac{1}{\sqrt{2}}[\alpha(|000\rangle + |011\rangle) + \beta(|100\rangle + |111\rangle)]
\end{align*}
$$
The left two qubits belongs to Alice and the right qubit belongs to Bob.\
First, Alice applies a **CNOT** gate to her 2 qubits:
$$
\frac{1}{\sqrt{2}}[\alpha(|000\rangle + |011\rangle) + \beta(|110\rangle + |101\rangle)]
$$
Next, she applied a Hardmard gate to her **left** qubit, yielding
$$
\begin{align*}
& \frac{1}{\sqrt{2}}[\alpha(|+00\rangle + |+11\rangle) + \beta (|-10\rangle+ |-01\rangle)] \\[5pt]
&= \frac{1}{2}[\alpha(|0\rangle + |1\rangle)(|00\rangle + |11\rangle) + \beta (|0\rangle - |1\rangle)(|10\rangle + |01\rangle)] \\[5pt]
&= \frac{1}{2}[|00\rangle (\alpha|0\rangle + \beta | 1\rangle) + |01\rangle (\beta |0\rangle + \alpha |1\rangle) 
 |10\rangle(\alpha |0\rangle-\beta |1\rangle) + |11\rangle (-\beta|0\rangle + \alpha |1\rangle)]
\end{align*}
$$ 
Then Alice measures her two qubits. She gets 00, 01, 10, 11, each with probability 1/4. So after measurement, the possible states are
$$
|00\rangle (\alpha|0\rangle + \beta | 1\rangle), \newline
|01\rangle (\beta |0\rangle + \alpha |1\rangle), \newline
|10\rangle (\alpha |0\rangle-\beta |1\rangle), \newline
|11\rangle (-\beta|0\rangle + \alpha |1\rangle) \newline

$$

- If Alice's measurement was 00, Bob does nothing because his qubit is now in the state $|\psi\rangle$ that Alice wanted to send him
- If measurement was 01, then Bob applies an $X$ gate to his qubit, transforming it to $|\psi\rangle$.
- If measurement was 10, Bob applies a $Z$ gate to his qubit, transforming it into $|\psi\rangle$
- If measurement was 11, then Bob applies an $X$ gate followed by a $Z$ gate, fransforming it into $\psi\rangle$

Alice's qubit was not physically transferred to Bob, only information about what state it was in. In the process, Alice had to measure her qubit, destroying the quantum information, which is necessary because of the **no-cloning theorem**.


<img src={require('./images/Teleportation/Tele-circuit.png').default} alt="tele-circuit" width="70%" /> 

The top is Bob's and the bottom two qubits are Alice's.

## Superdense Coding
Alice wants to send classical information to Bob,say one of four possible restaurant options: American, Chinese, Italian, or Mexican. Alice only needs to send **half** the number of qubits as she would bits.

**Quantum Solution**\
Alice can sent just one qubit, but it needs to be **entangled with** a second qubit that Bob already has. Say Alice and Bob sharte a pair of entangled qubits in the $|\Phi^+ \rangle$ state:

Alice ~~  $\quad \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle) \quad$ ~~Bob

- If Alice wants to send 00, she does nothing to her qubit, and sends it to Bob so that Bob has both qubits.
- If Alice wants to send 01, she applies the $X$ gate to her qubit, which transforms $|\Phi^+\rangle$ to:
$$
|\Psi^+\rangle = \frac{1}{\sqrt{2}}(|01\rangle + |10\rangle)
$$

- If Alice wants to send 10, she applies the $Z$ gate to her qubit, which transforms $|\Phi^+\rangle$ to:
$$
|\Phi^-\rangle = \frac{1}{\sqrt{2}}(|00\rangle-11\rangle)
$$
- Finally, If Alicee wants to send 11, she applies both $X$ and $Z$ to her qubit. Applying $X$ transforms $|\Phi^+\rangle$ to $|\Psi^+\rangle$ and appling Z transforms $|\Psi^+\rangle$ to:
$$
|\Psi^-\rangle = \frac{1}{\sqrt{2}} (|01\rangle -|10\rangle)
$$

Bob can measure the two qubits to distinguish them.
**Bell mresurement:** apply CNOT and then $H \otimes I$, then measureing in the Z-basis.That is :


$$
|\Phi^+\rangle \stackrel{CNOT}{\longrightarrow} \frac{1}{\sqrt{2}}(|00\rangle + |10\rangle) = |+\rangle|0\rangle \stackrel{H\otimes I}{\longrightarrow}= |00\rangle, \\[6pt]

|\Psi^+\rangle \stackrel{CNOT}{\longrightarrow} \frac{1}{\sqrt{2}}(|01\rangle + |11\rangle) = |+\rangle|1\rangle \stackrel{H\otimes I}{\longrightarrow}= |01\rangle, \\[6pt]

|\Phi^-\rangle \stackrel{CNOT}{\longrightarrow} \frac{1}{\sqrt{2}}(|00\rangle - |10\rangle) = |-\rangle|0\rangle \stackrel{H\otimes I}{\longrightarrow}= |10\rangle, \\[6pt]

|\Psi^-\rangle \stackrel{CNOT}{\longrightarrow} \frac{1}{\sqrt{2}}(|01\rangle - |11\rangle) = |-\rangle|1\rangle \stackrel{H\otimes I}{\longrightarrow}= |11\rangle.
$$
