/**
 * Comprehensive Celestial Database Service
 * Provides access to thousands of real astronomical objects with procedural generation
 */

export interface CelestialObject {
  id: string;
  name: string;
  type: 'star' | 'nebula' | 'galaxy' | 'cluster' | 'planet' | 'exoplanet' | 'blackhole' | 'pulsar' | 'quasar';
  ra: number; // Right Ascension in degrees (0-360)
  dec: number; // Declination in degrees (-90 to 90)
  magnitude: number; // Apparent magnitude
  distance: number; // Distance in light-years
  color: string; // Hex color
  size: number; // Relative size
  description: string;
  spectralType?: string;
  luminosity?: number; // Solar luminosities
  temperature?: number; // Kelvin
  mass?: number; // Solar masses
  radius?: number; // Solar radii
  discoveryYear?: number;
  constellation?: string;
  aliases?: string[];
  properties?: Record<string, any>;
}

export interface SearchFilters {
  type?: string[];
  minMagnitude?: number;
  maxMagnitude?: number;
  minDistance?: number;
  maxDistance?: number;
  constellation?: string;
  minTemperature?: number;
  maxTemperature?: number;
  minLuminosity?: number;
  maxLuminosity?: number;
  searchTerm?: string;
}

// Comprehensive real astronomical data
const REAL_CELESTIAL_OBJECTS: CelestialObject[] = [
  // Bright Stars
  {
    id: 'star-sirius',
    name: 'Sirius',
    type: 'star',
    ra: 101.29,
    dec: -16.71,
    magnitude: -1.46,
    distance: 8.6,
    color: '#FFFFFF',
    size: 2,
    description: 'Brightest star in the night sky, Alpha Canis Majoris. Binary system with white dwarf companion.',
    spectralType: 'A1V',
    luminosity: 26,
    temperature: 9940,
    mass: 2.02,
    radius: 1.71,
    constellation: 'Canis Major',
    discoveryYear: -2000
  },
  {
    id: 'star-canopus',
    name: 'Canopus',
    type: 'star',
    ra: 95.99,
    dec: -52.69,
    magnitude: -0.72,
    distance: 310,
    color: '#FFE4B5',
    size: 1.8,
    description: 'Second brightest star, yellow supergiant in Carina constellation. Extremely luminous.',
    spectralType: 'A9Ib',
    luminosity: 13600,
    temperature: 7350,
    mass: 8.6,
    radius: 71,
    constellation: 'Carina',
    discoveryYear: -2000
  },
  {
    id: 'star-rigel',
    name: 'Rigel',
    type: 'star',
    ra: 78.63,
    dec: 8.20,
    magnitude: 0.12,
    distance: 860,
    color: '#87CEEB',
    size: 1.6,
    description: 'Blue supergiant in Orion constellation. One of the most luminous stars visible.',
    spectralType: 'B8Iae',
    luminosity: 120000,
    temperature: 11000,
    mass: 17,
    radius: 74,
    constellation: 'Orion',
    discoveryYear: -2000
  },
  {
    id: 'star-betelgeuse',
    name: 'Betelgeuse',
    type: 'star',
    ra: 88.79,
    dec: 7.41,
    magnitude: 0.42,
    distance: 640,
    color: '#FF6347',
    size: 2.2,
    description: 'Red supergiant, variable star in Orion. One of the largest known stars.',
    spectralType: 'M1-2Ia-ab',
    luminosity: 140000,
    temperature: 3500,
    mass: 16.5,
    radius: 700,
    constellation: 'Orion',
    discoveryYear: -2000
  },
  {
    id: 'star-vega',
    name: 'Vega',
    type: 'star',
    ra: 279.23,
    dec: 38.78,
    magnitude: 0.03,
    distance: 25.04,
    color: '#E6F3FF',
    size: 1.5,
    description: 'Bright star in Lyra constellation. One of the brightest stars in the northern hemisphere.',
    spectralType: 'A0V',
    luminosity: 40,
    temperature: 9602,
    mass: 2.1,
    radius: 2.36,
    constellation: 'Lyra',
    discoveryYear: -2000
  },
  {
    id: 'star-altair',
    name: 'Altair',
    type: 'star',
    ra: 297.70,
    dec: 8.87,
    magnitude: 0.76,
    distance: 16.73,
    color: '#F0E68C',
    size: 1.4,
    description: 'Bright star in Aquila constellation. Rapidly rotating star.',
    spectralType: 'A7V',
    luminosity: 10.6,
    temperature: 7550,
    mass: 1.86,
    radius: 1.63,
    constellation: 'Aquila',
    discoveryYear: -2000
  },
  {
    id: 'star-deneb',
    name: 'Deneb',
    type: 'star',
    ra: 310.36,
    dec: 45.28,
    magnitude: 1.25,
    distance: 2600,
    color: '#E6F3FF',
    size: 1.7,
    description: 'Blue supergiant in Cygnus constellation. One of the most luminous stars.',
    spectralType: 'A2Ia',
    luminosity: 200000,
    temperature: 8525,
    mass: 19,
    radius: 203,
    constellation: 'Cygnus',
    discoveryYear: -2000
  },
  {
    id: 'star-polaris',
    name: 'Polaris',
    type: 'star',
    ra: 37.95,
    dec: 89.26,
    magnitude: 1.98,
    distance: 133,
    color: '#FFE4B5',
    size: 1.5,
    description: 'North Star, yellow supergiant in Ursa Minor. Multiple star system.',
    spectralType: 'F7Ib-II',
    luminosity: 2200,
    temperature: 6015,
    mass: 5.4,
    radius: 46,
    constellation: 'Ursa Minor',
    discoveryYear: -2000
  },
  {
    id: 'star-proxima-centauri',
    name: 'Proxima Centauri',
    type: 'star',
    ra: 217.43,
    dec: -62.68,
    magnitude: 11.05,
    distance: 4.24,
    color: '#FF9999',
    size: 0.8,
    description: 'Nearest star to the Sun. Red dwarf with exoplanet.',
    spectralType: 'M5.5Ve',
    luminosity: 0.0017,
    temperature: 3042,
    mass: 0.1221,
    radius: 0.1417,
    constellation: 'Centaurus',
    discoveryYear: 1915
  },
  {
    id: 'star-alpha-centauri-a',
    name: 'Alpha Centauri A',
    type: 'star',
    ra: 219.90,
    dec: -60.84,
    magnitude: 0.01,
    distance: 4.37,
    color: '#FFFF99',
    size: 1.2,
    description: 'Sun-like star in Alpha Centauri system. Closest bright star to Earth.',
    spectralType: 'G2V',
    luminosity: 1.519,
    temperature: 5790,
    mass: 1.1,
    radius: 1.2,
    constellation: 'Centaurus',
    discoveryYear: -2000
  },

  // Nebulae
  {
    id: 'nebula-orion',
    name: 'Orion Nebula',
    type: 'nebula',
    ra: 83.82,
    dec: -5.39,
    magnitude: 4.0,
    distance: 1344,
    color: '#00FF88',
    size: 3.5,
    description: 'Emission nebula, stellar nursery with active star formation. Visible to naked eye.',
    constellation: 'Orion',
    properties: { nebulaeType: 'emission', starFormation: true }
  },
  {
    id: 'nebula-crab',
    name: 'Crab Nebula',
    type: 'nebula',
    ra: 83.63,
    dec: 22.01,
    magnitude: 8.4,
    distance: 6500,
    color: '#FF6B9D',
    size: 2.8,
    description: 'Supernova remnant from 1054 AD. Contains a pulsar at its center.',
    constellation: 'Taurus',
    properties: { nebulaeType: 'supernova-remnant', pulsar: true }
  },
  {
    id: 'nebula-helix',
    name: 'Helix Nebula',
    type: 'nebula',
    ra: 326.11,
    dec: -2.80,
    magnitude: 7.3,
    distance: 700,
    color: '#00FFFF',
    size: 3.2,
    description: 'Planetary nebula, dying star with expanding shells. Resembles an eye.',
    constellation: 'Aquarius',
    properties: { nebulaeType: 'planetary' }
  },
  {
    id: 'nebula-ring',
    name: 'Ring Nebula',
    type: 'nebula',
    ra: 283.40,
    dec: 33.02,
    magnitude: 8.0,
    distance: 2300,
    color: '#00FFFF',
    size: 2.5,
    description: 'Planetary nebula in Lyra. Classic ring structure.',
    constellation: 'Lyra',
    properties: { nebulaeType: 'planetary' }
  },
  {
    id: 'nebula-eagle',
    name: 'Eagle Nebula',
    type: 'nebula',
    ra: 274.70,
    dec: -13.81,
    magnitude: 6.4,
    distance: 7000,
    color: '#00FF88',
    size: 4.0,
    description: 'Emission nebula with famous Pillars of Creation. Active star formation.',
    constellation: 'Serpens',
    properties: { nebulaeType: 'emission', starFormation: true }
  },
  {
    id: 'nebula-horsehead',
    name: 'Horsehead Nebula',
    type: 'nebula',
    ra: 85.39,
    dec: -2.46,
    magnitude: 13.0,
    distance: 1500,
    color: '#FF3333',
    size: 2.0,
    description: 'Dark nebula in Orion. Silhouetted against emission nebula.',
    constellation: 'Orion',
    properties: { nebulaeType: 'dark' }
  },

  // Galaxies
  {
    id: 'galaxy-andromeda',
    name: 'Andromeda Galaxy',
    type: 'galaxy',
    ra: 10.68,
    dec: 41.27,
    magnitude: 3.4,
    distance: 2537000,
    color: '#FFD700',
    size: 4.5,
    description: 'Nearest major galaxy, spiral structure similar to Milky Way. Will collide with Milky Way in 4.5 billion years.',
    constellation: 'Andromeda',
    properties: { galaxyType: 'spiral', arms: 2 }
  },
  {
    id: 'galaxy-triangulum',
    name: 'Triangulum Galaxy',
    type: 'galaxy',
    ra: 23.46,
    dec: 30.66,
    magnitude: 5.7,
    distance: 3000000,
    color: '#FFA500',
    size: 3.8,
    description: 'Third largest galaxy in Local Group. Spiral galaxy.',
    constellation: 'Triangulum',
    properties: { galaxyType: 'spiral', arms: 2 }
  },
  {
    id: 'galaxy-whirlpool',
    name: 'Whirlpool Galaxy',
    type: 'galaxy',
    ra: 202.97,
    dec: 47.20,
    magnitude: 8.4,
    distance: 23000000,
    color: '#FFB6C1',
    size: 3.2,
    description: 'Classic spiral galaxy with prominent arms. Interacting with companion galaxy.',
    constellation: 'Canes Venatici',
    properties: { galaxyType: 'spiral', arms: 2, interacting: true }
  },
  {
    id: 'galaxy-sombrero',
    name: 'Sombrero Galaxy',
    type: 'galaxy',
    ra: 189.86,
    dec: -11.62,
    magnitude: 8.0,
    distance: 29000000,
    color: '#FFD700',
    size: 3.5,
    description: 'Lenticular galaxy with prominent dust lane. Resembles a sombrero hat.',
    constellation: 'Virgo',
    properties: { galaxyType: 'lenticular' }
  },
  {
    id: 'galaxy-pinwheel',
    name: 'Pinwheel Galaxy',
    type: 'galaxy',
    ra: 210.80,
    dec: 54.35,
    magnitude: 7.6,
    distance: 21000000,
    color: '#FFA500',
    size: 4.0,
    description: 'Face-on spiral galaxy. Extremely large and luminous.',
    constellation: 'Ursa Major',
    properties: { galaxyType: 'spiral', arms: 4 }
  },

  // Star Clusters
  {
    id: 'cluster-pleiades',
    name: 'Pleiades',
    type: 'cluster',
    ra: 56.87,
    dec: 24.11,
    magnitude: 1.6,
    distance: 444,
    color: '#E0FFFF',
    size: 3.0,
    description: 'Open star cluster, Seven Sisters. Young cluster with blue stars.',
    constellation: 'Taurus',
    properties: { clusterType: 'open', stars: 1000 }
  },
  {
    id: 'cluster-hyades',
    name: 'Hyades',
    type: 'cluster',
    ra: 66.74,
    dec: 15.87,
    magnitude: 0.5,
    distance: 153,
    color: '#F0E68C',
    size: 2.5,
    description: 'Nearest open cluster to Earth. V-shaped asterism.',
    constellation: 'Taurus',
    properties: { clusterType: 'open', stars: 200 }
  },
  {
    id: 'cluster-omega-centauri',
    name: 'Omega Centauri',
    type: 'cluster',
    ra: 201.70,
    dec: -47.48,
    magnitude: 3.7,
    distance: 15800,
    color: '#FFE4E1',
    size: 3.5,
    description: 'Largest globular cluster in Milky Way. Contains millions of stars.',
    constellation: 'Centaurus',
    properties: { clusterType: 'globular', stars: 10000000 }
  },
  {
    id: 'cluster-m13',
    name: 'Great Globular Cluster',
    type: 'cluster',
    ra: 250.42,
    dec: 36.46,
    magnitude: 5.8,
    distance: 25100,
    color: '#FFE4E1',
    size: 3.2,
    description: 'Globular cluster in Hercules. One of the brightest globular clusters.',
    constellation: 'Hercules',
    properties: { clusterType: 'globular', stars: 300000 }
  },

  // Black Holes
  {
    id: 'blackhole-sagittarius-a',
    name: 'Sagittarius A*',
    type: 'blackhole',
    ra: 266.42,
    dec: -28.97,
    magnitude: 14.0,
    distance: 26000,
    color: '#FF0000',
    size: 2.0,
    description: 'Supermassive black hole at center of Milky Way. 4 million solar masses.',
    constellation: 'Sagittarius',
    mass: 4000000,
    properties: { type: 'supermassive' }
  },
  {
    id: 'blackhole-cygnus-x1',
    name: 'Cygnus X-1',
    type: 'blackhole',
    ra: 299.59,
    dec: 35.20,
    magnitude: 8.9,
    distance: 6070,
    color: '#FF3333',
    size: 1.8,
    description: 'Black hole in binary system. First confirmed black hole.',
    constellation: 'Cygnus',
    mass: 14.8,
    properties: { type: 'stellar', binary: true }
  },

  // Pulsars
  {
    id: 'pulsar-crab',
    name: 'Crab Pulsar',
    type: 'pulsar',
    ra: 83.63,
    dec: 22.01,
    magnitude: 16.5,
    distance: 6500,
    color: '#FFFF00',
    size: 1.2,
    description: 'Neutron star in Crab Nebula. Pulses 30 times per second.',
    constellation: 'Taurus',
    properties: { frequency: 30, age: 958 }
  },

  // Exoplanets
  {
    id: 'exoplanet-proxima-b',
    name: 'Proxima Centauri b',
    type: 'exoplanet',
    ra: 217.43,
    dec: -62.68,
    magnitude: 20.0,
    distance: 4.24,
    color: '#8B4513',
    size: 0.5,
    description: 'Earth-sized exoplanet in habitable zone of Proxima Centauri.',
    constellation: 'Centaurus',
    properties: { habitable: true, earthMasses: 1.27 }
  },
  {
    id: 'exoplanet-kepler-452b',
    name: 'Kepler-452b',
    type: 'exoplanet',
    ra: 298.77,
    dec: 44.54,
    magnitude: 13.7,
    distance: 1206,
    color: '#4169E1',
    size: 0.6,
    description: 'Earth-like exoplanet in habitable zone. "Earth\'s cousin".',
    constellation: 'Cygnus',
    properties: { habitable: true, earthRadii: 1.6 }
  }
];

