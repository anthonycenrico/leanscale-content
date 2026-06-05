# Post Generation Prompt

Used by the `leanscale-ghostwriter` skill in Step 4. One subagent invocation per author, run in parallel.

---

## Prompt template

```
Ghostwrite 5 LinkedIn posts in the voice of {{AUTHOR_NAME}} ({{AUTHOR_ROLE}}).

==== VOICE PROFILE ====
{{VOICE_PROFILE_MARKDOWN}}

==== CONTENT TYPE TAXONOMY ====
{{CONTENT_TYPES_MARKDOWN}}

==== TOPIC KERNELS (from this batch's transcripts) ====
{{TOPIC_KERNELS_JSON}}

==== YOUR JOB ====

1. Pick 5 topic kernels that fit {{AUTHOR_NAME}}'s domain and voice. Prefer kernels tagged with their role in `bestForRole` and content types in their `contentTypeFit`.

2. **Hard constraint — content type mix:** of the 5 posts, exactly 1 must be `CAROUSEL` (multi-slide, 4-6 slides) and exactly 1 must be `INFOGRAPHIC` (single image). The other 3 posts mix the remaining 7 content types (CONTRARIAN HOOK, TACTICAL PLAYBOOK, PERSONAL STORY, INDUSTRY OBSERVATION, SOFT EDUCATIONAL, LISTICLE, CASE STUDY SNIPPET). Don't use the same content type more than twice across the 5 posts.

3. Write each post in {{AUTHOR_NAME}}'s voice. Match:
   - Hook style (see voice profile)
   - Sentence length and rhythm
   - Formatting (emojis, bullets, line breaks)
   - Emotional register
   - Vocabulary
   - Sample phrasings — use the actual constructions they use

   The post should read like THEY wrote it, not like a generic LinkedIn post.

4. **For CAROUSEL and INFOGRAPHIC posts:** output a structured `visualSpec` field (JSON object with a `slides` array). Each slide specifies a template and params:

   ```json
   {
     "slides": [
       { "template": "cover", "params": { "kicker": "...", "title": "...", "body": "..." } },
       { "template": "stat", "params": { "kicker": "...", "stat": "01", "statLabel": "...", "body": "..." } }
     ]
   }
   ```

   Available templates and their params:
   - `cover`: kicker, title, body
   - `framework`: kicker, num, title, body
   - `listicle`: kicker, title, items (array, 3-6 strings)
   - `stat`: kicker, stat, statLabel, body
   - `quote`: kicker, title (the quote), body (attribution)
   - `dark`: kicker, title, body (use for closing slide of a carousel)

   CAROUSEL = 4-6 slides. INFOGRAPHIC = exactly 1 slide.

   Also include a free-text `visualAssetNeeded` for human editors who want a quick read on what the visual is supposed to be.

==== QUALITY BAR ====

- No corporate-speak ("in today's fast-paced world", "leverage synergies", "at the end of the day", "game-changer")
- No emoji unless the voice profile explicitly says this author uses them
- Hooks must earn the read — no clickbait that doesn't deliver
- Specifics over abstractions (numbers, named scenarios, concrete examples)
- Each post must be publish-ready, not a draft
- Front-load the hook in the first 2-3 lines (LinkedIn's "see more" cutoff)
- Respect the author's avoidances list — these are hard "no" rules

==== ANTI-REPETITION (don't let the batch look copy-paste) ====

Within this author's 5 posts:
- Vary the SIGN-OFFS. Do not end every post the same way. If the author has a signature closer (e.g. a salute emoji, a "let's connect!", a "DM me", a hashtag bundle), it may appear ONCE, maybe twice — never on all 5. The other posts close with a clean line, a question, a CTA to a resource, or just the payoff.
- Vary the OPENERS. Don't start multiple posts with the same construction.
- Vary post LENGTH and STRUCTURE across the 5 — some short and punchy, some longer.

The closer should feel like a natural end to THAT post, not a stamp applied to all of them. Signature elements are seasoning, not a template.

(Cross-author note for the orchestrator: after all 5 authors are generated, scan for cases where two different authors open the same shared topic with a near-identical hook — especially carousels on the same kernel. Re-vary the openers so each author frames the shared topic in their own distinct way. Three teammates posting the same opening line in the same week is the #1 copy-paste tell.)

Return all 5 posts with: contentType, topicTitle, postText (with real line breaks via \n), voiceNotes (which voice characteristics you leaned into), and visualAssetNeeded.
```

## Output schema (JSON Schema)

```json
{
  "type": "object",
  "required": ["authorName", "posts"],
  "properties": {
    "authorName": { "type": "string" },
    "posts": {
      "type": "array",
      "minItems": 5,
      "maxItems": 5,
      "items": {
        "type": "object",
        "required": ["contentType", "topicTitle", "postText", "voiceNotes", "visualAssetNeeded"],
        "properties": {
          "contentType":        { "type": "string" },
          "topicTitle":         { "type": "string" },
          "postText":           { "type": "string" },
          "voiceNotes":         { "type": "string" },
          "visualAssetNeeded":  { "type": "string" }
        }
      }
    }
  }
}
```

## Tips for the subagent

- If you find yourself reaching for clichés, stop. Look at the author's `samplePhrasings` and lift a construction from there.
- If the topic is genuinely a bad fit for the author, drop it and pick another. Don't force.
- The `voiceNotes` field is for the editor — explain in 1-2 sentences which specific voice characteristics this post leans into (e.g., "Uses his Unicode-bold tool-name pattern + salute emoji close. Opens with 'We recently' — matches his observed hook style.").
- For Jake specifically (confidence MEDIUM-LOW), lean conservative — favor TACTICAL PLAYBOOK and CASE STUDY over hot takes until his voice profile is refined.
- Anthony's posts can be slightly more category/founder POV than the operators' — he has earned that posture, others haven't.
