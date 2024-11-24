---
title: 7. Quantum Algorithms
sidebar_position: 7
authors: zhihe
tags: [Quantum Computing]
---

# Quantum Algorithms

## 1.Deutsch's Algorithm
### problem statemet
- Given a function $f: \{0,1\} \to \{0,1\}$ as a black box
- Determinine if the function is balanced or constant
- Balanced: $f(0) \neq f(1)$
- Constant: $f(0) = f(1)$

### Classial Solution
- Requires evaluating f with both inputs 0 and 1
- Worst-case complexity: 2 function evaluations

### Quantum Solution
- Uses quantum superposition to evaluate both inputs simultaneously
- Achieves result in one function evaluation

### Key concepts
- Quantum parallelism
- Hadmard gate for creating superposition
- Reversible quantum gates

### Algorithm Steps
1. Prepare initial state $\ket{01}$
2. Apply Hadamard gates to both qubits
3. Apply the quantum oracle $U_{f}$
4. Apply Hadamrd gate to the first qubit
5. Measure the first qubit

### Outcome
- $\ket{0}$: Functon is constant
- $\ket{1}$: Function is balanced

## 2.Deutsch-Jozsa Algorithm
### Problem Statement
- Generalization of Deutsch's algorithm
- Functon f: $\{0,1\}^n \to \{0,1\}$
- Determine if f is constant or balanced(half 0s, half 1s)

### Classical Solution
- Worst-case complexity: $2^{n-1} +1$ function evaluations

### Quantum Solution
- Achieves result in one function evaluation

### Key Concepts
- n-qubits superposition using tensor product of Hadamrd gates $H^{\otimes n}$
- Inner product over binary numbers

### Algorithm steps
1. prepare initial state $\ket{0...0}\ket{1}$
2. Apply $H^{\otimes n}$ to the first n qubits and H to the last qubit
3. Apply the quantum oracle $U_{f}$
4. Apply $H^{\otimes n}$ to the **first n qubits**
5. Measure the first n qubits

### Outcome
- All 0s: Function is constant
- Any other results: Function is balanced

## 3. Simon's Algorithm
### Problem Statement
- Given a 2-to-1 functon f such that $f(x) = f(x \otimes a) $ for some unknown a
- Task: Determine a

### Classical Solution
- Brute force: $O(2^n)$
- Birthday problem approach: $O(2^{n/2})$

### Quantum Solution
- Achieves $O(n)$ complexity, exponentially faster

### Key Concepts
- Quantum parallelism
- Interference
- Linear algebra GF(2)

### Algorithm Steps
1. Prepare initial state $\ket{0...0} \ket{0...0}$
2. Apply $H^{\otimes n}$ to the first n qubits
3. Apply the quantum oracle $U_f$
4. Apply $H^{\otimes n}$ to the first qubits
5. Measure the fist n qubits
6. Repeat steps 1-5 to obtain n-1 linearly independent equations
7. Solve the system of equations to find a


### Outcome
- Determines the hidden period a with a high probability in $O(n)$ quantum operations


# Quantum Generative Adversarial Networks (QGAN)
## Classcial Generative Adversrial Networks
### Overview
- An exciting development in Deep Learning research
- Various applications: Image generation, super-resolution, image-to-image translation, 3D object generation, text generatin, synthetic data generation

### Key Compnents 
1. Generator (G)
    - Creates new sample data from a specific domain (e.g., images, text, audio)
    - Aims to produce "fake" data indistinguishable from real data

2. Discriminator (D)
    - Distinguishes fake data created by the Generator from real data

### Training Strategy
- Using game theory
- Analogy: Generator as a counterfeiter, Distriminator as a detective
- Both try to outsmart each other

### Mathematical Framework
- Real-world data distribution: $p_R(x)$
- Generator distribution: $p_G(x)$
- Genweator parameters: $\theta_G$
- Discriminator parameters: $\theta_D$
- Objective: Maximize the probability of D misclassifying G's samples as real

## Quantum Generative Adversarial Networks
### Motvation
- Potential to solve certain hard problems that classical GANs struggle with
- Applications in quantum chemistry calculations and simulations

### Key Concepts
1. Quantum Generator (QG)
    - Implemented as a variational quantum circuit
    - Parameters: $\theta_G$
    - Output: Density matrix $\rho_{\text{G}}^{\lambda}$
2. Quantum Discriminator (QD)
    - Separate quantum circuit
    - Parameter: $\theta_D$
    - Determines if input state is created by R (real) or G (fake)
3. Data Source (R)
    - Outputs a density martix $\rho_{\text{G}}^{\lambda}$ ciontainning n subsystems
4. Noise Source($\ket{z}$)
    - Provides entropy within the distribution of generatied data
    - Acts as a control for the generator

### QGAN Framework
- Conditional GANs: Generate samples from condiional distribution $p(x|\lambda)$
- Labels: $\ket{\lambda}$
- Generator output:  $\rho_{\text{G}}^{\lambda}(\theta_G, z) = \ket{\psi_z} \bra{\psi_z}$ for each $\lambda$ and $\ket{z}$

### Optimization Objective
- Formalized as minmax adversarial game:
$
\underset{\theta_G}{\min} \, \underset{\theta_D}{\max} \, V(\theta_D, \theta_G)
$
- Cost function is linear in the output probabilities of D

### QGAN Circuit
- 6 operationally defined registers
- $Z \equiv \ket{real} \bra{real} - \ket{fake}\bra{fake}$

### Trainning Procedure
1. Initialize $\theta_G$ and $\theta_D$ randomly
2. For each training iteration :
    - Sample minibatch of n noise samples and m label samples
    - Generate m fake dara samples using G
    - Update D by ascending its stochastic gradient
    - Sample minibatch of m noise samples and m label samples
    - Update G by descending its stochastic gradient

## Key Takeways
1. QGANs extend classical GANs to the quantum domain, potentially solving problems classical GANs strugglew with.
2. The quantum framework uses density matrices and quantum circuits for both the generator and discriminator.
3. The training process involves a minmax game between the quantum generator and discriminator
4. QGAN have potential applications in quantum chemistry and quantum simulations.
5. The noisee source $\ket{z}$ play a crucial role in providing entropy and control for the quantum generator.



