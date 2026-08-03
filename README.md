# spcmky.github.io

Personal site for Chris Edwards — [www.spcmky.net](https://www.spcmky.net)

Static, hand-written, zero dependencies. No build step, no framework, no trackers,
no external network requests. GitHub Pages serves the repo root as-is.

## Structure

```
index.html          Single-page site
404.html            Not-found page
assets/css/main.css Design tokens + components
assets/js/main.js   Theme toggle, scroll reveal (progressive enhancement only)
CNAME               Custom domain
```

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Editing

Content lives directly in `index.html`. Colors, spacing, and type are all CSS
custom properties at the top of `assets/css/main.css` — change a token there
rather than a value in a component rule.

Dark theme is the default; light is derived from the same token names and the
visitor's choice persists in `localStorage`.
