/**
 * CAD Geometry Processing Service
 * Handles CAD file loading, validation, and geometry analysis
 */

import * as THREE from 'three';

export interface GeometryMetrics {
  volume: number;
  surfaceArea: number;
  boundingBox: {
    min: THREE.Vector3;
    max: THREE.Vector3;
    dimensions: THREE.Vector3;
  };
  centroid: THREE.Vector3;
  meshQuality: {
    vertexCount: number;
    triangleCount: number;
    averageEdgeLength: number;
    minEdgeLength: number;
    maxEdgeLength: number;
    aspectRatio: number;
  };
}

export interface CADGeometry {
  mesh: THREE.Mesh;
  geometry: THREE.BufferGeometry;
  metrics: GeometryMetrics;
  isValid: boolean;
  warnings: string[];
}

export class CADGeometryService {
  /**
   * Load and process STL file
   */
  static async loadSTLFile(file: File): Promise<CADGeometry> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const geometry = this.parseSTL(arrayBuffer);
          const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x0ea5e9 }));
          
          const metrics = this.calculateGeometryMetrics(geometry);
          const validation = this.validateGeometry(geometry, metrics);
          
          resolve({
            mesh,
            geometry,
            metrics,
            isValid: validation.isValid,
            warnings: validation.warnings,
          });
        } catch (error) {
          reject(new Error(`Failed to parse STL file: ${error}`));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Parse binary STL file
   */
  private static parseSTL(arrayBuffer: ArrayBuffer): THREE.BufferGeometry {
    const view = new DataView(arrayBuffer);
    const isASCII = this.isASCIISTL(arrayBuffer);
    
    if (isASCII) {
      return this.parseASCIISTL(new TextDecoder().decode(arrayBuffer));
    }
    
    return this.parseBinarySTL(view);
  }

  /**
   * Parse binary STL format
   */
  private static parseBinarySTL(view: DataView): THREE.BufferGeometry {
    const triangles = view.getUint32(80, true);
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const normals: number[] = [];
    
    let offset = 84;
    
    for (let i = 0; i < triangles; i++) {
      const nx = view.getFloat32(offset, true);
      const ny = view.getFloat32(offset + 4, true);
      const nz = view.getFloat32(offset + 8, true);
      offset += 12;
      
      for (let j = 0; j < 3; j++) {
        vertices.push(
          view.getFloat32(offset, true),
          view.getFloat32(offset + 4, true),
          view.getFloat32(offset + 8, true)
        );
        normals.push(nx, ny, nz);
        offset += 12;
      }
      
      offset += 2; // Attribute byte count
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
    geometry.computeVertexNormals();
    
    return geometry;
  }

  /**
   * Parse ASCII STL format
   */
  private static parseASCIISTL(text: string): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const normals: number[] = [];
    
    const vertexPattern = /vertex\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/g;
    const normalPattern = /facet normal\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/g;
    
    let normalMatch;
    let vertexMatch;
    let currentNormal = [0, 0, 0];
    
    while ((normalMatch = normalPattern.exec(text)) !== null) {
      currentNormal = [parseFloat(normalMatch[1]), parseFloat(normalMatch[3]), parseFloat(normalMatch[5])];
    }
    
    while ((vertexMatch = vertexPattern.exec(text)) !== null) {
      vertices.push(parseFloat(vertexMatch[1]), parseFloat(vertexMatch[3]), parseFloat(vertexMatch[5]));
      normals.push(...currentNormal);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
    geometry.computeVertexNormals();
    
    return geometry;
  }

  /**
   * Check if STL is ASCII format
   */
  private static isASCIISTL(arrayBuffer: ArrayBuffer): boolean {
    const view = new Uint8Array(arrayBuffer);
    const header = new TextDecoder().decode(view.slice(0, 5));
    return header.toLowerCase() === 'solid';
  }

  /**
   * Calculate comprehensive geometry metrics
   */
  private static calculateGeometryMetrics(geometry: THREE.BufferGeometry): GeometryMetrics {
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();
    
    const boundingBox = geometry.boundingBox!;
    const dimensions = new THREE.Vector3();
    boundingBox.getSize(dimensions);
    
    const centroid = new THREE.Vector3();
    boundingBox.getCenter(centroid);
    
    const positions = geometry.getAttribute('position').array as Float32Array;
    const vertexCount = positions.length / 3;
    const triangleCount = vertexCount / 3;
    
    // Calculate edge lengths
    let totalEdgeLength = 0;
    let minEdgeLength = Infinity;
    let maxEdgeLength = 0;
    let edgeCount = 0;
    
    for (let i = 0; i < positions.length; i += 9) {
      const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
      const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
      const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
      
      const e1 = v1.distanceTo(v2);
      const e2 = v2.distanceTo(v3);
      const e3 = v3.distanceTo(v1);
      
      totalEdgeLength += e1 + e2 + e3;
      minEdgeLength = Math.min(minEdgeLength, e1, e2, e3);
      maxEdgeLength = Math.max(maxEdgeLength, e1, e2, e3);
      edgeCount += 3;
    }
    
    const averageEdgeLength = totalEdgeLength / edgeCount;
    const aspectRatio = maxEdgeLength / (minEdgeLength || 1);
    
    // Calculate volume (using divergence theorem)
    let volume = 0;
    for (let i = 0; i < positions.length; i += 9) {
      const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
      const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
      const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
      
      volume += v1.dot(v2.cross(v3)) / 6;
    }
    
    // Calculate surface area
    let surfaceArea = 0;
    for (let i = 0; i < positions.length; i += 9) {
      const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
      const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
      const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
      
      const edge1 = v2.clone().sub(v1);
      const edge2 = v3.clone().sub(v1);
      const cross = edge1.cross(edge2);
      surfaceArea += cross.length() / 2;
    }
    
    return {
      volume: Math.abs(volume),
      surfaceArea,
      boundingBox: {
        min: boundingBox.min,
        max: boundingBox.max,
        dimensions,
      },
      centroid,
      meshQuality: {
        vertexCount,
        triangleCount,
        averageEdgeLength,
        minEdgeLength,
        maxEdgeLength,
        aspectRatio,
      },
    };
  }

  /**
   * Validate geometry quality
   */
  private static validateGeometry(
    geometry: THREE.BufferGeometry,
    metrics: GeometryMetrics
  ): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    
    if (metrics.volume === 0) {
      warnings.push('Geometry has zero volume - may be a surface or invalid mesh');
    }
    
    if (metrics.meshQuality.aspectRatio > 100) {
      warnings.push(`High aspect ratio (${metrics.meshQuality.aspectRatio.toFixed(1)}) - mesh may have quality issues`);
    }
    
    if (metrics.meshQuality.triangleCount < 100) {
      warnings.push('Mesh has very few triangles - may lack detail');
    }
    
    if (metrics.meshQuality.minEdgeLength < 0.001) {
      warnings.push('Mesh contains very small edges - may cause numerical issues');
    }
    
    // Check for non-manifold geometry
    const isManifold = this.checkManifoldGeometry(geometry);
    if (!isManifold) {
      warnings.push('Geometry may be non-manifold - could cause meshing issues');
    }
    
    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }

  /**
   * Check if geometry is manifold
   */
  private static checkManifoldGeometry(geometry: THREE.BufferGeometry): boolean {
    const positions = geometry.getAttribute('position').array as Float32Array;
    const edgeMap = new Map<string, number>();
    
    for (let i = 0; i < positions.length; i += 9) {
      const edges = [
        `${i},${i + 3}`,
        `${i + 3},${i + 6}`,
        `${i + 6},${i}`,
      ];
      
      for (const edge of edges) {
        edgeMap.set(edge, (edgeMap.get(edge) || 0) + 1);
      }
    }
    
    // Each edge should be shared by exactly 2 triangles
    for (const count of edgeMap.values()) {
      if (count !== 2) return false;
    }
    
    return true;
  }

  /**
   * Optimize geometry for CFD
   */
  static optimizeForCFD(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    
    // Remove duplicate vertices
    const positions = geometry.getAttribute('position').array as Float32Array;
    const uniquePositions: number[] = [];
    const indexMap = new Map<string, number>();
    const indices: number[] = [];
    
    for (let i = 0; i < positions.length; i += 3) {
      const key = `${positions[i]},${positions[i + 1]},${positions[i + 2]}`;
      
      if (!indexMap.has(key)) {
        indexMap.set(key, uniquePositions.length / 3);
        uniquePositions.push(positions[i], positions[i + 1], positions[i + 2]);
      }
      
      indices.push(indexMap.get(key)!);
    }
    
    const optimized = new THREE.BufferGeometry();
    optimized.setAttribute('position', new THREE.BufferAttribute(new Float32Array(uniquePositions), 3));
    optimized.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    optimized.computeVertexNormals();
    
    return optimized;
  }

  /**
   * Export Three.js BufferGeometry as ASCII STL file for CAD/CFD compatibility
   */
  static exportGeometryToSTL(geometry: THREE.BufferGeometry, filename: string = 'aeroforge-model.stl'): void {
    const position = geometry.getAttribute('position');
    const index = geometry.getIndex();

    let output = 'solid aeroforge_exported_mesh\n';

    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        const i1 = index.getX(i);
        const i2 = index.getX(i + 1);
        const i3 = index.getX(i + 2);

        const v1 = new THREE.Vector3(position.getX(i1), position.getY(i1), position.getZ(i1));
        const v2 = new THREE.Vector3(position.getX(i2), position.getY(i2), position.getZ(i2));
        const v3 = new THREE.Vector3(position.getX(i3), position.getY(i3), position.getZ(i3));

        const normal = new THREE.Vector3()
          .crossVectors(
            new THREE.Vector3().subVectors(v2, v1),
            new THREE.Vector3().subVectors(v3, v1)
          )
          .normalize();

        output += `  facet normal ${normal.x.toExponential(6)} ${normal.y.toExponential(6)} ${normal.z.toExponential(6)}\n`;
        output += '    outer loop\n';
        output += `      vertex ${v1.x.toExponential(6)} ${v1.y.toExponential(6)} ${v1.z.toExponential(6)}\n`;
        output += `      vertex ${v2.x.toExponential(6)} ${v2.y.toExponential(6)} ${v2.z.toExponential(6)}\n`;
        output += `      vertex ${v3.x.toExponential(6)} ${v3.y.toExponential(6)} ${v3.z.toExponential(6)}\n`;
        output += '    endloop\n';
        output += '  endfacet\n';
      }
    } else {
      for (let i = 0; i < position.count; i += 3) {
        const v1 = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i));
        const v2 = new THREE.Vector3(position.getX(i + 1), position.getY(i + 1), position.getZ(i + 1));
        const v3 = new THREE.Vector3(position.getX(i + 2), position.getY(i + 2), position.getZ(i + 2));

        const normal = new THREE.Vector3()
          .crossVectors(
            new THREE.Vector3().subVectors(v2, v1),
            new THREE.Vector3().subVectors(v3, v1)
          )
          .normalize();

        output += `  facet normal ${normal.x.toExponential(6)} ${normal.y.toExponential(6)} ${normal.z.toExponential(6)}\n`;
        output += '    outer loop\n';
        output += `      vertex ${v1.x.toExponential(6)} ${v1.y.toExponential(6)} ${v1.z.toExponential(6)}\n`;
        output += `      vertex ${v2.x.toExponential(6)} ${v2.y.toExponential(6)} ${v2.z.toExponential(6)}\n`;
        output += `      vertex ${v3.x.toExponential(6)} ${v3.y.toExponential(6)} ${v3.z.toExponential(6)}\n`;
        output += '    endloop\n';
        output += '  endfacet\n';
      }
    }

    output += 'endsolid aeroforge_exported_mesh\n';

    const blob = new Blob([output], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default CADGeometryService;
