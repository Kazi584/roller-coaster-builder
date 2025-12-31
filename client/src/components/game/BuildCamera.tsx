import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRollerCoaster } from "@/lib/stores/useRollerCoaster";

export function BuildCamera() {
  const { mode, isDraggingPoint, trackPoints, selectedPointId, cameraTarget, setCameraTarget } = useRollerCoaster();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  
  useEffect(() => {
    if (controlsRef.current && cameraTarget) {
      controlsRef.current.target.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);
      controlsRef.current.update();
    }
  }, [cameraTarget]);
  
  if (mode === "ride") return null;
  
  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isDraggingPoint}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={500}
      maxPolarAngle={Math.PI / 2 - 0.05}
      panSpeed={1.5}
      zoomSpeed={1.2}
    />
  );
}
