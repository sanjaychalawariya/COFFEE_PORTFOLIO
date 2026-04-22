import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AmbientParticles({ isDark, scrollProgress }) {
  const pointsRef = useRef()

  const [positions, velocities] = useMemo(() => {
    const count = 200
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = Math.random() * 8 - 1
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2

      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = Math.random() * 0.003 + 0.001
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001
    }

    return [pos, vel]
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3] += velocities[i * 3]
      pos[i * 3 + 1] += velocities[i * 3 + 1]
      pos[i * 3 + 2] += velocities[i * 3 + 2]

      // Wrap around
      if (pos[i * 3 + 1] > 8) {
        pos[i * 3 + 1] = -1
        pos[i * 3] = (Math.random() - 0.5) * 20
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  const color = isDark ? '#ff9944' : '#C68642'

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.04}
        sizeAttenuation
        transparent
        opacity={isDark ? 0.6 : 0.3}
        depthWrite={false}
      />
    </points>
  )
}
