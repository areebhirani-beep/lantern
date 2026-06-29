# Lantern

*A community-owned engine that turns the last phrases of a dying language into a real course, honestly, in minutes, for any language on Earth.*

Moonshot Hackathon. Live at lantern-cyan.vercel.app. Source at github.com/areebhirani-beep/lantern

> **The claim, verifiable in your browser.** Lantern hands a probabilistic language model a deterministic correctness property, *never teach a word a real speaker did not say*, and enforces it in code, not in a prompt. The endpoint `GET /api/metrics` recomputes that property from scratch on every request and reports the number of invented words that have ever reached a learner. It is zero. You do not have to take our word for it.

## Abstract

Roughly every two weeks a language loses its last fluent speaker, and close to half of the world's seven thousand living languages are projected to be gone by the end of this century. The reason is not that no one cares. The reason is cost. Turning what a community still remembers into something teachable has always required a trained field linguist working for years, and there are a few thousand such linguists against several thousand languages running out of time. The arithmetic has never closed, so the world triages: a handful of languages get courses, and the long tail runs out of time.

Lantern attacks the cost, not the symptom. It is a single engine that ingests a small set of cited phrases a community still remembers, induces the grammar hidden inside them, and produces a real, citeable beginner course (vocabulary, discovered grammar patterns, and audio flashcards on a spaced-repetition schedule) for a language that had nothing an hour earlier. The moonshot is not the app. It is the inversion underneath it: the model is never the expert. It is an amplifier of the community's own words, forbidden in code from teaching anything a real speaker did not say. That single constraint is at once the ethical guarantee that makes a critically endangered language safe to touch, and the architectural property that lets one engine serve every language without a per-language model, dataset, or training run. This paper sets out the full argument and the full architecture: the realization, the five enforced layers of honesty, the measured results, and the path from "save a few languages" to "give every language a way back."

## 1. The clock

Start with a person, not a dataset. A grandmother who still dreams in a language her grandchild was never taught, one of the last people in her family who can speak it, living in a city of millions with no one left to speak it with. Her language has no app, no course, no classroom. Not because nobody cares, but because the work of writing a language down and making it teachable has always been measured in linguist-years, and no one was ever going to spend a career on her language in time.

```
   every ~14 days   ──►   one language loses its last speaker
   ~7,000 living    ──►   ~3,400 projected gone by 2100
   speakers lost    ──►   Indigenous, immigrant, diaspora first

   when the last speaker goes, a grammar, a story-form, a way of
   naming the world goes quiet in a single afternoon, usually with
   no recording, no textbook, and no course to bring any of it back.
```

*Figure 1. The clock the project is racing.*

The languages disappearing fastest belong to the communities with the least institutional support, and to the children most likely to grow up speaking a dominant language instead of their own. This is not a fringe loss. Each language is a distinct, irreplaceable hypothesis about what a mind can hold (what can be thought, felt, and told apart), and most of those hypotheses are scheduled for deletion before anyone ever tests them.

Language death is not destiny. It is a tooling problem. The entire project rests on that one sentence.

## 2. The realization: it was always a cost problem

Documentation is expensive in exactly one currency: expert time. The table below is the comparison that defines the work.

| | Traditional documentation | Lantern |
|---|---|---|
| Unit of work | linguist-*years* per language | *minutes* per language |
| Who does it | a trained field linguist | the community, with the engine |
| Cost to add a language | a career | a handful of cited phrases |
| Reach | the few that get attention | the long tail, any language |
| Source of truth | the linguist | the community's own words, cited |

The bottleneck was never how much anyone cared. It was the price of converting memory into curriculum. Collapse that price, from years to minutes, and the triage math that condemns the long tail simply flips.

```
   COST TO GIVE A DYING LANGUAGE ITS FIRST REAL COURSE

   Traditional  ████████████████████████  linguist-years
   Lantern      ▏                          minutes, from cited phrases

   same axis. that gap is the moonshot.
```

*Figure 2. The cost collapse, drawn to scale.*

## 3. The arithmetic that condemns the long tail

