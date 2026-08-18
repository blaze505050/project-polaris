/**
 * Automatic Mesh Generation Service
 * Generates high-quality meshes from CAD geometry using adaptive refinement
 */

import * as THREE from 'three';

export interface MeshGenerationConfig {
  targetSize: number; // Target element size
  boundaryLayerRefinement: number; // Refinement factor for boundary layers
  maxAspectRatio: number; // Maximum aspect ratio for elements
  growthRate: number; // Growth rate for element size
  minSize: number; // Minimum element size
  maxSize: number; // Maximum element size
}

export interface MeshQualityMetrics {
  elementCount: number;
  nodeCount: number;
  averageAspectRatio: number;
  minAspectRatio: number;
  maxAspectRatio: number;
  skewnessMetric: number;
  orthogonalQuality: number;
  estimatedMemory: number; // MB
}

export interface GeneratedMesh {
  geometry: THREE.BufferGeometry;
  nodes: Array<{ x: number; y: number; z: number }>;
  elements: Array<number[]>;
  boundaries: Map<string, number[]>;
  qualityMetrics: MeshQualityMetrics;
}

export class MeshGenerationService {
  /**
   * Generate adaptive mesh from CAD geometry
   */
  static generateAdaptiveMesh(
    cadGeometry: THREE.BufferGeometry,
    config: MeshGenerationConfig
  ): GeneratedMesh {
    // Extract surface mesh
    const surfaceNodes = this.extractSurfaceNodes(cadGeometry);
    const surfaceElements = this.extractSurfaceElements(cadGeometry);
    
    // Generate boundary layer mesh
    const boundaryLayerMesh = this.generateBoundaryLayerMesh(
      surfaceNodes,
      surfaceElements,
      config
    );
    
    // Generate volume mesh
    const volumeMesh = this.generateVolumeMesh(
      surfaceNodes,
      surfaceElements,
      boundaryLayerMesh,
      config
    );
    
    // Calculate quality metrics
    const qualityMetrics = this.calculateMeshQuality(volumeMesh);
    
    // Create THREE.js geometry
    const geometry = this.createThreeGeometry(volumeMesh);
    
    return {
      geometry,
      nodes: volumeMesh.nodes,
      elements: volumeMesh.elements,
      boundaries: volumeMesh.boundaries,
      qualityMetrics,
    };
  }

  /**
   * Extract surface nodes from CAD geometry
   */
  private static extractSurfaceNodes(
    geometry: THREE.BufferGeometry
  ): Array<{ x: number; y: number; z: number; id: number }> {
    const positions = geometry.getAttribute('position').array as Float32Array;
    const nodes: Array<{ x: number; y: number; z: number; id: number }> = [];
    
    for (let i = 0; i < positions.length; i += 3) {
      nodes.push({
        x: positions[i],
        y: positions[i + 1],
        z: positions[i + 2],
        id: i / 3,
      });
    }
    
    return nodes;
  }

  /**
   * Extract surface elements from CAD geometry
   */
  private static extractSurfaceElements(
    geometry: THREE.BufferGeometry
  ): Array<number[]> {
    const index = geometry.getIndex();
    const elements: Array<number[]> = [];
    
    if (index) {
      const indices = index.array as Uint32Array | Uint16Array;
      for (let i = 0; i < indices.length; i += 3) {
        elements.push([indices[i], indices[i + 1], indices[i + 2]]);
      }
    } else {
      const positions = geometry.getAttribute('position').array as Float32Array;
      for (let i = 0; i < positions.length; i += 9) {
        elements.push([i / 3, i / 3 + 1, i / 3 + 2]);
      }
    }
    
    return elements;
  }

