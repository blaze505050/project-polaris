import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Folder,
  Calendar,
  User,
  Tag,
  Archive,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { useProjectStore } from '@/stores/projectStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';

interface ProjectItem {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  createdDate: string | Date;
  updatedDate: string | Date;
  owner?: string;
  tags?: string[];
}

export default function FixedProjectsPage() {
  const navigate = useNavigate();
  const { setCurrentProject, projects, setProjects } = useProjectStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived' | 'completed'>('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(false);
        // Mock data - in production would fetch from CMS
        const mockProjects: ProjectItem[] = [
          {
            _id: '1',
            name: 'Orbital Mechanics Study',
            description: 'Advanced N-body simulation research',
            status: 'active',
            createdDate: new Date('2024-01-15'),
            updatedDate: new Date('2024-02-20'),
            owner: 'Dr. Smith',
            tags: ['astrodynamics', 'research'],
          },
          {
            _id: '2',
            name: 'CFD Analysis - Wing Design',
            description: 'Aerodynamic optimization project',
            status: 'active',
            createdDate: new Date('2024-02-01'),
            updatedDate: new Date('2024-02-25'),
            owner: 'Dr. Johnson',
            tags: ['aerodynamics', 'optimization'],
          },
          {
            _id: '3',
            name: 'Black Hole Simulation',
            description: 'General relativity visualization',
            status: 'completed',
            createdDate: new Date('2023-12-10'),
            updatedDate: new Date('2024-01-30'),
            owner: 'Dr. Williams',
            tags: ['relativity', 'visualization'],
          },
        ];
        setProjects(mockProjects);
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };

    loadProjects();
  }, [setProjects]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    const newProject: ProjectItem = {
      _id: Date.now().toString(),
      name: newProjectName,
      status: 'active',
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    setProjects([...projects, newProject]);
    setNewProjectName('');
    setShowNewProjectModal(false);
  };

  const handleSelectProject = (project: ProjectItem) => {
    setCurrentProject(project);
    navigate(`/projects/${project._id}`);
  };

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground flex flex-col">
      <Header />

      <div className="flex flex-1">
        <CommandCenterSidebar />

        <main className="flex-1 max-w-[100rem] mx-auto px-6 py-8 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-aerospace-blue mb-2">Projects</h1>
                <p className="text-secondary-foreground">Manage your research and simulation projects</p>
              </div>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors"
              >
                <Plus size={20} />
                New Project
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-primary border border-secondary/30 rounded-lg text-foreground placeholder-secondary-foreground focus:outline-none focus:border-aerospace-blue"
                />
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-primary border border-secondary/30 rounded-lg text-foreground focus:outline-none focus:border-aerospace-blue"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-secondary-foreground">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12 border border-secondary/20 rounded-lg">
                <Folder size={48} className="mx-auto text-secondary-foreground mb-4 opacity-50" />
                <p className="text-secondary-foreground mb-4">No projects found</p>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors"
                >
                  Create First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-primary border border-secondary/20 rounded-lg p-6 hover:border-aerospace-blue/50 transition-all cursor-pointer group"
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Folder className="text-aerospace-blue" size={24} />
                      <span
                        className={`text-xs font-mono px-2 py-1 rounded ${
                          project.status === 'active'
                            ? 'bg-aerospace-success/20 text-aerospace-success'
                            : project.status === 'completed'
                            ? 'bg-aerospace-accent/20 text-aerospace-accent'
                            : 'bg-secondary/20 text-secondary-foreground'
                        }`}
                      >
                        {project.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-secondary-foreground mb-4 line-clamp-2">{project.description}</p>

                    <div className="space-y-2 text-xs text-secondary-foreground">
                      {project.owner && (
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          {project.owner}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(project.createdDate as any).toLocaleDateString()}
                      </div>
                    </div>

                    {project.tags && project.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary border border-secondary/30 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Create New Project</h2>
            <input
              type="text"
              placeholder="Project name..."
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              className="w-full px-4 py-2 bg-aerospace-dark border border-secondary/30 rounded-lg text-foreground placeholder-secondary-foreground focus:outline-none focus:border-aerospace-blue mb-4"
              onKeyPress={e => e.key === 'Enter' && handleCreateProject()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-4 py-2 bg-secondary/20 text-foreground rounded-lg hover:bg-secondary/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="flex-1 px-4 py-2 bg-aerospace-blue text-white rounded-lg hover:bg-aerospace-accent transition-colors"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