Make the triage explicit, because it is the thing Lantern overturns. With a fixed, tiny supply of expert-years and a large, growing demand of endangered languages, the world is forced to rank. A small number of high-attention languages clear the bar. Everything below the line waits, and the line moves down the list more slowly than the clock moves through it.

```
   THE TRIAGE        supply of linguist-years is flat; the clock is not

   demand ▲
          │  ██  ██                    languages that get a course
   ───────┼──██──██──────────────────  ◄ funding / attention line
          │  ██  ██  ▒▒ ▒▒ ▒▒ ▒▒ ▒▒    the long tail: runs out of time
          └────────────────────────►   thousands of languages


   LANTERN MOVES THE LINE TO THE FLOOR     cost per language → minutes

          │  ██  ██  ██ ██ ██ ██ ██    every language clears the bar
   ───────┼────────────────────────►   ◄ line at the floor
```

*Figure 3. The triage, and the inversion that ends it.*

When the cost per language drops to "a handful of cited phrases," there is no line to fall below. Revival stops being a privilege of the well-studied few and becomes available to the thousands of languages no expert was ever going to reach. That is the difference between saving a few languages and giving every language a path.

## 4. What Lantern is

Lantern is Duolingo for the languages that are dying, the ones so endangered that no app, textbook, or course exists for them. You pick such a language. Lantern takes a small set of phrases someone still remembers, works out the grammar hidden inside them, and builds a beginner course you can sit down and learn from today. That course contains:

- A cited vocabulary bank, where every single word links back to the exact phrase that proves it is real.
- The grammar patterns the engine discovered on its own. For Māori: how tense rides on a small particle *before* the verb; how number lives on the *article* rather than the noun; how possession is marked by *dropping a single letter*.
- Audio flashcards with pronunciation you can hear, scheduled on a spaced-repetition system.
- A Contribute tab, where adding one phrase you remember, say *Ka pai* ("good"), re-derives the whole course, a little richer, in seconds.

It ships pre-loaded with eight endangered languages, deliberately spanning the full spectrum of endangerment, from Ainu, with around ten fluent speakers left, to Manx and Cornish, two languages a generation of their own communities pulled back from being declared dead. Māori and Cherokee are fully learnable right now. You can watch the engine learn Māori from 41 phrases, read the grammar it found, and take the course it produced.

```
   THE ENDANGERMENT SPECTRUM          one engine serves all of it

   critically endangered ───────────────────────────────► revived
     Ainu (~10)    ...   Cherokee    Māori    ...   Manx, Cornish
     ▏ almost silent      ▍ taught   ▋ taught       █ brought back

   no per-language model. the data is the community's, not ours.
```

*Figure 4. The full spectrum, covered by a single engine.*

### What the engine found in Māori

The grammar in the course is not supplied by us, and not recalled by the model from training. It is induced from the cited phrases by comparison. Put two phrases that differ in one place beside each other, a minimal pair, and the difference tells you what that one place does.

Set "Ka haere au" against "E haere ana au" and "Kua haere au." All three share *haere au*; they differ only in the small words wrapped around the verb. From that contrast alone the engine proposes a rule it was never told: in these phrases, tense and aspect are carried by a particle that sits *before* the verb (*ka*, *kua*, the *e ... ana* frame) while the verb itself never changes. English buries tense inside the verb (go, went, gone); Māori, the corpus shows, hangs it out front.

Number behaves the same way in a different place. Compare "te whare" with "ngā whare": the noun *whare* is identical in both, and only the article moves, from *te* to *ngā*. The engine concludes that number lives on the article, not the noun, the mirror image of the English habit of pluralizing the noun itself.

Possession reveals a quieter pattern. Across the possessive forms in the corpus, marking more than one possessed thing is done by dropping a single letter, the initial *t*, so that *tāku* ("my", one thing) becomes *āku* ("my", many). A whole grammatical contrast turns on the absence of one consonant.

None of these are claims we make about Māori in general. They are the patterns these particular phrases support, each shown with the evidence that produced it. If a newly contributed phrase contradicts a pattern, the pattern is re-derived. The community's words remain the authority; the engine only reads them carefully.

