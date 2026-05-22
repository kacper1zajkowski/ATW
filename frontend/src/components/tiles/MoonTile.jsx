import { useRef, useEffect } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Moon } from 'lucide-react';
import { BaseTile } from './BaseTile';

function MoonSphere({ phaseIndex }) {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, '/moon-color.jpg');
  const dragging = useRef(false);
  const prev = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  const angle = Math.PI * (1 - phaseIndex / 4);
  const lightX = Math.sin(angle) * 3;
  const lightZ = Math.cos(angle) * 3;

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.cursor = 'grab';

    const onMove = (e) => {
      if (!dragging.current || !meshRef.current) return;
      const dx = e.clientX - prev.current.x;
      const dy = e.clientY - prev.current.y;
      vel.current = { x: dx * 0.01, y: dy * 0.01 };
      meshRef.current.rotation.y += vel.current.x;
      meshRef.current.rotation.x += vel.current.y;
      prev.current = { x: e.clientX, y: e.clientY };
    };

    const onUp = () => {
      dragging.current = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onUp);
    return () => {
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (dragging.current) return;

    const speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2);
    if (speed > 0.0005) {
      // inertia decay after releasing
      meshRef.current.rotation.y += vel.current.x;
      meshRef.current.rotation.x += vel.current.y;
      vel.current.x *= 0.92;
      vel.current.y *= 0.92;
    } else {
      // auto-rotate + slowly level out X tilt
      vel.current = { x: 0, y: 0 };
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x *= 0.97;
    }
  });

  return (
    <>
      <ambientLight intensity={0.08} color="#2a3f6f" />
      <directionalLight position={[lightX, 1, lightZ]} intensity={1.6} color="#c8dcff" />
      <mesh
        ref={meshRef}
        onPointerDown={(e) => {
          vel.current = { x: 0, y: 0 };
          dragging.current = true;
          prev.current = { x: e.clientX, y: e.clientY };
          gl.domElement.style.cursor = 'grabbing';
        }}
      >
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </>
  );
}

export function MoonTile({ moon, index }) {
  if (!moon) return null;

  return (
    <BaseTile
      title="Moon phase"
      icon={<Moon size={14} className="text-slate-300" />}
      accentColor="border-l-slate-400"
      index={index}
    >
      <div className="flex gap-4 items-center">
        <div className="shrink-0" style={{ width: 160, height: 160 }}>
          <Canvas camera={{ position: [0, 0, 3], fov: 45 }} gl={{ alpha: true }}>
            <MoonSphere phaseIndex={moon.phaseIndex} />
          </Canvas>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-slate-100">{moon.phaseName}</p>
              <p className="text-sm text-slate-400">{moon.illumination}% illuminated</p>
            </div>
            <div className="flex gap-4 text-sm shrink-0">
              <div className="text-right">
                <p className="text-slate-500">Moonrise</p>
                <p className="font-medium text-slate-200">{moon.moonrise}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Moonset</p>
                <p className="font-medium text-slate-200">{moon.moonset}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-500 mb-1.5">Day {moon.age} of cycle</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-slate-300 transition-all duration-700"
                style={{ width: `${(moon.age / 29.53) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseTile>
  );
}
