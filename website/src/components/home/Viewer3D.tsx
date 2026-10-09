import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Bounds,
  Center,
  Environment,
  Grid,
} from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

useGLTF.preload("/models/house.glb");

export default function Viewer3D({
  url,
  zoomEnabled,
}: {
  url: string;
  zoomEnabled: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [12, 10, 12], fov: 28 }} // narrow fov = near-isometric look
      dpr={[1, 2]}
      className="cursor-grab active:cursor-grabbing"
    >
      <color attach="background" args={["#1c2028"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} />

      <Suspense fallback={null}>
        {/* Bounds zooms the camera so the whole model fits the box */}
        <Bounds fit clip observe margin={1.25}>
          <Center top>
            <Model url={url} />
          </Center>
        </Bounds>
        <Environment preset="city" />
      </Suspense>

      {/* CAD-style grid, like your screenshot */}
      <Grid
        infiniteGrid
        cellSize={1}
        cellThickness={0.6}
        cellColor="#2b3445"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3a4760"
        fadeDistance={80}
        fadeStrength={1.5}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={zoomEnabled}
        maxPolarAngle={Math.PI / 2.05} // can't go under the ground
      />
    </Canvas>
  );
}