### The learner's loop

Once a course exists, Lantern behaves like an app you would actually open. Vocabulary becomes flashcards, each one scheduled by the SM-2 algorithm: answer a card well and its next review slides further into the future; miss it and the interval collapses back to minutes, so attention pools where it is needed. Pronunciation plays through the browser's own speech synthesis, so a learner hears the word and does not only read it. Practice sentences are drawn only from the attested set, so nothing a learner drills was ever invented. And the Contribute tab keeps the loop open: a remembered phrase, typed in, re-runs the whole derivation and hands the next learner a slightly larger course.

## 5. The inversion that makes it work

Most AI products ask the model to *be the expert*. For a language with fifty living speakers, that is a category error. The model has barely encountered it in training, so when you ask it to teach the language, the only thing it can do is hallucinate, producing fluent, confident, wrong material. And for a critically endangered language, a convincing fake is worse than silence, because it quietly poisons the very record the community is fighting to preserve. A wrong word, taught to a learner and repeated, becomes indistinguishable from a real one within a generation.

Lantern inverts the role completely.

```
   ┌──────────────────────────┐        ┌──────────────────────────────┐
   │  EVERYONE ELSE           │        │  LANTERN                     │
   │                          │        │                              │
   │   model = the expert     │   ──►  │   model = an amplifier       │
   │   knowledge from weights │        │   knowledge from the people  │
   │   confidence = fluency   │        │   confidence = citation      │
   │   failure = hallucination│        │   failure = silence, which   │
   │                          │        │             is safe          │
   └──────────────────────────┘        └──────────────────────────────┘
         poisons the record                   protects the record
```

*Figure 5. The same rule that keeps the model honest is the rule that makes it universal.*

The model reasons only over the phrases it is given. It cites its evidence for every claim. And it is forbidden, in the code itself and not in a prompt, from ever teaching a word a real speaker did not actually say. That single constraint does double duty. It is the ethics: a critically endangered language is safe to hand to this system because the system cannot invent into it. And it is the architecture: because the engine leans on the community's data instead of the model's training, one engine serves any language on Earth. Honesty and universality are the same property, seen from two sides.

## 6. The engine, end to end

The system is a single loop that grows richer every time a person touches it. A model proposes, the code verifies and filters, the learner practices, and the act of contributing feeds the corpus back into the start. The model is inside the loop; it never gets the last word.

```
   cited phrases   (schema-checked)
        │
        ▼   Llama 3.3 70B on Groq
   [1] INDUCE      align words, induce grammar from minimal pairs
        │
        ▼
   [2] VERIFY      each vocab form must match its OWN citation
        │              └─ fails ──►  never enters ground truth
        ▼
   [3] GUARDRAIL   tokenize every sentence + card
        │              └─ any unattested token ──►  DISCARD item
        ▼
   [4] GENERATE    flashcards, practice, audio   (SRS)
        │
        ▼
   [5] LEARN  ──►  a learner adds +1 phrase
        │                             │
        └─────────────────────────────┘  GROW: re-derives, richer
                (the corpus compounds; the loop only tightens)
```

*Figure 6. The loop, read as a ratchet.*

Read it as a ratchet. Every pass can only remove unsupported material and add community-supported material. There is no path by which an invention survives to a learner, and no path by which a real contributed phrase is lost. The loop only tightens toward the truth.

### A worked example: one phrase through the engine

Follow a single phrase the whole way. An elder's corpus contains "E haere ana au" ("I am going"). SEED stores it as cited text. INDUCE sets it beside "Ka haere au" and "Kua haere au," sees that all three share *haere au*, and proposes two vocabulary forms, *haere* ("go") and *au* ("I"), together with the preverbal-tense pattern the three phrases jointly imply. VERIFY tests each proposed form against its own citation: *haere* is admitted because the token appears in "E haere ana au"; *au* likewise.

