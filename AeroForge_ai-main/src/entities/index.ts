/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: aerospacetemplates
 * Interface for AerospaceTemplates
 */
export interface AerospaceTemplates {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType url */
  templateFileUrl?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  previewImage?: string;
}


/**
 * Collection ID: airfoilprofiles
 * Interface for AirfoilProfiles
 */
export interface AirfoilProfiles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  profileName?: string;
  /** @wixFieldType text */
  coordinatesData?: string;
  /** @wixFieldType number */
  maximumThickness?: number;
  /** @wixFieldType number */
  maximumCamber?: number;
  /** @wixFieldType number */
  designReynoldsNumber?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profileImage?: string;
}


/**
 * Collection ID: aisuggestions
 * Interface for AISuggestions
 */
export interface AISuggestions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  suggestionText?: string;
  /** @wixFieldType number */
  confidenceScore?: number;
  /** @wixFieldType number */
  relevanceScore?: number;
  /** @wixFieldType text */
  contextDescription?: string;
  /** @wixFieldType text */
  suggestionType?: string;
  /** @wixFieldType datetime */
  generatedTimestamp?: Date | string;
}


/**
 * Collection ID: antigoals
 * Interface for AntiGoals
 */
export interface AntiGoals {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  statement?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  rationale?: string;
  /** @wixFieldType text */
  consequence?: string;
  /** @wixFieldType text */
  reinforcesPrinciple?: string;
}


/**
 * Collection ID: architectureprinciples
 * Interface for ArchitecturePrinciples
 */
export interface ArchitecturePrinciples {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  principleTitle?: string;
  /** @wixFieldType text */
  detailedExplanation?: string;
  /** @wixFieldType text */
  analogyUsed?: string;
  /** @wixFieldType text */
  keyConcepts?: string;
  /** @wixFieldType text */
  diagramText?: string;
  /** @wixFieldType text */
  relatedAntiGoals?: string;
}


/**
 * Collection ID: cadprojects
 * Interface for CADProjects
 */
export interface CADProjects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectTitle?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType text */
  owner?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  thumbnail?: string;
  /** @wixFieldType datetime */
  creationDate?: Date | string;
  /** @wixFieldType datetime */
  lastModifiedDate?: Date | string;
}


/**
 * Collection ID: casestudies
 * Interface for CaseStudies
 */
export interface CaseStudies {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectName?: string;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType text */
  industrySector?: string;
  /** @wixFieldType text */
  projectOverview?: string;
  /** @wixFieldType text */
  keyChallenge?: string;
  /** @wixFieldType text */
  solutionImplemented?: string;
  /** @wixFieldType number */
  performanceImprovement?: number;
  /** @wixFieldType number */
  costReduction?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  mainProjectImage?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  beforeImage?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  afterImage?: string;
}


/**
 * Collection ID: certifications
 * Interface for Certifications
 */
export interface Certifications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  certificationName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  complianceStandard?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType date */
  expiryDate?: Date | string;
  /** @wixFieldType url */
  auditTrailLink?: string;
}


/**
 * Collection ID: cfddatasets
 * Interface for CFDDatasets
 */
export interface CFDDatasets {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  datasetName?: string;
  /** @wixFieldType url */
  modelFile?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  simulationParameters?: string;
  /** @wixFieldType url */
  dataDownloadUrl?: string;
  /** @wixFieldType text */
  category?: string;
}


/**
 * Collection ID: corephilosophy
 * Interface for CorePhilosophy
 */
export interface CorePhilosophy {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  philosophyTitle?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  emphasisKeyword?: string;
  /** @wixFieldType number */
  displayOrder?: number;
  /** @wixFieldType boolean */
  isKeyPrinciple?: boolean;
}


/**
 * Collection ID: designversions
 * Interface for DesignVersions
 */
export interface DesignVersions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  versionNumber?: string;
  /** @wixFieldType text */
  versionName?: string;
  /** @wixFieldType text */
  changeLog?: string;
  /** @wixFieldType datetime */
  creationTimestamp?: Date | string;
  /** @wixFieldType text */
  status?: string;
}


/**
 * Collection ID: experimentreports
 * Interface for ExperimentReports
 */
export interface ExperimentReports {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  reportTitle?: string;
  /** @wixFieldType text */
  analysisSummary?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  dataVisualizationChart?: string;
  /** @wixFieldType text */
  conclusionsFindings?: string;
  /** @wixFieldType datetime */
  reportDate?: Date | string;
  /** @wixFieldType text */
  authorName?: string;
  /** @wixFieldType number */
  reportVersion?: number;
}


/**
 * Collection ID: experiments
 * Interface for Experiments
 */
export interface Experiments {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  experimentName?: string;
  /** @wixFieldType text */
  parameters?: string;
  /** @wixFieldType text */
  results?: string;
  /** @wixFieldType datetime */
  conductedAt?: Date | string;
  /** @wixFieldType text */
  userNotes?: string;
  /** @wixFieldType text */
  status?: string;
}


/**
 * Collection ID: knowledgebasearticles
 * Interface for KnowledgeBaseArticles
 */
export interface KnowledgeBaseArticles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  summary?: string;
  /** @wixFieldType text */
  content?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  subcategory?: string;
  /** @wixFieldType text */
  difficultyLevel?: string;
  /** @wixFieldType date */
  publicationDate?: Date | string;
  /** @wixFieldType text */
  author?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  mainImage?: string;
  /** @wixFieldType text */
  relatedTopics?: string;
}


/**
 * Collection ID: labmodes
 * Interface for LabModes
 */
export interface LabModes {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  modeName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType text */
  defaultPermissions?: string;
  /** @wixFieldType text */
  configurationSettings?: string;
  /** @wixFieldType text */
  targetAudience?: string;
}


/**
 * Collection ID: mechanicaltemplates
 * Interface for MechanicalTemplates
 */
export interface MechanicalTemplates {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType url */
  templateFileUrl?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  previewImage?: string;
  /** @wixFieldType text */
  version?: string;
}


/**
 * Collection ID: researchpapers
 * Interface for ResearchPapers
 */
export interface ResearchPapers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  abstract?: string;
  /** @wixFieldType text */
  authors?: string;
  /** @wixFieldType text */
  arxivId?: string;
  /** @wixFieldType text */
  ieeeId?: string;
  /** @wixFieldType url */
  pdfUrl?: string;
  /** @wixFieldType text */
  researchTopic?: string;
  /** @wixFieldType date */
  publicationDate?: Date | string;
}


/**
 * Collection ID: roboticstemplates
 * Interface for RoboticsTemplates
 */
export interface RoboticsTemplates {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType url */
  templateFileUrl?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  previewImage?: string;
}


/**
 * Collection ID: simulations
 * Interface for Simulations
 */
export interface Simulations {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  simulationName?: string;
  /** @wixFieldType text */
  simulationType?: string;
  /** @wixFieldType text */
  inputParameters?: string;
  /** @wixFieldType text */
  resultSummary?: string;
  /** @wixFieldType boolean */
  successStatus?: boolean;
  /** @wixFieldType datetime */
  simulationDate?: Date | string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  visualizations?: string;
}


/**
 * Collection ID: spacechallenges
 * Interface for SpaceChallenges
 */
export interface SpaceChallenges {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  challengeName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  difficultyLevel?: string;
  /** @wixFieldType text */
  solutionSteps?: string;
  /** @wixFieldType text */
  hints?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  challengeImage?: string;
}
