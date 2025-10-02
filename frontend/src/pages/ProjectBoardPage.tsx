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
  List,
} from "lucide-react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  getProjectContributions,
  getBranches,
  getCurrencies,
} from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuth from "../hooks/useAuth";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/helpers";
import ProjectFormModal from "@/components/ProjectFormModal";

const ProjectBoardPage = ({ showModal }) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [expandedProject, setExpandedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  // Disable background scroll when modal open
  useEffect(() => {
    if (isProjectModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isProjectModalOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isProjectModalOpen) {
        setIsProjectModalOpen(false);
        setCurrentProject(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isProjectModalOpen]);

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

  // Helpers
  const getBranchName = useCallback(
    (code) => branches.find((b) => b.code === code)?.name || code,
    [branches]
  );

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
      filtered = filtered.filter((p) => p.branchCode === branchFilter);
    if (searchTerm)
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
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

  const handleDeleteProject = (id) => {
    showModal(
      "Are you sure you want to delete this project? This will also delete the associated revenue head.",
      "Confirm Deletion",
      true,
      () => deleteProjectMutation.mutate(id)
    );
  };

  const handleCloseModal = () => {
    setIsProjectModalOpen(false);
    setCurrentProject(null);
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

  if (isLoadingProjects) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-xl">
              <List className="w-8 h-8 text-blue-600" />
            </div>
            Project Management
          </h1>
          <p className="text-gray-600">
            Manage and track all projects across branches
          </p>
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            onClick={refetchProjects}
            disabled={isRefetching}
            className="p-3 rounded-xl border border-gray-300 hover:bg-gray-100 bg-white disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-500 ${
                isRefetching ? "animate-spin" : ""
              }`}
            />
          </button>
          <button
            onClick={handleCreateProject}
            className="px-6 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </button>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-grow">
              <div className="relative flex-grow max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.code} value={branch.code}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {["name", "branchCode", "targetAmount", "status"].map((col) => (
                  <th
                    key={col}
                    onClick={() => requestSort(col)}
                    className="py-4 px-6 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {col === "name"
                        ? "Project Name"
                        : col === "branchCode"
                        ? "Branch"
                        : col === "targetAmount"
                        ? "Target Amount"
                        : "Status"}
                      {sortConfig.key === col &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                ))}
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedProjects.length > 0 ? (
                filteredAndSortedProjects.map((project) => (
                  <React.Fragment key={project.id}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6">{project.name}</td>
                      <td className="py-4 px-6">
                        {getBranchName(project.branchCode)}
                      </td>
                      <td className="py-4 px-6">
                        {formatCurrency(
                          project.targetAmount,
                          project.currencyCode
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="py-4 px-6 flex items-center gap-2">
                        <button
                          onClick={() =>
                            setExpandedProject(
                              expandedProject === project.id ? null : project.id
                            )
                          }
                          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          {expandedProject === project.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="px-4 py-2 text-xs font-medium flex items-center gap-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          disabled={deleteProjectMutation.isLoading}
                          className="px-4 py-2 text-xs font-medium flex items-center gap-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3 h-3" /> 
                          {deleteProjectMutation.isLoading ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                    {expandedProject === project.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="5" className="p-6">
                          <ExpandedProjectView projectId={project.id} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
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
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal */}
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

// ExpandedProjectView remains the same...
const ExpandedProjectView = ({ projectId }) => {
  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(projectId),
  });

  const { data: contributions = [], isLoading: isLoadingContributions } =
    useQuery({
      queryKey: ["projectContributions", projectId],
      queryFn: () => getProjectContributions(projectId),
    });

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-800">Project Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h5 className="font-medium text-gray-700 mb-2">Members</h5>
          {isLoadingMembers ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-wrap gap-2">
              {members.length > 0 ? (
                members.map((m) => (
                  <span
                    key={m.id}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    {m.firstName} {m.lastName}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-xs">No members assigned.</p>
              )}
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h5 className="font-medium text-gray-700 mb-2">Contributions</h5>
          {isLoadingContributions ? (
            <LoadingSpinner />
          ) : (
            <ul className="space-y-1">
              {contributions.length > 0 ? (
                contributions.map((c) => (
                  <li key={c.id} className="flex justify-between text-sm">
                    <span>{c.memberId}</span>
                    <span className="font-semibold">
                      {formatCurrency(c.amount, c.currencyCode)}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-xs">No contributions yet.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectBoardPage;