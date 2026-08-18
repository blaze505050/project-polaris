/**
 * SPACE PROBLEMS BOARD
 * P0 Challenges - Interactive problem-solving scenarios
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Rocket, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: React.ComponentType<{ className?: string }>;
  simulator: string;
  completed: boolean;
  objective: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'earth-orbit',
    title: 'Stable Earth Orbit',
    description: 'Calculate the orbital parameters for a stable Earth orbit',
    difficulty: 'easy',
    icon: Rocket,
    simulator: '/astrolab/p0/orbital',
    completed: false,
    objective: 'Set a = 1 AU, e = 0.2, i = 0° to match Earth\'s orbit',
  },
  {
    id: 'geostationary',
    title: 'Geostationary Satellite',
    description: 'Find the orbital period for a geostationary satellite',
    difficulty: 'medium',
    icon: Zap,
    simulator: '/astrolab/p0/orbital',
    completed: false,
    objective: 'Calculate the semi-major axis for a 24-hour orbital period',
  },
  {
    id: 'three-body',
    title: 'Three-Body Dynamics',
    description: 'Simulate the chaotic three-body problem',
    difficulty: 'hard',
    icon: Brain,
    simulator: '/astrolab/p0/gravity',
    completed: false,
    objective: 'Observe the chaotic motion of three equal-mass stars',
  },
  {
    id: 'earth-sun',
    title: 'Earth-Sun System',
    description: 'Simulate the gravitational interaction between Earth and Sun',
    difficulty: 'easy',
    icon: Rocket,
    simulator: '/astrolab/p0/gravity',
    completed: false,
    objective: 'Run the Earth-Sun preset and observe orbital stability',
  },
  {
    id: 'transit-detection',
    title: 'Detect an Exoplanet',
    description: 'Use transit photometry to detect an exoplanet',
    difficulty: 'medium',
    icon: Zap,
    simulator: '/astrolab/p0/transit',
    completed: false,
    objective: 'Create a transit with depth > 0.1% and duration > 2 hours',
  },
  {
    id: 'habitable-zone',
    title: 'Habitable Zone Transit',
    description: 'Find a planet in the habitable zone of its star',
    difficulty: 'hard',
    icon: Brain,
    simulator: '/astrolab/p0/transit',
    completed: false,
    objective: 'Set orbital period between 200-500 days with detectable transit',
  },
  {
    id: 'main-sequence',
    title: 'Main Sequence Stars',
    description: 'Explore the Hertzsprung-Russell diagram',
    difficulty: 'easy',
    icon: Rocket,
    simulator: '/astrolab/p0/stellar',
    completed: false,
    objective: 'Vary stellar mass and observe position on HR diagram',
  },
  {
    id: 'stellar-evolution',
    title: 'Stellar Evolution Path',
    description: 'Trace a star\'s evolution from birth to death',
    difficulty: 'medium',
    icon: Zap,
    simulator: '/astrolab/p0/stellar',
    completed: false,
    objective: 'Compare properties of O, G, and M-type stars',
  },
];

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-300 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function SpaceProblemsBoard() {
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredChallenges = challenges.filter(
    (c) => filter === 'all' || c.difficulty === filter
  );

  const handleCompleteChallenge = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalCount = challenges.length;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">Space Problems</h1>
        <p className="text-secondary-foreground">
          {completedCount} of {totalCount} challenges completed
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-primary rounded-full h-2">
              <motion.div
                className="bg-accent h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <p className="text-sm font-semibold text-accent">
            {Math.round((completedCount / totalCount) * 100)}%
          </p>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
          <Button
            key={level}
            onClick={() => setFilter(level)}
            variant={filter === level ? 'default' : 'outline'}
            className="capitalize"
          >
            {level}
          </Button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChallenges.map((challenge, idx) => {
          const Icon = challenge.icon;
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className={`p-6 space-y-4 h-full flex flex-col ${
                  challenge.completed ? 'border-accent/50 bg-primary/50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold">{challenge.title}</h3>
                      <span
                        className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold border ${
                          difficultyColors[challenge.difficulty]
                        }`}
                      >
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>
                  {challenge.completed && (
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  )}
                </div>

                <p className="text-sm text-secondary-foreground flex-1">
                  {challenge.description}
                </p>

                <div className="p-3 bg-primary rounded text-xs">
                  <p className="text-secondary-foreground mb-1">Objective:</p>
                  <p className="text-foreground">{challenge.objective}</p>
                </div>

                <Link to={challenge.simulator} className="w-full">
                  <Button className="w-full gap-2">
                    <Rocket className="w-4 h-4" /> Launch Simulator
                  </Button>
                </Link>

                <Button
                  onClick={() => handleCompleteChallenge(challenge.id)}
                  variant="outline"
                  className="w-full"
                >
                  {challenge.completed ? '✓ Completed' : 'Mark Complete'}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <Card className="p-12 text-center text-secondary-foreground">
          <p>No challenges found for this difficulty level</p>
        </Card>
      )}
    </div>
  );
}
