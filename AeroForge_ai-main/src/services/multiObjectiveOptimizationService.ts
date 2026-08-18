/**
 * Multi-Objective Optimization Service
 * Implements NSGA-II (Non-dominated Sorting Genetic Algorithm II)
 * for aerospace design optimization
 */

export interface OptimizationObjective {
  name: string;
  type: 'minimize' | 'maximize';
  weight: number;
}

export interface DesignVariable {
  name: string;
  min: number;
  max: number;
  value: number;
}

export interface Solution {
  id: string;
  variables: DesignVariable[];
  objectives: Record<string, number>;
  fitness: number;
  rank: number;
  crowdingDistance: number;
  paretoFront: boolean;
}

export interface OptimizationConfig {
  populationSize: number;
  generations: number;
  crossoverRate: number;
  mutationRate: number;
  objectives: OptimizationObjective[];
  variables: DesignVariable[];
}

export interface OptimizationResults {
  paretoFront: Solution[];
  allSolutions: Solution[];
  convergenceHistory: Array<{ generation: number; hypervolume: number }>;
  statistics: {
    bestFitness: number;
    averageFitness: number;
    diversity: number;
    spreadMetric: number;
  };
}

class MultiObjectiveOptimizationService {
  private config: OptimizationConfig;
  private population: Solution[] = [];
  private paretoFront: Solution[] = [];
  private convergenceHistory: Array<{ generation: number; hypervolume: number }> = [];
  private allSolutions: Solution[] = [];

  constructor(config: OptimizationConfig) {
    this.config = config;
  }

  /**
   * Evaluate objectives for a solution
   */
  private evaluateObjectives(variables: DesignVariable[]): Record<string, number> {
    const objectives: Record<string, number> = {};

    // Wing design optimization objectives
    const wingArea = variables[0].value; // m²
    const aspectRatio = variables[1].value;
    const sweepAngle = variables[2].value; // degrees
    const thickness = variables[3].value; // % chord

    // Objective 1: Minimize Drag (Cd)
    const dragCoefficient =
      0.015 +
      0.08 * Math.pow(thickness / 100, 2) +
      0.05 * Math.pow(sweepAngle / 45, 2) +
      0.02 / aspectRatio;

    // Objective 2: Maximize Lift (Cl)
    const liftCoefficient =
      1.2 +
      0.8 * (thickness / 100) -
      0.3 * Math.pow(sweepAngle / 45, 2) +
      0.15 * Math.log(aspectRatio);

    // Objective 3: Minimize Weight (structural)
    const weight = 50 + wingArea * 2.5 + (thickness / 100) * 30 - aspectRatio * 3;

    // Objective 4: Maximize Efficiency (L/D ratio)
    const efficiency = liftCoefficient / Math.max(dragCoefficient, 0.01);

    objectives['Drag'] = dragCoefficient;
    objectives['Lift'] = liftCoefficient;
    objectives['Weight'] = weight;
    objectives['Efficiency'] = efficiency;

    return objectives;
  }

  /**
   * Initialize population with random solutions
   */
  private initializePopulation(): void {
    this.population = [];

    for (let i = 0; i < this.config.populationSize; i++) {
      const variables = this.config.variables.map((v) => ({
        ...v,
        value: Math.random() * (v.max - v.min) + v.min,
      }));

      const objectives = this.evaluateObjectives(variables);

      const solution: Solution = {
        id: `sol_${i}_0`,
        variables,
        objectives,
        fitness: 0,
        rank: 0,
        crowdingDistance: 0,
        paretoFront: false,
      };

      this.population.push(solution);
    }

    this.allSolutions = [...this.population];
  }

  /**
   * Non-dominated sorting (Pareto ranking)
   */
  private nonDominatedSort(population: Solution[]): Solution[][] {
    const fronts: Solution[][] = [];
    const dominationCount = new Array(population.length).fill(0);
    const dominatedSolutions = Array.from({ length: population.length }, () => []);

    // Calculate domination relationships
    for (let i = 0; i < population.length; i++) {
      for (let j = i + 1; j < population.length; j++) {
        const comparison = this.compareSolutions(population[i], population[j]);

        if (comparison < 0) {
          dominatedSolutions[i].push(j);
          dominationCount[j]++;
        } else if (comparison > 0) {
          dominatedSolutions[j].push(i);
          dominationCount[i]++;
        }
      }
    }

    // Find first front (non-dominated solutions)
    let currentFront: Solution[] = [];
    for (let i = 0; i < population.length; i++) {
      if (dominationCount[i] === 0) {
        population[i].rank = 0;
        currentFront.push(population[i]);
      }
    }

    let rank = 0;
    while (currentFront.length > 0) {
      fronts.push([...currentFront]);
      const nextFront: Solution[] = [];

      for (const solution of currentFront) {
        const idx = population.indexOf(solution);
        for (const dominated of dominatedSolutions[idx]) {
          dominationCount[dominated]--;
          if (dominationCount[dominated] === 0) {
            population[dominated].rank = rank + 1;
            nextFront.push(population[dominated]);
          }
        }
      }

      currentFront = nextFront;
      rank++;
    }

    return fronts;
  }

