import { useRef, useEffect } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Moon } from 'lucide-react';
import { BaseTile } from './BaseTile';

const BASELINE_VY = 0.25;
const DRAG_SENSITIVITY = 0.008;
const IMPULSE_DECAY = 1.0;
const FLICK_WINDOW_MS = 100;

function MoonSphere({ phaseIndex }) {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, '/moon-color.jpg');
  const { gl } = useThree();

  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, t: 0 });
  const recent = useRef([]);
  const impulse = useRef(0);

  const angle = Math.PI * (1 - phaseIndex / 4);
  const lightX = Math.sin(angle) * 3;
  const lightZ = Math.cos(angle) * 3;

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.cursor = 'grab';

    const onDown = (e) => {
      dragging.current = true;
      lastPointer.current = { x: e.clientX, t: performance.now() };
      recent.current = [];
      canvas.style.cursor = 'grabbing';
    };

    const onMove = (e) => {
      if (!dragging.current || !meshRef.current) return;
      const now = performance.now();
      const dx = e.clientX - lastPointer.current.x;

      meshRef.current.rotation.y += dx * DRAG_SENSITIVITY;

      recent.current.push({ dx, t: now });
      while (recent.current.length && now - recent.current[0].t > FLICK_WINDOW_MS) {
        recent.current.shift();
      }
      lastPointer.current = { x: e.clientX, t: now };
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      canvas.style.cursor = 'grab';

      if (recent.current.length > 0) {
        const now = performance.now();
        const windowMs = now - recent.current[0].t;
        if (windowMs > 0) {
          let totalDx = 0;
          for (const m of recent.current) totalDx += m.dx;
          impulse.current += (totalDx / windowMs) * 1000 * DRAG_SENSITIVITY;
        }
      }
      recent.current = [];
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onUp);
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!meshRef.current || dragging.current) return;

    meshRef.current.rotation.y += (BASELINE_VY + impulse.current) * delta;
    impulse.current *= Math.exp(-IMPULSE_DECAY * delta);
  });

  return (
    <>
      <ambientLight intensity={0.08} color="#2a3f6f" />
      <directionalLight position={[lightX, 1, lightZ]} intensity={1.6} color="#c8dcff" />
      <mesh ref={meshRef}>
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
