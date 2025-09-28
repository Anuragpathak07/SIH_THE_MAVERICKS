import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import * as THREE from 'three';

// Function to check WebGL support
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(gl && (gl as WebGLRenderingContext).getExtension);
  } catch (e) {
    return false;
  }
}

interface GLBModelProps {
  url: string;
  onLoad: () => void;
}

function GLBModel({ url, onLoad }: GLBModelProps) {
  try {
    const { scene } = useGLTF(url);
    
    // Call onLoad when model is ready
    useEffect(() => {
      if (scene) {
        console.log('GLB model loaded successfully:', url);
        onLoad();
      }
    }, [scene, onLoad]);
    
    return <primitive object={scene} scale={[0.1, 0.1, 0.1]} />;
  } catch (error) {
    console.error('Error loading GLB model:', error);
    return (
      <mesh>
        <boxGeometry args={[10, 10, 10]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }
}

interface GLBViewerProps {
  modelPath: string;
  className?: string;
  cameraTarget?: number[];
}

export const GLBViewer = ({ modelPath, className, cameraTarget }: GLBViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [webGLError, setWebGLError] = useState(false);
  const controlsRef = useRef<any>(null);
  
  console.log('GLBViewer rendering with modelPath:', modelPath);
  
  // Check WebGL support on mount
  useEffect(() => {
    if (!isWebGLSupported()) {
      setWebGLError(true);
      setIsLoading(false);
    }
  }, []);
  
  const handleModelLoad = () => {
    console.log('Model load callback triggered');
    setIsLoading(false);
  };

  // Reset loading state when model path changes
  useEffect(() => {
    console.log('Model path changed, setting loading to true');
    setIsLoading(true);
  }, [modelPath]);

  // Handle camera target changes
  useEffect(() => {
    if (cameraTarget && controlsRef.current) {
      const target = new THREE.Vector3(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
      controlsRef.current.target.copy(target);
      controlsRef.current.update();
    }
  }, [cameraTarget]);

  // Show WebGL error fallback
  if (webGLError) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted/50 rounded-lg border border-border`}>
        <div className="flex flex-col items-center space-y-4 text-center p-8">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">3D View Not Available</h3>
            <p className="text-muted-foreground max-w-md">
              WebGL is not supported or enabled in your browser. The 3D mine visualization requires WebGL to display properly.
            </p>
          </div>
          <div className="w-full h-48 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-lg border border-dashed border-border/50 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">3D Mine Model Preview</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [50, 50, 50], fov: 60 }}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          // Additional WebGL checks
          try {
            gl.getContext();
          } catch (error) {
            console.error('WebGL context error:', error);
            setWebGLError(true);
          }
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
          setWebGLError(true);
        }}
        onPointerMissed={() => {
          // Allow scrolling when clicking outside of 3D objects
          document.body.style.overflow = 'auto';
        }}
      >
        <Suspense 
          fallback={
            <mesh>
              <boxGeometry args={[5, 5, 5]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          }
        >
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          {/* Test with a simple box first */}
          <mesh>
            <boxGeometry args={[10, 10, 10]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          <GLBModel url={modelPath} onLoad={handleModelLoad} />
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={200}
            minDistance={10}
            enableDamping={true}
            dampingFactor={0.05}
            makeDefault
          />
        </Suspense>
      </Canvas>
      
      {/* Loading overlay - only show when loading */}
      {isLoading && !webGLError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg font-medium">Loading 3D Model...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Preload the models
useGLTF.preload('/chuquicamata_mine_chile.glb');
useGLTF.preload('/the_bingham_canyon_mine_-_utah.glb');
useGLTF.preload('/toquepala_mine_-_peru.glb');