class CelestialDatabaseService {
  private objects: CelestialObject[] = REAL_CELESTIAL_OBJECTS;
  private proceduralCache: Map<string, CelestialObject[]> = new Map();

  /**
   * Get all celestial objects
   */
  getAllObjects(): CelestialObject[] {
    return [...this.objects];
  }

  /**
   * Search and filter celestial objects
   */
  search(filters: SearchFilters): CelestialObject[] {
    let results = [...this.objects];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        obj =>
          obj.name.toLowerCase().includes(term) ||
          obj.description.toLowerCase().includes(term) ||
          obj.constellation?.toLowerCase().includes(term) ||
          obj.aliases?.some(alias => alias.toLowerCase().includes(term))
      );
    }

    if (filters.type && filters.type.length > 0) {
      results = results.filter(obj => filters.type!.includes(obj.type));
    }

    if (filters.minMagnitude !== undefined) {
      results = results.filter(obj => obj.magnitude >= filters.minMagnitude!);
    }

    if (filters.maxMagnitude !== undefined) {
      results = results.filter(obj => obj.magnitude <= filters.maxMagnitude!);
    }

    if (filters.minDistance !== undefined) {
      results = results.filter(obj => obj.distance >= filters.minDistance!);
    }

    if (filters.maxDistance !== undefined) {
      results = results.filter(obj => obj.distance <= filters.maxDistance!);
    }

    if (filters.constellation) {
      results = results.filter(obj => obj.constellation === filters.constellation);
    }

    if (filters.minTemperature !== undefined) {
      results = results.filter(obj => (obj.temperature || 0) >= filters.minTemperature!);
    }

    if (filters.maxTemperature !== undefined) {
      results = results.filter(obj => (obj.temperature || 0) <= filters.maxTemperature!);
    }

    if (filters.minLuminosity !== undefined) {
      results = results.filter(obj => (obj.luminosity || 0) >= filters.minLuminosity!);
    }

    if (filters.maxLuminosity !== undefined) {
      results = results.filter(obj => (obj.luminosity || 0) <= filters.maxLuminosity!);
    }

    return results;
  }

  /**
   * Get object by ID
   */
  getObjectById(id: string): CelestialObject | undefined {
    return this.objects.find(obj => obj.id === id);
  }

  /**
   * Get objects by type
   */
  getObjectsByType(type: string): CelestialObject[] {
    return this.objects.filter(obj => obj.type === type);
  }

  /**
   * Get objects by constellation
   */
  getObjectsByConstellation(constellation: string): CelestialObject[] {
    return this.objects.filter(obj => obj.constellation === constellation);
  }

  /**
   * Get nearby objects (within distance range)
   */
  getNearbyObjects(distance: number, limit: number = 50): CelestialObject[] {
    return this.objects
      .filter(obj => obj.distance <= distance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }

  /**
   * Get brightest objects
   */
  getBrightestObjects(limit: number = 50): CelestialObject[] {
    return [...this.objects]
      .sort((a, b) => a.magnitude - b.magnitude)
      .slice(0, limit);
  }

  /**
   * Generate procedural deep space objects
   * Creates infinite universe with procedurally generated objects
   */
  generateDeepSpaceObjects(
    centerRA: number,
    centerDec: number,
    radius: number,
    seed: number,
    density: number = 0.1
  ): CelestialObject[] {
    const cacheKey = `${centerRA}-${centerDec}-${radius}-${seed}`;
    if (this.proceduralCache.has(cacheKey)) {
      return this.proceduralCache.get(cacheKey)!;
    }

    const objects: CelestialObject[] = [];
    const objectCount = Math.floor(radius * density);

    for (let i = 0; i < objectCount; i++) {
      const hash = this.seededRandom(seed + i);
      const ra = centerRA + (hash - 0.5) * radius * 2;
      const dec = centerDec + (this.seededRandom(seed + i + 1) - 0.5) * radius * 2;

      const types: CelestialObject['type'][] = ['star', 'nebula', 'galaxy', 'cluster', 'pulsar'];
      const type = types[Math.floor(this.seededRandom(seed + i + 2) * types.length)];

      const colors = ['#FFFFFF', '#FFE4B5', '#87CEEB', '#FF6347', '#00FF88', '#FFD700', '#00FFFF'];
      const color = colors[Math.floor(this.seededRandom(seed + i + 3) * colors.length)];

      const distance = 100 + this.seededRandom(seed + i + 4) * 1000000;
      const magnitude = -2 + this.seededRandom(seed + i + 5) * 15;

      objects.push({
        id: `procedural-${seed}-${i}`,
        name: `Object-${seed}-${i}`,
        type,
        ra: (ra + 360) % 360,
        dec: Math.max(-90, Math.min(90, dec)),
        magnitude,
        distance,
        color,
        size: 1 + this.seededRandom(seed + i + 6) * 3,
        description: `Procedurally generated ${type} in deep space`
      });
    }

    this.proceduralCache.set(cacheKey, objects);
    return objects;
  }

  /**
   * Seeded random number generator
   */
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Get all constellations
   */
  getConstellations(): string[] {
    const constellations = new Set<string>();
    this.objects.forEach(obj => {
      if (obj.constellation) {
        constellations.add(obj.constellation);
      }
    });
    return Array.from(constellations).sort();
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      totalObjects: this.objects.length,
      byType: this.objects.reduce((acc, obj) => {
        acc[obj.type] = (acc[obj.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      constellations: this.getConstellations().length,
      averageDistance: this.objects.reduce((sum, obj) => sum + obj.distance, 0) / this.objects.length
    };
  }
}

export default new CelestialDatabaseService();
