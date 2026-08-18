/**
 * Physics Core - Unified physics engine for all AstroLab tools
 * Provides scientifically accurate simulations for:
 * - General Relativity (gravitational lensing, time dilation)
 * - N-body orbital mechanics (Barnes-Hut algorithm)
 * - Volumetric rendering
 * - Planetary surface generation
 */

import * as THREE from 'three';

export interface PhysicsBody {
  id: string;
  name: string;
  mass: number; // kg
  position: THREE.Vector3; // meters
  velocity: THREE.Vector3; // m/s
  radius: number; // meters
  type: 'star' | 'planet' | 'moon' | 'asteroid' | 'black_hole';
  temperature?: number; // Kelvin
  luminosity?: number; // Solar luminosities
  atmosphere?: AtmosphereData;
  surface?: SurfaceData;
}

export interface AtmosphereData {
  composition: { [key: string]: number }; // percentages
  density: number; // kg/m³
  pressure: number; // Pa
  temperature: number; // K
}

export interface SurfaceData {
  terrain: TerrainConfig;
  albedo: number;
  roughness: number;
}

export interface TerrainConfig {
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  seed: number;
}

// Physical constants
export const CONSTANTS = {
  G: 6.67430e-11, // Gravitational constant (m³ kg⁻¹ s⁻²)
  c: 299792458, // Speed of light (m/s)
  AU: 1.496e11, // Astronomical Unit (m)
  SOLAR_MASS: 1.989e30, // kg
  SOLAR_RADIUS: 6.96e8, // m
  SOLAR_LUMINOSITY: 3.828e26, // W
  EARTH_MASS: 5.972e24, // kg
  EARTH_RADIUS: 6.371e6, // m
  SCHWARZSCHILD_RADIUS_FACTOR: 2.954e-27, // 2GM/c² in SI units
};

/**
 * Barnes-Hut Tree for efficient N-body simulation
 */
export class BarnesHutTree {
  private root: BarnesHutNode | null = null;
  private theta: number = 0.5; // Opening angle for force calculation

  constructor(theta: number = 0.5) {
    this.theta = theta;
  }

  insert(body: PhysicsBody): void {
    if (!this.root) {
      this.root = new BarnesHutNode(
        new THREE.Vector3(-1e12, -1e12, -1e12),
        2e12
      );
    }
    this.root.insert(body);
  }

  calculateForce(body: PhysicsBody): THREE.Vector3 {
    const force = new THREE.Vector3();
    if (this.root) {
      this.root.calculateForce(body, force, this.theta);
    }
    return force;
  }

  clear(): void {
    this.root = null;
  }
}

class BarnesHutNode {
  private center: THREE.Vector3;
  private size: number;
  private bodies: PhysicsBody[] = [];
  private children: BarnesHutNode[] = [];
  private centerOfMass: THREE.Vector3 = new THREE.Vector3();
  private totalMass: number = 0;

  constructor(center: THREE.Vector3, size: number) {
    this.center = center.clone();
    this.size = size;
  }

  insert(body: PhysicsBody): void {
    if (this.bodies.length === 0) {
      this.bodies.push(body);
      this.updateCenterOfMass();
      return;
    }

    if (this.children.length === 0) {
      // Subdivide
      this.subdivide();
    }

    for (const child of this.children) {
      if (child.contains(body.position)) {
        child.insert(body);
        break;
      }
    }

    this.updateCenterOfMass();
  }

