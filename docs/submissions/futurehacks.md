# Lantern, FutureHacks submission

**Theme:** Future cities, civic tools and technology that improve how people *live, work, and connect in urban spaces.*
**Tagline:** Cities are where languages go to die. Lantern is civic infrastructure for the future city that refuses to let them, turning the words an elder still remembers into a living course to learn their language, with AI that never invents a word.

## Why this is a future-city project

The future is urban. By 2050 roughly two-thirds of humanity will live in cities, and that single fact is the largest driver of language extinction on Earth. A language rarely dies in the village it was born in; it dies one generation after that village's children move to the city for work and grow up in the dominant language instead. Linguists call it language shift, and urbanization is its engine. About **one language falls silent every two weeks**, and nearly half of the world's 7,000 languages are expected to be gone this century, most of them carried by the Indigenous, immigrant, and diaspora communities now packed into our biggest cities.

So when we ask what a city should look like tomorrow, we treat this as a piece of missing **civic infrastructure**. A smart city counts its traffic and its power. A *humane* future city also keeps the cultures of the people who move into it from being flattened into a monoculture. There is sewage and there is broadband, and there should also be a public tool that lets the Somali grandmother in Minneapolis, the Māori family in Auckland, or the Cherokee household off-reservation in a city keep their language and hand it to the next generation, **from the few words they still remember.** That tool is Lantern.

It improves how people *connect* in urban spaces in the most literal way: it reconnects an urban child to a grandparent's language, and a displaced community to its own words.

## How it maps to the judging criteria

- **Innovation & Creativity:** an inversion. The AI is not the expert, it is an *amplifier* of the community's knowledge, and it is **forbidden in code** (not just in a prompt) from ever teaching a word a real speaker didn't say. A probabilistic model handed a hard, deterministic correctness property.
- **Adherence to Theme:** a civic, public-good tool aimed squarely at the defining cultural problem of the urban future, the languages a city quietly erases as people migrate into it. Infrastructure for *who a city's people are*, not just how it runs.
- **Real-world Impact & Usefulness:** it ships with eight real endangered languages, two fully learnable today, every word cited to a real source. This is not a mockup; the AI runs live on the deployed site.
- **Presentation:** a 2-3 minute film, a working deployment, and reproducible measured results at `GET /api/metrics`.
- **User Experience:** Duolingo-simple. Flashcards, pronunciation you can hear, spaced repetition, and a one-field Contribute box that rebuilds the whole course in seconds.

## Required deliverables

- **Public repository:** this repo.
- **Working deployment:** the live Next.js app at **https://lantern-cyan.vercel.app**, with live induction enabled. Watch it learn Māori from 41 phrases, see the grammar it found, and take the course it built.
- **Video (2-3 min):** the Lantern film in `video/` (trim the 4K master to the 2-3 min cut).

> Note for judging: everything below is shown on screen in the film, the working app, the live induction, and the measured results, so the video stands on its own without opening the repo.

## The honest core, in one line

Zero invented words reach a learner, and every vocabulary item is cited, **48/48** across both seed languages. It is not a prompt instruction; it is enforced in code (`src/lib/engine/guardrail.ts`) and independently recomputed at `GET /api/metrics`.
