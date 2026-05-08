# ☕ Coffee Portfolio — 3D Scrollable Portfolio

A premium, immersive 3D portfolio website with a coffee shop aesthetic. Built with React, Three.js (@react-three/fiber), Tailwind CSS, and Framer Motion.

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
