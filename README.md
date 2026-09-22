# Veyloro

Marketing site for **Veyloro** — *a marketplace focused on you*.

A single-page, dependency-free static site: hand-written HTML, CSS and ~120 lines of
vanilla JavaScript. No build step, no framework, no tracking.

**Live site:** https://hmarucheck.github.io/test-website-1/

> The repository is named `test-website-1`; the product and everything the visitor
> sees is **Veyloro**.

## What's in here

| Path | Purpose |
| --- | --- |
| `index.html` | The marketing page, with structured data in the head |
| `terms.html` | Terms of Service |
| `signin.html` | Sign in with Google |
| `config.js` | Site configuration — the Google OAuth client ID lives here |
| `auth.js` | Google Identity Services integration |
| `styles.css` | Design tokens, layout and components (light + dark themes) |
| `main.js` | Sticky header, mobile nav, scroll reveals, count-up stats, signup validation |
| `assets/` | Brand artwork, logo cutouts, icons, Open Graph card |
| `robots.txt`, `sitemap.xml`, `site.webmanifest` | Crawler and install metadata |
| `404.html` | Branded not-found page (GitHub Pages serves this automatically) |

## Brand assets

Everything in `assets/` is derived from the original Veyloro identity artwork, so the
wordmark on the site is the *actual* lettering rather than a substitute font:

- `veyloro-wordmark.png` / `veyloro-wordmark-light.png` — the wordmark keyed out of the
  photograph onto transparency, supersampled so it stays crisp on high-DPI screens
- `veyloro-mark.png` — the bag-and-smile mark, teal and orange on transparency
- `veyloro-tagline.png` — "A marketplace focused on you" in the brand's sans
- `veyloro-brand-hero.{webp,jpg}` (+ 900px variants) — the hero photograph
- `veyloro-og.jpg` — 1200×630 social sharing card
- `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-mark-512.png`

Brand colours: teal `#176369`, deep teal `#0a2f33`, orange `#f09b57`, cream `#faf5ec`.

## Search engine optimisation

- One `<h1>`, a descriptive `<title>` (under 60 characters) and a 155-character meta description
- Canonical URL, `max-image-preview:large` robots directive, `robots.txt` and an image sitemap
- JSON-LD `@graph`: `Organization`, `WebSite` (with `SearchAction`), `WebPage`,
  `BreadcrumbList` and `FAQPage` — the FAQ answers match the visible accordion text
  exactly, which is what Google requires for rich results
- Open Graph and Twitter card tags with a real 1200×630 image
- Semantic landmarks (`header`/`nav`/`main`/`section`/`footer`), meaningful alt text,
  skip link, visible focus rings and a `prefers-reduced-motion` fallback
- Fast by construction: no framework, WebP with JPEG fallback, `width`/`height` on every
  image to avoid layout shift, `preload` on the LCP image, deferred script

## Sign in with Google

`signin.html` uses Google Identity Services — the real SDK from
`accounts.google.com/gsi/client`, not a mock button. It needs an OAuth client ID
before it will work:

1. Open the [Google Cloud credentials page](https://console.cloud.google.com/apis/credentials)
   and create a project if you need one.
2. Configure the **OAuth consent screen** (External; app name, support email).
3. **Create credentials → OAuth client ID → Web application.**
4. Under **Authorised JavaScript origins**, add `https://hmarucheck.github.io`, plus
   `http://localhost:8000` for local testing. No redirect URI is required for the
   One Tap / button flow.
5. Put the ID in `googleClientId` in `config.js` and push.

`signin.html` loads `config.js?v=N`. Bump that number whenever you change the client
ID — GitHub Pages caches assets for roughly ten minutes, and a stale `config.js` shows
the setup panel instead of the button.

Client IDs are public by design and safe to commit; the client *secret* is not used
here and must never be added to the repository. Until the ID is filled in, the page
shows these steps instead of a button that cannot work.

**On verification:** Google returns a signed JWT ID token. Decoding it in the browser,
as `auth.js` does to greet the user, proves nothing — anyone can craft a JWT. A real
deployment must post the token to a server and verify its signature, `aud` and `iss`
against Google's published keys before creating a session. This site has no backend,
so nothing is stored beyond the browser tab.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

Published with GitHub Pages straight from the default branch. In the repository
settings, under **Pages → Build and deployment**, set **Source** to *Deploy from a
branch*, then choose branch `main` and folder `/ (root)`. Every push to `main` then
republishes the site — no build, no Actions workflow. The `.nojekyll` file stops
GitHub running Jekyll over the files.

Using a custom domain instead? Replace `https://hmarucheck.github.io/test-website-1/`
in `index.html` (canonical, Open Graph, JSON-LD), `robots.txt` and `sitemap.xml`, and add
a `CNAME` file containing the domain.

## Note on content

Veyloro is a demonstration brand. The statistics, reviews and seller figures on the page
are illustrative copy, not claims about a real business. The signup form validates input
in the browser and sends nothing anywhere.
