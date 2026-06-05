# Topic Mining Prompt

Used by the `leanscale-ghostwriter` skill in Step 3. Passed to a subagent with the transcript content injected.

---

## Prompt template

```
Read the transcript(s) below and extract 18-22 post-worthy topic kernels.

A "kernel" = an insight, framework, contrarian take, story, or pattern that could anchor a single LinkedIn post. It does NOT have to reference the podcast or guest — the transcript is seed material, not subject matter.

For each kernel, return:
- title: short, punchy
- angle: the SPECIFIC take or POV. Bad: "AI is changing RevOps." Good: "The CHRO is no longer the economic buyer for HR AI — IT is."
- sourceQuote: 1-3 lines from the transcript that sparked it
- sourcePerson: guest name OR "Anthony" (he's the host)
- bestFor: which content types could carry it, from: CONTRARIAN HOOK, TACTICAL PLAYBOOK, PERSONAL STORY, INDUSTRY OBSERVATION, SOFT EDUCATIONAL, CAROUSEL, INFOGRAPHIC, LISTICLE, CASE STUDY SNIPPET
- bestForRole: which LeanScale team roles this fits, from: Engineering/Product, Revenue, Customers, Marketing, Founder
- domain: e.g., RevOps strategy, AI in GTM, sales methodology, services-as-software, GTM hiring, leadership, MEDDPICC, enterprise selling

Push for VARIETY:
- Different domains
- Different content type fits
- Mix contrarian + educational + tactical + personal-story kernels
- Ensure each of the 5 LeanScale roles has at least 3-4 viable kernels (so each author has real choices)

Return as structured JSON matching the schema below.

==== TRANSCRIPT(S) ====
{{TRANSCRIPT_CONTENT}}
```

## Output schema (JSON Schema)

```json
{
  "type": "object",
  "required": ["topics"],
  "properties": {
    "topics": {
      "type": "array",
      "minItems": 18,
      "maxItems": 22,
      "items": {
        "type": "object",
        "required": ["title", "angle", "sourceQuote", "sourcePerson", "bestFor", "bestForRole", "domain"],
        "properties": {
          "title":         { "type": "string" },
          "angle":         { "type": "string" },
          "sourceQuote":   { "type": "string" },
          "sourcePerson":  { "type": "string" },
          "bestFor":       { "type": "array", "items": { "type": "string" } },
          "bestForRole":   { "type": "array", "items": { "type": "string" } },
          "domain":        { "type": "string" }
        }
      }
    }
  }
}
```

## Tips for the subagent

- If the transcript is long (>10k tokens), focus extraction on Anthony's questions + the guest's most emphatic answers — those are where the kernels usually live.
- If the guest names a specific number, customer, or moment, lift it verbatim into the sourceQuote.
- Don't soften contrarian takes — if the guest says something pointed, capture the point as-is.
- A kernel can fit multiple roles. Don't artificially restrict.
- It's OK to lightly synthesize across multiple quotes if they form one coherent kernel, but keep sourceQuote tight (≤3 lines).
