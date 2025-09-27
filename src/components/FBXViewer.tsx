
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface FBXViewerProps {
  isTalking?: boolean;
  className?: string;
}

export default function FBXViewer({ isTalking = false, className = "" }: FBXViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const currentModelRef = useRef<any>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const initializedRef = useRef(false);
  const talkingActiveRef = useRef(false);

  // Animation model names
  const talkingModels = [
    "Talking.fbx",
    "Talking-2.fbx",
    "Talking-3.fbx",
    "Talking4.fbx",
  ];
  const idleModel = "Idle.fbx";

  // Helper: Setup model
  function setupModel(fbx: any) {
    fbx.scale.setScalar(0.035);
    fbx.position.set(0, -2.2, 0);
    fbx.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const defaultMaterial = new THREE.MeshPhongMaterial({ color: 0x8888aa, shininess: 30 });
          if (child.material.map && !child.material.map.image) {
            child.material = defaultMaterial;
          }
        }
      }
    });
  }

  // Helper: Get random talking model
  function getRandomModel() {
    if (talkingModels.length <= 1) return talkingModels[0];
    let randomModel;
    do {
      randomModel = talkingModels[Math.floor(Math.random() * talkingModels.length)];
    } while (randomModel === currentModelRef.current?.userData?.modelName && talkingModels.length > 1);
    return randomModel;
  }

  // Helper: Show fallback cube
  function showFallbackCube() {
    const scene = sceneRef.current;
    if (!scene) return;
    const geometry = new THREE.BoxGeometry(1, 2, 0.5);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    scene.add(cube);
  }

  // Helper: Load FBX model
  function loadModel(modelName: string, isIdle: boolean = false) {
    import("three/examples/jsm/loaders/FBXLoader.js").then(({ FBXLoader }) => {
      const loader = new FBXLoader();
      const fullPath = `/models/actions/${modelName}`;
      loader.load(
        fullPath,
        (fbx: any) => {
          const scene = sceneRef.current;
          if (!scene) return;
          // Remove previous model
          if (currentModelRef.current) {
            scene.remove(currentModelRef.current);
            if (mixerRef.current) mixerRef.current.stopAllAction();
          }
          setupModel(fbx);
          fbx.userData.modelName = modelName;
          scene.add(fbx);
          currentModelRef.current = fbx;
          // Setup animation
          if (fbx.animations.length > 0) {
            mixerRef.current = new THREE.AnimationMixer(fbx);
            const action = mixerRef.current.clipAction(fbx.animations[0]);
            action.play();
            const duration = action.getClip().duration;
            if (animationTimeoutRef.current) {
              clearTimeout(animationTimeoutRef.current);
            }
            if (isIdle) {
              action.setLoop(THREE.LoopRepeat, Infinity);
            } else {
              // Schedule next talking animation
              const switchDelay = (duration + 1.5) * 1000;
              animationTimeoutRef.current = setTimeout(() => {
                if (talkingActiveRef.current) {
                  const nextModel = getRandomModel();
                  loadModel(nextModel);
                }
              }, switchDelay);
            }
          }
        },
        undefined,
        (error: any) => {
          if (!isIdle) {
            const nextModel = getRandomModel();
            if (nextModel !== modelName) {
              setTimeout(() => loadModel(nextModel), 1000);
            } else {
              showFallbackCube();
            }
          } else {
            showFallbackCube();
          }
        }
      );
    });
  }

  // Helper: Animation/render loop
  function animate() {
    animationFrameRef.current = requestAnimationFrame(animate);
    if (mixerRef.current) {
      mixerRef.current.update(0.016);
    }
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Helper: Resize handler
  function handleResize() {
    const mount = mountRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (mount && renderer && camera) {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
    }
  }

  // Mount/init logic
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mountRef.current || initializedRef.current) return;
    initializedRef.current = true;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.0, 2.8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 4, 3);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-2, 2, 2);
    scene.add(fillLight);

    // Start animation loop
    animate();

    // Initial animation state
    talkingActiveRef.current = isTalking;
    if (isTalking) {
      const firstModel = getRandomModel();
      loadModel(firstModel);
    } else {
      loadModel(idleModel, true);
    }

    // Resize handler
    window.addEventListener("resize", handleResize);
    setTimeout(() => handleResize(), 100);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {}
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      initializedRef.current = false;
    };
  }, [isClient]);

  // Respond to isTalking prop changes
  useEffect(() => {
    if (!initializedRef.current) return;
    talkingActiveRef.current = isTalking;
    if (isTalking) {
      const nextModel = getRandomModel();
      loadModel(nextModel);
    } else {
      loadModel(idleModel, true);
    }
  }, [isTalking]);

  // Show loading state during SSR and initial client load
  if (!isClient) {
    return (
      <div
        className={`w-full h-[500px] rounded-lg overflow-hidden bg-gray-900 ${className} flex items-center justify-center`}
        style={{ minHeight: "500px" }}
      >
        <div className="text-white text-lg">Loading 3D Model...</div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`w-full h-[500px] rounded-lg overflow-hidden bg-transparent ${className}`}
      style={{
        minHeight: "500px",
        pointerEvents: "none",
        userSelect: "none"
      }}
    ></div>
  );
}