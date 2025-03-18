import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Preloader from "../Preloader";

// Control Panel Component
const ControlPanel = ({ onButtonPress, onButtonRelease }) => {
  const buttonStyle = {
    width: "45px",
    height: "45px",
    backgroundColor: "rgba(40, 40, 40, 0.9)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "system-ui",
    userSelect: "none",
    position: "relative",
    top: "-4px",
    transition: "all 40ms linear",
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.3) inset, 0 0 0 2px rgba(255, 255, 255, 0.15) inset, 0 6px 0 0 rgba(60, 60, 60, 0.7), 0 6px 6px 1px rgba(0, 0, 0, .2)",
  };

  const activeButtonStyle = {
    top: "2px",
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.3) inset, 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 1px 3px 1px rgba(0, 0, 0, .2)",
  };

  // State to track pressed buttons
  const [pressedButtons, setPressedButtons] = useState({});

  // Helper function to merge styles
  const mergeStyles = (...styles) => Object.assign({}, ...styles);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        left: "30px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 45px)",
        gap: "5px",
        padding: "15px",
        borderRadius: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        touchAction: "none",
      }}
    >
      <div></div>
      <button
        onMouseDown={() => {
          setPressedButtons(prev => ({ ...prev, forward: true }));
          onButtonPress("forward");
        }}
        onMouseUp={() => {
          setPressedButtons(prev => ({ ...prev, forward: false }));
          onButtonRelease("forward");
        }}
        onTouchStart={() => {
          setPressedButtons(prev => ({ ...prev, forward: true }));
          onButtonPress("forward");
        }}
        onTouchEnd={() => {
          setPressedButtons(prev => ({ ...prev, forward: false }));
          onButtonRelease("forward");
        }}
        style={mergeStyles(buttonStyle, pressedButtons["forward"] && activeButtonStyle)}
        title="Move Forward"
      >
        ↑
      </button>
      <div></div>

      <button
        onMouseDown={() => {
          setPressedButtons(prev => ({ ...prev, left: true }));
          onButtonPress("left");
        }}
        onMouseUp={() => {
          setPressedButtons(prev => ({ ...prev, left: false }));
          onButtonRelease("left");
        }}
        onTouchStart={() => {
          setPressedButtons(prev => ({ ...prev, left: true }));
          onButtonPress("left");
        }}
        onTouchEnd={() => {
          setPressedButtons(prev => ({ ...prev, left: false }));
          onButtonRelease("left");
        }}
        style={mergeStyles(buttonStyle, pressedButtons["left"] && activeButtonStyle)}
        title="Move Left"
      >
        ←
      </button>
      <div style={{ ...buttonStyle, backgroundColor: "rgba(30, 30, 30, 0.9)" }}></div>
      <button
        onMouseDown={() => {
          setPressedButtons(prev => ({ ...prev, right: true }));
          onButtonPress("right");
        }}
        onMouseUp={() => {
          setPressedButtons(prev => ({ ...prev, right: false }));
          onButtonRelease("right");
        }}
        onTouchStart={() => {
          setPressedButtons(prev => ({ ...prev, right: true }));
          onButtonPress("right");
        }}
        onTouchEnd={() => {
          setPressedButtons(prev => ({ ...prev, right: false }));
          onButtonRelease("right");
        }}
        style={mergeStyles(buttonStyle, pressedButtons["right"] && activeButtonStyle)}
        title="Move Right"
      >
        →
      </button>

      <div></div>
      <button
        onMouseDown={() => {
          setPressedButtons(prev => ({ ...prev, backward: true }));
          onButtonPress("backward");
        }}
        onMouseUp={() => {
          setPressedButtons(prev => ({ ...prev, backward: false }));
          onButtonRelease("backward");
        }}
        onTouchStart={() => {
          setPressedButtons(prev => ({ ...prev, backward: true }));
          onButtonPress("backward");
        }}
        onTouchEnd={() => {
          setPressedButtons(prev => ({ ...prev, backward: false }));
          onButtonRelease("backward");
        }}
        style={mergeStyles(buttonStyle, pressedButtons["backward"] && activeButtonStyle)}
        title="Move Backward"
      >
        ↓
      </button>
      <div></div>
    </div>
  );
};

// Start Button Component
const FoldButton = ({ onClick, disabled, isFolded }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: "fixed",
        bottom: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "15px 30px",
        fontSize: "24px",
        backgroundColor: "#ffd000",
        color: "#650049",
        border: "none",
        borderRadius: "8px",
        cursor: disabled ? "default" : "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        opacity: disabled ? 0.7 : 1,
        fontWeight: "700",
        fontFamily: "Rubik, sans-serif"
      }}
    >
      {isFolded ? "UNFOLD" : "FOLD"}
    </button>
  );
};

