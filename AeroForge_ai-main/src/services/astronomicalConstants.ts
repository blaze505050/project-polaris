/**
 * Astronomical Constants & Physical Constants
 * ISO 80000-3:2019 compliant
 */

export const AstronomicalConstants = {
  // Fundamental Constants (SI units)
  SPEED_OF_LIGHT: 299792458, // m/s
  GRAVITATIONAL_CONSTANT: 6.67430e-11, // m³ kg⁻¹ s⁻²
  PLANCK_CONSTANT: 6.62607015e-34, // J·s
  BOLTZMANN_CONSTANT: 1.380649e-23, // J/K
  AVOGADRO_NUMBER: 6.02214076e23, // mol⁻¹

  // Solar System Constants
  SOLAR_MASS: 1.98892e30, // kg
  SOLAR_RADIUS: 6.95700e8, // m
  SOLAR_LUMINOSITY: 3.828e26, // W
  SOLAR_CONSTANT: 1361, // W/m² (at Earth's distance)

  // Earth Constants
  EARTH_MASS: 5.9722e24, // kg
  EARTH_RADIUS: 6371000, // m (mean)
  EARTH_EQUATORIAL_RADIUS: 6378137, // m
  EARTH_POLAR_RADIUS: 6356752.3, // m
  EARTH_FLATTENING: 1 / 298.257223563, // WGS84
  EARTH_ROTATION_PERIOD: 86164.0905, // s (sidereal day)
  EARTH_ORBITAL_PERIOD: 365.25636, // days (tropical year)
  EARTH_ORBITAL_VELOCITY: 29780, // m/s (mean)
  EARTH_SURFACE_GRAVITY: 9.80665, // m/s²
  EARTH_MAGNETIC_FIELD: 25e-6, // T (at surface)

  // Moon Constants
  MOON_MASS: 7.342e22, // kg
  MOON_RADIUS: 1737400, // m
  MOON_ORBITAL_PERIOD: 27.321661, // days (sidereal)
  MOON_ORBITAL_DISTANCE: 384400000, // m (mean)

  // Orbital Mechanics
  STANDARD_GRAVITATIONAL_PARAMETER_EARTH: 3.986004418e14, // m³/s² (GM_Earth)
  STANDARD_GRAVITATIONAL_PARAMETER_SUN: 1.32712440018e20, // m³/s² (GM_Sun)
  STANDARD_GRAVITATIONAL_PARAMETER_MOON: 4.9028e12, // m³/s² (GM_Moon)

  // Astronomical Units
  AU: 1.495978707e11, // m (Astronomical Unit)
  PARSEC: 3.0857e16, // m
  LIGHT_YEAR: 9.4607e15, // m
  SOLAR_MASS_KG: 1.98892e30, // kg

  // Time Constants
  JULIAN_CENTURY: 36525, // days
  JULIAN_DAY_EPOCH: 2451545.0, // J2000.0 epoch
  UNIX_EPOCH_JD: 2440587.5, // Julian Day at Unix epoch (1970-01-01)

  // Radiation Constants
  STEFAN_BOLTZMANN: 5.670374419e-8, // W m⁻² K⁻⁴
  WIEN_DISPLACEMENT: 2.897771955e-3, // m·K

  // Photometric Constants
  SOLAR_MAGNITUDE_V: -26.74, // Visual magnitude of Sun
  SOLAR_MAGNITUDE_ABSOLUTE: 4.83, // Absolute visual magnitude
  MAGNITUDE_ZERO_POINT_V: 3631, // Jy (Vega system)

  // Atmospheric Constants
  EARTH_ATMOSPHERE_SCALE_HEIGHT: 8500, // m (mean)
  EARTH_ATMOSPHERE_DENSITY_SEA_LEVEL: 1.225, // kg/m³

  // Precession & Nutation
  PRECESSION_CONSTANT: 5028.796195, // arcsec/century (IAU 2000A)
  NUTATION_AMPLITUDE: 9.2025, // arcsec (mean obliquity amplitude)

  // Relativity Corrections
  RELATIVISTIC_ABERRATION: 20.4898, // arcsec (annual aberration constant)
  LIGHT_DEFLECTION_SOLAR: 1.7505, // arcsec (at solar limb)
};

/**
 * Orbital Element Ranges (for validation)
 */
