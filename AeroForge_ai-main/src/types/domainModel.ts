/**
 * AEROFORGE UNIFIED DOMAIN MODEL & ENTITY SCHEMA
 * Standardized schema for all 20 platform entities.
 * Every entity enforces persistent identity, digital thread provenance, and timestamping.
 */

export type EntityType =
  | 'User'
  | 'Organization'
  | 'Project'
  | 'Requirement'
  | 'Design'
  | 'Geometry'
  | 'Simulation'
  | 'Experiment'
  | 'Dataset'
  | 'Result'
  | 'OptimizationRun'
  | 'ValidationCase'
  | 'Notebook'
  | 'ResearchPaper'
  | 'Citation'
  | 'Report'
  | 'PublicArtifact'
  | 'ToolRun'
  | 'AIConversation'
  | 'AuditEvent';

export type EntityStatus =
  | 'draft'
  | 'active'
  | 'queued'
  | 'initializing'
  | 'running'
  | 'post_processing'
  | 'completed'
  | 'verified'
  | 'failed'
  | 'archived';

export interface EntityProvenance {
  sourceType?: EntityType;
  sourceId?: string;
  toolId?: string;
  solver?: string;
  method?: string;
  assumptions?: string[];
  dependencies?: string[];
  referenceDoi?: string;
}

export interface BaseEntity {
  id: string;
  projectId?: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  version: string;
  status: EntityStatus;
  provenance: EntityProvenance;
}

// ─── 1. User & Organization ──────────────────────────────────────────────────

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'Student' | 'Researcher' | 'Engineer' | 'Educator' | 'Admin';
  organizationId?: string;
  preferences: {
    unitSystem: 'SI' | 'Metric' | 'Imperial';
    userMode: 'student' | 'professional';
    reducedMotion: boolean;
  };
}

export interface Organization extends BaseEntity {
  name: string;
  domain?: string;
  tier: 'Free' | 'Pro' | 'Research' | 'Enterprise';
}

// ─── 2. Core Project & Requirements ──────────────────────────────────────────

export interface ProjectEntity extends BaseEntity {
  name: string;
  description: string;
  domain: 'Aerospace' | 'Mechanical' | 'Astrospace';
  tags: string[];
  healthIndex: number; // 0 - 100%
  requirementIds: string[];
  designIds: string[];
  experimentIds: string[];
}

export interface RequirementEntity extends BaseEntity {
  code: string; // e.g. REQ-AERO-01
  title: string;
  description: string;
  targetMetric: string;
  targetValue: number;
  operator: '>' | '<' | '>=' | '<=' | '==';
  unit: string;
  verificationStatus: 'unverified' | 'in_progress' | 'verified' | 'failed';
}

// ─── 3. Engineering Design & Geometry ───────────────────────────────────────

export interface DesignEntity extends BaseEntity {
  name: string;
  description: string;
  parameters: Record<string, number | string | boolean>;
  geometryId?: string;
  parentDesignId?: string;
}

export interface GeometryEntity extends BaseEntity {
  name: string;
  format: 'naca' | 'step' | 'stl' | 'iges' | 'obj';
  coordinateData?: { x: number; y: number; z?: number }[];
  fileUrl?: string;
  maxThickness?: number;
  maxCamber?: number;
}

// ─── 4. Simulation & Compute Job ──────────────────────────────────────────────

export interface SimulationEntity extends BaseEntity {
  name: string;
  solver: 'PrandtlGlauert' | 'EulerBernoulli' | 'ISAStandard' | 'KeplerianTwoBody' | 'OpenFOAM' | 'SU2';
  inputs: Record<string, number | string>;
  outputs?: Record<string, number | string>;
  residuals?: { iteration: number; value: number }[];
  durationMs?: number;
  resultId?: string;
}

// ─── 5. Experiment & Datasets ─────────────────────────────────────────────────

export interface ExperimentEntity extends BaseEntity {
  name: string;
  hypothesis: string;
  variables: string[];
  sweepMatrix: Record<string, number[]>;
  resultIds: string[];
  datasetIds: string[];
  notes?: string;
}

export interface DatasetEntity extends BaseEntity {
  name: string;
  description: string;
  format: 'csv' | 'json' | 'parquet';
  rowCount: number;
  variables: string[];
  sampleData?: Record<string, any>[];
  fileUrl?: string;
}

// ─── 6. Results & Optimization ───────────────────────────────────────────────

export interface ResultEntity extends BaseEntity {
  name: string;
  metrics: Record<string, { value: number | string; unit: string }>;
  visualData?: any;
  interpretation?: string;
  isVerified: boolean;
}

export interface OptimizationRunEntity extends BaseEntity {
  name: string;
  objectiveFunction: string;
  paretoPoints: { parameters: Record<string, number>; score: number }[];
  optimalPoint: Record<string, number>;
}

// ─── 7. Validation & Notebook ────────────────────────────────────────────────

export interface ValidationCaseEntity extends BaseEntity {
  name: string;
  referenceSource: string;
  referenceValue: number;
  calculatedValue: number;
  errorPercentage: number;
  tolerancePercentage: number;
  passed: boolean;
}

export interface NotebookEntity extends BaseEntity {
  title: string;
  contentMarkdown: string;
  latexEquations: string[];
  linkedResultIds: string[];
}

// ─── 8. Research & Citations ─────────────────────────────────────────────────

export interface ResearchPaperEntity extends BaseEntity {
  title: string;
  authors: string[];
  year: number;
  doi?: string;
  arxivId?: string;
  journal?: string;
  abstract: string;
  pdfUrl?: string;
  citationsCount?: number;
}

export interface CitationEntity extends BaseEntity {
  paperId: string;
  formatBibTeX: string;
  formatIEEE: string;
  formatAPA: string;
}

// ─── 9. Reports & Public Artifacts ────────────────────────────────────────────

export interface ReportEntity extends BaseEntity {
  title: string;
  executiveSummary: string;
  sections: { title: string; content: string }[];
  linkedResultIds: string[];
  pdfDownloadUrl?: string;
}

export interface PublicArtifactEntity extends BaseEntity {
  title: string;
  description: string;
  shareToken: string;
  viewsCount: number;
  forksCount: number;
  publicUrl: string;
}

// ─── 10. System Logs & Audit ─────────────────────────────────────────────────

export interface ToolRunEntity extends BaseEntity {
  toolId: string;
  executionTimeMs: number;
  wasSuccessful: boolean;
  errorMessage?: string;
}

export interface AIConversationEntity extends BaseEntity {
  prompt: string;
  response: string;
  accessedContextIds: string[];
  modelUsed: string;
}

export interface AuditEventEntity extends BaseEntity {
  eventType: string;
  ipAddress?: string;
  details: Record<string, any>;
}