export default function PaperAirplaneScene() {
  const mountRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const modelRef = useRef(null);
  const initialPositionRef = useRef(null);
  const mixerRef = useRef(null);
  const [isFolded, setIsFolded] = useState(false);
  const windTimeRef = useRef(0);
  const velocityRef = useRef({ x: 0, z: 0 });
  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false
  });

  // Wind parameters
  const WIND_CONFIG = {
    positionAmplitude: { x: 0.25, y: 0.3, z: 0.2 },      // Increased amplitude for more movement
    positionFrequency: { x: 1.2, y: 0.8, z: 1.0 },       // Adjusted frequencies for more natural motion
    rotationAmplitude: { x: 0.12, y: 0.08, z: 0.1 },     // Increased rotation amounts
    rotationFrequency: { x: 1.5, y: 1.2, z: 1.3 },       // Faster rotation for more turbulence
    baseFloatHeight: 0.2                                  // Increased base float height
  };

  // Movement parameters
  const MOVEMENT_CONFIG = {
    acceleration: 20,      // How quickly it reaches max speed
    deceleration: 3,      // How quickly it slows down (lower = more slide)
    maxSpeed: 5,          // Maximum movement speed
    rotationSpeed: 5      // How quickly it turns
  };

  // Function to apply wind effect
  const applyWindEffect = (delta) => {
    if (!modelRef.current || !initialPositionRef.current) return;

    windTimeRef.current += delta;
    const time = windTimeRef.current;

    // Calculate position offsets using combined sine waves for more complex motion
    const posOffset = {
      x: Math.sin(time * WIND_CONFIG.positionFrequency.x) * WIND_CONFIG.positionAmplitude.x +
         Math.sin(time * WIND_CONFIG.positionFrequency.x * 1.5) * WIND_CONFIG.positionAmplitude.x * 0.3,
      y: Math.sin(time * WIND_CONFIG.positionFrequency.y) * WIND_CONFIG.positionAmplitude.y +
         Math.cos(time * WIND_CONFIG.positionFrequency.y * 2) * WIND_CONFIG.positionAmplitude.y * 0.2 +
         WIND_CONFIG.baseFloatHeight,
      z: Math.sin(time * WIND_CONFIG.positionFrequency.z) * WIND_CONFIG.positionAmplitude.z +
         Math.sin(time * WIND_CONFIG.positionFrequency.z * 1.2) * WIND_CONFIG.positionAmplitude.z * 0.4
    };

    // Calculate rotation offsets with combined waves for more turbulent motion
    const rotOffset = {
      x: Math.sin(time * WIND_CONFIG.rotationFrequency.x) * WIND_CONFIG.rotationAmplitude.x +
         Math.cos(time * WIND_CONFIG.rotationFrequency.x * 1.3) * WIND_CONFIG.rotationAmplitude.x * 0.3,
      y: Math.sin(time * WIND_CONFIG.rotationFrequency.y) * WIND_CONFIG.rotationAmplitude.y +
         Math.sin(time * WIND_CONFIG.rotationFrequency.y * 1.7) * WIND_CONFIG.rotationAmplitude.y * 0.2,
      z: Math.sin(time * WIND_CONFIG.rotationFrequency.z) * WIND_CONFIG.rotationAmplitude.z +
         Math.cos(time * WIND_CONFIG.rotationFrequency.z * 1.4) * WIND_CONFIG.rotationAmplitude.z * 0.4
    };

    // Apply position offsets relative to initial position
    modelRef.current.container.position.x = initialPositionRef.current.x + posOffset.x;
    modelRef.current.container.position.y = initialPositionRef.current.y + posOffset.y;
    modelRef.current.container.position.z = initialPositionRef.current.z + posOffset.z;

    // Apply rotation offsets with base rotation
    modelRef.current.container.rotation.x = rotOffset.x;
    modelRef.current.container.rotation.y = Math.PI + rotOffset.y;  // Keep base PI rotation + wind effect
    modelRef.current.container.rotation.z = rotOffset.z;
  };

  const handleFoldToggle = () => {
    if (mixerRef.current) {
      const action = mixerRef.current.existingAction;
      if (action) {
        if (isFolded) {
          // If currently folded, play animation in reverse starting from frame 40
          action.timeScale = -1;
          action.paused = false;
          action.time = 40/30; // Convert frame 40 to seconds (assuming 30fps)
          action.play();
        } else {
          // If currently unfolded, play animation forward from start
          action.timeScale = 1;
          action.reset();
          action.paused = false;
          action.play();
        }
      }
      setIsFolded(!isFolded);
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        keysRef.current.forward = true;
        break;
      case 'ArrowDown':
        keysRef.current.backward = true;
        break;
      case 'ArrowLeft':
        keysRef.current.left = true;
        break;
      case 'ArrowRight':
        keysRef.current.right = true;
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        keysRef.current.forward = false;
        break;
      case 'ArrowDown':
        keysRef.current.backward = false;
        break;
      case 'ArrowLeft':
        keysRef.current.left = false;
        break;
      case 'ArrowRight':
        keysRef.current.right = false;
        break;
    }
  };

  const handleButtonPress = (direction) => {
    keysRef.current[direction] = true;
  };

  const handleButtonRelease = (direction) => {
    keysRef.current[direction] = false;
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    // Create the loading manager first
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      setLoadingProgress(progress);
    };
    loadingManager.onLoad = () => {
      console.log("Loading complete!");
      setIsLoading(false);
    };

    // === Scene Setup ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setupan
    const camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2; // Increased exposure for more vibrant colors

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Reduced ambient light for deeper shadows
    scene.add(ambientLight);

    // Create a pivot point for the directional light
    const lightPivot = new THREE.Object3D();
    scene.add(lightPivot);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.6); // Increased intensity
    directionalLight.position.set(0, 20, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.002;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500.0;
    directionalLight.shadow.camera.left = 50;
    directionalLight.shadow.camera.right = -50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.darkness = 1.0;
    lightPivot.add(directionalLight);

    // Ground plane with darker shadows
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const shadowMaterial = new THREE.ShadowMaterial({ 
      opacity: .5,  // Increased opacity for darker shadows
      transparent: true,
      depthWrite: false
    });
    const groundPlane = new THREE.Mesh(planeGeometry, shadowMaterial);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -2;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    // Environment sphere with increased opacity
    const envSphere = new THREE.Mesh(
      new THREE.SphereGeometry(600, 60, 40),  // Increased radius from 500 to 600 (20% larger)
      new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.95 // Increased opacity for more vivid background
      })
    );
    envSphere.position.y = -120; // Move down 20% of sphere radius (600 * 0.2 = 120)
    scene.add(envSphere);

    // Add sky rotation variables
    let skyRotationAngle = 0;
    const skyRotationSpeed = 0.002; // Constant increment for continuous rotation

    // Enhanced HDRI texture settings
    const hdriLoader = new THREE.TextureLoader(loadingManager);
    hdriLoader.load("/resources/hdri_sky_02.png", (texture) => {
      texture.encoding = THREE.sRGBEncoding;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      
      // Adjust color and saturation of the environment texture
      const colorMatrix = new THREE.Matrix3();
      colorMatrix.set(
        1.2, 0, 0,    // R (increased for more saturation)
        0, 1.2, 0,    // G (increased for more saturation)
        0, 0, 1.2     // B (increased for more saturation)
      );
      texture.matrix = colorMatrix;
      
      envSphere.material.map = texture;
      envSphere.material.needsUpdate = true;
      scene.environment = texture;

      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.7; // Reduced exposure for darker look
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.gammaFactor = 1.4; // Increased for more saturation
      renderer.gammaOutput = true;
    });

    // Load the plane model (glTF)
    const gltfLoader = new GLTFLoader(loadingManager);
    gltfLoader.load("/resources/character/plane.gltf", (gltf) => {
      console.log("Plane model loaded:", gltf);
      const model = gltf.scene;

      model.scale.set(1, 1, 1);
      model.position.y = 0; // Reset position since container will handle position
      model.rotation.y = 0; // Reset rotation since container will handle base rotation

      // Create a container object for the model
      const container = new THREE.Object3D();
      container.position.y = 0.4;
      container.rotation.y = Math.PI; // Move the PI rotation to the container
      container.add(model);
      
      // Store references to both container and model
      modelRef.current = {
        container: container,
        plane: model
      };
      initialPositionRef.current = container.position.clone();

      // Load and apply texture to the model
      const textureLoader = new THREE.TextureLoader(loadingManager);
      textureLoader.load("/resources/character/tex/poster_01.png", (texture) => {
        texture.encoding = THREE.sRGBEncoding;
        texture.rotation = Math.PI; // Rotate texture 180 degrees
        texture.center.set(0.5, 0.5); // Set rotation center to middle of texture
        
        // Enhanced material settings for HDRI reflection with texture
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Enhanced material settings for the plane
            const material = new THREE.MeshPhysicalMaterial({
              map: texture,
              metalness: 0.3,          // Increased for stronger reflections
              roughness: 0.2,          // Decreased for shinier surface
              envMapIntensity: 1.5,    // Increased for stronger environment reflections
              clearcoat: 0.6,          // Increased for more shine
              clearcoatRoughness: 0.2, // Decreased for clearer reflections
              side: THREE.DoubleSide
            });
            
            child.material = material;
            child.material.needsUpdate = true;
          }
        });
      });

      scene.add(container);

      // Modified animation setup - store the mixer but don't play yet
      if (gltf.animations && gltf.animations.length > 0) {
        console.log("Animation clips found:", gltf.animations);
        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        
        // Initialize at first frame
        action.reset();
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.time = 0;  // Set time to 0 (first frame)
        action.paused = true;  // Keep it paused
        action.play();  // Needed to initialize the animation state
        
        // Store the mixer and action for later use
        mixerRef.current = {
          mixer: mixer,
          existingAction: action
        };
      } else {
        console.log("No animations found in the glTF file.");
      }
    });

    // Set up a global clock and render loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      // Update mixer if it exists
      if (mixerRef.current && mixerRef.current.mixer) {
        mixerRef.current.mixer.update(delta);
      }
      
      // Apply wind effect
      applyWindEffect(delta);
      
      // Handle model movement
      if (modelRef.current) {
        const maxDistance = 2;
        const backwardLimit = 0; // New limit for backward movement
        const currentPos = modelRef.current.container.position;
        const initialPos = initialPositionRef.current;
        
        // Store the wind offset before applying movement
        const windOffset = {
          x: currentPos.x - initialPos.x,
          y: currentPos.y - initialPos.y,
          z: currentPos.z - initialPos.z
        };

        // Calculate target velocity based on input
        const targetVelocity = { x: 0, z: 0 };
        
        if (keysRef.current.left) targetVelocity.x = -MOVEMENT_CONFIG.maxSpeed;
        if (keysRef.current.right) targetVelocity.x = MOVEMENT_CONFIG.maxSpeed;
        if (keysRef.current.forward) targetVelocity.z = -MOVEMENT_CONFIG.maxSpeed;
        if (keysRef.current.backward) {
          // Special handling for backward movement with new limit
          const distanceToOrigin = initialPositionRef.current.z - backwardLimit;
          if (distanceToOrigin < 0) {
            targetVelocity.z = MOVEMENT_CONFIG.maxSpeed;
          }
        }

        // Apply acceleration/deceleration
        velocityRef.current.x = THREE.MathUtils.lerp(
          velocityRef.current.x,
          targetVelocity.x,
          (targetVelocity.x !== 0 ? MOVEMENT_CONFIG.acceleration : MOVEMENT_CONFIG.deceleration) * delta
        );
        velocityRef.current.z = THREE.MathUtils.lerp(
          velocityRef.current.z,
          targetVelocity.z,
          (targetVelocity.z !== 0 ? MOVEMENT_CONFIG.acceleration : MOVEMENT_CONFIG.deceleration) * delta
        );

        // Apply velocity to position
        initialPositionRef.current.x += velocityRef.current.x * delta;
        initialPositionRef.current.z += velocityRef.current.z * delta;

        // Clamp positions to boundaries
        initialPositionRef.current.x = THREE.MathUtils.clamp(
          initialPositionRef.current.x,
          initialPos.x - maxDistance,
          initialPos.x + maxDistance
        );
        
        // Clamp z position and handle return to origin with new backward limit
        if (keysRef.current.backward) {
          initialPositionRef.current.z = Math.min(initialPositionRef.current.z, backwardLimit);
        } else {
          initialPositionRef.current.z = THREE.MathUtils.clamp(
            initialPositionRef.current.z,
            initialPos.z - maxDistance,
            initialPos.z
          );
        }
        
        // Reapply wind offset after movement
        modelRef.current.container.position.x = initialPositionRef.current.x + windOffset.x;
        modelRef.current.container.position.y = initialPositionRef.current.y + windOffset.y;
        modelRef.current.container.position.z = initialPositionRef.current.z + windOffset.z;
      }
      
      // Add sky rotation and synchronize light rotation
      skyRotationAngle += skyRotationSpeed;
      envSphere.rotation.y = skyRotationAngle;
      lightPivot.rotation.y = skyRotationAngle;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height, false);

      const canvas = renderer.domElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />
      
      {!isLoading && (
        <FoldButton 
          onClick={handleFoldToggle}
          disabled={false}
          isFolded={isFolded}
        />
      )}
      
      <ControlPanel
        onButtonPress={handleButtonPress}
        onButtonRelease={handleButtonRelease}
      />
      
      <Preloader progress={loadingProgress} isLoading={isLoading} />
    </>
  );
}
