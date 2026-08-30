import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UnitSystem = "SI" | "Metric" | "Imperial";

export interface UnitPreferenceState {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;

  // Format helpers
  formatPressure: (valuePa: number) => { value: string; unit: string };
  formatTemperature: (valueKelvin: number) => { value: string; unit: string };
  formatVelocity: (valueMs: number) => { value: string; unit: string };
  formatForce: (valueN: number) => { value: string; unit: string };
  formatLength: (valueMeters: number) => { value: string; unit: string };
  formatMass: (valueKg: number) => { value: string; unit: string };
}

export const useUnitStore = create<UnitPreferenceState>()(
  persist(
    (set, get) => ({
      unitSystem: "SI",

      setUnitSystem: (system) => set({ unitSystem: system }),

      formatPressure: (valuePa) => {
        const sys = get().unitSystem;
        if (sys === "Imperial") {
          // Pa to psi (1 Pa = 0.000145038 psi)
          const psi = valuePa * 0.000145038;
          return { value: psi.toFixed(2), unit: "psi" };
        } else if (sys === "Metric") {
          if (valuePa >= 1e6) {
            return { value: (valuePa / 1e6).toFixed(2), unit: "MPa" };
          } else if (valuePa >= 1e3) {
            return { value: (valuePa / 1e3).toFixed(2), unit: "kPa" };
          }
          return { value: valuePa.toFixed(0), unit: "bar" };
        } else {
          // SI
          if (valuePa >= 1e6) {
            return { value: (valuePa / 1e6).toFixed(2), unit: "MPa" };
          } else if (valuePa >= 1e3) {
            return { value: (valuePa / 1e3).toFixed(2), unit: "kPa" };
          }
          return { value: valuePa.toFixed(0), unit: "Pa" };
        }
      },

      formatTemperature: (valueK) => {
        const sys = get().unitSystem;
        if (sys === "Imperial") {
          const f = (valueK - 273.15) * 1.8 + 32;
          return { value: f.toFixed(1), unit: "°F" };
        } else if (sys === "Metric") {
          const c = valueK - 273.15;
          return { value: c.toFixed(1), unit: "°C" };
        } else {
          return { value: valueK.toFixed(1), unit: "K" };
        }
      },

      formatVelocity: (valueMs) => {
        const sys = get().unitSystem;
        if (sys === "Imperial") {
          const mph = valueMs * 2.23694;
          return { value: mph.toFixed(1), unit: "mph" };
        } else if (sys === "Metric") {
          const kmh = valueMs * 3.6;
          return { value: kmh.toFixed(1), unit: "km/h" };
        } else {
          return { value: valueMs.toFixed(1), unit: "m/s" };
        }
      },

      formatForce: (valueN) => {
        const sys = get().unitSystem;
        if (sys === "Imperial") {
          const lbf = valueN * 0.224809;
          return { value: lbf.toFixed(1), unit: "lbf" };
        } else {
          if (valueN >= 1e3) {
            return { value: (valueN / 1e3).toFixed(2), unit: "kN" };
          }
          return { value: valueN.toFixed(1), unit: "N" };
        }
      },

      formatLength: (valueMeters) => {
        const sys = get().unitSystem;
        if (sys === "Imperial") {
          if (valueMeters < 0.3048) {
            return { value: (valueMeters * 39.3701).toFixed(2), unit: "in" };
          }
          return { value: (valueMeters * 3.28084).toFixed(2), unit: "ft" };
        } else if (sys === "Metric") {
          if (valueMeters < 1) {
            return { value: (valueMeters * 1000).toFixed(1), unit: "mm" };
          }
          return { value: valueMeters.toFixed(2), unit: "m" };
        } else {
          if (valueMeters < 0.01) {
            return { value: (valueMeters * 1000).toFixed(2), unit: "mm" };
          }
          return { value: valueMeters.toFixed(2), unit: "m" };
        }
      },

      formatMass: (valueKg) => {
        const sys = get().unitSystem;
        if (sys === "Imperial") {
          return { value: (valueKg * 2.20462).toFixed(2), unit: "lb" };
        } else {
          if (valueKg >= 1000) {
            return { value: (valueKg / 1000).toFixed(2), unit: "tonne" };
          }
          return { value: valueKg.toFixed(2), unit: "kg" };
        }
      },
    }),
    {
      name: "aeroforge-unit-preferences",
    },
  ),
);