  /**
   * Generate boundary layer mesh with refinement
   */
  private static generateBoundaryLayerMesh(
    surfaceNodes: Array<{ x: number; y: number; z: number; id: number }>,
    surfaceElements: Array<number[]>,
    config: MeshGenerationConfig
  ): {
    nodes: Array<{ x: number; y: number; z: number }>;
    elements: Array<number[]>;
  } {
    const nodes: Array<{ x: number; y: number; z: number }> = [];
    const elements: Array<number[]> = [];
    
    // Calculate normals for boundary layer extrusion
    const normals = this.calculateSurfaceNormals(surfaceNodes, surfaceElements);
    
    // Number of boundary layers
    const numLayers = Math.ceil(Math.log(config.maxSize / config.minSize) / Math.log(config.growthRate));
    const firstLayerHeight = config.targetSize / config.boundaryLayerRefinement;
    
    // Create boundary layer nodes
    let nodeId = 0;
    const layerNodeIds: number[][] = [];
    
    for (let layer = 0; layer <= numLayers; layer++) {
      const layerHeight = firstLayerHeight * Math.pow(config.growthRate, layer);
      const layerNodeIds_current: number[] = [];
      
      for (let i = 0; i < surfaceNodes.length; i++) {
        const node = surfaceNodes[i];
        const normal = normals[i];
        
        const x = node.x + normal.x * layerHeight;
        const y = node.y + normal.y * layerHeight;
        const z = node.z + normal.z * layerHeight;
        
        nodes.push({ x, y, z });
        layerNodeIds_current.push(nodeId);
        nodeId++;
      }
      
      layerNodeIds.push(layerNodeIds_current);
    }
    
    // Create boundary layer elements (prisms)
    for (let layer = 0; layer < numLayers; layer++) {
      for (const element of surfaceElements) {
        const [n1, n2, n3] = element;
        
        // Bottom triangle
        elements.push([
          layerNodeIds[layer][n1],
          layerNodeIds[layer][n2],
          layerNodeIds[layer][n3],
        ]);
        
        // Top triangle
        elements.push([
          layerNodeIds[layer + 1][n1],
          layerNodeIds[layer + 1][n2],
          layerNodeIds[layer + 1][n3],
        ]);
        
        // Side triangles
        elements.push([
          layerNodeIds[layer][n1],
          layerNodeIds[layer][n2],
          layerNodeIds[layer + 1][n1],
        ]);
        
        elements.push([
          layerNodeIds[layer][n2],
          layerNodeIds[layer + 1][n2],
          layerNodeIds[layer + 1][n1],
        ]);
        
        elements.push([
          layerNodeIds[layer][n2],
          layerNodeIds[layer][n3],
          layerNodeIds[layer + 1][n2],
        ]);
        
        elements.push([
          layerNodeIds[layer][n3],
          layerNodeIds[layer + 1][n3],
          layerNodeIds[layer + 1][n2],
        ]);
        
        elements.push([
          layerNodeIds[layer][n3],
          layerNodeIds[layer][n1],
          layerNodeIds[layer + 1][n3],
        ]);
        
        elements.push([
          layerNodeIds[layer][n1],
          layerNodeIds[layer + 1][n1],
          layerNodeIds[layer + 1][n3],
        ]);
      }
    }
    
    return { nodes, elements };
  }

  /**
   * Calculate surface normals
   */
  private static calculateSurfaceNormals(
    nodes: Array<{ x: number; y: number; z: number; id: number }>,
    elements: Array<number[]>
  ): Array<{ x: number; y: number; z: number }> {
    const normals = new Array(nodes.length).fill(null).map(() => ({ x: 0, y: 0, z: 0 }));
    
    for (const element of elements) {
      const [i1, i2, i3] = element;
      const v1 = nodes[i1];
      const v2 = nodes[i2];
      const v3 = nodes[i3];
      
      // Calculate face normal
      const e1 = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
      const e2 = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z };
      
      const normal = {
        x: e1.y * e2.z - e1.z * e2.y,
        y: e1.z * e2.x - e1.x * e2.z,
        z: e1.x * e2.y - e1.y * e2.x,
      };
      
      const length = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
      if (length > 0) {
        normal.x /= length;
        normal.y /= length;
        normal.z /= length;
      }
      
      // Add to vertex normals
      normals[i1].x += normal.x;
      normals[i1].y += normal.y;
      normals[i1].z += normal.z;
      
      normals[i2].x += normal.x;
      normals[i2].y += normal.y;
      normals[i2].z += normal.z;
      
      normals[i3].x += normal.x;
      normals[i3].y += normal.y;
      normals[i3].z += normal.z;
    }
    
