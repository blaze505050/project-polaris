import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Download, Trash2, File, Folder, Eye, Share2 } from 'lucide-react';

interface DatasetFile {
  id: string;
  name: string;
  type: 'geometry' | 'mesh' | 'results' | 'other';
  size: number;
  uploadedAt: Date;
  format: string;
}

interface DatasetManagerProps {
  projectId: string;
}

export default function DatasetManager({ projectId }: DatasetManagerProps) {
  const [datasets, setDatasets] = useState<DatasetFile[]>([
    {
      id: '1',
      name: 'airfoil_geometry.step',
      type: 'geometry',
      size: 2.4,
      uploadedAt: new Date(Date.now() - 86400000),
      format: 'STEP',
    },
    {
      id: '2',
      name: 'mesh_refined_v2.msh',
      type: 'mesh',
      size: 15.8,
      uploadedAt: new Date(Date.now() - 43200000),
      format: 'Gmsh',
    },
    {
      id: '3',
      name: 'cfd_results_run1.h5',
      type: 'results',
      size: 342.5,
      uploadedAt: new Date(Date.now() - 3600000),
      format: 'HDF5',
    },
  ]);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<DatasetFile['type'] | 'all'>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const getTypeIcon = (type: DatasetFile['type']) => {
    switch (type) {
      case 'geometry':
        return '🔷';
      case 'mesh':
        return '🔶';
      case 'results':
        return '📊';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: DatasetFile['type']) => {
    switch (type) {
      case 'geometry':
        return 'text-aerospace-blue';
      case 'mesh':
        return 'text-aerospace-accent';
      case 'results':
        return 'text-aerospace-success';
      default:
        return 'text-secondary-foreground';
    }
  };

  const formatFileSize = (mb: number) => {
    if (mb > 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredDatasets = filterType === 'all' ? datasets : datasets.filter(d => d.type === filterType);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-primary border border-secondary/20 rounded-lg p-4"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-2 rounded transition-colors ${
              filterType === 'all'
                ? 'bg-aerospace-blue text-white'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('geometry')}
            className={`px-3 py-2 rounded transition-colors ${
              filterType === 'geometry'
                ? 'bg-aerospace-blue text-white'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            Geometry
          </button>
          <button
            onClick={() => setFilterType('mesh')}
            className={`px-3 py-2 rounded transition-colors ${
              filterType === 'mesh'
                ? 'bg-aerospace-blue text-white'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            Mesh
          </button>
          <button
            onClick={() => setFilterType('results')}
            className={`px-3 py-2 rounded transition-colors ${
              filterType === 'results'
                ? 'bg-aerospace-blue text-white'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            Results
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-secondary-foreground">
            {filteredDatasets.length} file{filteredDatasets.length !== 1 ? 's' : ''}
            {' '}
            ({formatFileSize(filteredDatasets.reduce((sum, f) => sum + f.size, 0))})
          </div>
          <button
            onClick={() => setShowUploadDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Dataset
          </button>
        </div>
      </motion.div>

      {/* Files List */}
      <div className="space-y-2">
        {filteredDatasets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary border border-secondary/20 rounded-lg p-12 text-center"
          >
            <Folder className="w-12 h-12 text-secondary-foreground mx-auto mb-4 opacity-50" />
            <p className="text-secondary-foreground mb-2">No datasets found</p>
            <p className="text-sm text-secondary-foreground">Upload geometry, meshes, or results files to get started</p>
          </motion.div>
        ) : (
          filteredDatasets.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedFile(file.id)}
              className={`bg-primary border border-secondary/20 rounded-lg p-4 cursor-pointer transition-all ${
                selectedFile === file.id ? 'border-aerospace-blue bg-primary/80' : 'hover:border-secondary/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl">{getTypeIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-medium truncate">{file.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-secondary-foreground mt-1">
                      <span className={`px-2 py-1 rounded bg-secondary/20 ${getTypeColor(file.type)}`}>
                        {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                      </span>
                      <span>{file.format}</span>
                      <span>{formatFileSize(file.size)}</span>
                      <span>{formatDate(file.uploadedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDatasets(datasets.filter(d => d.id !== file.id));
                      setSelectedFile(null);
                    }}
                    className="p-2 hover:bg-aerospace-danger/20 rounded transition-colors text-secondary-foreground hover:text-aerospace-danger"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowUploadDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-primary border border-secondary/20 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Upload Dataset</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-secondary/40 rounded-lg p-8 text-center hover:border-aerospace-blue transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-secondary-foreground mx-auto mb-2" />
                <p className="text-foreground font-medium">Drop files here or click to browse</p>
                <p className="text-sm text-secondary-foreground mt-1">Supported: STEP, STL, MSH, H5, VTK</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Dataset Type</label>
                <select className="w-full bg-aerospace-dark text-foreground px-3 py-2 rounded border border-secondary/20 focus:border-aerospace-blue focus:outline-none">
                  <option>Geometry</option>
                  <option>Mesh</option>
                  <option>Results</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowUploadDialog(false)}
                  className="flex-1 px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-foreground rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowUploadDialog(false)}
                  className="flex-1 px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
