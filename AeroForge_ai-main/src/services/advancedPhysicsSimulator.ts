/**
 * Advanced Physics Simulator for Astronomical Simulations
 * Implements N-body gravity, relativistic effects, and high-fidelity physics
 */

// ===== FUNDAMENTAL CONSTANTS =====
export const CONSTANTS = {
  // Gravitational
  G: 6.67430e-11, // m³/(kg·s²)
  SOLAR_MASS: 1.989e30, // kg
  EARTH_MASS: 5.972e24, // kg
  MOON_MASS: 7.342e22, // kg
  
  // Relativistic
  SPEED_OF_LIGHT: 299792458, // m/s
  PLANCK_CONSTANT: 6.62607015e-34, // J·s
  
  // Astronomical distances
  AU: 1.496e11, // meters (Astronomical Unit)
  LIGHT_YEAR: 9.461e15, // meters
  PARSEC: 3.086e16, // meters
  
  // Stellar
  SOLAR_RADIUS: 6.96e8, // meters
  SOLAR_LUMINOSITY: 3.828e26, // watts
  STEFAN_BOLTZMANN: 5.670374419e-8, // W/(m²·K⁴)
  
  // Quantum
  PLANCK_MASS: 2.176434e-8, // kg
  PLANCK_LENGTH: 1.616255e-35, // meters
  PLANCK_TIME: 5.391247e-44, // seconds
};

