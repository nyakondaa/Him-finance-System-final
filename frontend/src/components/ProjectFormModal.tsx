import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Building, DollarSign, Calendar, FileText } from 'lucide-react';
import { getBranches } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectFormModal = ({ project, onClose, onCreate, onUpdate, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fundingGoal: '',
        branchId: '',
        status: 'DRAFT'
    });

    // Fetch branches only
    const { data: branches = [], isLoading: isLoadingBranches, isError: isBranchesError } = useQuery({
        queryKey: ['branches'],
        queryFn: getBranches,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Initialize form with project data if editing
    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                fundingGoal: project.fundingGoal ? parseFloat(project.fundingGoal).toFixed(2) : '',
                branchId: project.branchId || '',
                status: project.status || 'DRAFT'
            });
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            fundingGoal: parseFloat(formData.fundingGoal)
        };

        if (project) {
            onUpdate({ id: project.id, data });
        } else {
            onCreate(data);
        }
    };

    // Show loading state only if we're actually loading and don't have data yet
    const isLoadingData = isLoadingBranches && branches.length === 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {project ? 'Edit Project' : 'Create New Project'}
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                {project ? 'Update project details' : 'Add a new project to your portfolio'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {isLoadingData ? (
                        <div className="flex justify-center items-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Project Title */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Project Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter project title"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                            required
                                            minLength={1}
                                            maxLength={255}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formData.title.length}/255 characters
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Describe the project goals and objectives..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Optional project description
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Branch Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Building className="w-4 h-4" />
                                            Branch *
                                        </label>
                                        <select
                                            name="branchId"
                                            value={formData.branchId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                            required
                                        >
                                            <option value="">Select a branch</option>
                                            {branches.map(branch => (
                                                <option key={branch.id} value={branch.id}>
                                                    {branch.branchName}
                                                </option>
                                            ))}
                                        </select>
                                        {isBranchesError && (
                                            <p className="text-red-500 text-xs mt-1">
                                                Failed to load branches. Please try again.
                                            </p>
                                        )}
                                    </div>

                                    {/* Funding Goal */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            Funding Goal *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="fundingGoal"
                                                value={formData.fundingGoal}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                                required
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <span className="text-gray-600 font-medium">USD</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Enter the target funding amount
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                        >
                                            <option value="DRAFT">Draft</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Project status
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 font-medium"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || isLoadingData}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {project ? 'Updating...' : 'Creating...'}
                                        </div>
                                    ) : (
                                        project ? 'Update Project' : 'Create Project'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectFormModal;