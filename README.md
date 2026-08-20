# Josh_Dev — 3D Developer Portfolio

A responsive, single-page developer portfolio with an interactive WebGL hero
scene, tilt-responsive project cards, and no build step — just plain
HTML, CSS, and JavaScript (plus [three.js](https://threejs.org) from a CDN).

## Structure

```
Josh_Dev/
├── index.html          # all page markup + sections
├── css/
│   └── style.css        # design tokens, layout, responsive rules
├── js/
│   ├── three-scene.js   # WebGL hero scene (wireframe geometry + pointer parallax)
│   └── main.js           # nav toggle, skill list, card tilt, scroll reveal
├── assets/               # put images / favicon / resume here
└── README.md
```

## Run it locally

No build tools required. Any static file server works:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then open `http://localhost:8080`.

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository (e.g. `Josh_Dev`).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
4. Save — your site will publish at `https://<your-username>.github.io/Josh_Dev/`.

## Editing content

- **Copy & sections** live directly in `index.html` — hero headline, About
  paragraphs, the `skills` array in `js/main.js`, and the project `<article
  class="card">` blocks under `#work`.
- **Colors, type, spacing** are centralized as CSS custom properties at the
  top of `css/style.css` (`:root`) — change a token once and it updates the
  whole site.
- **The 3D scene** (`js/three-scene.js`) uses only `three.js` primitives
  (icosahedron, octahedron, torus, a particle field) so it stays lightweight
  and has no external model dependencies to swap out.

## Using this with Figma

The markup uses plain semantic HTML and CSS (no CSS-in-JS, no framework
runtime classes), which makes it straightforward to bring into Figma with an
HTML-import plugin such as **html.to.design** or **Figma to Code**:

1. Install the plugin from the Figma Community.
2. Point it at your deployed URL (or paste the HTML/CSS) to generate editable
   Figma layers for the static sections (nav, about, skills, work, contact).
3. Note the `<canvas id="webgl">` hero scene is rendered by JavaScript at
   runtime, so importers will capture it as a flat screenshot/frame rather
   than editable layers — recreate that section natively in Figma if you need
   an editable design-file version of the hero.

## Browser support

Targets evergreen browsers (Chrome, Firefox, Safari, Edge). WebGL is required
for the hero scene; the rest of the page (nav, content, cards) degrades
gracefully with plain CSS if WebGL or JavaScript is unavailable.

## License

Free to use and adapt for your own portfolio.
