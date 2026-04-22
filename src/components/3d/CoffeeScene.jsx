import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Stars, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import CoffeeCup from './CoffeeCup'
import FloatingBeans from './FloatingBeans'
import WoodTable from './WoodTable'
import AmbientParticles from './AmbientParticles'

// Camera path through the coffee world
const CAMERA_PATH = [
  // Hero: looking at coffee cup on table
  { pos: [0, 2, 8], target: [0, 0.5, 0], section: 0 },
  // About: pulled back, side angle
  { pos: [-3, 3, 6], target: [0, 0, 0], section: 0.15 },
  // Skills: overhead, artistic angle
  { pos: [2, 5, 4], target: [0, 0, 0], section: 0.3 },
  // Projects: close, dramatic angle
  { pos: [4, 2, 3], target: [0, 1, 0], section: 0.5 },
  // Experience: scrolling side
  { pos: [-4, 1.5, 5], target: [0, 0, 0], section: 0.7 },
  // Contact: final wide shot
  { pos: [0, 4, 10], target: [0, 0, 0], section: 1.0 },
]

function lerp(a, b, t) {
  return a + (b - a) * t
}

function lerpV3(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}

function getCameraState(progress) {
  // Find surrounding keyframes
  let fromIdx = 0
  let toIdx = 1
  for (let i = 0; i < CAMERA_PATH.length - 1; i++) {
    if (progress >= CAMERA_PATH[i].section && progress <= CAMERA_PATH[i + 1].section) {
      fromIdx = i
      toIdx = i + 1
      break
    }
  }
  if (progress >= CAMERA_PATH[CAMERA_PATH.length - 1].section) {
    fromIdx = CAMERA_PATH.length - 2
    toIdx = CAMERA_PATH.length - 1
  }

  const from = CAMERA_PATH[fromIdx]
  const to = CAMERA_PATH[toIdx]
  const range = to.section - from.section
  const local = range > 0 ? (progress - from.section) / range : 1

  // Smooth ease
  const t = local * local * (3 - 2 * local)

  return {
    pos: lerpV3(from.pos, to.pos, t),
    target: lerpV3(from.target, to.target, t),
  }
}

export default function CoffeeScene({ scrollProgress, theme }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 2, 8))
  const targetLook = useRef(new THREE.Vector3(0, 0.5, 0))
  const currentPos = useRef(new THREE.Vector3(0, 2, 8))
  const currentLook = useRef(new THREE.Vector3(0, 0.5, 0))

  useFrame((state, delta) => {
    const { pos, target } = getCameraState(scrollProgress)

    // Add subtle mouse parallax
    const mouseX = state.mouse.x * 0.3
    const mouseY = state.mouse.y * 0.2

    targetPos.current.set(
      pos[0] + mouseX,
      pos[1] + mouseY,
      pos[2]
    )
    targetLook.current.set(target[0], target[1], target[2])

    // Smooth camera lerp
    currentPos.current.lerp(targetPos.current, delta * 2.5)
    currentLook.current.lerp(targetLook.current, delta * 2.5)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentLook.current)
  })

  const isDark = theme === 'espresso'
  const fogColor = isDark ? '#1a0d04' : '#fdf5e6'
  const fogNear = 8
  const fogFar = 25

  return (
    <>
      {/* Fog for depth */}
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* Lighting */}
      <ambientLight intensity={isDark ? 0.3 : 0.8} color={isDark ? '#ff9966' : '#ffe8cc'} />
      <pointLight
        position={[0, 5, 3]}
        intensity={isDark ? 2 : 1.5}
        color={isDark ? '#ff8844' : '#ffcc88'}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, 2, -2]} intensity={0.5} color="#C68642" />
      <pointLight position={[5, 1, 2]} intensity={0.3} color="#ff6633" />
      <spotLight
        position={[0, 8, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={isDark ? 1.5 : 1.0}
        color={isDark ? '#ffaa44' : '#ffe4b5'}
        castShadow
      />

      {/* Environment */}
      <Environment preset={isDark ? 'night' : 'sunset'} />

      {/* Stars (espresso mode only) */}
      {isDark && (
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
      )}

      {/* Main coffee cup - hero element */}
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <CoffeeCup
          position={[0, 0, 0]}
          scrollProgress={scrollProgress}
          isDark={isDark}
        />
      </Float>

      {/* Wooden table */}
      <WoodTable position={[0, -0.8, 0]} isDark={isDark} />

      {/* Floating coffee beans */}
      <FloatingBeans scrollProgress={scrollProgress} isDark={isDark} />

      {/* Ambient particles */}
      <AmbientParticles isDark={isDark} scrollProgress={scrollProgress} />

      {/* Background coffee bean sphere */}
      <mesh position={[-6, 3, -5]} castShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <MeshDistortMaterial
          color={isDark ? '#2d1607' : '#8B4513'}
          roughness={0.8}
          metalness={0.1}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.6}
        />
      </mesh>

      <mesh position={[6, 1, -3]} castShadow>
        <torusGeometry args={[0.8, 0.25, 8, 16]} />
        <meshStandardMaterial
          color={isDark ? '#3d1c02' : '#C68642'}
          roughness={0.9}
          metalness={0.05}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color={isDark ? '#1a0d04' : '#f5e6cc'}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </>
  )
}