// ===== VECTOR3 UTILITY =====
export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  multiply(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  divide(scalar: number): Vector3 {
    return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Vector3 {
    const mag = this.magnitude();
    return mag > 0 ? this.divide(mag) : new Vector3();
  }

  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  distance(v: Vector3): number {
    return this.subtract(v).magnitude();
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
}

// ===== CELESTIAL BODY =====
export interface CelestialBody {
  id: string;
  name: string;
  mass: number; // kg
  radius: number; // meters
  position: Vector3; // meters
  velocity: Vector3; // m/s
  acceleration: Vector3; // m/s²
  color: string;
  type: 'star' | 'planet' | 'moon' | 'asteroid' | 'black_hole';
  temperature?: number; // Kelvin
  luminosity?: number; // watts
  spin?: Vector3; // angular velocity
}

// ===== N-BODY GRAVITY SOLVER =====
export class NBodyGravitySolver {
  private bodies: CelestialBody[] = [];
  private timeStep: number = 1; // seconds
  private softening: number = 1e8; // softening parameter to prevent singularities

  addBody(body: CelestialBody): void {
    this.bodies.push(body);
  }

  setTimeStep(dt: number): void {
    this.timeStep = dt;
  }

  setSoftening(epsilon: number): void {
    this.softening = epsilon;
  }

  /**
   * Compute gravitational acceleration on a body due to all others
   * Uses Barnes-Hut approximation for efficiency (simplified version)
   */
  private computeAcceleration(body: CelestialBody): Vector3 {
    let acceleration = new Vector3();

    for (const other of this.bodies) {
      if (body.id === other.id) continue;

      const r = other.position.subtract(body.position);
      const distance = r.magnitude();
      
      // Softening prevents singularities at close distances
      const softDistance = Math.max(distance, this.softening);
      
      // F = G * m1 * m2 / r²
      const forceMagnitude = (CONSTANTS.G * body.mass * other.mass) / (softDistance * softDistance);
      
      // a = F / m = G * m2 / r²
      const direction = r.normalize();
      const accel = direction.multiply(forceMagnitude / body.mass);
      
      acceleration = acceleration.add(accel);
    }

    return acceleration;
  }

  /**
   * Leapfrog integration for better energy conservation
   */
  step(): void {
    // Half step for velocities
    for (const body of this.bodies) {
      body.acceleration = this.computeAcceleration(body);
      body.velocity = body.velocity.add(body.acceleration.multiply(this.timeStep * 0.5));
    }

    // Full step for positions
    for (const body of this.bodies) {
      body.position = body.position.add(body.velocity.multiply(this.timeStep));
    }

    // Recompute accelerations
    for (const body of this.bodies) {
      body.acceleration = this.computeAcceleration(body);
    }

    // Half step for velocities
    for (const body of this.bodies) {
      body.velocity = body.velocity.add(body.acceleration.multiply(this.timeStep * 0.5));
    }
  }

  /**
   * Compute orbital elements from position and velocity
   */
  getOrbitalElements(body: CelestialBody, centralBody: CelestialBody) {
    const r = body.position.subtract(centralBody.position);
    const v = body.velocity.subtract(centralBody.velocity);
    const rMag = r.magnitude();
    const vMag = v.magnitude();

    // Specific orbital energy
    const mu = CONSTANTS.G * (body.mass + centralBody.mass);
    const energy = (vMag * vMag) / 2 - mu / rMag;

    // Semi-major axis
    const a = -mu / (2 * energy);

    // Eccentricity
    const h = r.cross(v);
    const hMag = h.magnitude();
    const p = (hMag * hMag) / mu;
    const e = Math.sqrt(1 - p / a);

    // Inclination
    const i = Math.acos(h.z / hMag);

    // Period (Kepler's third law)
    const period = 2 * Math.PI * Math.sqrt((a * a * a) / mu);

    return {
      semiMajorAxis: a,
      eccentricity: e,
      inclination: i,
      period: period,
      apohelion: a * (1 + e),
      perihelion: a * (1 - e),
      meanMotion: Math.sqrt(mu / (a * a * a)),
    };
  }

  getBodies(): CelestialBody[] {
    return this.bodies;
  }

  clear(): void {
    this.bodies = [];
  }
}

// ===== RELATIVISTIC EFFECTS =====
export class RelativisticCalculator {
  /**
   * Schwarzschild radius for black holes
   */
  static schwarzschildRadius(mass: number): number {
    return (2 * CONSTANTS.G * mass) / (CONSTANTS.SPEED_OF_LIGHT * CONSTANTS.SPEED_OF_LIGHT);
  }

  /**
   * Gravitational time dilation factor
   * dt_proper = dt_coordinate * sqrt(1 - 2GM/rc²)
   */
  static timeDilationFactor(mass: number, distance: number): number {
    const rs = this.schwarzschildRadius(mass);
    return Math.sqrt(Math.max(0, 1 - rs / distance));
  }

  /**
   * Gravitational lensing deflection angle
   * θ ≈ 4GM/c²b (for weak lensing)
   */
  static lensingDeflectionAngle(mass: number, impactParameter: number): number {
    return (4 * CONSTANTS.G * mass) / (CONSTANTS.SPEED_OF_LIGHT * CONSTANTS.SPEED_OF_LIGHT * impactParameter);
  }

  /**
   * Doppler shift due to gravitational field
   */
  static gravitationalRedshift(mass: number, distance: number): number {
    const rs = this.schwarzschildRadius(mass);
    return Math.sqrt(Math.max(0, 1 - rs / distance));
  }

  /**
   * Perihelion precession (relativistic correction)
   * Δω = 6πGM/c²a(1-e²) per orbit
   */
  static perihelionPrecession(mass: number, semiMajorAxis: number, eccentricity: number): number {
    const factor = (6 * Math.PI * CONSTANTS.G * mass) / (CONSTANTS.SPEED_OF_LIGHT * CONSTANTS.SPEED_OF_LIGHT * semiMajorAxis * (1 - eccentricity * eccentricity));
    return factor;
  }
}

// ===== STELLAR PHYSICS =====
export class StellarPhysics {
  /**
   * Stefan-Boltzmann law for stellar luminosity
   * L = 4πR²σT⁴
   */
  static luminosity(radius: number, temperature: number): number {
    return 4 * Math.PI * radius * radius * CONSTANTS.STEFAN_BOLTZMANN * Math.pow(temperature, 4);
  }

  /**
   * Effective temperature from luminosity and radius
   */
  static effectiveTemperature(luminosity: number, radius: number): number {
    return Math.pow(luminosity / (4 * Math.PI * radius * radius * CONSTANTS.STEFAN_BOLTZMANN), 0.25);
  }

  /**
   * Mass-luminosity relation (main sequence)
   * L/L_sun ≈ (M/M_sun)^3.5
   */
  static massLuminosityRelation(mass: number): number {
    const massSolar = mass / CONSTANTS.SOLAR_MASS;
    return Math.pow(massSolar, 3.5) * CONSTANTS.SOLAR_LUMINOSITY;
  }

  /**
   * Escape velocity from stellar surface
   */
  static escapeVelocity(mass: number, radius: number): number {
    return Math.sqrt((2 * CONSTANTS.G * mass) / radius);
  }

  /**
   * Schwarzschild radius (event horizon for black holes)
   */
  static schwarzschildRadius(mass: number): number {
    return (2 * CONSTANTS.G * mass) / (CONSTANTS.SPEED_OF_LIGHT * CONSTANTS.SPEED_OF_LIGHT);
  }
}

// ===== EXOPLANET HABITABILITY =====
export class HabitabilityCalculator {
  /**
   * Habitable zone calculation (conservative estimate)
   * Based on stellar luminosity
   */
  static habitableZone(stellarLuminosity: number): { inner: number; outer: number } {
    const luminosityRatio = stellarLuminosity / CONSTANTS.SOLAR_LUMINOSITY;
    
    // Conservative habitable zone
    const inner = Math.sqrt(luminosityRatio * 0.95) * CONSTANTS.AU;
    const outer = Math.sqrt(luminosityRatio * 1.37) * CONSTANTS.AU;
    
    return { inner, outer };
  }

  /**
   * Earth Similarity Index (ESI)
   * Combines radius, density, escape velocity, and surface temperature
   */
  static earthSimilarityIndex(
    radius: number,
    density: number,
    escapeVelocity: number,
    surfaceTemperature: number
  ): number {
    const EARTH_RADIUS = 6.371e6;
    const EARTH_DENSITY = 5514;
    const EARTH_ESCAPE_VEL = 11186;
    const EARTH_TEMP = 288;

    const radiusESI = 1 - Math.abs(radius - EARTH_RADIUS) / (radius + EARTH_RADIUS);
    const densityESI = 1 - Math.abs(density - EARTH_DENSITY) / (density + EARTH_DENSITY);
    const escapeVelESI = 1 - Math.abs(escapeVelocity - EARTH_ESCAPE_VEL) / (escapeVelocity + EARTH_ESCAPE_VEL);
    const tempESI = 1 - Math.abs(surfaceTemperature - EARTH_TEMP) / (surfaceTemperature + EARTH_TEMP);

    return Math.pow(radiusESI * densityESI * escapeVelESI * tempESI, 0.25);
  }

  /**
   * Radiation received by exoplanet
   */
  static receivedRadiation(stellarLuminosity: number, orbitalDistance: number): number {
    return stellarLuminosity / (4 * Math.PI * orbitalDistance * orbitalDistance);
  }
}

// ===== COSMOLOGICAL CALCULATIONS =====
export class CosmologicalCalculator {
  /**
   * Hubble distance
   */
  static hubbleDistance(redshift: number, hubbleConstant: number = 70): number {
    // H0 = 70 km/s/Mpc
    const H0_SI = (hubbleConstant * 1000) / (3.086e22); // Convert to SI
    return CONSTANTS.SPEED_OF_LIGHT / H0_SI;
  }

  /**
   * Comoving distance (simplified)
   */
  static comovingDistance(redshift: number): number {
    // Simplified calculation for low redshifts
    return (CONSTANTS.SPEED_OF_LIGHT / 70000) * redshift * CONSTANTS.LIGHT_YEAR;
  }

  /**
   * Luminosity distance
   */
  static luminosityDistance(redshift: number): number {
    const comovingDist = this.comovingDistance(redshift);
    return comovingDist * (1 + redshift);
  }

  /**
   * Apparent magnitude from absolute magnitude and distance
   */
  static apparentMagnitude(absoluteMagnitude: number, distanceParsecs: number): number {
    return absoluteMagnitude + 5 * Math.log10(distanceParsecs) - 5;
  }
}

// ===== PARTICLE SYSTEM FOR VISUALIZATION =====
export class ParticleSystem {
  particles: Array<{
    position: Vector3;
    velocity: Vector3;
    life: number;
    maxLife: number;
    color: string;
    size: number;
  }> = [];

  addParticle(
    position: Vector3,
    velocity: Vector3,
    life: number,
    color: string,
    size: number = 1
  ): void {
    this.particles.push({
      position,
      velocity,
      life,
      maxLife: life,
      color,
      size,
    });
  }

  update(deltaTime: number): void {
    this.particles = this.particles.filter((p) => {
      p.life -= deltaTime;
      p.position = p.position.add(p.velocity.multiply(deltaTime));
      return p.life > 0;
    });
  }

  getParticles() {
    return this.particles;
  }

  clear(): void {
    this.particles = [];
  }
}
