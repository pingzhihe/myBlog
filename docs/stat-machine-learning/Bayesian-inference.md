# Bayesian Inference
Could reason over all parameters that are consistent with the data?
- Weight with a better fit to the training data should be more probable than others
- Make predictins with all these weights, scaled by their probability
This is the idea underlying Bayesian inference

**Frequentist VS Bayesian "divide"**
- Frequenitist: learnin using *point estimates*, regularisation, p-values
    - backed by sophistivated theory on simplifying assumptions
    - mostly simpler altorithms, characterises much practical machine learning research
- Bayesian: maintain *uncertainty*, marginalise(sum) out unknown during inference
    - some theory supported (not as complete as frequenitist)
    - often more complex algorithms, but not always
    - often (not always) more compitationally expensive

### Bayesian Regression
Apply Bayesian inference to linear regression, using Normal prior over **w**
Bayes Rule:
$$
p(\mathbf{w}|\mathbf{X}, \mathbf{y}) = \frac{p(\mathbf{y}|\mathbf{X}, \mathbf{w}) p(\mathbf{w})}{p(\mathbf{y}|\mathbf{X})} \\[6pt]
\max_{\mathbf{w}} p(\mathbf{w}|\mathbf{X}, \mathbf{y}) = \max_{\mathbf{w}} p(\mathbf{y}|\mathbf{X}, \mathbf{w}) p(\mathbf{w})
$$

$p(\mathbf{y}|\mathbf{X}, \mathbf{w})$ Is the likelihoond function, $p(\mathbf{w})$ is the prior and $p(\mathbf{y}|\mathbf{X})$ is **marginal mikelihood**

**Consider the full posterior**
$$
p(\mathbf{w}|\mathbf{X}, \mathbf{y}, \sigma^2) = \frac{p(\mathbf{y}|\mathbf{X}, \mathbf{w}, \sigma^2) \, p(\mathbf{w})}{p(\mathbf{y}|\mathbf{X}, \sigma^2)}
$$
A marginal likelihood is a likelihood function that has been integrated over the **parameter space**\
Due to the integration over the parameter space, the marginal likelihood does not directly depend upon the parameters.
[Marginal likelihood defination](https://en.wikipedia.org/wiki/Marginal_likelihood) 

$$
p(\mathbf{y}|\mathbf{X}, \sigma^2) = \int p(\mathbf{y}|\mathbf{X}, \mathbf{w}, \sigma^2) \, p(\mathbf{w}) \, d\mathbf{w}
$$

<span style={{ color: 'red', fontWeight: 'bold' }}>Conjugate prior:</span>
when product of **likelihood x prior** results in the same distribution as the **prior**

Evidence can be computed easily using the normalising constant of the Normal distribution

$$
p(\mathbf{w}|\mathbf{X}, \mathbf{y}, \sigma^2) \propto \text{Normal}(\mathbf{w}|\mathbf{0}, \gamma^2 \mathbf{I}_D) \, \text{Normal}(\mathbf{y}|\mathbf{Xw}, \sigma^2 \mathbf{I}_N) \\
\propto \text{Normal}(\mathbf{w}|\mathbf{w}_N, V_N) \\[6pt]
$$
Where: 
$$ \mathbf{w}_N = \frac{1}{\sigma^2} \mathbf{V}_N \mathbf{X}^\prime \mathbf{y} \\    \mathbf{V}_N = \sigma^2 \left( \mathbf{X}^\prime \mathbf{X} + \frac{\sigma^2}{\gamma^2} \mathbf{I}_D \right)^{-1}$$
$\mathbf{w}_N$ : Mean Vector $\mathbf{V}_N$ : Covariance Matrix 