Now suppose the model, reaching for fluency, also proposes *haerenga* ("journey"), a real Māori word that simply never appears in this corpus. Its token is in no citation, so it is refused. It never joins the attested set, and nothing downstream may lean on it. GENERATE then composes a practice card, and the guardrail tokenizes the candidate (*e*, *haere*, *ana*, *au*), ignores the *e ... ana* gap frame, and checks each token for membership. Every token is present, so the card is shown. Had the model written "E oma ana au" ("I am running") while *oma* was never spoken in the corpus, the tokenizer would find *oma* missing and discard the entire card, without comment.

What survives to the learner is exactly one sentence, "I am going," every word of it traceable to a phrase a real speaker said. The model did the proposing; the corpus did the deciding.

## 7. How we built it: five enforced layers of honesty

This is the part that separates Lantern from a clever prompt. The honesty guarantee is not a request we make of the model. It is a property we enforce in code, in five distinct layers. Each one closes a hole the previous one would otherwise leave open.

### Layer one: the contract

The model is never allowed to write free prose into the product. It must return a strictly typed object: vocabulary entries, each with a *form*, a *meaning*, a *part of speech*, a *confidence level*, and a list of *evidence phrase IDs*; grammar patterns; and a lesson made of cards and practice sentences. We parse that object at runtime with a Zod schema. Anything malformed is thrown out before it can reach a learner. Forced structured output turns "please be careful" into a parser that physically cannot pass a shape it does not recognize.

### Layer two: two-stage attestation

This is the scientific heart of the system. Ground truth starts as exactly the set of word tokens that appear in the community's cited corpus, and nothing more. A vocabulary form the model proposes is admitted to that ground-truth set only if every token in it appears in that form's own cited evidence phrase. One check catches two failure modes at once: an *invented* word, whose tokens are nowhere in its citation, and a *miscited* word, whose tokens are real but absent from the phrase it points at.

The subtle, load-bearing detail is this: a form that fails verification never becomes ground truth. That ordering closes a hole that most cite-your-sources systems leave wide open, the laundering attack.

```
   ATTESTATION AS SET ALGEBRA

   A = { tokens that appear in cited phrases }     ← ground truth

   for a proposed form f with citation c:
       admit f   ⇔   tokens(f) ⊆ tokens(c)   and   c ∈ corpus
       on admit:   A ← A ∪ tokens(f)     (verified tokens only)

   THE LAUNDERING ATTACK, BLOCKED
       a hallucinated word cannot first slip in as "vocabulary" and
       then be used to bless a fabricated sentence; it never entered A.
       Verification gates membership; membership is the only currency
       the next stage will accept.
```

*Figure 7. Verification gates membership; membership is the only currency that travels.*

Stated plainly: hallucinations are not allowed to bootstrap themselves into legitimacy. The only thing that can vouch for a sentence is a token already proven against a real citation.

### Layer three: the guardrail

Before any practice sentence or flashcard answer is shown, it is tokenized and checked against that attested set. If even one token is unattested, the entire item is discarded, not flagged, not softened, discarded. The guardrail is pure: it has no dependency on the model or the database, so it can be tested in isolation and proven to do what it claims.

The tokenizer is careful exactly where carefulness decides correctness.

```
   THE GUARDRAIL TOKENIZER        correctness lives in the edge cases

   case folding    "Kia" (sentence-initial)  ≡  stored "kia"
   punctuation     strip  . , ! ?  before comparison
   macrons         ā ē ī ō ū  preserved + normalized (vowel length)
   syllabary       Cherokee syllabary  first-class, never mojibake
   discontinuous   ignore gap markers like  e ... ana  (Māori tense)

   item shown  ⇔  every token in the item ∈ A     (else: discard)
```

*Figure 8. A guardrail that mishandled a macron would either reject real words or admit fakes.*

Getting the tokenizer right is getting the guarantee right.

### Layer four: independent verification

The live endpoint `GET /api/metrics` does not read a stored claim. It recomputes the zero-hallucination property from scratch, reusing the exact same tokenizer the engine uses, and reports the number of hallucinated words that reached a learner, which should be zero, alongside citation coverage. A judge does not have to trust a README. They can pull an independent audit of the same property, in their browser, right now.

