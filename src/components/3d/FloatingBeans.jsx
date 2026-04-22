import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function CoffeeBean({ position, rotation, scale, speed, phase, isDark }) {
  const ref = useRef()
  const beanColor = isDark ? '#3d1c02' : '#6B4226'
  const beanDark = isDark ? '#1a0d04' : '#4a2008'

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.3
    ref.current.rotation.x = rotation[0] + t * speed * 0.7
    ref.current.rotation.y = rotation[1] + t * speed * 0.5
    ref.current.rotation.z = rotation[2] + Math.sin(t * speed * 0.3) * 0.2
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Bean body */}
      <mesh>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color={beanColor} roughness={0.9} metalness={0} />
      </mesh>
      {/* Bean crease */}
      <mesh scale={[0.15, 0.9, 0.15]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color={beanDark} roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}

export default function FloatingBeans({ scrollProgress, isDark }) {
  const beans = useMemo(() => (
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 14,
        Math.random() * 6 - 1,
        (Math.random() - 0.5) * 10 - 2,
      ],
      rotation: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ],
      scale: (Math.random() * 0.04 + 0.02),
      speed: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }))
  ), [])

  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    // Slowly rotate entire bean field
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.05 + scrollProgress * 0.5
  })

  return (
    <group ref={groupRef}>
      {beans.map(bean => (
        <CoffeeBean
          key={bean.id}
          position={bean.position}
          rotation={bean.rotation}
          scale={bean.scale}
          speed={bean.speed}
          phase={bean.phase}
          isDark={isDark}
        />
      ))}
    </group>
  )
}
