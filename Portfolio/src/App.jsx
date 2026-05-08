import { Suspense, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { motion } from 'framer-motion'

import { useScrollProgress, useData, useTheme, useIsMobile } from './hooks'
import LoadingScreen from './components/ui/LoadingScreen'
import Navigation from './components/ui/Navigation'
import CustomCursor from './components/ui/CustomCursor'
import MobileLayout from './components/ui/MobileLayout'
import CoffeeScene from './components/3d/CoffeeScene'
import HeroSection from './components/sections/HeroSection'
import AboutSection from './components/sections/AboutSection'
import SkillsSection from './components/sections/SkillsSection'
import ProjectsSection from './components/sections/ProjectsSection'
import ExperienceSection from './components/sections/ExperienceSection'
import ContactSection from './components/sections/ContactSection'

function SceneFallback() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <motion.div
        className="text-6xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        ☕
      </motion.div>
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [dpr, setDpr] = useState(1.5)
  const { scrollProgress, scrollY } = useScrollProgress()
  const { data, loading } = useData()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()

  const handleLoadComplete = useCallback(() => setLoaded(true), [])

  const isDark = theme === 'espresso'

  return (
    <div
      className={`noise grain ${isDark ? '' : 'theme-latte'}`}
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Loading screen */}
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}

      {/* Custom cursor (desktop only) */}
      {!isMobile && loaded && <CustomCursor />}

      {loaded && (
        <>
          {/* Navigation */}
          <Navigation
            scrollProgress={scrollProgress}
            theme={theme}
            toggleTheme={toggleTheme}
          />

          {isMobile ? (
            /* ── Mobile: simplified 2D layout ─────────────────────────── */
            <MobileLayout data={data} />
          ) : (
            /* ── Desktop: full 3D experience ──────────────────────────── */
            <>
              {/* Three.js Canvas — fixed background */}
              <div className="canvas-container">
                <Canvas
                  shadows
                  dpr={dpr}
                  camera={{ position: [0, 2, 8], fov: 55, near: 0.1, far: 100 }}
                  gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance',
                    stencil: false,
                  }}
                  style={{ background: isDark ? '#1a0d04' : '#fdf5e6' }}
                >
                  <PerformanceMonitor
                    onDecline={() => setDpr(1)}
                    onIncline={() => setDpr(1.5)}
                  />
                  <Suspense fallback={null}>
                    <CoffeeScene
                      scrollProgress={scrollProgress}
                      theme={theme}
                    />
                  </Suspense>
                </Canvas>
              </div>

              {/* Scrollable content overlay */}
              <div className="content-overlay relative z-10">
                <HeroSection data={data} />
                <AboutSection data={data} />
                <SkillsSection data={data} />
                <ProjectsSection data={data} />
                <ExperienceSection data={data} />
                <ContactSection data={data} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
