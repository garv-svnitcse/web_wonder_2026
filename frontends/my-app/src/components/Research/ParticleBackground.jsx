/* ============================================================
   PART 1: IMPORTS, SCENE SETUP, PARTICLE CREATION
============================================================ */

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    /* ---------- PARTICLES ---------- */

    const PARTICLE_COUNT = 190;

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 55;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities.push({
        x: (Math.random() - 0.5) * 0.045,
        y: (Math.random() - 0.5) * 0.045,
        z: (Math.random() - 0.5) * 0.02,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    function createCircleTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.3, "rgba(140,255,170,0.8)");
      gradient.addColorStop(1, "rgba(0,255,100,0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      return new THREE.CanvasTexture(canvas);
    }

    const circleTexture = createCircleTexture();

    const particleMaterial = new THREE.PointsMaterial({
      map: circleTexture,
      color: 0x5dffa0,
      size: 0.5,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    /* ---------- LINE SYSTEM (THREADS) ---------- */

    const MAX_CONNECTIONS = PARTICLE_COUNT * PARTICLE_COUNT;
    const linePositions = new Float32Array(MAX_CONNECTIONS * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3),
    );
    lineGeometry.setDrawRange(0, 0);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x2dff6a,
      transparent: true,
      opacity: 0.12,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    /* ---------- FLOATING GLOW ORBS (top to bottom) ---------- */

    const GLOW_COUNT = 45;
    const glowPositions = new Float32Array(GLOW_COUNT * 3);
    const glowSpeeds = [];

    for (let i = 0; i < GLOW_COUNT; i++) {
      glowPositions[i * 3] = (Math.random() - 0.5) * 55;
      glowPositions[i * 3 + 1] = Math.random() * 40 - 20;
      glowPositions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      glowSpeeds.push(0.02 + Math.random() * 0.05);
    }

    const glowGeometry = new THREE.BufferGeometry();
    glowGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(glowPositions, 3),
    );

    const glowMaterial = new THREE.PointsMaterial({
      map: circleTexture,
      color: 0x9dffc0,
      size: 0.9,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const glowOrbs = new THREE.Points(glowGeometry, glowMaterial);
    scene.add(glowOrbs);

    /* ============================================================
       PART 2: LIVE ANIMATION, DYNAMIC THREADS, MOUSE INTERACTION
    ============================================================ */

    const mouse = new THREE.Vector2(999, 999);
    const mouseWorld = new THREE.Vector3(999, 999, 0);
    const raycaster = new THREE.Raycaster();

    function onMouseMove(e) {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const distance = -camera.position.z / raycaster.ray.direction.z;
      raycaster.ray.at(distance, mouseWorld);
    }

    function onMouseLeave() {
      mouseWorld.set(999, 999, 0);
    }

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    let animationId;
    const maxDistance = 8;
    const mouseRadius = 10;

    function animate() {
      const positionsArray = particleGeometry.attributes.position.array;
      let lineIndex = 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        // base drifting movement
        positionsArray[i3] += velocities[i].x;
        positionsArray[i3 + 1] += velocities[i].y;
        positionsArray[i3 + 2] += velocities[i].z;

        // mouse interaction: gentle repulsion from cursor
        const dx = positionsArray[i3] - mouseWorld.x;
        const dy = positionsArray[i3 + 1] - mouseWorld.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < mouseRadius) {
          const force = (mouseRadius - distToMouse) / mouseRadius;
          positionsArray[i3] += (dx / distToMouse) * force * 0.15;
          positionsArray[i3 + 1] += (dy / distToMouse) * force * 0.15;
        }

        // bounce off edges
        if (positionsArray[i3] > 27 || positionsArray[i3] < -27) {
          velocities[i].x *= -1;
        }
        if (positionsArray[i3 + 1] > 16 || positionsArray[i3 + 1] < -16) {
          velocities[i].y *= -1;
        }
        if (positionsArray[i3 + 2] > 12 || positionsArray[i3 + 2] < -12) {
          velocities[i].z *= -1;
        }
      }

      // rebuild connecting threads
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const j3 = j * 3;
          const dx = positionsArray[i3] - positionsArray[j3];
          const dy = positionsArray[i3 + 1] - positionsArray[j3 + 1];
          const dz = positionsArray[i3 + 2] - positionsArray[j3 + 2];
          const distanceSquared = dx * dx + dy * dy + dz * dz;

          if (distanceSquared < maxDistance * maxDistance) {
            linePositions[lineIndex++] = positionsArray[i3];
            linePositions[lineIndex++] = positionsArray[i3 + 1];
            linePositions[lineIndex++] = positionsArray[i3 + 2];
            linePositions[lineIndex++] = positionsArray[j3];
            linePositions[lineIndex++] = positionsArray[j3 + 1];
            linePositions[lineIndex++] = positionsArray[j3 + 2];
          }
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;
      // glow orbs: falling top to bottom
    const glowArray = glowGeometry.attributes.position.array;
    for (let i = 0; i < GLOW_COUNT; i++) {
      const i3 = i * 3;
      glowArray[i3 + 1] -= glowSpeeds[i];

    // jab neeche pahunch jaye, wapas upar bhej do
    if (glowArray[i3 + 1] < -20) {
      glowArray[i3 + 1] = 20;
      glowArray[i3] = (Math.random() - 0.5) * 55;
    }
  }
glowGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIndex / 3);
      lineGeometry.attributes.position.needsUpdate = true;

      // slow ambient rotation for extra life
      particles.rotation.y += 0.0006;
      lines.rotation.y += 0.0006;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }

    function onWindowResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener("resize", onWindowResize);
    animate();

    /* ============================================================
       PART 3: CLEANUP, RESIZE HANDLING, RETURN JSX
    ============================================================ */

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onWindowResize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      renderer.dispose();
      particleGeometry.dispose();
      lineGeometry.dispose();
      particleMaterial.dispose();
      lineMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "auto",
      }}
    />
  );
}
