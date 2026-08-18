/**
 * Professional Scientific Data Formatting
 * Suitable for publication and industry-grade analysis
 */

export class DataFormatter {
  /**
   * Format numbers with scientific notation
   * @param value - The number to format
   * @param precision - Number of significant figures
   * @param useExponential - Force exponential notation
   */
  static scientific(value: number, precision: number = 3, useExponential: boolean = false): string {
    if (value === 0) return '0.00e+00';
    
    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exponent);
    
    if (useExponential || Math.abs(exponent) > 3) {
      return `${mantissa.toFixed(precision - 1)}e${exponent >= 0 ? '+' : ''}${exponent.toString().padStart(2, '0')}`;
    }
    
    return mantissa.toFixed(precision - 1);
  }

  /**
   * Format angle in degrees to DMS (Degrees, Minutes, Seconds)
   */
  static angleToDMS(degrees: number, precision: number = 2): string {
    const sign = degrees < 0 ? '-' : '+';
    const absDegrees = Math.abs(degrees);
    
    const d = Math.floor(absDegrees);
    const m = Math.floor((absDegrees - d) * 60);
    const s = ((absDegrees - d) * 60 - m) * 60;
    
    return `${sign}${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'${s.toFixed(precision).padStart(precision + 3, '0')}"`;
  }

  /**
   * Format angle in radians to DMS
   */
  static radiansToDMS(radians: number, precision: number = 2): string {
    return this.angleToDMS((radians * 180) / Math.PI, precision);
  }

  /**
   * Format RA/Dec coordinates (J2000.0)
   */
  static formatRADec(ra: number, dec: number, precision: number = 2): { ra: string; dec: string } {
    // RA is in hours (0-24), convert to degrees
    const raDegrees = (ra / 24) * 360;
    const raHours = Math.floor(ra);
    const raMinutes = Math.floor((ra - raHours) * 60);
    const raSeconds = ((ra - raHours) * 60 - raMinutes) * 60;
    
    const decSign = dec < 0 ? '-' : '+';
    const absDec = Math.abs(dec);
    const decDegrees = Math.floor(absDec);
    const decMinutes = Math.floor((absDec - decDegrees) * 60);
    const decSeconds = ((absDec - decDegrees) * 60 - decMinutes) * 60;
    
    const raStr = `${raHours.toString().padStart(2, '0')}h${raMinutes.toString().padStart(2, '0')}m${raSeconds.toFixed(precision).padStart(precision + 3, '0')}s`;
    const decStr = `${decSign}${decDegrees.toString().padStart(2, '0')}°${decMinutes.toString().padStart(2, '0')}'${decSeconds.toFixed(precision).padStart(precision + 3, '0')}"`;
    
    return { ra: raStr, dec: decStr };
  }

  /**
   * Format magnitude with proper notation
   */
  static magnitude(value: number, precision: number = 2): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(precision)}ᵐ`;
  }

  /**
   * Format distance with appropriate units
   */
  static distance(meters: number, precision: number = 3): string {
    const AU = 1.495978707e11;
    const PARSEC = 3.0857e16;
    const LIGHT_YEAR = 9.4607e15;
    
    if (Math.abs(meters) < 1000) {
      return `${meters.toFixed(precision)} m`;
    } else if (Math.abs(meters) < 1e6) {
      return `${(meters / 1000).toFixed(precision)} km`;
    } else if (Math.abs(meters) < AU * 10) {
      return `${(meters / AU).toFixed(precision)} AU`;
    } else if (Math.abs(meters) < LIGHT_YEAR * 10) {
      return `${(meters / LIGHT_YEAR).toFixed(precision)} ly`;
    } else if (Math.abs(meters) < PARSEC * 1000) {
      return `${(meters / PARSEC).toFixed(precision)} pc`;
    } else {
      return `${(meters / PARSEC).toFixed(precision)} pc`;
    }
  }

  /**
   * Format velocity with appropriate units
   */
  static velocity(metersPerSecond: number, precision: number = 3): string {
    if (Math.abs(metersPerSecond) < 1000) {
      return `${metersPerSecond.toFixed(precision)} m/s`;
    } else if (Math.abs(metersPerSecond) < 1e6) {
      return `${(metersPerSecond / 1000).toFixed(precision)} km/s`;
    } else {
      return `${(metersPerSecond / 1e6).toFixed(precision)} Mm/s`;
    }
  }

  /**
   * Format time duration
   */
  static duration(seconds: number, precision: number = 2): string {
    if (Math.abs(seconds) < 60) {
      return `${seconds.toFixed(precision)} s`;
    } else if (Math.abs(seconds) < 3600) {
      const minutes = seconds / 60;
      return `${minutes.toFixed(precision)} min`;
    } else if (Math.abs(seconds) < 86400) {
      const hours = seconds / 3600;
      return `${hours.toFixed(precision)} h`;
    } else {
      const days = seconds / 86400;
      return `${days.toFixed(precision)} d`;
    }
  }

  /**
   * Format orbital period
   */
  static orbitalPeriod(seconds: number, precision: number = 2): string {
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365.25;
    
    if (minutes < 60) {
      return `${minutes.toFixed(precision)} min`;
    } else if (hours < 24) {
      return `${hours.toFixed(precision)} h`;
    } else if (days < 365.25) {
      return `${days.toFixed(precision)} d`;
    } else {
      return `${years.toFixed(precision)} yr`;
    }
  }

  /**
   * Format temperature
   */
  static temperature(kelvin: number, precision: number = 0): string {
    return `${kelvin.toFixed(precision)} K`;
  }

  /**
   * Format luminosity
   */
  static luminosity(watts: number, precision: number = 2): string {
    const SOLAR_LUMINOSITY = 3.828e26;
    
    if (Math.abs(watts) < 1e3) {
      return `${watts.toFixed(precision)} W`;
    } else if (Math.abs(watts) < 1e6) {
      return `${(watts / 1e3).toFixed(precision)} kW`;
    } else if (Math.abs(watts) < SOLAR_LUMINOSITY * 10) {
      return `${(watts / SOLAR_LUMINOSITY).toFixed(precision)} L☉`;
    } else {
      return this.scientific(watts, precision);
    }
  }

  /**
   * Format mass with appropriate units
   */
  static mass(kilograms: number, precision: number = 2): string {
    const SOLAR_MASS = 1.98892e30;
    const EARTH_MASS = 5.9722e24;
    
    if (Math.abs(kilograms) < 1e3) {
      return `${kilograms.toFixed(precision)} kg`;
    } else if (Math.abs(kilograms) < 1e6) {
      return `${(kilograms / 1e3).toFixed(precision)} Mg`;
    } else if (Math.abs(kilograms) < EARTH_MASS * 10) {
      return `${(kilograms / EARTH_MASS).toFixed(precision)} M⊕`;
    } else if (Math.abs(kilograms) < SOLAR_MASS * 10) {
      return `${(kilograms / SOLAR_MASS).toFixed(precision)} M☉`;
    } else {
      return this.scientific(kilograms, precision);
    }
  }

  /**
   * Format flux density
   */
  static fluxDensity(janskyValue: number, precision: number = 2): string {
    if (Math.abs(janskyValue) < 1e3) {
      return `${janskyValue.toFixed(precision)} Jy`;
    } else if (Math.abs(janskyValue) < 1e6) {
      return `${(janskyValue / 1e3).toFixed(precision)} mJy`;
    } else {
      return `${(janskyValue / 1e6).toFixed(precision)} µJy`;
    }
  }

  /**
   * Format wavelength
   */
  static wavelength(meters: number, precision: number = 2): string {
    if (Math.abs(meters) < 1e-6) {
      return `${(meters * 1e12).toFixed(precision)} pm`;
    } else if (Math.abs(meters) < 1e-3) {
      return `${(meters * 1e9).toFixed(precision)} nm`;
    } else if (Math.abs(meters) < 1) {
      return `${(meters * 1e6).toFixed(precision)} µm`;
    } else if (Math.abs(meters) < 1e3) {
      return `${meters.toFixed(precision)} m`;
    } else {
      return `${(meters / 1e3).toFixed(precision)} km`;
    }
  }

  /**
   * Format frequency
   */
  static frequency(hertz: number, precision: number = 2): string {
    if (Math.abs(hertz) < 1e3) {
      return `${hertz.toFixed(precision)} Hz`;
    } else if (Math.abs(hertz) < 1e6) {
      return `${(hertz / 1e3).toFixed(precision)} kHz`;
    } else if (Math.abs(hertz) < 1e9) {
      return `${(hertz / 1e6).toFixed(precision)} MHz`;
    } else if (Math.abs(hertz) < 1e12) {
      return `${(hertz / 1e9).toFixed(precision)} GHz`;
    } else {
      return `${(hertz / 1e12).toFixed(precision)} THz`;
    }
  }

  /**
   * Format uncertainty/error with proper notation
   */
  static uncertainty(value: number, uncertainty: number, precision: number = 2): string {
    return `${value.toFixed(precision)} ± ${uncertainty.toFixed(precision)}`;
  }

  /**
   * Format UTC timestamp in ISO 8601 format
   */
  static utcTimestamp(date: Date): string {
    return date.toISOString();
  }

  /**
   * Format Julian Date
   */
  static julianDate(jd: number, precision: number = 5): string {
    return `JD ${jd.toFixed(precision)}`;
  }

  /**
   * Format Modified Julian Date
   */
  static modifiedJulianDate(mjd: number, precision: number = 5): string {
    return `MJD ${mjd.toFixed(precision)}`;
  }

  /**
   * Format right ascension in hours
   */
  static rightAscension(hours: number, precision: number = 3): string {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = ((hours - h) * 60 - m) * 60;
    return `${h.toString().padStart(2, '0')}ʰ${m.toString().padStart(2, '0')}ᵐ${s.toFixed(precision).padStart(precision + 3, '0')}ˢ`;
  }

  /**
   * Format declination in degrees
   */
  static declination(degrees: number, precision: number = 2): string {
    return this.angleToDMS(degrees, precision);
  }

  /**
   * Format parallax in milliarcseconds
   */
  static parallax(milliarcseconds: number, precision: number = 3): string {
    return `${milliarcseconds.toFixed(precision)} mas`;
  }

  /**
   * Format proper motion
   */
  static properMotion(masPerYear: number, precision: number = 3): string {
    return `${masPerYear.toFixed(precision)} mas/yr`;
  }

  /**
   * Format redshift
   */
  static redshift(z: number, precision: number = 4): string {
    return `z = ${z.toFixed(precision)}`;
  }

  /**
   * Format percentage with uncertainty
   */
  static percentage(value: number, precision: number = 1): string {
    return `${(value * 100).toFixed(precision)}%`;
  }
}

/**
 * LaTeX formatter for equations and scientific notation
 */
export class LaTeXFormatter {
  /**
   * Format a simple equation
   */
  static equation(latex: string): string {
    return `$${latex}$`;
  }

  /**
   * Format display equation
   */
  static displayEquation(latex: string): string {
    return `$$${latex}$$`;
  }

  /**
   * Format Kepler's Third Law
   */
  static keplersThirdLaw(): string {
    return this.displayEquation('T^2 = \\frac{4\\pi^2}{GM} a^3');
  }

  /**
   * Format orbital velocity equation
   */
  static orbitalVelocity(): string {
    return this.displayEquation('v = \\sqrt{\\frac{GM}{r}}');
  }

  /**
   * Format escape velocity equation
   */
  static escapeVelocity(): string {
    return this.displayEquation('v_{esc} = \\sqrt{\\frac{2GM}{r}}');
  }

  /**
   * Format gravitational force
   */
  static gravitationalForce(): string {
    return this.displayEquation('F = G\\frac{m_1 m_2}{r^2}');
  }

  /**
   * Format Stefan-Boltzmann law
   */
  static stefanBoltzmann(): string {
    return this.displayEquation('L = 4\\pi R^2 \\sigma T^4');
  }

  /**
   * Format Wien\'s displacement law
   */
  static wiensLaw(): string {
    return this.displayEquation('\\lambda_{max} = \\frac{b}{T}');
  }

  /**
   * Format magnitude difference
   */
  static magnitudeDifference(): string {
    return this.displayEquation('m_1 - m_2 = -2.5 \\log_{10}\\left(\\frac{F_1}{F_2}\\right)');
  }

  /**
   * Format distance modulus
   */
  static distanceModulus(): string {
    return this.displayEquation('m - M = 5 \\log_{10}(d) - 5');
  }
}