  /**
   * Compare two solutions for domination
   * Returns: -1 if sol1 dominates, 1 if sol2 dominates, 0 if non-dominated
   */
  private compareSolutions(sol1: Solution, sol2: Solution): number {
    let sol1Better = false;
    let sol2Better = false;

    for (const obj of this.config.objectives) {
      const val1 = sol1.objectives[obj.name];
      const val2 = sol2.objectives[obj.name];

      if (obj.type === 'minimize') {
        if (val1 < val2) sol1Better = true;
        if (val1 > val2) sol2Better = true;
      } else {
        if (val1 > val2) sol1Better = true;
        if (val1 < val2) sol2Better = true;
      }
    }

    if (sol1Better && !sol2Better) return -1;
    if (sol2Better && !sol1Better) return 1;
    return 0;
  }

  /**
   * Calculate crowding distance
   */
  private calculateCrowdingDistance(front: Solution[]): void {
    if (front.length <= 2) {
      front.forEach((s) => (s.crowdingDistance = Infinity));
      return;
    }

    front.forEach((s) => (s.crowdingDistance = 0));

    for (const obj of this.config.objectives) {
      front.sort((a, b) => a.objectives[obj.name] - b.objectives[obj.name]);

      const min = front[0].objectives[obj.name];
      const max = front[front.length - 1].objectives[obj.name];
      const range = max - min || 1;

      front[0].crowdingDistance = Infinity;
      front[front.length - 1].crowdingDistance = Infinity;

      for (let i = 1; i < front.length - 1; i++) {
        const distance =
          (front[i + 1].objectives[obj.name] - front[i - 1].objectives[obj.name]) / range;
        front[i].crowdingDistance += distance;
      }
    }
  }

  /**
   * Selection operator (tournament selection)
   */
  private selectParent(population: Solution[]): Solution {
    const tournamentSize = 3;
    let best = population[Math.floor(Math.random() * population.length)];

    for (let i = 0; i < tournamentSize - 1; i++) {
      const candidate = population[Math.floor(Math.random() * population.length)];

      if (candidate.rank < best.rank) {
        best = candidate;
      } else if (
        candidate.rank === best.rank &&
        candidate.crowdingDistance > best.crowdingDistance
      ) {
        best = candidate;
      }
    }

    return best;
  }

  /**
   * Crossover operator (SBX - Simulated Binary Crossover)
   */
  private crossover(parent1: Solution, parent2: Solution): Solution[] {
    const child1 = JSON.parse(JSON.stringify(parent1));
    const child2 = JSON.parse(JSON.stringify(parent2));

    if (Math.random() < this.config.crossoverRate) {
      for (let i = 0; i < child1.variables.length; i++) {
        if (Math.random() < 0.5) {
          const u = Math.random();
          const beta =
            u <= 0.5
              ? Math.pow(2 * u, 1 / 3)
              : Math.pow(1 / (2 * (1 - u)), 1 / 3);

          child1.variables[i].value =
            0.5 *
            (parent1.variables[i].value +
              parent2.variables[i].value +
              beta * (parent1.variables[i].value - parent2.variables[i].value));

          child2.variables[i].value =
            0.5 *
            (parent1.variables[i].value +
              parent2.variables[i].value -
              beta * (parent1.variables[i].value - parent2.variables[i].value));

          // Boundary handling
          child1.variables[i].value = Math.max(
            child1.variables[i].min,
            Math.min(child1.variables[i].max, child1.variables[i].value)
          );
          child2.variables[i].value = Math.max(
            child2.variables[i].min,
            Math.min(child2.variables[i].max, child2.variables[i].value)
          );
        }
      }
    }

    return [child1, child2];
  }

  /**
   * Mutation operator (Polynomial mutation)
   */
  private mutate(solution: Solution): void {
    const eta = 20; // Distribution index

    for (let i = 0; i < solution.variables.length; i++) {
      if (Math.random() < this.config.mutationRate) {
        const u = Math.random();
        const delta =
          u < 0.5
            ? Math.pow(2 * u, 1 / (eta + 1)) - 1
            : 1 - Math.pow(2 * (1 - u), 1 / (eta + 1));

        solution.variables[i].value +=
          delta * (solution.variables[i].max - solution.variables[i].min);

        solution.variables[i].value = Math.max(
          solution.variables[i].min,
          Math.min(solution.variables[i].max, solution.variables[i].value)
        );
      }
    }

    solution.objectives = this.evaluateObjectives(solution.variables);
  }

