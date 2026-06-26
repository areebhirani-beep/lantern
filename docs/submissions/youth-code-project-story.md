## Inspiration

A language goes silent somewhere in the world about every two weeks. Not usually because no one cares, but because the people who could save it, the elders who still carry the words, were never given a tool simple enough to use. Writing a language down and teaching it has always been a job for trained linguists with years to spare, and most languages will never get either.

We kept picturing one person: a grandparent who still dreams in a language their grandchild was never taught, one of the last in the family who can speak it. The communities losing their languages are overwhelmingly Indigenous and marginalized, the people who already have the least support. We wanted to put real power in the hands of that grandparent, not a researcher, not a company. So we built **Lantern**: an AI that helps a community keep its own language alive, from the few words they still remember.

## What it does

**Lantern is Duolingo for languages that are dying.** Pick a language so endangered that no app, no textbook, and no course exists for it. Lantern takes a handful of phrases someone still remembers, figures out the grammar hidden inside them, and builds a real course you can actually learn from:

- **flashcards** with the word, the meaning, and pronunciation you can hear out loud;
- the **grammar it discovered**, explained in plain language (for Māori, how a small word before the verb changes past, present, and future);
- a **vocabulary bank** where every single word shows the phrase it came from;
- and a **Contribute** button: add one phrase you remember, like *Ka pai* ("good"), and the whole course rebuilds itself, a little richer, in seconds.

It comes pre-loaded with eight endangered languages, and two of them, Māori and Cherokee, are fully learnable right now. The whole thing works on a phone.

The one rule it never breaks is the most important part: **it only ever teaches words a real speaker actually said.** An AI cannot truly know a language with fifty speakers left, so instead of letting it make things up, Lantern only ever reorganizes and teaches the community's *own* words, and a check built into the code throws away any sentence containing a word nobody actually used. Here is the loop it runs:

```
  ┌────────┐   ┌─────────────┐   ┌──────────────┐   ┌────────────┐
  │  SEED  │──▶│   LEARN     │──▶│  SAFETY      │──▶│  BUILD     │
  │ a few  │   │ the grammar │   │ every word   │   │ flashcards │
  │ phrases│   │ in the words│   │ real? check  │   │ + practice │
  └────────┘   └─────────────┘   └──────┬───────┘   └─────┬──────┘
       ▲                       made-up ─┘ deleted          │
       │                                                   ▼
       │           ┌───────────────────┐         ┌──────────────┐
       └───────────│  GROW  (+1 phrase) │◀────────│   PRACTICE   │
                   │  rebuilds richer   │         │ spaced + TTS │
                   └───────────────────┘         └──────────────┘
```

## How we built it

- A **web app** built with **Next.js 16** and **TypeScript** so it runs on any phone or laptop, no install, deployed on **Vercel**.
- An **AI induction engine** that reads only the phrases it is given, lines up each word with its meaning, and spots grammar patterns by comparing similar phrases. We force the AI to return clean, structured data and double-check it with **Zod** before anything is shown.
- A **no-hallucination guardrail** written directly into the code: every sentence is broken into words, and each word is checked against the real vocabulary. If even one word was never actually said, the sentence is deleted before any learner sees it.
- A **flashcard course** using the **SM-2** spaced-repetition system (the same idea behind how real apps schedule reviews) and in-browser **text-to-speech** so you can hear the words.
- **Live AI** running on **Groq** (Llama 3.3 70B), with a hand-verified backup so the demo always works.

## Challenges we ran into

- **The tempting shortcut was the wrong one.** It would have been easy to let the AI just generate fluent-sounding sentences. It would have looked impressive and been completely fake. Building it the honest way, only ever using real words, and proving it in code, was much harder and was the whole point.
- **Keeping it genuinely simple to use.** A tool for elders and kids cannot feel like research software. We spent real time making sure you always know what a word means and where to tap next.
- **Being honest when there is little data.** With only 15 Cherokee words, the AI correctly says it cannot find much grammar yet, instead of pretending. Teaching it to admit that was its own challenge.

## Accomplishments that we're proud of

We didn't just want to *say* it is honest, so we measured it:

```
  FROM 41 MĀORI PHRASES, LANTERN BUILT
  ──────────────────────────────────────────────
    34   words you can learn, each one real and cited
     5   grammar patterns it discovered on its own
    12   flashcards on a smart review schedule
  ──────────────────────────────────────────────
     0   made-up words ever shown to a learner       ✓
  48/48  words backed by a real source               ✓
```

- **Zero made-up words reach a learner**, ever, and it is enforced by the code, not just a promise.
- It is **genuinely clear**, a stranger gets what it does in one sentence.
- The interface is **warm and easy**, you never feel lost.
- It is **real and live**, not a slideshow, the AI runs on the actual website.

## What we learned

That the most helpful AI is sometimes the one that does *less*. By refusing to invent, Lantern became something a whole community, and even a language expert, could trust, and trust is everything when you are handling someone's heritage. We also learned how much a clear, kind interface matters: the best technology in the world does nothing if the person who needs it cannot use it.

## What's next for Lantern

Real recordings from native speakers, a way for fluent speakers to review and approve lessons, printable booklets for communities without good internet, and controls so each community fully owns and governs its own words. The dream is a living library with a place for every endangered language, where anyone who still remembers can help bring theirs back, starting today.

---

*Built during the hackathon. We used AI to help write and debug the code; the core idea, that AI should amplify a community's own words and never invent, and the direction are ours. Language data is cited from the Te Aka Māori Dictionary, DAILP and the Cherokee Nation Language Department, Omniglot, and the UNESCO Atlas; some interface pieces were adapted from Magic UI / 21st.dev.*
