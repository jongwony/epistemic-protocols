---
name: grasp-adjudicable-answer
turn: 2
---
Right — so it's a sliding window over the last 60 seconds, and since the counter lives in the middleware it's shared across all the workers. So 100 requests a minute per client is the real ceiling no matter how we scale out.
