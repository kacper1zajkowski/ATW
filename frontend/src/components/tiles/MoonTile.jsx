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
      <ambientLight intensity={0.85} color="#8aa0c8" />
      <directionalLight position={[lightX, 1, lightZ]} intensity={2.6} color="#eef4ff" />
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
      icon={<Moon size={14} className="text-ink-2" />}
      idx={7}
      index={index}
    >
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <div className="shrink-0 w-32 h-32 sm:w-40 sm:h-40">
          <Canvas camera={{ position: [0, 0, 3], fov: 45 }} gl={{ alpha: true }}>
            <MoonSphere phaseIndex={moon.phaseIndex} />
          </Canvas>
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-lg font-semibold text-ink">{moon.phaseName}</p>
              <p className="text-sm text-ink-2">{moon.illumination}% illuminated</p>
            </div>
            <div className="flex gap-4 text-sm shrink-0">
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-label text-ink-3">Moonrise</p>
                <p className="mt-0.5 font-medium tabular-nums text-ink">{moon.moonrise}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-label text-ink-3">Moonset</p>
                <p className="mt-0.5 font-medium tabular-nums text-ink">{moon.moonset}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-label text-ink-3">Day {moon.age} of cycle</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
              <div
                className="h-full rounded-full bg-ink-2 transition-all duration-700"
                style={{ width: `${(moon.age / 29.53) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseTile>
  );
}
