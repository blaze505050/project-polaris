/**
 * PROJECT ARCHIVE EXPORT & IMPORT SERVICE (.aeroforge JSON format)
 * Allows users to download, backup, and restore complete project archives.
 */

import { Project } from '@/stores/projectStore';

export interface AeroForgeArchivePackage {
  format: 'aeroforge-archive-v1';
  exportedAt: string;
  version: string;
  project: Project;
}

export class ProjectArchiveService {
  /**
   * Export project into a formatted .aeroforge JSON payload
   */
  exportProject(project: Project): string {
    const archive: AeroForgeArchivePackage = {
      format: 'aeroforge-archive-v1',
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      project,
    };
    return JSON.stringify(archive, null, 2);
  }

  /**
   * Trigger browser file download of .aeroforge archive
   */
  downloadArchive(project: Project) {
    const jsonStr = this.exportProject(project);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.aeroforge`;

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Validate and parse an imported .aeroforge archive file content
   */
  parseArchive(fileContent: string): Project {
    const data = JSON.parse(fileContent);

    if (data.format !== 'aeroforge-archive-v1' || !data.project || !data.project.name) {
      throw new Error('Invalid .aeroforge archive format');
    }

    const proj = data.project;
    return {
      _id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: `${proj.name} (Restored)`,
      description: proj.description || 'Imported project archive.',
      status: proj.status || 'active',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      owner: proj.owner || 'Imported User',
      tags: proj.tags || ['imported'],
      requirements: proj.requirements || [],
      simulations: proj.simulations || [],
      datasets: proj.datasets || [],
      notebooks: proj.notebooks || [],
    };
  }
}

export const projectArchiveService = new ProjectArchiveService();
