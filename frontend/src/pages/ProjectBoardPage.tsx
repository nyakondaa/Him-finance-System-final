import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Grid3X3,
  Filter,
  Target,
  Users,
  Calendar,
  TrendingUp,
  Building,
  DollarSign,
  Clock,
  FileText,
  X
} from "lucide-react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getBranches,
  getCurrencies,
} from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuth from "../hooks/useAuth";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/helpers";
import ProjectFormModal from "@/components/ProjectFormModal";

// Progress calculation helper
const calculateProgress = (current, goal) => {
  if (!goal || goal === 0) return 0;
  const progress = (current / goal) * 100;
  return Math.min(Math.round(progress * 100) / 100, 100); // Round to 2 decimal places, max 100%
};

// Mock data for project details (remove when real API is ready)
const mockProjectMembers = [
  { id: 1, firstName: "John", lastName: "Doe" },
  { id: 2, firstName: "Jane", lastName: "Smith" },
  { id: 3, firstName: "Mike", lastName: "Johnson" }
];

const mockProjectContributions = [
  { id: 1, amount: 5000, currencyCode: "USD", memberId: "MEM001", date: "2024-01-15" },
  { id: 2, amount: 3000, currencyCode: "USD", memberId: "MEM002", date: "2024-01-10" },
  { id: 3, amount: 2000, currencyCode: "USD", memberId: "MEM003", date: "2024-01-05" }
];

