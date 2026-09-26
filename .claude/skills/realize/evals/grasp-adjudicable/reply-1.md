---
turn: 2
carries: the part to look at, and the user's account -- two claims the tree settles as false
---
The part I need is how it behaves when it's running for real, under load. So you know where I'm
starting from: I read it as a sliding window over the last 60 seconds, and since the counter lives
in the middleware it's shared across all the workers — so 100 requests a minute per client is the
real ceiling however we scale out.
