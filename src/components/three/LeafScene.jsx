import { Canvas } from '@react-three/fiber';
import { useMemo, Suspense } from 'react';
import Leaf from './Leaf';

export default function LeafScene({ isSignup = false }) {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
        />
        <Suspense fallback={null}>
          <LeafParticles count={isSignup ? 20 : 15} />
          <GreenSphere />
        </Suspense>
      </Canvas>
    </div>
  );
}

function GreenSphere() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshPhysicalMaterial
        color="#339933"
        transmission={0.6}
        roughness={0.3}
        metalness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.3}
        opacity={0.7}
        transparent
      />
    </mesh>
  );
}

function LeafParticles({ count = 15 }) {
  const leafColors = ['#8DC63F', '#339933', '#1E5C1E', '#66A63D'];

  const leaves = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const radius = 5 + Math.random() * 2;
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
      const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      const z = (Math.random() - 0.5) * 4;

      return {
        position: [x, y, z],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        scale: 0.5 + Math.random() * 0.5,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        speed: 0.5 + Math.random() * 0.5
      };
    });
  }, [count]);

  return (
    <group>
      {leaves.map((leaf, i) => (
        <Leaf
          key={i}
          position={leaf.position}
          rotation={leaf.rotation}
          scale={leaf.scale}
          color={leaf.color}
          speed={leaf.speed}
        />
      ))}
    </group>
  );
}
