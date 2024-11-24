---
title: 4. QAOA
sidebar_position: 4
authors: zhihe
tags: [Quantum Computing]
---

# QAOA

## The Max-Cut Problem
- **Goal**: To partition the vertices of a graph into two sets such that the number of edges between the two sets is maximized.
- The Max-Cut problem is a NP-hard problem.
- **Binary representation**: For each vertex $i$, define a binary variable $x_i$, where $x_i = 1$ if $i$ belongs to one set, and $x_i = 0$ if $i$ belongs to the other set. For
each edge $(i,j)$, it contributes to the cut if $x_i \neq x_j$.

### QUBO Formulation
- The MaxCut objective function is exressed as:\
Maximize $\sum_{(i,j) \in E} w_ij (1 - x_i x_j)$
    
### Hamiltonian
Using the substitution, $x_i = \frac{1 - Z_i}{2}$, we can formulate the equtaion:
$$
\begin{align}
\hat{H}MaxCut &= \sum_{(i,j) \in E} \frac{I - Z_i Z_j}{2}  \
&= -\frac{1}{2} \sum_{(i,j) \in E} (Z_i Z_j) + \frac{1}{2} |E| I \
\end{align}
$$
Where $|E|$ is the size of the edge

## The Minimum Vertex Cover Problem
- **Goal**: To find the smallest set of vertices such that each edge in the graph has at least one endpoint in the set.
- **Binary Representation**: For each vertex $j$, $x_j=1$ if $j$ is in the vertex cover, and $x_j=0$ otherwise
### QUBO Formulation
Minimize $\sum_{j \in V}{x_j}$,\
for all $(i,j)$ in Edge $E$ , $x_i + x_j \geq 1$

For the constraint of MVC, we using the penalty function: $P(1-x-y+xy)$

**The penalty function can convert a constrinat problem to an unconstrained problem**\
The unconstrained alternative for MVC is ($P$: Penalty Coefficient, $w_j$: weight to vertex $j$, usually $w_j = 1$):

$$
\begin{align}
\text{Minimize} & \sum_{j \in V}{w_j x_j} + 
& P\left(\sum_{(i,j)\in E} (1 - x_i - x_j + x_i x_j)\right)
\end{align}
$$

### Hamiltonian
Substitute $x_i = \frac{1 - Z_i}{2}$, we can get the Hamiltonian for MVC:
$$
\begin{align}
y &= \sum_{j\in V} \frac{(1-z_j)w_j}{2} + P \sum_{(i,j)\in E} \left[1-\frac{1-z_j}{2}-\frac{1-z_i}{2}+\frac{1-z_j}{2}\frac{1-z_i}{2}\right] \\
&= \frac{|V|w_j}{2} - \sum_{j\in V}w_j\frac{z_j}{2} + P \sum_{(i,j)\in E} \left[1-\frac{1}{2}+\frac{z_j}{2}-\frac{1}{2}+\frac{z_i}{2}+\frac{1-z_i-z_j+z_iz_j}{4}\right] \\
&= \frac{|V|w_j}{2} - \sum_{j\in V}w_j\frac{z_j}{2} + P \sum_{(i,j)\in E} \left[\frac{1+z_iz_j+z_i+z_j}{4}\right]
\end{align}
$$
Then we have:
$$
\hat{H}_\text{MVC} = -\sum_{j\in V} w_j \frac{Z_j}{2} + P \sum_{(i,j)\in E} \left[\frac{Z_iZ_j + Z_i + Z_j}{4}\right] + \frac{|V|w_j}{2}\mathbb{I} + \frac{|E|P}{4}\mathbb{I}
$$
where $|V|$ is the number of vertices, $|E|$ is the number of edges.

## QUBO and Ising Model
The **Ising Model** is a mathematicla formulation used in quantum systems to encode **Optimization Problems**.

- For a single qubit, energy can be encoded using **Z gate**:
    - **Z** gate: Assigns +1 energy for the state $\ket{0}$ and -1 energy for the state $\ket{1}$.
- For multiple qubits, interactions are defined using **Ising couplings** between qubits:
    - $Z_i Z_i$ interactions for two qubits:
        - +1 for states $\ket{00}$ or $\ket{11}$
        - -1 for states $\ket{01}$ or $\ket{10}$
The total energy of the system is determined by these couplings.

The objective in QUBO is to minimize a cost function of the from:

$E(x_1, x_2, ..., x_n) = \sum_{i}^n c_i x_i + \sum_{i,j}^n Q_ij x_i x_j$\
where $x_i$ are binary variables (0 or 1)

* This cost function can be mapped to the Ising Hamiltonian:
    - $x_i = \frac{1 - Z_i}{2}$\
    $z_i$ is the Pauli z operator

