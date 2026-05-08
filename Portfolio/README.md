# ☕ Coffee Portfolio — 3D Scrollable Portfolio

A premium, immersive 3D portfolio website with a coffee shop aesthetic. Built with React, Three.js (@react-three/fiber), Tailwind CSS, and Framer Motion.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Folder Structure

```
coffee-portfolio/
├── public/
│   ├── data.json          ← All portfolio content (edit this!)
│   └── favicon.svg
│
├── src/
│   ├── App.jsx            ← Root component, orchestrates everything
│   ├── main.jsx           ← React entry point
│   │
│   ├── hooks/
│   │   └── index.js       ← Custom hooks (scroll, typing, theme, etc.)
│   │
│   ├── styles/
│   │   └── index.css      ← Global CSS, Tailwind, animations, themes
│   │
│   └── components/
│       ├── 3d/
│       │   ├── CoffeeScene.jsx      ← Main Three.js scene + camera path
│       │   ├── CoffeeCup.jsx        ← Detailed 3D coffee cup with steam
│       │   ├── FloatingBeans.jsx    ← Animated floating coffee beans
│       │   ├── WoodTable.jsx        ← Wooden table with grain detail
│       │   └── AmbientParticles.jsx ← Rising dust/steam particles
│       │
│       ├── ui/
│       │   ├── LoadingScreen.jsx    ← Coffee brewing loading animation
│       │   ├── Navigation.jsx       ← Sticky nav with active states
│       │   ├── CustomCursor.jsx     ← Custom cursor (desktop only)
│       │   └── MobileLayout.jsx     ← Simplified 2D mobile version
│       │
│       └── sections/
│           ├── HeroSection.jsx      ← Typing effect + CTAs
│           ├── AboutSection.jsx     ← Bio + stats grid
│           ├── SkillsSection.jsx    ← Animated skill cards
│           ├── ProjectsSection.jsx  ← Interactive project cards
│           ├── ExperienceSection.jsx← Timeline with expand
│           └── ContactSection.jsx  ← Contact form + links
│
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Customizing Your Content

**All content lives in `public/data.json`** — you never need to touch UI code.

### Sections you can edit:
- `personal` — Name, title, social links, location, coffee order
- `about` — Bio paragraphs, stats
- `skills` — Categories with icons, colors, and skill tags
- `projects` — Title, description, tags, links, colors
- `experience` — Role, company, duration, highlights, tech
- `contact` — Headline, subtext, availability, form placeholders

---

## 🎥 How Scroll Controls the 3D Camera

The magic is in `CoffeeScene.jsx`. Here's how it works:

### 1. Camera Path Keyframes
```js
const CAMERA_PATH = [
  { pos: [0, 2, 8],  target: [0, 0.5, 0], section: 0 },    // Hero
  { pos: [-3, 3, 6], target: [0, 0, 0],   section: 0.15 }, // About
  { pos: [2, 5, 4],  target: [0, 0, 0],   section: 0.3 },  // Skills
  { pos: [4, 2, 3],  target: [0, 1, 0],   section: 0.5 },  // Projects
  { pos: [-4, 1.5, 5],target:[0, 0, 0],   section: 0.7 },  // Experience
  { pos: [0, 4, 10], target: [0, 0, 0],   section: 1.0 },  // Contact
]
```
Each keyframe has a `section` value from `0` (top) to `1` (bottom), matching scroll progress.

### 2. Interpolation
On each frame, we find the two surrounding keyframes and interpolate between them using a smoothstep easing curve:
```js
const t = local * local * (3 - 2 * local) // smoothstep
pos = lerpV3(from.pos, to.pos, t)
```

### 3. Mouse Parallax
The camera position also responds to mouse movement for a subtle parallax:
```js
targetPos.set(pos[0] + mouseX * 0.3, pos[1] + mouseY * 0.2, pos[2])
```

### 4. Smooth Following
The camera doesn't snap — it follows with `lerp` damping:
```js
currentPos.lerp(targetPos, delta * 2.5)
camera.position.copy(currentPos)
camera.lookAt(currentLook)
```

---

## 🌙 Themes

Two themes out of the box:
- **Espresso** (dark) — Deep browns, warm orange glow, starry background
- **Latte** (light) — Creamy whites, soft caramels, sunset environment

Toggle by clicking the ☀️/🌙 button in the nav. Theme preference is persisted in `localStorage`.

---

## 📱 Mobile

On screens < 768px:
- Three.js canvas is hidden
- A beautiful 2D-only layout renders (`MobileLayout.jsx`)
- All content remains accessible
- Custom cursor is disabled

---

## ⚡ Performance Features

- `PerformanceMonitor` from drei — auto-lowers DPR if frame rate drops
- Low-poly 3D geometry (no heavy GLTF models)
- `requestAnimationFrame` throttling for scroll handler
- Lazy loading via React `Suspense`
- Particles use a single `BufferGeometry` (not individual meshes)
- Fog reduces overdraw on distant objects
- Canvas `powerPreference: 'high-performance'`

---

## 🛠 Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI framework |
| @react-three/fiber | 8 | React renderer for Three.js |
| @react-three/drei | 9 | Three.js helpers (Float, Stars, etc.) |
| Three.js | 0.165 | 3D engine |
| Framer Motion | 11 | Animations & transitions |
| Tailwind CSS | 3 | Utility-first styling |
| Vite | 5 | Build tool & dev server |

---

## 🔧 Extending the 3D Scene

To add a new 3D object:

1. Create `src/components/3d/MyObject.jsx`
2. Import and add to `CoffeeScene.jsx`
3. Use `useFrame` for per-frame animation
4. Add a new camera keyframe if needed

To add a new section:
1. Create `src/components/sections/MySection.jsx`
2. Add to `App.jsx`
3. Add an entry in `data.json`
4. Optionally add a nav link in `Navigation.jsx`

---

## ☕ Credits

Designed & built as a premium portfolio template.  
Inspired by the craft of specialty coffee and the precision of great engineering.
