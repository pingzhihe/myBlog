---
title: 1. Classical Planning
sidebar_position: 1
authors: zhihe
tags: [AI]
---

## Classical Planning
**State Model $S(P)$**
- Finite and discrete state space $S$
- a known initial state  $\ s_0 \in S$
- a set $S_G \subseteq S$ of goal states
- actions $A(s) \subseteq A$ applicable in each $s \in S$
- a deterministic transition function $s' = f(a,s)$ for $a \in A(s)$
- positve action cost $c(a,s)$

Goals states can be more than one

**Search Algorithm**
- b: maximal branching factor
- d: goal depth
- m: the **maximal** depth reached

**Breadth First Search**
Data structure: *FIFO (Queue)*

*Breadth First Search* explores node level by level, and a queue (FIFO) allows nodes to be processed in the order that they are discovered, which ensures all nodes at a given depth are expanded before moving to the next level.


**Depth first Search**

Data structure: *LIFO (Stack)*

*Depth FiRst Search* explores as deep as possible along each branch before backtracking, and a stack (LIFO) enables this by always processing the most recently discovered node that still has unexplored successors.


**Uniform Cost Search**

Data structure: *Priority Queue*

*Uniform Cost Search* expands nodes based on t6he lowest cumulaitve cost, and a priority queue efficiently retrieves the node with the minimal cost at each step, allowing UCS for finding the optimal path.





|          | DFS   | BFS  | ID    | A*    | HC    | IDA*  |
|----------|-------|-------|-------|-------|-------|-------|
| Complete | No    | Yes   | Yes   | Yes   | No    | Yes   |
| Optimal  | No    | Yes*  | Yes*  | Yes   | No    | Yes   |
| Time     | $b^m$  | $b^d$ | $b^d$ | $b^d$ | $∞$   | $b^d$ |
| Space    | $bm$  | $b^d$ | $bd$  | $b^d$ | $b$   | $bd$|

A search algorithm is considered complete if it **guarantees to find a solution**, if one exists.

BFS and IDS are optimal only all nodes (edges) has equal costs(uniform).

### **Astar Search**

$f(n) = g(n) + h(n)$\
$g(n)$ : The actual cost from the initial state to the current state\
$h(n)$ : The heuristic value from the current state to goal state

$h^*(s)$ Actual optimal value from current state s to goal state 

**Property of heuristic**
1. Admissble: never over-estimate. If $h(s) \leq h^*(s)$ for all $s \in S$ 
2. Safe: for all $h(s) = \infty \rightarrow h^*(s) = \infty$
3. Goal aware： $h(s) = 0$ for all $s\in S_G$
4. Consistent: $h(s) \leq cost(a) + h(s')$ 

consistent + goal aware $\rightarrow$ admissible\
admissible $\rightarrow$ goal aware + safe

**Optimality for A star search**
- A star search without **re-open mechanism** requires both **consistent** and **admissible** to ensure finding an optimal path.
- With re-open mechanism, it only requies admissible

Example for a non-optimal solution by inconsistent but adimissble for A* search without re-open nodes.
```
     (8)
      A
     / \
+1  /   \ +3
   /     \   
  B ----- C ----- D
(7)  +1  (0)  +6  (0)
```
[Reference: Why does A* with admissible non consistent heuristic find non optimal solution?](https://stackoverflow.com/questions/51684682/why-does-a-with-admissible-non-consistent-heuristic-find-non-optimal-solution)

**Greedy best-first search**
- Using priority queue expand node by h(s)
- Completeness: For safe heuristic, Yes
- Optimality: No

## STRIPS And Relaxation
A STRIPS problem P = $\langle F, O, I, G \rangle$ : **Propositions, Initial state, Goal, Actions.**


h+: The Optimal Delete Relaxation Heuristic

Default STRIP model: s' = s + add(s) - del(s)\
after delete relaxation: s' = s + add(s)


**Defination $h^{add}$**
$$
\begin{cases}
0 & g \subseteq s \\
\min_{a \in A, g \in \text{add}_a} c(a) + h^{\text{add}}(s, \text{pre}_a) & |g| = 1 \\
\sum_{g' \in g} h^{\text{add}}(s, \{g'\}) & |g| > 1 \\
\end{cases}
$$
如果目标大于1: $h^{add}$ 等于每个小目标的$h^{add}$ 之和

**Defination $h^{max}$**
$$
\begin{cases}
0 & g \subseteq s \\
\min_{a \in A, g \in \text{add}_a} c(a) + h^{\text{max}}(s, \text{pre}_a) & |g| = 1 \\
\max_{g' \in g} h^{\text{max}}(s, \{g'\}) & |g| > 1 \\
\end{cases}
$$

如果目标大于1: $h^{max}$ 等于每个小目标的$h^{max}$ 的最大值

<span style={{ color: 'red' }}>

$h^{add}$ 和 $h^{max}$：如果一个动作有多个precondition，则视为多个g：$|g| > 1$

</span>


**Bellman-Ford Table**

$h^{max}$

<img src={require('./image.png').default} alt="alt text" width="700" />


$h^{add}$

<img src={require('./image-1.png').default} alt="alt text" width="700" />

- $h^{max}$ is admissible, but is typically far too optimistic

- $h^{add}$ is not admissible, but is typically a lot more informed than $h^{max}$

**Relaxed Plan Extraction $h^{ff}$**

A heuristic function is called a **relaxed plan heuristic**, denoted $h^{FF}$, if, given a state $s$, it returns $\infty$ if no relaxed plan exists, and otherwise returns $\sum_{a \in RPlan} c(a)$ where $RPlan$ is the **action set returned** by relaxed plan extraction on a **closed well-founded best-supporter function** for $s$.
- Plan set means no duplicate actions.

<img src={require('./image-5.png').default} alt="alt text" width="500" />

- $h^{FF}$ never over count sub plans due to $\text{RPlan} := \text{RPlan} \cup \{ b_s(g) \}$
- $h^{FF}$  may be inadmissible, just like $h^{add}$, but for more subtle reasons.
- In practice, $h^{FF}$ typically does not over-estimate $h^*$

**For relaxed plan extraction to make sense, it requires a closed well-founded best-supporter function:**

The $h^{max}$ supporter function:
$$
b^{\text{max}}_s(p) := \argmin_{a \in A, p \in \text{add}_a} c(a) + h^{\text{max}}(s, \text{pre}_a).
$$

The $h^{add}$ supporter function:
$$
b^{\text{add}}_s(p) := \argmin_{a \in A, p \in \text{add}_a} c(a) + h^{\text{add}}(s, \text{pre}_a).
$$

**Proposition** : ($h^{FF}$ is Pessimistic and Agrees with $h^{*}$ on $\infty$). For all STRIPS planning tasks $\Pi$, $h^{FF} \geq h^{+}$ for all states, $h^{+}(s) = \infty$ if and only if $h^{FF}(s) = \infty$. There exists STRIPS planning tasks $\Pi$ and $s$ so that $h^{FF}(s) > h^{*}(s)$.

## Width-based search

**novelty w(s)**



