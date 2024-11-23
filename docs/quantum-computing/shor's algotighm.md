## QFT
在经典计算中，傅里叶变换用于将信号从**时域**转换到**频域**\
**量子傅里叶变换的数学定义**
$$
|\psi\rangle = \sum_{j=0}^{N-1} a_j |j\rangle \longrightarrow |\phi\rangle = \sum_{k=0}^{N-1} \phi_k |k\rangle = \frac{1}{\sqrt{N}} \sum_{k=0}^{N-1} \sum_{j=0}^{N-1} a_j e^{2\pi i jk / N} |k\rangle
$$
通过上述公式 QFT 把 基态转化为：
$$
\ket{j} \longrightarrow \frac{1}{\sqrt{N}} \sum_{k=0}^{N-1}  e^{2\pi i jk / N} \ket{k}
$$
QFT 性质:
$$
\text{QFT}^\dagger \text{QFT} = I.
$$

### Inverse Quantum Fourier Transform
IQFT does the reverse:
$$
\frac{1}{\sqrt{N}} \sum_{k=0}^{N-1}  e^{2\pi i jk / N} \ket{k} \longrightarrow \ket{j} 
$$


## Quantum Phase Estimation, QPE
量子相位估计算法的主要目标是：给定一个酉算符 *U* 及其本征态 $\ket{\psi}$ 精确地估计对应的本征值的相位 $\theta$

## Shor’s algorithm 的整体思路

Shor算法将整数因数分解问题转化为**周期发现问题**。具体步骤如下:

1. 随机选择一个整数  $a$ ,  满足 $1<a<n$
    - 如果 gcd$(a,N) \not= 1$ , 则a和$N$不互质，直接得到一个因数
    - 否则， 下一步
    
2. 找到函数 $f(x) = a^x$ mod $N$ 最小正周期 $r$
    - 也就是找到最小的正整数 $r$ ,使得 $a^r \equiv 1$ mod $N$
    
3. 利用周期 $r$ 来找到 $N$  的因数
    - 如果 $r$ 是偶数， 且 $a^ {r/2}  \not \equiv -1$ mod  $N$ , 则：
        
        **gcd$(a^{r/2} \pm 1 , N)$   将给出N的非平凡因数**