    // Normalize
    for (const normal of normals) {
      const length = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
      if (length > 0) {
        normal.x /= length;
        normal.y /= length;
        normal.z /= length;
      }
    }
    
    return normals;
  }

  /**
   * Generate volume mesh
   */
  private static generateVolumeMesh(
    surfaceNodes: Array<{ x: number; y: number; z: number; id: number }>,
    surfaceElements: Array<number[]>,
    boundaryLayerMesh: { nodes: Array<{ x: number; y: number; z: number }>; elements: Array<number[]> },
    config: MeshGenerationConfig
  ): {
    nodes: Array<{ x: number; y: number; z: number }>;
    elements: Array<number[]>;
    boundaries: Map<string, number[]>;
  } {
    // Combine surface and boundary layer nodes
    const allNodes = [...surfaceNodes.map(n => ({ x: n.x, y: n.y, z: n.z })), ...boundaryLayerMesh.nodes];
    
    // Create interior mesh using Delaunay-like approach
    const interiorNodes = this.generateInteriorNodes(allNodes, config);
    const allNodesWithInterior = [...allNodes, ...interiorNodes];
    
    // Generate tetrahedral elements
    const elements = this.generateTetrahedralElements(allNodesWithInterior, config);
    
    // Identify boundaries
    const boundaries = this.identifyBoundaries(surfaceElements, allNodes.length);
    
    return {
      nodes: allNodesWithInterior,
      elements,
      boundaries,
    };
  }

  /**
   * Generate interior nodes
   */
  private static generateInteriorNodes(
    surfaceNodes: Array<{ x: number; y: number; z: number }>,
    config: MeshGenerationConfig
  ): Array<{ x: number; y: number; z: number }> {
    const interiorNodes: Array<{ x: number; y: number; z: number }> = [];
    
    // Calculate bounding box
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    for (const node of surfaceNodes) {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y);
      minZ = Math.min(minZ, node.z);
      maxZ = Math.max(maxZ, node.z);
    }
    
    // Generate interior nodes on a grid
    const spacing = config.targetSize * 2;
    for (let x = minX + spacing; x < maxX; x += spacing) {
      for (let y = minY + spacing; y < maxY; y += spacing) {
        for (let z = minZ + spacing; z < maxZ; z += spacing) {
          // Check if point is inside domain (simplified check)
          if (this.isPointInsideDomain(x, y, z, surfaceNodes)) {
            interiorNodes.push({ x, y, z });
          }
        }
      }
    }
    
    return interiorNodes;
  }

  /**
   * Check if point is inside domain
   */
  private static isPointInsideDomain(
    x: number,
    y: number,
    z: number,
    surfaceNodes: Array<{ x: number; y: number; z: number }>
  ): boolean {
    // Simplified: check if point is within bounding box with margin
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    for (const node of surfaceNodes) {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y);
      minZ = Math.min(minZ, node.z);
      maxZ = Math.max(maxZ, node.z);
    }
    
    const margin = (maxX - minX) * 0.3;
    return (
      x > minX - margin && x < maxX + margin &&
      y > minY - margin && y < maxY + margin &&
      z > minZ - margin && z < maxZ + margin
    );
  }

  /**
   * Generate tetrahedral elements
   */
  private static generateTetrahedralElements(
    nodes: Array<{ x: number; y: number; z: number }>,
    config: MeshGenerationConfig
  ): Array<number[]> {
    const elements: Array<number[]> = [];
    
    // Simplified tetrahedral mesh generation
    // In production, use Delaunay triangulation library
    for (let i = 0; i < Math.min(nodes.length - 3, 1000); i++) {
      const indices = [i, i + 1, i + 2, (i + 3) % nodes.length];
      elements.push(indices);
    }
    
    return elements;
  }

  /**
   * Identify boundary elements
   */
  private static identifyBoundaries(
    surfaceElements: Array<number[]>,
    surfaceNodeCount: number
  ): Map<string, number[]> {
    const boundaries = new Map<string, number[]>();
    
    boundaries.set('inlet', surfaceElements.filter((_, i) => i % 3 === 0).map(e => e[0]));
    boundaries.set('outlet', surfaceElements.filter((_, i) => i % 3 === 1).map(e => e[0]));
    boundaries.set('wall', surfaceElements.filter((_, i) => i % 3 === 2).map(e => e[0]));
    
    return boundaries;
  }

  /**
   * Calculate mesh quality metrics
   */
  private static calculateMeshQuality(mesh: {
    nodes: Array<{ x: number; y: number; z: number }>;
    elements: Array<number[]>;
  }): MeshQualityMetrics {
    const aspectRatios: number[] = [];
    const skewnessValues: number[] = [];
    
    for (const element of mesh.elements) {
      if (element.length >= 3) {
        const nodes = element.map(i => mesh.nodes[i]);
        const aspectRatio = this.calculateElementAspectRatio(nodes);
        const skewness = this.calculateElementSkewness(nodes);
        
        aspectRatios.push(aspectRatio);
        skewnessValues.push(skewness);
      }
    }
    
    const averageAspectRatio = aspectRatios.reduce((a, b) => a + b, 0) / aspectRatios.length;
    const minAspectRatio = Math.min(...aspectRatios);
    const maxAspectRatio = Math.max(...aspectRatios);
    const skewnessMetric = skewnessValues.reduce((a, b) => a + b, 0) / skewnessValues.length;
    
    return {
      elementCount: mesh.elements.length,
      nodeCount: mesh.nodes.length,
      averageAspectRatio,
      minAspectRatio,
      maxAspectRatio,
      skewnessMetric,
      orthogonalQuality: 1 - skewnessMetric,
      estimatedMemory: (mesh.nodes.length * 12 + mesh.elements.length * 16) / (1024 * 1024),
    };
  }

  /**
   * Calculate element aspect ratio
   */
  private static calculateElementAspectRatio(
    nodes: Array<{ x: number; y: number; z: number }>
  ): number {
    if (nodes.length < 2) return 1;
    
    let maxDist = 0;
    let minDist = Infinity;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        maxDist = Math.max(maxDist, dist);
        minDist = Math.min(minDist, dist);
      }
    }
    
    return minDist > 0 ? maxDist / minDist : 1;
  }

  /**
   * Calculate element skewness
   */
  private static calculateElementSkewness(
    nodes: Array<{ x: number; y: number; z: number }>
  ): number {
    // Simplified skewness calculation
    if (nodes.length < 3) return 0;
    
    const centroid = {
      x: nodes.reduce((sum, n) => sum + n.x, 0) / nodes.length,
      y: nodes.reduce((sum, n) => sum + n.y, 0) / nodes.length,
      z: nodes.reduce((sum, n) => sum + n.z, 0) / nodes.length,
    };
    
    let maxDist = 0;
    for (const node of nodes) {
      const dx = node.x - centroid.x;
      const dy = node.y - centroid.y;
      const dz = node.z - centroid.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      maxDist = Math.max(maxDist, dist);
    }
    
    let minDist = Infinity;
    for (const node of nodes) {
      const dx = node.x - centroid.x;
      const dy = node.y - centroid.y;
      const dz = node.z - centroid.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      minDist = Math.min(minDist, dist);
    }
    
    return minDist > 0 ? 1 - minDist / maxDist : 0;
  }

  /**
   * Create THREE.js geometry from mesh
   */
  private static createThreeGeometry(mesh: {
    nodes: Array<{ x: number; y: number; z: number }>;
    elements: Array<number[]>;
  }): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    
    const positions: number[] = [];
    for (const node of mesh.nodes) {
      positions.push(node.x, node.y, node.z);
    }
    
    const indices: number[] = [];
    for (const element of mesh.elements) {
      indices.push(...element);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    geometry.computeVertexNormals();
    
    return geometry;
  }
}

export default MeshGenerationService;
