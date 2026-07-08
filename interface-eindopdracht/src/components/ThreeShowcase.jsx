import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeShowcase = ({ game }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current || !game) return;

    // --- 1. Scene & Setup ---
    const scene = new THREE.Scene();
    
    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    
    // Clear previous canvas
    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Glowing Point Light matching the game's theme color
    const themeColor = new THREE.Color(game.color || '#9d00ff');
    const pointLight = new THREE.PointLight(themeColor, 4, 30);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0xffffff, 1.5, 10);
    rimLight.position.set(-3, -3, -2);
    scene.add(rimLight);

    // --- 3. Construct 3D Object Group based on modelType ---
    const group = new THREE.Group();
    
    const materialColor = themeColor;
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x151525,
      roughness: 0.2,
      metalness: 0.8
    });
    
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: materialColor,
      emissive: materialColor,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95
    });

    let primaryMesh = null;
    let secondaryMesh = null;

    if (game.modelType === 'sword') {
      // --- Energy Sword ---
      // Handle
      const handleGeom = new THREE.CylinderGeometry(0.08, 0.08, 1, 12);
      const handle = new THREE.Mesh(handleGeom, darkMaterial);
      handle.position.y = -1.2;
      group.add(handle);

      // Guard
      const guardGeom = new THREE.BoxGeometry(0.8, 0.15, 0.2);
      const guard = new THREE.Mesh(guardGeom, darkMaterial);
      guard.position.y = -0.7;
      group.add(guard);

      // Blade (Glowing Cone)
      const bladeGeom = new THREE.ConeGeometry(0.2, 2.5, 4, 1);
      primaryMesh = new THREE.Mesh(bladeGeom, glowMaterial);
      primaryMesh.position.y = 0.6;
      group.add(primaryMesh);

    } else if (game.modelType === 'portal') {
      // --- Portal Ring ---
      // Outer Ring
      const ringGeom = new THREE.TorusGeometry(1.3, 0.15, 16, 64);
      primaryMesh = new THREE.Mesh(ringGeom, darkMaterial);
      group.add(primaryMesh);

      // Inner Glowing Event Horizon
      const diskGeom = new THREE.TorusGeometry(1.2, 0.05, 8, 48);
      secondaryMesh = new THREE.Mesh(diskGeom, glowMaterial);
      group.add(secondaryMesh);

      // Ring Orbiters
      for (let i = 0; i < 8; i++) {
        const sphereGeom = new THREE.SphereGeometry(0.08, 8, 8);
        const orbiter = new THREE.Mesh(sphereGeom, glowMaterial);
        const angle = (i / 8) * Math.PI * 2;
        orbiter.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
        group.add(orbiter);
      }

    } else if (game.modelType === 'core') {
      // --- Sci-Fi Power Core ---
      // Outer Cage (Wireframe Octahedron)
      const cageGeom = new THREE.OctahedronGeometry(1.5, 1);
      const cageMat = new THREE.MeshStandardMaterial({
        color: 0x2e2e4a,
        wireframe: true,
        roughness: 0.1
      });
      const cage = new THREE.Mesh(cageGeom, cageMat);
      group.add(cage);

      // Inner Core Sphere
      const sphereGeom = new THREE.SphereGeometry(0.7, 32, 32);
      primaryMesh = new THREE.Mesh(sphereGeom, glowMaterial);
      group.add(primaryMesh);

      // Orbiting Ring
      const orbitRingGeom = new THREE.TorusGeometry(1.8, 0.03, 8, 64);
      secondaryMesh = new THREE.Mesh(orbitRingGeom, glowMaterial);
      secondaryMesh.rotation.x = Math.PI / 3;
      group.add(secondaryMesh);

    } else if (game.modelType === 'hologram') {
      // --- Hologram Pyramid ---
      // Platform base
      const baseGeom = new THREE.CylinderGeometry(1.4, 1.5, 0.2, 32);
      const base = new THREE.Mesh(baseGeom, darkMaterial);
      base.position.y = -1.2;
      group.add(base);

      // Glowing Cone Wireframe
      const coneGeom = new THREE.ConeGeometry(1.2, 2.0, 4, 8, true);
      const coneMat = new THREE.MeshStandardMaterial({
        color: materialColor,
        emissive: materialColor,
        emissiveIntensity: 1.0,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
      primaryMesh = new THREE.Mesh(coneGeom, coneMat);
      primaryMesh.position.y = -0.1;
      group.add(primaryMesh);

      // Internal spinning Core
      const coreGeom = new THREE.OctahedronGeometry(0.3, 0);
      secondaryMesh = new THREE.Mesh(coreGeom, glowMaterial);
      secondaryMesh.position.y = -0.1;
      group.add(secondaryMesh);

    } else {
      // --- Default: Futuristic Game Controller ---
      // Center Body
      const bodyGeom = new THREE.BoxGeometry(2.0, 1.0, 0.4);
      const body = new THREE.Mesh(bodyGeom, darkMaterial);
      group.add(body);

      // Left Grip
      const leftGripGeom = new THREE.CylinderGeometry(0.25, 0.35, 1.2, 16);
      const leftGrip = new THREE.Mesh(leftGripGeom, darkMaterial);
      leftGrip.position.set(-1.1, -0.3, 0);
      leftGrip.rotation.z = Math.PI / 10;
      group.add(leftGrip);

      // Right Grip
      const rightGrip = leftGrip.clone();
      rightGrip.position.x = 1.1;
      rightGrip.rotation.z = -Math.PI / 10;
      group.add(rightGrip);

      // Joysticks (Glowing Spheres)
      const stickGeom = new THREE.SphereGeometry(0.15, 16, 16);
      const stickL = new THREE.Mesh(stickGeom, glowMaterial);
      stickL.position.set(-0.4, -0.15, 0.25);
      group.add(stickL);

      const stickR = stickL.clone();
      stickR.position.x = 0.4;
      group.add(stickR);

      // Glowing Buttons
      const buttonGeom = new THREE.SphereGeometry(0.08, 12, 12);
      
      const btnX = new THREE.Mesh(buttonGeom, glowMaterial);
      btnX.position.set(0.9, 0.15, 0.25);
      group.add(btnX);
      
      const btnY = btnX.clone();
      btnY.position.set(1.05, 0.0, 0.25);
      group.add(btnY);
      
      primaryMesh = body; // Rotate entire assembly
    }

    scene.add(group);

    // Initial positioning and rotation
    group.rotation.x = 0.3;
    group.rotation.y = 0.5;

    // --- 4. Animation Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Core pulsing glow effect
      if (game.modelType === 'core' && primaryMesh) {
        const pulse = 1 + Math.sin(elapsedTime * 4) * 0.15;
        primaryMesh.scale.set(pulse, pulse, pulse);
        
        if (secondaryMesh) {
          secondaryMesh.rotation.z += 0.01;
          secondaryMesh.rotation.y += 0.005;
        }
      }

      if (game.modelType === 'portal') {
        if (secondaryMesh) secondaryMesh.rotation.z -= 0.03;
      }

      if (game.modelType === 'hologram' && secondaryMesh) {
        secondaryMesh.rotation.x += 0.02;
        secondaryMesh.rotation.y += 0.01;
      }

      // Default idle spin if not dragging
      if (!isDragging) {
        group.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // --- 5. Mouse / Touch Interactions (Rotation dragging) ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaMove = {
        x: clientX - previousMousePosition.x,
        y: clientY - previousMousePosition.y
      };

      // Rotate group based on mouse movement speed
      group.rotation.y += deltaMove.x * 0.008;
      group.rotation.x += deltaMove.y * 0.008;

      previousMousePosition = {
        x: clientX,
        y: clientY
      };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    // Attach listeners to renderer DOM element
    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    dom.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp); // Window level in case release happens outside canvas

    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    dom.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // --- 6. Window Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    animate();

    // --- 7. Clean up on unmount or game change ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      
      dom.removeEventListener('mousedown', handlePointerDown);
      dom.removeEventListener('mousemove', handlePointerMove);
      dom.removeEventListener('touchstart', handlePointerDown);
      dom.removeEventListener('touchmove', handlePointerMove);

      if (containerRef.current && dom.parentNode) {
        containerRef.current.removeChild(dom);
      }
      
      scene.clear();
      renderer.dispose();
    };

  }, [game]);

  // Handle styles
  const showcaseColorStyle = {
    '--showcase-color': game.color
  };

  return (
    <div className="showcase-panel" style={showcaseColorStyle}>
      <div className="showcase-header">
        <h2>3D Showcase</h2>
        <p>Sleep om het 3D-object te roteren</p>
      </div>

      <div className="canvas-wrapper" ref={containerRef}>
        <div className="canvas-instruction">drag to rotate</div>
      </div>

      <div className="showcase-details">
        <h3>{game.titel}</h3>
        <div className="showcase-meta">
          <span>{game.genre} | {game.platform}</span>
          <span className="showcase-type">{game.modelType} model</span>
        </div>
        <p>{game.description || 'Geen beschrijving beschikbaar.'}</p>
      </div>
    </div>
  );
};

export default ThreeShowcase;