```
   GET /api/metrics          an audit, not an assertion

   recomputed live, from raw corpus and generated course:
        hallucinated words shown to a learner   :   0
        vocabulary items cited                  :   48 / 48
        generated sentences attested            :    7 / 7

   the same tokenizer the engine trusts. a claim you can refute
   is worth more than a claim you must believe.
```

*Figure 9. The property is recomputed on every request, not stored.*

### Layer five: graceful degradation

The verified seed inductions for Māori and Cherokee are pinned while their corpus is untouched, so the live demo always shows a pristine, fully cited result. The instant a learner contributes a phrase, the corpus grows past the seed and the live model takes over the re-derivation. If there is no API key, or the model errors for any reason, the system falls back to the verified result, so the demo never breaks in front of an audience, and never shows anything uncited.

Five layers, one promise. By the time anything reaches a learner, it has survived a typed contract, an attestation gate that cannot be laundered, a pure guardrail, an independent recomputation, and a safe fallback. The model proposes; the architecture decides.

## 8. What we measured

We did not want to merely assert honesty, so we instrumented it and reported the numbers. Every figure below is reproducible live at `GET /api/metrics`.

```
   FROM 41 MĀORI PHRASES, LANTERN RECOVERED

        34   words, each cited to its source
         5   grammar patterns (tense, number, possession)
        12   flashcards on a spaced-repetition schedule

         0   invented words reached a learner
     48/48   vocabulary items cited (both languages)
       7/7   generated practice sentences attested
```

*Figure 10. Input to output, in minutes, with zero hallucinations reaching a learner.*

Handing a probabilistic model a deterministic correctness property, and then proving with a number that it held, is the scientific core of this project. It is the one thing a prompt instruction can never give you. A prompt can ask for honesty; only architecture can demonstrate it.

## 9. Why it scales: the economics of the moonshot

The honesty constraint is not only an ethical stance. It is what makes the moonshot economically tractable. Because Lantern leans on the community's data instead of the model's training, there is no per-language model to train, no fine-tuning run, and no per-language evaluation to fund. Adding a new language costs a handful of cited phrases, and the same single engine serves all of them.

```
   COST PER ADDITIONAL LANGUAGE

   traditional / fine-tuned    cost
        │           ╱╱╱╱╱      each language: new data, new training,
        │       ╱╱╱╱           new eval, unfundable at scale
        │   ╱╱╱╱
        └──────────────►  number of languages

   Lantern                     cost
        │                      one engine; per-language ≈ a few phrases
        │ ───────────────      flat, the long tail becomes reachable
        └──────────────►  number of languages
```

*Figure 11. The curve that turns "a few languages" into "every language."*

And the curve does not merely stay flat. It bends downward with use. The contribution flywheel means a language's record compounds with attention rather than decaying with neglect. Every phrase a learner or an elder adds re-derives a richer course for everyone after them.

```
   THE FLYWHEEL          the asset appreciates instead of rotting

        ┌────────────┐    contribute     ┌────────────┐
        │ a learner  │  one phrase  ──►  │  corpus +1 │
        │ / an elder │                   │            │
        └─────▲──────┘                   └─────┬──────┘
              │                                │  re-derive in seconds
              │      richer course for         ▼
              │      everyone after them  ┌────────────┐
              └───────────────────────────│  course ++ │
                                          └────────────┘

   neglect → decay  becomes  use → enrichment.
```

*Figure 12. One engine, every language, getting better the more people touch it.*

Flat-to-falling marginal cost, plus an asset that appreciates with use: that is what turns "save a few languages" into "give every language a path."

## 10. Why nothing else does this

Four kinds of tool already touch this problem, and each stops short in the same place.

Field linguistics is the gold standard and always will be, but it is the very thing whose cost we are trying to escape. A documentary grammar is the work of years, and there are not enough years to go around. It produces the deepest record and reaches the fewest languages.

Ask a general model to teach a fifty-speaker language and it will answer in fluent, confident sentences with nothing underneath them. It has no real exposure to the language, no citations, and no way to tell you which of its words were ever spoken. For a healthy language with abundant text this is merely unreliable; for an endangered one it is dangerous, because the fabrications are indistinguishable from the truth and they enter the record looking authoritative.

