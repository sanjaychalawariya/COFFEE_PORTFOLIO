import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, MeshDistortMaterial, Caustics } from '@react-three/drei'
import * as THREE from 'three'

// ─── Procedural PBR textures baked into DataTextures ─────────────────────────

/** Build a tileable normal-map that mimics fine ceramic micro-bumps */
function makeCeramicNormal(size = 256) {
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      // multiple octaves of noise → normal
      const nx = Math.sin(x * 0.35 + y * 0.12) * 0.5 +
                 Math.sin(x * 1.1  - y * 0.9)  * 0.25 +
                 Math.sin(x * 3.3  + y * 2.7)  * 0.12
      const ny = Math.cos(x * 0.28 - y * 0.41) * 0.5 +
                 Math.cos(x * 0.9  + y * 1.2)  * 0.25 +
                 Math.cos(x * 2.8  - y * 3.1)  * 0.12
      data[i]     = Math.round((nx * 0.08 + 0.5) * 255)   // R → tangent X
      data[i + 1] = Math.round((ny * 0.08 + 0.5) * 255)   // G → tangent Y
      data[i + 2] = 255                                     // B → always up
      data[i + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  tex.needsUpdate = true
  return tex
}

/** Roughness map: slight variations so light scatters non-uniformly */
function makeCeramicRoughness(size = 256) {
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const v = 0.28 +
        Math.sin(x * 0.5 + y * 0.3) * 0.04 +
        Math.sin(x * 2.1 - y * 1.7) * 0.02
      const byte = Math.round(v * 255)
      data[i] = data[i + 1] = data[i + 2] = byte
      data[i + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  tex.needsUpdate = true
  return tex
}

/** Crema normal map: organic swirling foam texture */
function makeCreemaNormal(size = 128) {
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const cx = x / size - 0.5, cy = y / size - 0.5
      const angle = Math.atan2(cy, cx)
      const r = Math.sqrt(cx * cx + cy * cy)
      const swirl = angle + r * 8
      const nx = Math.sin(swirl * 3 + x * 0.2) * 0.3
      const ny = Math.cos(swirl * 2 - y * 0.2) * 0.3
      data[i]     = Math.round((nx + 0.5) * 255)
      data[i + 1] = Math.round((ny + 0.5) * 255)
      data[i + 2] = 255
      data[i + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.needsUpdate = true
  return tex
}

/** Latte-art colour map on the crema surface */
function makeCremaColor(size = 128) {
  const data = new Uint8Array(size * size * 4)
  // colours: rich amber → dark espresso → pale cream
  const palette = [
    [200, 118,  42],   // caramel
    [ 80,  32,   8],   // espresso
    [212, 168,  88],   // blonde
  ]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const cx = x / size - 0.5, cy = y / size - 0.5
      const r = Math.sqrt(cx * cx + cy * cy)
      const angle = Math.atan2(cy, cx)
      // rosetta-like swirl pattern
      const t = (Math.sin(angle * 4 + r * 12) * 0.5 + 0.5) * (1 - r * 1.5)
      const tClamped = Math.max(0, Math.min(1, t))
      const pIdx = tClamped < 0.5 ? 0 : tClamped < 0.8 ? 1 : 2
      const [R, G, B] = palette[pIdx]
      data[i]     = R
      data[i + 1] = G
      data[i + 2] = B
      data[i + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.needsUpdate = true
  return tex
}

// ─── Lathe profile helpers ────────────────────────────────────────────────────

/** Smooth espresso-cup silhouette using a lathe */
function makeCupProfile() {
  // points are [radius, height] — cup sits on y=0, opens upward
  return [
    new THREE.Vector2(0.0,   0.0),   // base center
    new THREE.Vector2(0.195, 0.0),   // base outer edge
    new THREE.Vector2(0.19,  0.02),  // base chamfer
    new THREE.Vector2(0.185, 0.06),
    new THREE.Vector2(0.19,  0.18),
    new THREE.Vector2(0.205, 0.32),
    new THREE.Vector2(0.225, 0.46),
    new THREE.Vector2(0.255, 0.56),
    new THREE.Vector2(0.275, 0.60),  // just below rim
    new THREE.Vector2(0.28,  0.615), // rim flare start
    new THREE.Vector2(0.285, 0.625), // rim tip
  ]
}

/** Saucer profile */
function makeSaucerProfile() {
  return [
    new THREE.Vector2(0.0,   0.0),
    new THREE.Vector2(0.22,  0.0),
    new THREE.Vector2(0.24,  0.01),
    new THREE.Vector2(0.55,  0.03),
    new THREE.Vector2(0.72,  0.055),
    new THREE.Vector2(0.76,  0.06),
    new THREE.Vector2(0.78,  0.05),
    new THREE.Vector2(0.78,  0.02),
    new THREE.Vector2(0.75,  0.0),
  ]
}

// ─── Steam ────────────────────────────────────────────────────────────────────

function SteamParticle({ seed, isDark }) {
  const ref = useRef()
  // each particle gets its own random trajectory baked at mount time
  const [ox, oz, speed, phase, drift] = useMemo(() => [
    (Math.random() - 0.5) * 0.18,
    (Math.random() - 0.5) * 0.18,
    0.28 + Math.random() * 0.18,
    Math.random() * Math.PI * 2,
    (Math.random() - 0.5) * 0.22,
  ], []) // eslint-disable-line

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (clock.getElapsedTime() * speed + phase) % 1
    const life = t < 0.15 ? t / 0.15 : t > 0.7 ? (1 - t) / 0.3 : 1
    ref.current.position.set(
      ox + Math.sin(t * Math.PI * 3 + phase) * drift,
      t * 1.8,
      oz + Math.cos(t * Math.PI * 2 + phase) * drift * 0.6
    )
    ref.current.material.opacity = life * (isDark ? 0.22 : 0.14)
    const s = 0.018 + t * 0.065
    ref.current.scale.setScalar(s)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 7, 7]} />
      <meshStandardMaterial
        color={isDark ? '#d8c8b0' : '#fffaf0'}
        transparent
        opacity={0}
        depthWrite={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}

function Steam({ isDark }) {
  return (
    <group position={[0, 0.63, 0]}>
      {Array.from({ length: 28 }, (_, i) => (
        <SteamParticle key={i} seed={i} isDark={isDark} />
      ))}
    </group>
  )
}

// ─── Main cup ─────────────────────────────────────────────────────────────────

export default function CoffeeCup({ position, scrollProgress, isDark }) {
  const groupRef  = useRef()
  const liquidRef = useRef()
  const glowRef   = useRef()
  const cremaRef  = useRef()

  // Bake all procedural textures once
  const ceramicNormal    = useMemo(() => makeCeramicNormal(),    [])
  const ceramicRoughness = useMemo(() => makeCeramicRoughness(), [])
  const cremaNormal      = useMemo(() => makeCreemaNormal(),     [])
  const cremaColor       = useMemo(() => makeCremaColor(),       [])

  // Lathe geometry for the cup body (smooth silhouette)
  const cupGeo = useMemo(() => {
    const geo = new THREE.LatheGeometry(makeCupProfile(), 72)
    geo.computeVertexNormals()
    return geo
  }, [])

  // Lathe geometry for the saucer
  const saucerGeo = useMemo(() => {
    const geo = new THREE.LatheGeometry(makeSaucerProfile(), 72)
    geo.computeVertexNormals()
    return geo
  }, [])

  // Crema disk with slight radial subdivision for the distort shader
  const cremaDiskGeo = useMemo(() => {
    const geo = new THREE.CircleGeometry(0.245, 48, 0, Math.PI * 2)
    geo.computeVertexNormals()
    return geo
  }, [])

  // Coffee liquid surface — slightly concave disk
  const liquidGeo = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 32; i++) {
      const r = (i / 32) * 0.245
      // very slight concavity (0.008 dip at centre) = meniscus
      const h = -Math.pow(r / 0.245, 2) * 0.008
      pts.push(new THREE.Vector2(r, h))
    }
    const geo = new THREE.LatheGeometry(pts, 64)
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    // Gentle breathing sway
    groupRef.current.rotation.y = Math.sin(t * 0.42) * 0.04

    // Scale back gracefully as user scrolls past hero
    const heroFade = Math.max(0, 1 - scrollProgress * 3.5)
    groupRef.current.scale.setScalar(0.82 + heroFade * 0.38)

    // Liquid: animated env-map-like roughness flicker
    if (liquidRef.current?.material) {
      liquidRef.current.material.roughness = 0.04 + Math.abs(Math.sin(t * 1.8)) * 0.06
    }

    // Crema: very slow rotation for the latte-art pattern
    if (cremaRef.current) {
      cremaRef.current.rotation.z = t * 0.04
    }

    // Floor glow pulse
    if (glowRef.current?.material) {
      glowRef.current.material.opacity = (0.18 + Math.sin(t * 1.3) * 0.06) * heroFade
    }
  })

  // Colour palette
  const C = {
    ceramic:    isDark ? '#e8e0d8' : '#f5f0ea',   // off-white porcelain
    ceramicDark:isDark ? '#c8c0b4' : '#ddd5c8',   // shadow side of porcelain
    gold:        '#c8a060',                         // thin gold band
    liquid:      '#1c0a02',                         // very dark espresso
    saucer:     isDark ? '#e2dbd2' : '#ede7df',
    glow:        '#ff7722',
  }

  return (
    <group ref={groupRef} position={position}>

      {/* ── Floor glow ── */}
      <mesh ref={glowRef} position={[0, -0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1.6, 48]} />
        <meshBasicMaterial
          color={C.glow}
          transparent
          opacity={0.18}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Saucer ── */}
      <group position={[0, -0.82, 0]}>
        <mesh geometry={saucerGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color={C.saucer}
            roughness={0.28}
            metalness={0.04}
            normalMap={ceramicNormal}
            normalScale={new THREE.Vector2(0.4, 0.4)}
            roughnessMap={ceramicRoughness}
            envMapIntensity={0.9}
          />
        </mesh>
        {/* thin gold rim ring on saucer */}
        <mesh position={[0, 0.058, 0]}>
          <torusGeometry args={[0.74, 0.006, 8, 72]} />
          <meshStandardMaterial color={C.gold} roughness={0.2} metalness={0.8} envMapIntensity={1.2} />
        </mesh>
      </group>

      {/* ── Cup body (lathe) ── */}
      <group position={[0, -0.82 + 0.002, 0]}>
        <mesh geometry={cupGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color={C.ceramic}
            roughness={0.26}
            metalness={0.03}
            normalMap={ceramicNormal}
            normalScale={new THREE.Vector2(0.5, 0.5)}
            roughnessMap={ceramicRoughness}
            envMapIntensity={1.1}
          />
        </mesh>

        {/* Inner wall — slightly darker, matte */}
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.238, 0.175, 0.56, 48, 1, true]} />
          <meshStandardMaterial
            color={C.ceramicDark}
            roughness={0.55}
            metalness={0.0}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Gold accent band 1/3 from bottom */}
        <mesh position={[0, 0.18, 0]}>
          <torusGeometry args={[0.198, 0.004, 8, 64]} />
          <meshStandardMaterial color={C.gold} roughness={0.15} metalness={0.85} envMapIntensity={1.4} />
        </mesh>

        {/* ── Handle — swept tube path ── */}
        <HandleMesh color={C.ceramic} ceramicNormal={ceramicNormal} />

        {/* ── Coffee liquid surface (meniscus) ── */}
        <mesh ref={liquidRef} geometry={liquidGeo} position={[0, 0.565, 0]}>
          <meshStandardMaterial
            color={C.liquid}
            roughness={0.05}
            metalness={0.0}
            envMapIntensity={2.5}
          />
        </mesh>

        {/* ── Crema — latte art ── */}
        <mesh ref={cremaRef} geometry={cremaDiskGeo} position={[0, 0.572, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <MeshDistortMaterial
            map={cremaColor}
            normalMap={cremaNormal}
            normalScale={new THREE.Vector2(0.35, 0.35)}
            roughness={0.92}
            metalness={0.0}
            distort={0.04}
            speed={0.6}
          />
        </mesh>
      </group>

      {/* ── Steam ── */}
      <group position={[0, -0.82, 0]}>
        <Steam isDark={isDark} />
      </group>
    </group>
  )
}

// ─── Realistic D-ring handle built from a TubeGeometry along a custom curve ──

function HandleMesh({ color, ceramicNormal }) {
  const geo = useMemo(() => {
    // D-shape curve offset to the right of the cup
    class HandleCurve extends THREE.Curve {
      getPoint(t) {
        const angle = t * Math.PI  // 0 → π (semi-circle)
        const r = 0.115
        const cx = 0.268           // x offset from cup centre
        const yMid = 0.30          // vertical midpoint on cup
        return new THREE.Vector3(
          cx + Math.cos(angle - Math.PI / 2) * r * 0.7,
          yMid + Math.sin(angle - Math.PI / 2) * r,
          Math.sin(angle * 2) * 0.008   // tiny z-wobble for realism
        )
      }
    }
    const path = new HandleCurve()
    const g = new THREE.TubeGeometry(path, 32, 0.022, 10, false)
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial
        color={color}
        roughness={0.30}
        metalness={0.03}
        normalMap={ceramicNormal}
        normalScale={new THREE.Vector2(0.3, 0.3)}
        envMapIntensity={0.9}
      />
    </mesh>
  )
}
