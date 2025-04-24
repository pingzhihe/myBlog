---
title: "Week7"
---
# LLM and Prompting

## 1. Overview of Generative Pretrained Transformers (GPT)
| Metric         | GPT-1     | GPT-2    | GPT-3       | ChatGPT                                 |
| -------------- | --------- | -------- | ----------- | --------------------------------------- |
| Training Data  | BookCrawl | WebText  | CommonCrawl | + GPT-3.5 *Supervised Reinforcement Learning* |
| Parameters     | 117M      | 1.5B     | 175B        | —                                       |
| Layers         | 12        | 48       | 96          | —                                       |
| Dimensions     | 768       | 1,600    | 12,288      | —                                       |

### 1.1 Training Process for *Instruct GPT* -  (RLHF)
**Step 1**: Supervised Fine-tuning (SFT)

- **High quality data collection:**
    - Set up the prompt list
    - Request the expected answers
    - **Made by human**: Experts and Crowsourcing
    - Around 120k - 150k Data Samples

- **Fine-Tuning the Pretrained Model**
    - With Pretrained Model GPT with code Presume: GPT-3.5

**Step 2**: Reward Model (RM)

- **Output Generation**
    - Select the prompt list
    - The SFT model (from the step 1) generate around 4-9 outputs

- **Ranked by Labellers**
    - Rank the outputs from best to worst
    - Data Sample Size: Around *10 times larger* than the one in step 1

- **Reward Model Training**
    - Input: Prompt and the outputs from SFT
    - Output: a scalar r**eward
    - Train based on their ranking (based on best to worst)

**Step3**: Proximal Policy Optimisation (PPO)
- **SFT model + PPO**
    - Fine-tune the SFT model using PPO
- **Evaluate by the Reward Model(RM)**
    - Given the prompt and response
    - Produce a reward determined by the Reward Model (RM)
- **Proximal Policy Optimisation(PPO)**
    - Reinforcement Learning Algorithm
    - The reward is used to update the poloicy using PPO

- **Step 4**: Optimising Language Model for Dialogue
    - **Natural and Conversational** This is due to its ability to take context into account when producing outout. This makes it ideal for dialogue system and allows for more natural conversations to take place between a user and a machine.

## 2. Scaling Laws and LLaMA
**LLaMA** (Large Language Model Meta AI): Smaller Sized Model but with Larger Dataset and Longer Training
## 3. Prompting
### 3.1 Zero-shot and Few-shot in-context learning
- Specify a task by prepending examples of the tasks before your example
- Called 'in-context learning', to stress that no gradient updates are performed when learning a new task

**Limitations**: Some tasks are too difficult for LLMs to learn through prompting alone.

### 3.2 Chain-of-Thought Prompting
Improved demenstrations with intermediate reasoning steps


<img src={require('@site/static/img/NLP/week7/cot.png').default} alt="cot" width="600pt" />


<img src={require('@site/static/img/NLP/week7/cot_bench.png').default} alt="GPT Fine Tuning" width="500pt" />

### 3.3 Conclusion
**In-Contect-Learning**

Pros:
- No Finetuning is needed
- Prompt Engineering (e.g. Cot) cam improve performance easily

Cons:
- Limits to what you can fit in context
- Complex tasks will probably need gradient steps




