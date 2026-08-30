import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import {
  validateLEOVelocity,
  validateTransitDetection,
  validateStarClassification,
} from "@/services/physicsEngine";

interface ProblemState {
  userInput: string;
  submitted: boolean;
  result: any;
}

export default function SpaceProblemsPanel() {
  const [activeProblem, setActiveProblem] = useState<"leo" | "transit" | "star">("leo");
  const [problems, setProblems] = useState<Record<string, ProblemState>>({
    leo: { userInput: "", submitted: false, result: null },
    transit: { userInput: "", submitted: false, result: null },
    star: { userInput: "", submitted: false, result: null },
  });

  // Problem 1: LEO Velocity
  const handleLEOSubmit = () => {
    const velocity = parseFloat(problems.leo.userInput);
    if (isNaN(velocity)) {
      alert("Please enter a valid number");
      return;
    }
    const result = validateLEOVelocity(velocity);
    setProblems((prev) => ({
      ...prev,
      leo: { ...prev.leo, submitted: true, result },
    }));
  };

  // Problem 2: Transit Detection
  const handleTransitSubmit = () => {
    const depth = parseFloat(problems.transit.userInput);
    if (isNaN(depth)) {
      alert("Please enter a valid number");
      return;
    }
    // Example: Earth-sized planet around Sun-sized star
    const result = validateTransitDetection(depth, 6371, 696000);
    setProblems((prev) => ({
      ...prev,
      transit: { ...prev.transit, submitted: true, result },
    }));
  };

  // Problem 3: Star Classification
  const handleStarSubmit = () => {
    const classification = problems.star.userInput.trim();
    if (!classification) {
      alert("Please enter a spectral class (O, B, A, F, G, K, or M)");
      return;
    }
    // Example: 5778 K (Sun)
    const result = validateStarClassification(classification, 5778);
    setProblems((prev) => ({
      ...prev,
      star: { ...prev.star, submitted: true, result },
    }));
  };

  const resetProblem = (type: "leo" | "transit" | "star") => {
    setProblems((prev) => ({
      ...prev,
      [type]: { userInput: "", submitted: false, result: null },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Problem Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "leo", label: "Design a LEO", icon: "🛰️" },
          { id: "transit", label: "Detect Exoplanet", icon: "🔭" },
          { id: "star", label: "Classify Star", icon: "⭐" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveProblem(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeProblem === tab.id
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Problem Content */}
      <AnimatePresence mode="wait">
        {activeProblem === "leo" && (
          <motion.div
            key="leo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Problem 1: Design a Stable Low Earth Orbit (LEO)
              </h2>

              <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
                <p className="text-slate-300 mb-3">
                  <strong>Scenario:</strong> A satellite needs to orbit Earth at an altitude of 400
                  km. Calculate the required circular orbital velocity to maintain a stable orbit.
                </p>
                <p className="text-slate-400 text-sm">
                  <strong>Hint:</strong> Use the formula v = √(GM/r), where G is the gravitational
                  constant, M is Earth's mass, and r is the orbital radius (Earth's radius +
                  altitude).
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">
                    Your Answer: Orbital Velocity (km/s)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={problems.leo.userInput}
                    onChange={(e) =>
                      setProblems((prev) => ({
                        ...prev,
                        leo: { ...prev.leo, userInput: e.target.value },
                      }))
                    }
                    placeholder="e.g., 7.67"
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={problems.leo.submitted}
                  />
                </div>

                {!problems.leo.submitted ? (
                  <Button
                    onClick={handleLEOSubmit}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={() => resetProblem("leo")}
                    variant="outline"
                    className="w-full border-slate-600"
                  >
                    Try Again
                  </Button>
                )}

                {problems.leo.submitted && problems.leo.result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${
                      problems.leo.result.isCorrect
                        ? "bg-green-900/30 border-green-700"
                        : "bg-red-900/30 border-red-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {problems.leo.result.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={`font-bold ${
                            problems.leo.result.isCorrect ? "text-green-300" : "text-red-300"
                          }`}
                        >
                          {problems.leo.result.feedback}
                        </p>
                        <p className="text-sm text-slate-300 mt-2">
                          Required velocity:{" "}
                          <span className="font-mono">
                            {problems.leo.result.requiredVelocity.toFixed(2)} km/s
                          </span>
                        </p>
                        <p className="text-sm text-slate-300">
                          Your error:{" "}
                          <span className="font-mono">{problems.leo.result.error.toFixed(2)}%</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeProblem === "transit" && (
          <motion.div
            key="transit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Problem 2: Detect an Exoplanet</h2>

              <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
                <p className="text-slate-300 mb-3">
                  <strong>Scenario:</strong> You observe a star and measure a dip in its brightness
                  during a transit. An Earth-sized planet (R = 6,371 km) is orbiting a Sun-sized
                  star (R = 696,000 km). What is the transit depth (percentage of light blocked)?
                </p>
                <p className="text-slate-400 text-sm">
                  <strong>Hint:</strong> Transit Depth ≈ (R_planet / R_star)² × 100%
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Your Answer: Transit Depth (%)</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={problems.transit.userInput}
                    onChange={(e) =>
                      setProblems((prev) => ({
                        ...prev,
                        transit: { ...prev.transit, userInput: e.target.value },
                      }))
                    }
                    placeholder="e.g., 0.0084"
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={problems.transit.submitted}
                  />
                </div>

                {!problems.transit.submitted ? (
                  <Button
                    onClick={handleTransitSubmit}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={() => resetProblem("transit")}
                    variant="outline"
                    className="w-full border-slate-600"
                  >
                    Try Again
                  </Button>
                )}

                {problems.transit.submitted && problems.transit.result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${
                      problems.transit.result.isCorrect
                        ? "bg-green-900/30 border-green-700"
                        : "bg-red-900/30 border-red-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {problems.transit.result.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={`font-bold ${
                            problems.transit.result.isCorrect ? "text-green-300" : "text-red-300"
                          }`}
                        >
                          {problems.transit.result.feedback}
                        </p>
                        <p className="text-sm text-slate-300 mt-2">
                          Expected depth:{" "}
                          <span className="font-mono">
                            {problems.transit.result.expectedDepth.toFixed(4)}%
                          </span>
                        </p>
                        <p className="text-sm text-slate-300">
                          Your error:{" "}
                          <span className="font-mono">
                            {problems.transit.result.error.toFixed(2)}%
                          </span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeProblem === "star" && (
          <motion.div
            key="star"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Problem 3: Classify a Star</h2>

              <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
                <p className="text-slate-300 mb-3">
                  <strong>Scenario:</strong> You measure a star's surface temperature to be 5,778 K.
                  Based on the spectral classification system, what type of star is this?
                </p>
                <p className="text-slate-400 text-sm mb-3">
                  <strong>Spectral Classes:</strong> O (&gt;30,000 K) | B (10,000-30,000 K) | A
                  (7,500-10,000 K) | F (6,000-7,500 K) | G (5,200-6,000 K) | K (3,700-5,200 K) | M
                  (&lt;3,700 K)
                </p>
                <p className="text-slate-400 text-sm">
                  <strong>Hint:</strong> Enter a single letter (O, B, A, F, G, K, or M)
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Your Answer: Spectral Class</Label>
                  <Input
                    type="text"
                    maxLength={1}
                    value={problems.star.userInput.toUpperCase()}
                    onChange={(e) =>
                      setProblems((prev) => ({
                        ...prev,
                        star: { ...prev.star, userInput: e.target.value },
                      }))
                    }
                    placeholder="e.g., G"
                    className="bg-slate-700 border-slate-600 text-white uppercase"
                    disabled={problems.star.submitted}
                  />
                </div>

                {!problems.star.submitted ? (
                  <Button
                    onClick={handleStarSubmit}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={() => resetProblem("star")}
                    variant="outline"
                    className="w-full border-slate-600"
                  >
                    Try Again
                  </Button>
                )}

                {problems.star.submitted && problems.star.result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${
                      problems.star.result.isCorrect
                        ? "bg-green-900/30 border-green-700"
                        : "bg-red-900/30 border-red-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {problems.star.result.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={`font-bold ${
                            problems.star.result.isCorrect ? "text-green-300" : "text-red-300"
                          }`}
                        >
                          {problems.star.result.feedback}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
