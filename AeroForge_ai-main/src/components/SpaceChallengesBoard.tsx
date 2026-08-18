import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Lock, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { SpaceChallenges } from '@/entities';
import { Image } from '@/components/ui/image';

interface ChallengeWithProgress extends SpaceChallenges {
  completed?: boolean;
  progress?: number;
}

export default function SpaceChallengesBoard() {
  const [challenges, setChallenges] = useState<ChallengeWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeWithProgress | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const result = await BaseCrudService.getAll<SpaceChallenges>('spacechallenges', [], { limit: 50 });
        setChallenges(
          result.items.map((c) => ({
            ...c,
            completed: false,
            progress: 0,
          }))
        );
      } catch (error) {
        console.error('Error loading challenges:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadChallenges();
  }, []);

  const filteredChallenges =
    filterDifficulty === 'all'
      ? challenges
      : challenges.filter((c) => c.difficultyLevel === filterDifficulty);

  const difficultyColors: Record<string, string> = {
    Beginner: 'text-aerospace-success',
    Intermediate: 'text-aerospace-warning',
    Advanced: 'text-aerospace-danger',
  };

  const difficultyBgColors: Record<string, string> = {
    Beginner: 'bg-aerospace-success/10 border-aerospace-success/30',
    Intermediate: 'bg-aerospace-warning/10 border-aerospace-warning/30',
    Advanced: 'bg-aerospace-danger/10 border-aerospace-danger/30',
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-aerospace-blue" />
            Space Challenges
          </h2>
          <p className="text-foreground/70 text-sm mt-1">
            Solve real-world space science problems and earn achievements
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterDifficulty(level)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                filterDifficulty === level
                  ? 'bg-aerospace-blue text-white'
                  : 'bg-primary border border-secondary/30 text-foreground hover:border-aerospace-blue/50'
              }`}
            >
              {level === 'all' ? 'All Levels' : level}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-foreground/60 font-mono text-sm">Loading challenges...</div>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-primary border border-secondary/20 rounded-lg">
          <Lock className="w-12 h-12 text-foreground/30 mb-4" />
          <p className="text-foreground/60 font-mono text-sm">No challenges available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map((challenge, idx) => (
            <motion.div
              key={challenge._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedChallenge(challenge)}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all group ${
                selectedChallenge?._id === challenge._id
                  ? 'border-aerospace-blue bg-aerospace-blue/10'
                  : 'border-secondary/30 bg-primary hover:border-aerospace-blue/50'
              }`}
            >
              {/* Image */}
              {challenge.challengeImage && (
                <div className="mb-4 h-32 rounded-lg overflow-hidden bg-primary/50">
                  <Image
                    src={challenge.challengeImage}
                    alt={challenge.challengeName}
                    width={300}
                    height={128}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}

              {/* Difficulty Badge */}
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-mono mb-3 border ${
                  difficultyBgColors[challenge.difficultyLevel || 'Beginner']
                } ${difficultyColors[challenge.difficultyLevel || 'Beginner']}`}
              >
                {challenge.difficultyLevel}
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-foreground mb-2 line-clamp-2">
                {challenge.challengeName}
              </h3>

              {/* Description */}
              <p className="text-xs text-foreground/70 line-clamp-3 mb-4">
                {challenge.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-foreground/60 font-mono">Progress</span>
                  <span className="text-xs text-aerospace-blue font-mono">{challenge.progress || 0}%</span>
                </div>
                <div className="w-full h-2 bg-primary/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-aerospace-blue transition-all"
                    style={{ width: `${challenge.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                {challenge.completed ? (
                  <div className="flex items-center gap-1 text-aerospace-success text-xs font-mono">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </div>
                ) : (
                  <span className="text-xs text-foreground/60 font-mono">Not started</span>
                )}
                <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-aerospace-blue transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Challenge Details Modal */}
      {selectedChallenge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-primary border border-aerospace-blue/30 rounded-xl space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                {selectedChallenge.challengeName}
              </h3>
              <p className="text-sm text-foreground/70 mt-1">{selectedChallenge.description}</p>
            </div>
            <button
              onClick={() => setSelectedChallenge(null)}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Solution Steps */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-foreground text-sm">Solution Steps</h4>
            <div className="p-3 bg-primary/50 border border-secondary/20 rounded text-sm text-foreground/80 whitespace-pre-wrap">
              {selectedChallenge.solutionSteps}
            </div>
          </div>

          {/* Hints */}
          <div className="space-y-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-aerospace-blue hover:text-aerospace-accent transition-colors font-mono text-sm"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && selectedChallenge.hints && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-aerospace-warning/10 border border-aerospace-warning/30 rounded text-sm text-foreground/80"
              >
                {selectedChallenge.hints}
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <button className="flex-1 px-4 py-2 bg-aerospace-blue text-white font-mono text-sm font-bold rounded-lg hover:bg-aerospace-accent transition-colors">
              Start Challenge
            </button>
            <button
              onClick={() => setSelectedChallenge(null)}
              className="flex-1 px-4 py-2 border border-secondary/30 text-foreground font-mono text-sm font-bold rounded-lg hover:border-aerospace-blue/50 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