Crowdsourced dictionaries and word-list apps preserve vocabulary, which is worth doing, but a list is not a course. They carry no grammar a learner can generalize, no practice loop, and no engine that turns a handful of remembered phrases into something you can sit down and study.

Mainstream language apps build beautiful courses by hand, which is exactly why they will never serve the long tail: the course is the expensive artifact, and no company will fund one for ten speakers. Their unit economics require a mass market the dying languages do not have.

Lantern's move is to make the course cheap to produce and impossible to fake. It generates the curriculum from a few cited phrases, it proves every word against its source, it enforces that proof in code rather than in a prompt, and it does all of this with one engine that needs no per-language training. That combination (generative, cited, guaranteed, and universal) is the part nobody else ships.

## 11. How it maps to the Moonshot rubric

A moonshot is a tenfold reframing, not a ten-percent improvement. Lantern reframes endangered-language tooling from *manufacture an artificial expert* to *amplify the real ones, honestly, at the speed of software*.

**Zero to one.** A genuinely new primitive: the model as amplifier rather than expert, handed a hard correctness property enforced in code. Not a better course-builder, but a different kind of object. Nobody else ships this.

**Technical and scientific depth.** Two-stage attestation with a blocked laundering attack, a syllabary- and macron-aware tokenizer, forced structured output validated at runtime, a pure and independently testable guardrail, and a live metrics endpoint that recomputes the property from scratch. Not a prompt and a screen recording, but a verifiable system.

**Feasibility and execution.** It is real, live, and measured today, with graceful fallback so it cannot break on stage. The original contribution (the honest engine, its guardrail, and the full product around them) was built during the hackathon and is deployed at lantern-cyan.vercel.app.

**Long-term vision and impact.** A clear, credible path to a living ark for every endangered language, each one revivable the moment a single elder seeds it. The impact ceiling is civilizational, and the cost floor is a few phrases.

## 12. The long-term vision: a living ark

The destination is a living, community-governed digital ark, an entry for every endangered language on Earth, each one revivable the moment a single person who still remembers seeds it with a few phrases. Not a museum of recordings behind glass, but a set of living courses that grow as people return to them.

At scale, this rewrites the economics of language survival: the cost of a language's first real course falls below the cost of letting it die. But the deeper stake is not economic. Each language is a distinct, irreplaceable hypothesis about what a mind can be (what can be thought, felt, and told apart), and most of those hypotheses are about to be deleted before anyone ever tests them. Lantern is a bet that the cheapest and most scalable way to keep them alive is not to build an artificial expert, but to amplify the people who still hold the knowledge, honestly, at the speed of software. The honesty is not a feature bolted onto the bet. It is the bet: a record you can trust is the only kind worth saving.

## 13. What is next for Lantern

Lantern, as it stands today, is the first working piece of that ark. From here:

- Recordings from native speakers, so pronunciation is grounded in real voices, not synthesis alone.
- A review path, so fluent speakers can approve or correct lessons, putting the community in the editor's seat.
- Export to printable primers, for communities with poor connectivity, so the ark reaches paper and not only browsers.
- Formal data-sovereignty controls, so each community fully owns and governs its own words, including the right to restrict, license, or withhold them.

Every one of these extends the same principle the engine was built on: the community is the authority, the model is the amplifier, and the record stays honest.

## Build and links

Live demo: lantern-cyan.vercel.app. Watch the engine learn Māori from 41 phrases, read the grammar it found, and take the course.

Independent audit: lantern-cyan.vercel.app/api/metrics. The zero-hallucination property, recomputed live.

Source: github.com/areebhirani-beep/lantern.

Stack: Next.js 16 and TypeScript on Vercel; live induction on Llama 3.3 70B served by Groq, called through the Anthropic SDK; MongoDB Atlas, with an in-memory fallback, for the contribution flywheel; the SM-2 spaced-repetition algorithm; in-browser Web Speech for text-to-speech; and Zod for runtime schema validation.

*Language death is not destiny. It is a tooling problem. Lantern is the tool, and it is live.*