  private subdivide(): void {
    const halfSize = this.size / 2;
    const offsets = [
      [-1, -1, -1],
      [1, -1, -1],
      [-1, 1, -1],
      [1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [-1, 1, 1],
      [1, 1, 1],
    ];

    for (const offset of offsets) {
      const newCenter = this.center.clone().add(
        new THREE.Vector3(
          offset[0] * halfSize / 2,
          offset[1] * halfSize / 2,
          offset[2] * halfSize / 2
        )
      );
      this.children.push(new BarnesHutNode(newCenter, halfSize));
    }

    for (const body of this.bodies) {
      for (const child of this.children) {
        if (child.contains(body.position)) {
          child.insert(body);
          break;
        }
      }
    }
    this.bodies = [];
  }

  contains(position: THREE.Vector3): boolean {
    const dx = Math.abs(position.x - this.center.x);
    const dy = Math.abs(position.y - this.center.y);
    const dz = Math.abs(position.z - this.center.z);
    return dx <= this.size / 2 && dy <= this.size / 2 && dz <= this.size / 2;
  }

  calculateForce(body: PhysicsBody, force: THREE.Vector3, theta: number): void {
    if (this.totalMass === 0) return;

    const r = new THREE.Vector3().subVectors(this.centerOfMass, body.position);
    const distance = r.length();

    if (distance < 1e3) return; // Avoid singularity

    const s = this.size;
    const ratio = s / distance;

    if (ratio < theta || this.children.length === 0) {
      // Use center of mass
      const f = (CONSTANTS.G * body.mass * this.totalMass) / (distance * distance * distance);
      force.add(r.multiplyScalar(f));
    } else {
      // Recurse into children
      for (const child of this.children) {
        child.calculateForce(body, force, theta);
      }
    }
  }

  private updateCenterOfMass(): void {
    this.centerOfMass.set(0, 0, 0);
    this.totalMass = 0;

    for (const body of this.bodies) {
      this.centerOfMass.add(
        new THREE.Vector3().copy(body.position).multiplyScalar(body.mass)
      );
      this.totalMass += body.mass;
    }

    for (const child of this.children) {
      this.centerOfMass.add(
        new THREE.Vector3().copy(child.centerOfMass).multiplyScalar(child.totalMass)
      );
      this.totalMass += child.totalMass;
    }

    if (this.totalMass > 0) {
      this.centerOfMass.divideScalar(this.totalMass);
    }
  }
}

/**
 * General Relativity effects calculator
 */
export class GeneralRelativityEngine {
  /**
   * Calculate gravitational lensing effect
   * Returns the deflection angle in radians
   */
  static calculateLensingDeflection(
    sourcePosition: THREE.Vector3,
    lensPosition: THREE.Vector3,
    lensMass: number,
    observerPosition: THREE.Vector3
  ): number {
    const r = new THREE.Vector3().subVectors(lensPosition, observerPosition).length();
    const b = new THREE.Vector3()
      .subVectors(sourcePosition, lensPosition)
      .length();

    // Einstein radius
    const theta_e = Math.sqrt(
      (4 * CONSTANTS.G * lensMass) / (CONSTANTS.c * CONSTANTS.c * r)
    );

    // Deflection angle (simplified)
    return (2 * theta_e) / Math.max(b, theta_e);
  }

  /**
   * Calculate time dilation factor (Schwarzschild metric)
   * Returns the time dilation factor (< 1 means time runs slower)
   */
  static calculateTimeDilation(
    position: THREE.Vector3,
    centralMass: number
  ): number {
    const r = position.length();
    const rs = (2 * CONSTANTS.G * centralMass) / (CONSTANTS.c * CONSTANTS.c);

    if (r <= rs) return 0; // Inside event horizon

    return Math.sqrt(1 - rs / r);
  }

  /**
   * Calculate Schwarzschild radius (event horizon)
   */
  static schwarzschildRadius(mass: number): number {
    return (2 * CONSTANTS.G * mass) / (CONSTANTS.c * CONSTANTS.c);
  }

  /**
   * Calculate accretion disk temperature
   */
  static accretionDiskTemperature(
    mass: number,
    accretionRate: number,
    radius: number
  ): number {
    const rs = this.schwarzschildRadius(mass);
    const innerRadius = 3 * rs;

    if (radius < innerRadius) return 0;

    const x = radius / innerRadius;
    const temp =
      (3 * CONSTANTS.G * mass * accretionRate) /
      (8 * Math.PI * 5.67e-8 * Math.pow(radius, 3)) *
      (1 - Math.sqrt(1 / x));

    return Math.pow(temp, 0.25);
  }
}

/**
 * Procedural terrain generation using Perlin noise
 */
export class TerrainGenerator {
  private permutation: number[] = [];

  constructor(seed: number = 0) {
    this.initializePermutation(seed);
  }

  private initializePermutation(seed: number): void {
    this.permutation = [];
    for (let i = 0; i < 256; i++) {
      this.permutation.push(i);
    }

    // Shuffle with seed
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((seed * 73856093 ^ i * 19349663) % (i + 1));
      [this.permutation[i], this.permutation[j]] = [
        this.permutation[j],
        this.permutation[i],
      ];
    }

    // Duplicate for wrapping
    this.permutation = [...this.permutation, ...this.permutation];
  }

  /**
   * Generate Perlin noise value at given coordinates
   */
  perlinNoise(x: number, y: number, z: number): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const zi = Math.floor(z) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    const u = this.fade(xf);
    const v = this.fade(yf);
    const w = this.fade(zf);

