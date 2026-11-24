# Green Goals homepage

Next.js (App Router) + React + TypeScript. One page: header, hero, about, services, site photographs, projects, the
artificial grass scene, team, contact and footer.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build` then `npm run start` for a production run. It deploys to Vercel as is.

## Where things are

| Path | What |
| --- | --- |
| `src/lib/site.ts` | The words that are facts: nav links, the project table, turf specifications, offices, email and phones |
| `src/app/page.tsx` | The page: the order of the sections |
| `src/app/globals.css` | Colours, spacing and the classes every section shares (`wrap`, `section`, `h2`, `lead`, `button`) |
| `src/components/Header.tsx` | Clear over the hero, solid once the page scrolls |
| `src/components/Hero.tsx` | The full-screen photograph. It drifts, changes project by itself every 6.5 seconds (`HOLD`), and shows the next project in a pill with a ring that runs round it |
| `src/components/Wipe.tsx`, `Rise.tsx` | A photograph that wipes open, and a heading that rises, the first time they scroll into view |
| `src/components/sections/About.tsx` | One sentence that lights up word by word on scroll, and four numbers that count up |
| `src/components/sections/Services.tsx` | Four giant names. The section plays through them by itself; pointing at one chooses it |
| `src/components/sections/Sites.tsx` | The row of site photographs that slides sideways while the page scrolls (swiped on a phone) |
| `src/components/sections/Pitch.tsx` | The artificial grass scene: a pitch drawn in SVG that is laid as the page scrolls (shock pad, grass rolls, infill, lines), ending on the finished pitch. The timings are in `AT` |
| `src/components/sections/` | Also `Projects`, `Team`, `Contact` and its `QuoteForm` |
| `src/components/Footer.tsx`, `Logo.tsx`, `MobileMenu.tsx` | Footer, logo and the menu shown below 1024px |
| `src/assets/` | The logo, fourteen photographs and four portraits |
| `scripts/shot.mjs` | Headless-Chrome screenshot helper used while reviewing. Not part of the site |

On a desktop screen every section is one screen tall (the rule is in `globals.css`, under `.section`); on a
phone the sections are as tall as their content. All motion is GSAP and is switched off for visitors who ask their
system for reduced motion.

## Before it goes live

1. **The quote form has no server behind it.** Sending opens the visitor's email app with the request written
   out. To post to a form service or your own endpoint, replace the `mailto:` lines at the end of `onSubmit` in
   `src/components/sections/QuoteForm.tsx`.
2. **Link previews.** `src/app/opengraph-image.jpg` is the picture shown when the link is shared. On Vercel the
   address is picked up automatically; on another host, add `metadataBase: new URL("https://your-domain")` to the
   `metadata` in `src/app/layout.tsx`.
3. **Portraits.** The four team portraits come from the current website and are small. Replace the files in
   `src/assets/` with larger ones under the same names when the client sends them.