// Project Details Modal Component
const ProjectDetailsModal = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) return null;

  const progress = calculateProgress(project.currentFunding, project.fundingGoal);
  const members = mockProjectMembers;
  const contributions = mockProjectContributions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{project.branchName}</span>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 ml-4"
          >
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Project Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-3">Project Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {project.description || "No description provided."}
                </p>
              </div>

              {/* Funding Progress */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Funding Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          progress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-700">
                        {formatCurrency(project.currentFunding, 'USD')}
                      </div>
                      <div className="text-blue-600 text-xs">Raised</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-700">
                        {formatCurrency(project.fundingGoal, 'USD')}
                      </div>
                      <div className="text-gray-600 text-xs">Goal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Metadata */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Project Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Created</span>
                    <p className="font-medium text-sm">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Last Updated</span>
                    <p className="font-medium text-sm">
                      {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Contributions</span>
                    <p className="font-medium text-sm">{project.transactionCount || 0}</p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Members
                </h3>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-semibold">
                          {member.firstName[0]}{member.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Contributions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Recent Contributions
            </h3>
            <div className="space-y-3">
              {contributions.map((contribution) => (
                <div key={contribution.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Member {contribution.memberId}</p>
                      <p className="text-sm text-gray-500">{contribution.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 text-lg">
                      {formatCurrency(contribution.amount, contribution.currencyCode)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Project Card Component for Grid View
const ProjectCard = ({ project, onEdit, onDelete, onViewDetails }) => {
  const progress = calculateProgress(project.currentFunding, project.fundingGoal);
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building className="w-4 h-4" />
              <span>{project.branchName}</span>
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description || "No description provided."}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Funding Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                progress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatCurrency(project.currentFunding, 'USD')}</span>
            <span>{formatCurrency(project.fundingGoal, 'USD')}</span>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recent'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{project.transactionCount || 0} contributions</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(project)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
          >
            View Details
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Edit project"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Project List View Component
const ProjectListView = ({ projects, onEdit, onDelete, onViewDetails, sortConfig, onSort }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50/80">
          <tr>
            {[
              { key: 'title', label: 'Project Name' },
              { key: 'branch', label: 'Branch' },
              { key: 'fundingGoal', label: 'Funding Goal' },
              { key: 'currentFunding', label: 'Raised' },
              { key: 'progress', label: 'Progress' },
              { key: 'status', label: 'Status' },
              { key: 'actions', label: 'Actions' }
            ].map(({ key, label }) => (
              <th
                key={key}
                onClick={() => key !== 'actions' && onSort(key)}
                className={`py-4 px-6 text-left text-sm font-semibold text-gray-700 ${
                  key !== 'actions' ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  {label}
                  {sortConfig.key === key && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {projects.map((project) => {
            const progress = calculateProgress(project.currentFunding, project.fundingGoal);
            return (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors group">
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-md">
                      {project.description || "No description provided."}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Building className="w-4 h-4" />
                    {project.branchName}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(project.fundingGoal, 'USD')}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-semibold text-green-600">
                    {formatCurrency(project.currentFunding, 'USD')}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 min-w-[40px]">
                      {progress}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={project.status} />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(project)}
                      className="px-3 py-1.5 text-xs font-medium flex items-center gap-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FileText className="w-3 h-3" /> Details
                    </button>
                    <button
                      onClick={() => onEdit(project)}
                      className="px-3 py-1.5 text-xs font-medium flex items-center gap-1 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="px-3 py-1.5 text-xs font-medium flex items-center gap-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ProjectBoardPage = ({ showModal }) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Disable background scroll when modal open
  useEffect(() => {
    if (isProjectModalOpen || isDetailsModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isProjectModalOpen, isDetailsModalOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isProjectModalOpen) {
          setIsProjectModalOpen(false);
          setCurrentProject(null);
        }
        if (isDetailsModalOpen) {
          setIsDetailsModalOpen(false);
          setSelectedProject(null);
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isProjectModalOpen, isDetailsModalOpen]);

  // Queries
  const {
    data: projects = [],
    isLoading: isLoadingProjects,
    error: projectsError,
    refetch: refetchProjects,
    isRefetching,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    onSuccess: (data) => {
      console.log("Projects data received:", data);
    },
    onError: (err) => {
      console.error("Projects error:", err);
      showModal?.(err.message || "Failed to load projects.", "Error");
    },
  });

  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
  });

  const { data: currencies = [] } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
  });

  // Statistics
  const projectStats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'ACTIVE').length;
    const completed = projects.filter(p => p.status === 'COMPLETED').length;
    const draft = projects.filter(p => p.status === 'DRAFT').length;
    const totalFunding = projects.reduce((sum, project) => 
      sum + (parseFloat(project.currentFunding) || 0), 0
    );
    const targetFunding = projects.reduce((sum, project) => 
      sum + (parseFloat(project.fundingGoal) || 0), 0
    );

    return { total, active, completed, draft, totalFunding, targetFunding };
  }, [projects]);

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      showModal?.("Project created successfully!", "Success");
      setIsProjectModalOpen(false);
      setCurrentProject(null);
    },
    onError: (err) =>
      showModal?.(err.message || "Failed to create project.", "Error"),
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      showModal?.("Project updated successfully!", "Success");
      setIsProjectModalOpen(false);
      setCurrentProject(null);
    },
    onError: (err) =>
      showModal?.(err.message || "Failed to update project.", "Error"),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      showModal?.("Project deleted successfully.", "Success");
    },
    onError: (err) => {
      console.error("Delete project error:", err);
      showModal?.(
        err.message || "Failed to delete project. It may have associated records.", 
        "Error"
      );
    },
  });

  // Sorting + Filtering
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...(projects || [])];

    if (statusFilter !== "all")
      filtered = filtered.filter((p) => p.status === statusFilter);
    if (branchFilter !== "all")
      filtered = filtered.filter((p) => p.branchId?.toString() === branchFilter);
    if (searchTerm)
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle nested properties and special cases
        if (sortConfig.key === 'branch') {
          // Use the branchName that already exists in the project data
          aVal = a.branchName;
          bVal = b.branchName;
        } else if (sortConfig.key === 'progress') {
          aVal = calculateProgress(a.currentFunding, a.fundingGoal);
          bVal = calculateProgress(b.currentFunding, b.fundingGoal);
        }
        
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [projects, sortConfig, searchTerm, statusFilter, branchFilter]);

  // Handlers
  const handleEditProject = (project) => {
    setCurrentProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCreateProject = () => {
    setCurrentProject(null);
    setIsProjectModalOpen(true);
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteProject = (id) => {
    showModal(
      "Are you sure you want to delete this project? This action cannot be undone.",
      "Confirm Deletion",
      true,
      () => deleteProjectMutation.mutate(id)
    );
  };

  const handleCloseModal = () => {
    setIsProjectModalOpen(false);
    setCurrentProject(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProject(null);
  };

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setBranchFilter("all");
  };

  if (isLoadingProjects) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white rounded-2xl shadow-lg border border-gray-100">
                <Grid3X3 className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  Project Portfolio
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage and track all projects across branches
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refetchProjects}
              disabled={isRefetching}
              className="p-3 rounded-2xl border border-gray-200 hover:bg-white bg-white/80 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
              title="Refresh projects"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${
                  isRefetching ? "animate-spin" : ""
                }`}
              />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-2xl border transition-all duration-200 flex items-center gap-2 font-medium ${
                showFilters 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              } shadow-sm`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={handleCreateProject}
              className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl hover:from-blue-700 hover:to-blue-800 shadow-lg flex items-center gap-2 font-medium transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{projectStats.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {projectStats.active} active, {projectStats.draft} draft
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Grid3X3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{projectStats.active}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {projectStats.completed} completed
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(projectStats.totalFunding, 'USD')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {formatCurrency(projectStats.targetFunding, 'USD')} goal
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {projectStats.total > 0 ? Math.round((projectStats.completed / projectStats.total) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  projects completed
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6 animate-in fade-in duration-300">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-grow w-full">
                <div className="relative flex-grow max-w-md">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 min-w-[160px]"
                  >
                    <option value="all">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 min-w-[180px]"
                  >
                    <option value="all">All Branches</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <button
                  onClick={clearFilters}
                  className="px-4 py-3.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex-1 lg:flex-none"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid/List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* View Controls */}
          <div className="p-6 border-b border-gray-200 bg-gray-50/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Projects ({filteredAndSortedProjects.length})
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {searchTerm || statusFilter !== 'all' || branchFilter !== 'all' 
                    ? 'Filtered results' 
                    : 'All projects'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-xl border border-gray-300 p-1 flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Content */}
          <div className="p-6">
            {filteredAndSortedProjects.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={handleEditProject}
                      onDelete={handleDeleteProject}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              ) : (
                <ProjectListView
                  projects={filteredAndSortedProjects}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  onViewDetails={handleViewDetails}
                  sortConfig={sortConfig}
                  onSort={requestSort}
                />
              )
            ) : (
              <EmptyState
                entity="projects"
                searchTerm={searchTerm}
                onCreate={handleCreateProject}
                onClearFilters={clearFilters}
                hasFilters={
                  !!searchTerm ||
                  statusFilter !== "all" ||
                  branchFilter !== "all"
                }
                canManage
              />
            )}
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />

      {/* Project Form Modal */}
      {isProjectModalOpen && (
        <ProjectFormModal
          isOpen={isProjectModalOpen}
          onClose={handleCloseModal}
          onCreate={(data) => {
            if (currentProject) {
              updateProjectMutation.mutate({ id: currentProject.id, data });
            } else {
              createProjectMutation.mutate(data);
            }
          }}
          project={currentProject}
          branches={branches}
          currencies={currencies}
          isLoading={createProjectMutation.isLoading || updateProjectMutation.isLoading}
        />
      )}
    </div>
  );
};

export default ProjectBoardPage;