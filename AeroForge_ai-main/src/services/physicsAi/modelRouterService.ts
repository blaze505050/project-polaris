import { ModelRouterRequest, ModelRouterRecommendation } from "@/types/physicsAi";
import { MODEL_REGISTRY } from "./modelRegistryData";

export function routePhysicsModel(req: ModelRouterRequest): ModelRouterRecommendation[] {
  const recommendations: ModelRouterRecommendation[] = [];

  MODEL_REGISTRY.forEach((model) => {
    let score = 50;
    const reasoningParts: string[] = [];
    const tradeoffs: string[] = [];

    // Category match
    if (model.category === req.physicsCategory) {
      score += 25;
      reasoningParts.push(`Exact domain alignment with ${model.category}`);
    } else if (model.category === "General PDE") {
      score += 15;
      reasoningParts.push(`General PDE operator adaptable to ${req.domain}`);
    }

    // Geometry type evaluation
    const geomLower = req.geometryType.toLowerCase();
    if (geomLower.includes("mesh") && model.architecture.toLowerCase().includes("graph")) {
      score += 15;
      reasoningParts.push("GNN architecture optimized for unstructured mesh geometry");
    } else if (geomLower.includes("grid") && model.architecture.toLowerCase().includes("fourier")) {
      score += 15;
      reasoningParts.push("Fourier Neural Operator matched to regular grid discretization");
    }

    // PDE type evaluation
    const pdeLower = req.pdeType.toLowerCase();
    if (pdeLower.includes("navier-stokes") || pdeLower.includes("rans")) {
      if (model.id === "aerographnet" || model.id === "fno" || model.id === "pino") {
        score += 10;
        reasoningParts.push("Pre-trained on fluid dynamics & Navier-Stokes solvers");
      }
    } else if (pdeLower.includes("euler") || pdeLower.includes("shock")) {
      if (model.id === "poseidon" || model.id === "pde-transformer") {
        score += 15;
        reasoningParts.push("Specialized compressible shock-capturing formulation");
      }
    }

    // Status adjustments
    if (model.status === "LIVE") {
      score += 20;
      tradeoffs.push("Executable PyTorch FNO model connected via FastAPI backend");
    } else if (model.status === "PROTOTYPE") {
      score += 5;
      tradeoffs.push("Prototype model — API adapter required for high-res mesh runs");
    } else if (model.status === "RESEARCH") {
      tradeoffs.push("Research model — GPU backend inference required");
    } else if (model.status === "PLANNED") {
      score -= 20;
      tradeoffs.push("Roadmap model — Not yet deployed to production API");
    }

    const finalScore = Math.min(Math.max(score, 10), 98);

    recommendations.push({
      modelId: model.id,
      modelName: model.name,
      confidenceScore: finalScore,
      status: model.status,
      reasoning: reasoningParts.join("; ") || "General compatibility based on PDE operator class",
      tradeoffs,
    });
  });

  // Sort descending by score
  return recommendations.sort((a, b) => b.confidenceScore - a.confidenceScore);
}
