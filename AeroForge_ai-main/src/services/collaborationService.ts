/**
 * Real-Time Collaboration Service
 * Handles multi-user collaboration, version control, and conflict resolution
 */

export interface CollaborationSession {
  id: string;
  projectId: string;
  participants: Participant[];
  startTime: Date;
  lastActivity: Date;
  isActive: boolean;
}

export interface Participant {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
  lastSeen: Date;
  cursorPosition?: { x: number; y: number };
  selectedElement?: string;
}

export interface ChangeEvent {
  id: string;
  userId: string;
  timestamp: Date;
  type: 'create' | 'update' | 'delete' | 'move' | 'rotate' | 'scale';
  elementId: string;
  oldValue?: any;
  newValue?: any;
  description: string;
}

export interface ConflictResolution {
  conflictId: string;
  changeA: ChangeEvent;
  changeB: ChangeEvent;
  resolution: 'keep-a' | 'keep-b' | 'merge' | 'manual';
  resolvedAt: Date;
}

class CollaborationService {
  private sessions: Map<string, CollaborationSession> = new Map();
  private changeHistory: Map<string, ChangeEvent[]> = new Map();
  private conflicts: Map<string, ConflictResolution> = new Map();

  /**
   * Create a new collaboration session
   */
  createSession(projectId: string, initiator: Participant): CollaborationSession {
    const session: CollaborationSession = {
      id: `session-${Date.now()}`,
      projectId,
      participants: [initiator],
      startTime: new Date(),
      lastActivity: new Date(),
      isActive: true,
    };

    this.sessions.set(session.id, session);
    this.changeHistory.set(session.id, []);

    return session;
  }

  /**
   * Add participant to session
   */
  addParticipant(sessionId: string, participant: Participant): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const exists = session.participants.some(p => p.userId === participant.userId);
    if (!exists) {
      session.participants.push(participant);
      session.lastActivity = new Date();
    }

    return true;
  }

  /**
   * Remove participant from session
   */
  removeParticipant(sessionId: string, userId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.participants = session.participants.filter(p => p.userId !== userId);
    session.lastActivity = new Date();

    if (session.participants.length === 0) {
      session.isActive = false;
    }

    return true;
  }

  /**
   * Record a change event
   */
  recordChange(sessionId: string, change: Omit<ChangeEvent, 'id'>): ChangeEvent {
    const changeEvent: ChangeEvent = {
      ...change,
      id: `change-${Date.now()}`,
    };

    const history = this.changeHistory.get(sessionId) || [];
    history.push(changeEvent);
    this.changeHistory.set(sessionId, history);

    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }

    return changeEvent;
  }

  /**
   * Get change history for a session
   */
  getChangeHistory(sessionId: string, limit: number = 100): ChangeEvent[] {
    const history = this.changeHistory.get(sessionId) || [];
    return history.slice(-limit);
  }

  /**
   * Detect conflicts between concurrent changes
   */
  detectConflicts(sessionId: string): ConflictResolution[] {
    const history = this.changeHistory.get(sessionId) || [];
    const conflicts: ConflictResolution[] = [];

    for (let i = 0; i < history.length - 1; i++) {
      const changeA = history[i];
      const changeB = history[i + 1];

      // Check if changes affect the same element
      if (changeA.elementId === changeB.elementId && changeA.userId !== changeB.userId) {
        // Check if changes are within 1 second (concurrent)
        const timeDiff = changeB.timestamp.getTime() - changeA.timestamp.getTime();
        if (timeDiff < 1000) {
          const resolution: ConflictResolution = {
            conflictId: `conflict-${Date.now()}`,
            changeA,
            changeB,
            resolution: 'merge',
            resolvedAt: new Date(),
          };

          conflicts.push(resolution);
          this.conflicts.set(resolution.conflictId, resolution);
        }
      }
    }

    return conflicts;
  }

  /**
   * Resolve a conflict
   */
  resolveConflict(
    conflictId: string,
    resolution: 'keep-a' | 'keep-b' | 'merge' | 'manual',
    mergedValue?: any
  ): boolean {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) return false;

    conflict.resolution = resolution;
    conflict.resolvedAt = new Date();

    return true;
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): CollaborationSession[] {
    return Array.from(this.sessions.values()).filter(s => s.isActive);
  }

  /**
   * Get session details
   */
  getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Update participant cursor position (for live cursors)
   */
  updateParticipantCursor(
    sessionId: string,
    userId: string,
    position: { x: number; y: number }
  ): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const participant = session.participants.find(p => p.userId === userId);
    if (!participant) return false;

    participant.cursorPosition = position;
    participant.lastSeen = new Date();
    session.lastActivity = new Date();

    return true;
  }

  /**
   * Update participant selection
   */
  updateParticipantSelection(
    sessionId: string,
    userId: string,
    elementId: string
  ): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const participant = session.participants.find(p => p.userId === userId);
    if (!participant) return false;

    participant.selectedElement = elementId;
    participant.lastSeen = new Date();
    session.lastActivity = new Date();

    return true;
  }

  /**
   * Generate collaboration report
   */
  generateReport(sessionId: string): any {
    const session = this.sessions.get(sessionId);
    const history = this.changeHistory.get(sessionId) || [];

    if (!session) return null;

    const changesByUser = new Map<string, number>();
    const changesByType = new Map<string, number>();

    history.forEach(change => {
      changesByUser.set(change.userId, (changesByUser.get(change.userId) || 0) + 1);
      changesByType.set(change.type, (changesByType.get(change.type) || 0) + 1);
    });

    return {
      sessionId,
      projectId: session.projectId,
      duration: new Date().getTime() - session.startTime.getTime(),
      participantCount: session.participants.length,
      totalChanges: history.length,
      changesByUser: Object.fromEntries(changesByUser),
      changesByType: Object.fromEntries(changesByType),
      participants: session.participants.map(p => ({
        name: p.name,
        role: p.role,
        joinedAt: p.joinedAt,
      })),
    };
  }

  /**
   * Export collaboration data
   */
  exportCollaborationData(sessionId: string): any {
    const session = this.sessions.get(sessionId);
    const history = this.changeHistory.get(sessionId) || [];

    return {
      session,
      history,
      conflicts: Array.from(this.conflicts.values()),
    };
  }
}

export const collaborationService = new CollaborationService();