export const OrbitalRanges = {
  SEMI_MAJOR_AXIS: {
    MIN: 6.371e6, // Earth surface
    MAX: 1.5e11, // ~1 AU
  },
  ECCENTRICITY: {
    MIN: 0,
    MAX: 1,
  },
  INCLINATION: {
    MIN: 0,
    MAX: Math.PI,
  },
  ARGUMENT_OF_PERIGEE: {
    MIN: 0,
    MAX: 2 * Math.PI,
  },
  LONGITUDE_ASCENDING_NODE: {
    MIN: 0,
    MAX: 2 * Math.PI,
  },
  TRUE_ANOMALY: {
    MIN: 0,
    MAX: 2 * Math.PI,
  },
};

/**
 * Satellite Orbital Classifications
 */
export const SatelliteOrbitalTypes = {
  LEO: {
    name: 'Low Earth Orbit',
    altitudeRange: [160, 2000], // km
    period: [88, 127], // minutes
  },
  MEO: {
    name: 'Medium Earth Orbit',
    altitudeRange: [2000, 35786], // km
    period: [127, 1436], // minutes
  },
  GEO: {
    name: 'Geostationary Orbit',
    altitudeRange: [35786, 35786], // km
    period: [1436, 1436], // minutes
  },
  HEO: {
    name: 'High Earth Orbit',
    altitudeRange: [35786, 1000000], // km
    period: [1436, Infinity], // minutes
  },
  ESCAPE: {
    name: 'Escape Trajectory',
    altitudeRange: [1000000, Infinity], // km
    period: [Infinity, Infinity], // minutes
  },
};

/**
 * Photometric System Definitions
 */
export const PhotometricSystems = {
  JOHNSON_COUSINS: {
    name: 'Johnson-Cousins',
    bands: {
      U: { wavelength: 365, bandwidth: 66 },
      B: { wavelength: 445, bandwidth: 94 },
      V: { wavelength: 551, bandwidth: 88 },
      R: { wavelength: 658, bandwidth: 138 },
      I: { wavelength: 806, bandwidth: 149 },
    },
  },
  SDSS: {
    name: 'Sloan Digital Sky Survey',
    bands: {
      u: { wavelength: 355, bandwidth: 57 },
      g: { wavelength: 469, bandwidth: 106 },
      r: { wavelength: 618, bandwidth: 111 },
      i: { wavelength: 748, bandwidth: 111 },
      z: { wavelength: 893, bandwidth: 119 },
    },
  },
  GAIA: {
    name: 'Gaia Mission',
    bands: {
      G: { wavelength: 673, bandwidth: 446 },
      BP: { wavelength: 532, bandwidth: 280 },
      RP: { wavelength: 797, bandwidth: 440 },
    },
  },
};

/**
 * Coordinate System Definitions
 */
export const CoordinateSystems = {
  ICRS: 'International Celestial Reference System',
  FK5: 'Fifth Fundamental Catalogue (J2000.0)',
  ECLIPTIC: 'Ecliptic Coordinates',
  GALACTIC: 'Galactic Coordinates',
  HORIZONTAL: 'Horizontal/Alt-Az Coordinates',
};

/**
 * Utility function to get orbital period from semi-major axis
 * Using Kepler\'s Third Law: T² = (4π²/GM) * a³
 */
export function getOrbitalPeriod(semiMajorAxis: number, centralBodyMass: number = AstronomicalConstants.SOLAR_MASS): number {
  const GM = AstronomicalConstants.GRAVITATIONAL_CONSTANT * centralBodyMass;
  const T = 2 * Math.PI * Math.sqrt((semiMajorAxis ** 3) / GM);
  return T; // seconds
}

/**
 * Utility function to get semi-major axis from orbital period
 */
export function getSemiMajorAxis(period: number, centralBodyMass: number = AstronomicalConstants.SOLAR_MASS): number {
  const GM = AstronomicalConstants.GRAVITATIONAL_CONSTANT * centralBodyMass;
  const a = Math.cbrt((GM * (period ** 2)) / (4 * Math.PI ** 2));
  return a; // meters
}

/**
 * Utility function to get orbital velocity at a given distance
 * v = sqrt(GM/r)
 */
export function getOrbitalVelocity(distance: number, centralBodyMass: number = AstronomicalConstants.SOLAR_MASS): number {
  const GM = AstronomicalConstants.GRAVITATIONAL_CONSTANT * centralBodyMass;
  const v = Math.sqrt(GM / distance);
  return v; // m/s
}

/**
 * Utility function to get escape velocity
 * v_escape = sqrt(2GM/r)
 */
export function getEscapeVelocity(distance: number, centralBodyMass: number = AstronomicalConstants.SOLAR_MASS): number {
  const GM = AstronomicalConstants.GRAVITATIONAL_CONSTANT * centralBodyMass;
  const v = Math.sqrt((2 * GM) / distance);
  return v; // m/s
}
