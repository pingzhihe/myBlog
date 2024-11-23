## GMM
Cluster assignment of point
- $P(Z=j)$ describe by $P(C_j) = w_j \geq 0$ with  $\sum_{j=1}^k w_j = 1$

Each cluster has its own Gaussian distribution
- $P(X|Z=j) = \mathcal{N}(\mu_j, \Sigma_j)$ class conditional density

Gaussian mixture distribution:
$$
P(x) \equiv \sum_{j=1}^k w_j \mathcal{N}(x|\mu_j, \Sigma_j) 


$$
Modelling the data points as independent, aim is to find $P(C_j), \mu_j, \Sigma_j, j = 1,\ldots, k$ that maximise 

$P(x_1, \dots, x_n) = \prod_{i=1}^n \sum_{j=1}^k P(C_j) P(x_i | C_j)$

where $P(x | C_j) \equiv \mathcal{N}(x | \mu_j, \Sigma_j)$

Try the usual log trick
$$
\log P(x_1, \dots, x_n) = \sum_{i=1}^n \log \left( \sum_{j=1}^k P(C_j) P(x_i | C_j) \right)
$$
## EM
MLE is a frequentist principle that suggests that given a daraset, the "best" parameters to use are the ones that maximise the probability of the data
- MLE is a way to formally pose the problem

EM is an algorihm
- EM is a way to solve the problem posed by MLE
- Especially convenient under unvserved data
MLE can be found by other methods such as gradient descent

EM is a general approach, goes beyond GMMs
- Purpose: Implement MLE underlatent variables **Z**

Variableasz in GMMs:
- Variables: Point locations **X** abd cluster assignments Z
- Parameters : $\theta$ are cluster locations and scales

What is EM really doing?
- Coordinate ascent on a lower bound on the log-likelihood
    - M-step: ascent in modelede parameters $\theta$
    - E-step: ascent in the marginal likelihood $P(z)$

- Each step moves towards a local optimum
- Can get stuck, can need random restarts

**EM For fitting the GMM**

Initialisation Step:
- Initialze K clusters $C1, \ldots, C_k (\mu_j, \Sigma_j)$ and $P(C_j)$ for each cluster j.

Iterationm Step:
- Estimate the cluster of each datum $p(C_j | x_j) \rightarrow$ Expection
- Re-estimate the cluster parameters $(\mu_j, \Sigma_j), p(C_j)$ for each cluster j


