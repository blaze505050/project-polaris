import { useUnitStore } from "@/stores/unitStore";
import { useProjectStore } from "@/stores/projectStore";
import {
  calculateOrbitalPeriodSI,
  calculateOrbitalPeriodAU,
  calculateOrbitalPeriod,
} from "@/services/physicsEngine";

// Lightweight assertion runner for in-app regression verification
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function runHardeningTests() {
  console.log("[TEST] Running AeroForge Beta Hardening Test Suite...");

  // 1. Unit Store Formatting Test
  useUnitStore.getState().setUnitSystem("Metric");
  const metricPress = useUnitStore.getState().formatPressure(101325);
  assert(metricPress.value === "101.33", "Metric pressure value should be 101.33");
  assert(metricPress.unit === "kPa", "Metric pressure unit should be kPa without font-mono leak");

  // 2. Physics Engine Orbital Calculations Test
  const M_EARTH = 5.972e24;
  const R_ISS = 6.771e6;
  const periodSI = calculateOrbitalPeriodSI(M_EARTH, R_ISS);
  assert(
    periodSI > 5500 && periodSI < 5700,
    "ISS orbital period should be between 5500s and 5700s",
  );

  const periodAU = calculateOrbitalPeriodAU(1.0, 1.0);
  const daysAU = periodAU / 86400;
  assert(daysAU > 364 && daysAU < 366, "Earth 1AU orbital period should be ~365.25 days");

  const periodWrapper = calculateOrbitalPeriod(1.0);
  assert(periodWrapper / 86400 > 364, "calculateOrbitalPeriod wrapper should delegate correctly");

  // 3. Project Store & Dynamic Requirements Test
  const pStore = useProjectStore.getState();
  assert(pStore.projects.length > 0, "Project store should initialize with default demo projects");

  const newProjId = `test_proj_${Date.now()}`;
  pStore.addProject({
    _id: newProjId,
    name: "Hypersonic Test Vehicle",
    description: "Mach 5.5 boundary layer study",
    status: "active",
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
  });

  const updatedStore = useProjectStore.getState();
  assert(
    updatedStore.projects.some((p) => p._id === newProjId),
    "New project should be added to store",
  );

  console.log("[TEST] All AeroForge Beta Hardening Tests Passed Successfully!");
}
