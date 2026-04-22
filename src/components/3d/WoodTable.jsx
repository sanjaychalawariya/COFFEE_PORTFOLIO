import { useMemo } from 'react'
import * as THREE from 'three'

export default function WoodTable({ position, isDark }) {
  const woodColor = isDark ? '#3d1c02' : '#8B5E3C'
  const woodDark = isDark ? '#2d1607' : '#6B4226'
  const legColor = isDark ? '#2d1607' : '#5C3317'

  return (
    <group position={position}>
      {/* Table top */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4, 0.12, 2.5]} />
        <meshStandardMaterial
          color={woodColor}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Table top edge highlight */}
      <mesh position={[0, 0.065, 0]}>
        <boxGeometry args={[4.02, 0.01, 2.52]} />
        <meshStandardMaterial color={woodDark} roughness={0.4} />
      </mesh>

      {/* Wood grain lines */}
      {[-0.6, -0.2, 0.2, 0.6].map((z, i) => (
        <mesh key={i} position={[0, 0.062, z]}>
          <boxGeometry args={[3.9, 0.005, 0.01]} />
          <meshStandardMaterial color={woodDark} roughness={1} transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Legs */}
      {[[-1.7, -0.4, 1.0], [1.7, -0.4, 1.0], [-1.7, -0.4, -1.0], [1.7, -0.4, -1.0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.055, 0.07, 0.65, 8]} />
          <meshStandardMaterial color={legColor} roughness={0.7} />
        </mesh>
      ))}

      {/* Coffee stain ring */}
      <mesh position={[0.6, 0.063, 0.3]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <ringGeometry args={[0.12, 0.155, 32]} />
        <meshStandardMaterial
          color={isDark ? '#1a0d04' : '#4a2008'}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[-0.5, 0.063, -0.2]} rotation={[-Math.PI / 2, 0, -0.5]}>
        <ringGeometry args={[0.09, 0.115, 32]} />
        <meshStandardMaterial
          color={isDark ? '#1a0d04' : '#4a2008'}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