    const aaa = this.permutation[this.permutation[this.permutation[xi] + yi] + zi];
    const aba = this.permutation[this.permutation[this.permutation[xi] + yi + 1] + zi];
    const aab = this.permutation[this.permutation[this.permutation[xi] + yi] + zi + 1];
    const abb = this.permutation[this.permutation[this.permutation[xi] + yi + 1] + zi + 1];
    const baa = this.permutation[this.permutation[this.permutation[xi + 1] + yi] + zi];
    const bba = this.permutation[this.permutation[this.permutation[xi + 1] + yi + 1] + zi];
    const bab = this.permutation[this.permutation[this.permutation[xi + 1] + yi] + zi + 1];
    const bbb = this.permutation[this.permutation[this.permutation[xi + 1] + yi + 1] + zi + 1];

    const p0 = this.lerp(this.grad(aaa, xf, yf, zf), this.grad(baa, xf - 1, yf, zf), u);
    const p1 = this.lerp(this.grad(aba, xf, yf - 1, zf), this.grad(bba, xf - 1, yf - 1, zf), u);
    const p2 = this.lerp(this.grad(aab, xf, yf, zf - 1), this.grad(bab, xf - 1, yf, zf - 1), u);
    const p3 = this.lerp(this.grad(abb, xf, yf - 1, zf - 1), this.grad(bbb, xf - 1, yf - 1, zf - 1), u);

    const q0 = this.lerp(p0, p1, v);
    const q1 = this.lerp(p2, p3, v);

    return this.lerp(q0, q1, w);
  }

  /**
   * Generate fractional Brownian motion
   */
  fbm(x: number, y: number, z: number, octaves: number, persistence: number, lacunarity: number): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.perlinNoise(x * frequency, y * frequency, z * frequency);
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return value / maxValue;
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
}

/**
 * Volumetric rendering engine for nebulae and gas clouds
 */
export class VolumetricRenderer {
  /**
   * Calculate volumetric density at a point
   */
  static calculateDensity(
    position: THREE.Vector3,
    center: THREE.Vector3,
    radius: number,
    falloff: number = 2
  ): number {
    const distance = position.distanceTo(center);
    if (distance > radius) return 0;

    const normalized = distance / radius;
    return Math.pow(1 - normalized, falloff);
  }

  /**
   * Calculate volumetric color with absorption
   */
  static calculateVolumetricColor(
    position: THREE.Vector3,
    center: THREE.Vector3,
    radius: number,
    baseColor: THREE.Color,
    temperature: number
  ): THREE.Color {
    const density = this.calculateDensity(position, center, radius);
    const color = baseColor.clone();

    // Temperature-based color shift
    if (temperature > 10000) {
      color.lerp(new THREE.Color(0x0080ff), 0.3); // Blue for hot
    } else if (temperature > 5000) {
      color.lerp(new THREE.Color(0xffffff), 0.2); // White for warm
    } else {
      color.lerp(new THREE.Color(0xff4444), 0.2); // Red for cool
    }

    return color;
  }
}

/**
 * Orbital mechanics calculator
 */
export class OrbitalMechanics {
  /**
   * Calculate orbital velocity
   */
  static orbitalVelocity(centralMass: number, radius: number): number {
    return Math.sqrt((CONSTANTS.G * centralMass) / radius);
  }

  /**
   * Calculate escape velocity
   */
  static escapeVelocity(mass: number, radius: number): number {
    return Math.sqrt((2 * CONSTANTS.G * mass) / radius);
  }

  /**
   * Calculate orbital period (Kepler's third law)
   */
  static orbitalPeriod(centralMass: number, semiMajorAxis: number): number {
    return 2 * Math.PI * Math.sqrt(
      Math.pow(semiMajorAxis, 3) / (CONSTANTS.G * centralMass)
    );
  }

  /**
   * Calculate orbital elements from position and velocity
   */
  static calculateOrbitalElements(
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    centralMass: number
  ) {
    const r = position.length();
    const v = velocity.length();

    // Specific orbital energy
    const energy = (v * v) / 2 - (CONSTANTS.G * centralMass) / r;

    // Semi-major axis
    const a = -(CONSTANTS.G * centralMass) / (2 * energy);

    // Angular momentum
    const h = new THREE.Vector3().crossVectors(position, velocity).length();

    // Eccentricity
    const e = Math.sqrt(1 + (2 * energy * h * h) / (CONSTANTS.G * CONSTANTS.G * centralMass * centralMass));

    // Inclination
    const i = Math.acos(h / (r * v));

    return { a, e, i, h, energy };
  }
}