  /**
   * Calculate hypervolume (convergence metric)
   */
  private calculateHypervolume(front: Solution[]): number {
    if (front.length === 0) return 0;

    // Simplified hypervolume calculation
    let volume = 0;
    const referencePoint = 2.0; // Reference point for hypervolume

    for (const solution of front) {
      let contribution = 1;
      for (const obj of this.config.objectives) {
        const value = solution.objectives[obj.name];
        if (obj.type === 'minimize') {
          contribution *= Math.max(0, referencePoint - value);
        } else {
          contribution *= Math.max(0, value);
        }
      }
      volume += contribution;
    }

    return volume;
  }

  /**
   * Run optimization
   */
  public optimize(): OptimizationResults {
    this.initializePopulation();
    this.paretoFront = [];
    this.convergenceHistory = [];
    this.allSolutions = [];

    for (let generation = 0; generation < this.config.generations; generation++) {
      // Non-dominated sorting
      const fronts = this.nonDominatedSort(this.population);

      // Calculate crowding distance
      for (const front of fronts) {
        this.calculateCrowdingDistance(front);
      }

      // Create offspring
      const offspring: Solution[] = [];
      while (offspring.length < this.config.populationSize) {
        const parent1 = this.selectParent(this.population);
        const parent2 = this.selectParent(this.population);

        let [child1, child2] = this.crossover(parent1, parent2);

        this.mutate(child1);
        this.mutate(child2);

        child1.id = `sol_${generation}_${offspring.length}`;
        child2.id = `sol_${generation}_${offspring.length + 1}`;

        offspring.push(child1, child2);
      }

      // Combine and select next generation
      const combined = [...this.population, ...offspring];
      const newFronts = this.nonDominatedSort(combined);

      this.population = [];
      for (const front of newFronts) {
        if (this.population.length + front.length <= this.config.populationSize) {
          this.population.push(...front);
        } else {
          this.calculateCrowdingDistance(front);
          front.sort((a, b) => b.crowdingDistance - a.crowdingDistance);
          const remaining = this.config.populationSize - this.population.length;
          this.population.push(...front.slice(0, remaining));
          break;
        }
      }

      // Track Pareto front
      this.paretoFront = newFronts[0] || [];
      this.allSolutions.push(...offspring);

      // Calculate convergence metric
      const hypervolume = this.calculateHypervolume(this.paretoFront);
      this.convergenceHistory.push({ generation, hypervolume });
    }

    // Mark Pareto front solutions
    this.paretoFront.forEach((s) => (s.paretoFront = true));

    // Calculate statistics
    const statistics = this.calculateStatistics();

    return {
      paretoFront: this.paretoFront,
      allSolutions: this.allSolutions,
      convergenceHistory: this.convergenceHistory,
      statistics,
    };
  }

  /**
   * Calculate optimization statistics
   */
  private calculateStatistics() {
    const fitnesses = this.population.map((s) => s.fitness);
    const bestFitness = Math.max(...fitnesses);
    const averageFitness = fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length;

    // Diversity metric (spread in objective space)
    let diversity = 0;
    for (let i = 0; i < this.paretoFront.length; i++) {
      for (let j = i + 1; j < this.paretoFront.length; j++) {
        let distance = 0;
        for (const obj of this.config.objectives) {
          const diff =
            this.paretoFront[i].objectives[obj.name] -
            this.paretoFront[j].objectives[obj.name];
          distance += diff * diff;
        }
        diversity += Math.sqrt(distance);
      }
    }

    // Spread metric
    let spreadMetric = 0;
    if (this.paretoFront.length > 1) {
      const distances: number[] = [];
      for (let i = 0; i < this.paretoFront.length - 1; i++) {
        let distance = 0;
        for (const obj of this.config.objectives) {
          const diff =
            this.paretoFront[i + 1].objectives[obj.name] -
            this.paretoFront[i].objectives[obj.name];
          distance += diff * diff;
        }
        distances.push(Math.sqrt(distance));
      }
      spreadMetric =
        distances.reduce((a, b) => a + b, 0) / Math.max(distances.length, 1);
    }

    return {
      bestFitness,
      averageFitness,
      diversity,
      spreadMetric,
    };
  }

  /**
   * Get Pareto front for visualization
   */
  public getParetoFront(): Solution[] {
    return this.paretoFront;
  }

  /**
   * Get convergence history
   */
  public getConvergenceHistory() {
    return this.convergenceHistory;
  }

  /**
   * Get design space exploration data
   */
  public getDesignSpace() {
    return this.allSolutions.slice(0, 500); // Limit for visualization
  }
}

export default MultiObjectiveOptimizationService;
