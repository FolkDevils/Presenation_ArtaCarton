import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import Preloader from "../Preloader";
import { defaultTheme } from "../../utils/theme";

interface ModelViewerProps {
  texturePath: string;
}

export default function ModelViewer({ texturePath }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadProgress, setLoadProgress] = React.useState(0);
  const [isFolded, setIsFolded] = React.useState(false);
  const [containerDimensions, setContainerDimensions] = React.useState({ width: 0, height: 0 });

  // Store initial camera and controls state
  const initialStateRef = useRef<{
    cameraPosition: THREE.Vector3;
    controlsTarget: THREE.Vector3;
  }>({
    cameraPosition: new THREE.Vector3(4, 0, 0),
    controlsTarget: new THREE.Vector3(0, 0, 0)
  });

  // Add state for storing folded position
  const foldedStateRef = useRef<{
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    meshRotations: Map<THREE.Mesh, { x: number; y: number; z: number }>;
  }>({
    position: { x: -4.844, y: 0, z: 0.835 },
    rotation: { x: 0, y: 0, z: 0 },
    meshRotations: new Map()
  });

  // Reset fold state when texture changes
  useEffect(() => {
    setIsFolded(false);
  }, [texturePath]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera setup with fixed FOV
    const camera = new THREE.PerspectiveCamera(
      45,
      16 / 9,
      0.1,
      1000
    );
    camera.position.copy(initialStateRef.current.cameraPosition);
    camera.lookAt(initialStateRef.current.controlsTarget);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.copy(initialStateRef.current.controlsTarget);
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
    controlsRef.current = controls;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 10;
    directionalLight.shadow.bias = -0.001;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1);
    fillLight.position.set(-2, 0, -2);
    scene.add(fillLight);

    // Add shadow-catching plane
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({
        opacity: 0.2,
        transparent: true,
        color: 0x000000
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const parentWidth = window.innerWidth;
      const parentHeight = window.innerHeight;
      
      let width = parentWidth;
      let height = parentWidth * (9/16);
      
      if (height > parentHeight) {
        height = parentHeight;
        width = parentHeight * (16/9);
      }

      setContainerDimensions({ width, height });
      rendererRef.current.setSize(width, height, false);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Load texture and model
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath);
    
    texture.flipY = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.colorSpace = THREE.SRGBColorSpace;

    const colorCorrection = {
      saturation: 1,
      contrast: 1,
      brightness: 1
    };

    const loader = new GLTFLoader();
    loader.load(
      "/case.gltf",
      (gltf: GLTF) => {
        const model = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.sub(center);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.multiplyScalar(scale);
        
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            foldedStateRef.current.meshRotations.set(child, {
              x: child.rotation.x,
              y: child.rotation.y,
              z: child.rotation.z
            });
            
            child.rotation.set(0, 0, 0);
            
            const material = new THREE.MeshStandardMaterial({
              map: texture,
              metalness: 0.1,
              roughness: 0.7
            });
            
            child.castShadow = true;
            child.receiveShadow = true;

            material.onBeforeCompile = (shader) => {
              shader.uniforms.saturation = { value: colorCorrection.saturation };
              shader.uniforms.contrast = { value: colorCorrection.contrast };
              shader.uniforms.brightness = { value: colorCorrection.brightness };

              shader.fragmentShader = `
                uniform float saturation;
                uniform float contrast;
                uniform float brightness;
                ${shader.fragmentShader}
              `.replace(
                '#include <map_fragment>',
                `
                #include <map_fragment>
                
                #ifdef USE_MAP
                  vec3 color = diffuseColor.rgb;
                  color *= brightness;
                  color = (color - 0.5) * contrast + 0.5;
                  float gray = dot(color, vec3(0.299, 0.587, 0.114));
                  color = mix(vec3(gray), color, saturation);
                  diffuseColor.rgb = color;
                #endif
                `
              );
            };

            child.material = material;
          }
        });
        
        model.position.set(-2.464, 0, 5.315);
        model.rotation.set(0, 1.56, 0);
        
        // Remove previous model if it exists
        if (modelRef.current) {
          modelRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              if (child.material instanceof THREE.Material) {
                child.material.dispose();
              }
            }
          });
          scene.remove(modelRef.current);
        }
        
        scene.add(model);
        modelRef.current = model;
        setIsLoading(false);
        
        // Start animation loop after model is loaded
        animate();
      },
      (progress) => {
        const percentage = (progress.loaded / (progress.total || 1)) * 100;
        setLoadProgress(percentage);
      },
      (error: unknown) => {
        console.error("Error loading model:", error);
      }
    );

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();

      // Store ref value
      const container = containerRef.current;

      // Cleanup scene
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
        scene.remove(modelRef.current);
      }

      // Dispose of texture
      if (texture) {
        texture.dispose();
      }

      // Cleanup renderer
      if (container && rendererRef.current) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [texturePath]);

  const toggleFold = () => {
    if (!modelRef.current || !cameraRef.current || !controlsRef.current) return;
    
    setIsFolded(!isFolded);
    
    if (isFolded) {
      // Unfold - animate to unfolded position
      gsap.to(modelRef.current.position, {
        x: -2.464,
        y: 0,
        z: 5.315,
        duration: 2,
        ease: "power2.inOut"
      });
      
      gsap.to(modelRef.current.rotation, {
        x: 0,
        y: 1.56,
        z: 0,
        duration: 2,
        ease: "power2.inOut"
      });
      
      // Reset camera and controls to initial position
      gsap.to(cameraRef.current.position, {
        x: initialStateRef.current.cameraPosition.x,
        y: initialStateRef.current.cameraPosition.y,
        z: initialStateRef.current.cameraPosition.z,
        duration: 2,
        ease: "power2.inOut"
      });

      gsap.to(controlsRef.current.target, {
        x: initialStateRef.current.controlsTarget.x,
        y: initialStateRef.current.controlsTarget.y,
        z: initialStateRef.current.controlsTarget.z,
        duration: 2,
        ease: "power2.inOut"
      });
      
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          gsap.to(child.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2,
            ease: "power2.inOut"
          });
        }
      });
    } else {
      // Store current camera position before folding
      initialStateRef.current.cameraPosition.copy(cameraRef.current.position);
      initialStateRef.current.controlsTarget.copy(controlsRef.current.target);

      // Fold - animate to folded position
      gsap.to(modelRef.current.position, {
        x: foldedStateRef.current.position.x,
        y: foldedStateRef.current.position.y,
        z: foldedStateRef.current.position.z,
        duration: 2,
        ease: "power2.inOut"
      });
      
      gsap.to(modelRef.current.rotation, {
        x: foldedStateRef.current.rotation.x,
        y: foldedStateRef.current.rotation.y,
        z: foldedStateRef.current.rotation.z,
        duration: 2,
        ease: "power2.inOut"
      });
      
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const foldedRotation = foldedStateRef.current.meshRotations.get(child);
          if (foldedRotation) {
            gsap.to(child.rotation, {
              x: foldedRotation.x,
              y: foldedRotation.y,
              z: foldedRotation.z,
              duration: 2,
              ease: "power2.inOut"
            });
          }
        }
      });
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <button
        onClick={toggleFold}
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-xs font-light tracking-wider transition-colors text-white z-10 ${defaultTheme.fonts.body}`}
      >
        {isFolded ? 'UNFOLD' : 'FOLD'}
      </button>
      <div 
        ref={containerRef} 
        style={{
          width: `${containerDimensions.width}px`,
          height: `${containerDimensions.height}px`,
          position: 'relative'
        }}
      >
        {isLoading && <Preloader progress={loadProgress} isLoading={isLoading} />}
      </div>
    </div>
  );
} 