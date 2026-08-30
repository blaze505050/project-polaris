import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Engineering3DCanvasProps {
  scrollProgress: number; // 0 to 1
  activeDomain?: "aerospace" | "mechanical" | "astrospace";
}

export default function Engineering3DCanvas({
  scrollProgress,
  activeDomain = "aerospace",
}: Engineering3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  const domainRef = useRef(activeDomain);

  // Keep refs synchronized without recreating Three.js scene
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    domainRef.current = activeDomain;
  }, [activeDomain]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040814, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x040814, 1);
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x0ea5e9, 1.4);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.9);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // 3. Objects Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 3a. 3D Airfoil Extruded Geometry (Aerospace)
    const shape = new THREE.Shape();
    // NACA 2412 profile shape
    const pts = [
      [1.0, 0.002],
      [0.8, 0.024],
      [0.6, 0.045],
      [0.4, 0.06],
      [0.2, 0.058],
      [0.1, 0.045],
      [0.05, 0.032],
      [0.0, 0.0],
      [0.05, -0.012],
      [0.1, -0.018],
      [0.2, -0.022],
      [0.4, -0.02],
      [0.6, -0.015],
      [0.8, -0.008],
      [1.0, -0.002],
    ];
    shape.moveTo((pts[0][0] - 0.3) * 4, pts[0][1] * 4);
    for (let i = 1; i < pts.length; i++) {
      shape.lineTo((pts[i][0] - 0.3) * 4, pts[i][1] * 4);
    }

    const extrudeSettings = {
      depth: 3.5,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };
    const wingGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    wingGeo.center();

    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x090f20,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: false,
    });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    wingMesh.rotation.y = -Math.PI / 4;
    wingMesh.rotation.x = 0.15;
    mainGroup.add(wingMesh);

    // Wireframe overlay on wing
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireMesh = new THREE.Mesh(wingGeo, wireMat);
    wireMesh.rotation.y = -Math.PI / 4;
    wireMesh.rotation.x = 0.15;
    mainGroup.add(wireMesh);

    // 3b. Streamline Particle Field
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      particleSpeeds[i] = 0.03 + Math.random() * 0.05;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.065,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // 3c. Structural Beam Spar (Mechanical)
    const beamGeo = new THREE.BoxGeometry(7, 0.6, 0.4, 14, 3, 2);
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0x162244,
      wireframe: true,
      roughness: 0.3,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(0, -10, 0);
    mainGroup.add(beamMesh);

    // 3d. Orbital Earth & Trajectory Ellipse (Astrospace)
    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(0, 10, 0);

    const earthGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0f1830,
      wireframe: true,
      roughness: 0.5,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    orbitGroup.add(earthMesh);

    // Ellipse Ring
    const curve = new THREE.EllipseCurve(0, 0, 3.2, 2.0, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(64);
    const ellipseGeo = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, p.y, 0)),
    );
    const ellipseMat = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.75,
    });
    const ellipseLine = new THREE.Line(ellipseGeo, ellipseMat);
    ellipseLine.rotation.x = Math.PI / 3;
    orbitGroup.add(ellipseLine);

    mainGroup.add(orbitGroup);

    // 4. Resize Listener
    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 5. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const progress = scrollRef.current;
      const currentDomain = domainRef.current;

      // Flow streamline particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleSpeeds[i];
        if (positions[i * 3] > 8) {
          positions[i * 3] = -8;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Smooth camera position shift based on scroll
      camera.position.z = 12 - progress * 4;
      camera.position.y = Math.sin(progress * Math.PI) * 1.5;
      camera.position.x = Math.cos(progress * Math.PI * 0.5) * 0.8;

      // Rotation of wing geometry
      wingMesh.rotation.y =
        -Math.PI / 4 + progress * Math.PI * 0.8 + Math.sin(elapsedTime * 0.5) * 0.05;
      wingMesh.rotation.x = 0.15 + Math.cos(elapsedTime * 0.4) * 0.03;
      wireMesh.rotation.copy(wingMesh.rotation);

      // Domain-specific spatial transforms
      if (currentDomain === "mechanical") {
        beamMesh.position.y = THREE.MathUtils.lerp(beamMesh.position.y, 0, 0.08);
        wingMesh.position.y = THREE.MathUtils.lerp(wingMesh.position.y, -12, 0.08);
        wireMesh.position.y = wingMesh.position.y;
        orbitGroup.position.y = THREE.MathUtils.lerp(orbitGroup.position.y, 12, 0.08);
        beamMesh.rotation.y = elapsedTime * 0.2;
      } else if (currentDomain === "astrospace") {
        orbitGroup.position.y = THREE.MathUtils.lerp(orbitGroup.position.y, 0, 0.08);
        wingMesh.position.y = THREE.MathUtils.lerp(wingMesh.position.y, -12, 0.08);
        wireMesh.position.y = wingMesh.position.y;
        beamMesh.position.y = THREE.MathUtils.lerp(beamMesh.position.y, -12, 0.08);
        orbitGroup.rotation.y = elapsedTime * 0.15;
      } else {
        wingMesh.position.y = THREE.MathUtils.lerp(wingMesh.position.y, 0, 0.08);
        wireMesh.position.y = wingMesh.position.y;
        beamMesh.position.y = THREE.MathUtils.lerp(beamMesh.position.y, -12, 0.08);
        orbitGroup.position.y = THREE.MathUtils.lerp(orbitGroup.position.y, 12, 0.08);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // 6. Cleanup & Disposal
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);

      wingGeo.dispose();
      wingMat.dispose();
      wireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      ellipseGeo.dispose();
      ellipseMat.dispose();

      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70 transition-opacity duration-700"
      style={{ filter: "drop-shadow(0 0 40px rgba(14, 165, 233, 0.15))" }}
    />
  );
}
