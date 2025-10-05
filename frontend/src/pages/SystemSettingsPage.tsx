// src/pages/SystemSettingsPage.jsx
import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  Plus,
  Trash2,
  Edit,
  Search,
  Building,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Save,
  X,
  FileText
} from "lucide-react";
import {
  getRevenueHeads,
  addRevenueHead,
  updateRevenueHead,
  deleteRevenueHead,
  getExpenditureHeads,
  addExpenditureHead,
  updateExpenditureHead,
  deleteExpenditureHead,
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getBranches
} from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuth from "../hooks/useAuth";

// --- Type Definitions ---
interface Branch {
  id: number;
  branchName: string;
  branchCode: string;
}

interface RevenueHead {
  id: number;
  name: string;
  code: string;
  description?: string;
  branchID?: number;
}

interface ExpenditureHead {
  id: number;
  name: string;
  code: string;
  description?: string;
  branchID?: number;
}

interface PaymentMethod {
  id: number;
  name: string;
  details?: string;
}

// Form States
interface RevenueHeadFormState {
  name: string;
  code: string;
  description: string;
  branchID: string;
}

interface ExpenditureHeadFormState {
  name: string;
  code: string;
  description: string;
  branchID: string;
}

interface PaymentMethodFormState {
  name: string;
  details: string;
}

const getInitialRevenueHeadFormState = (): RevenueHeadFormState => ({
  name: "",
  code: "",
  description: "",
  branchID: ""
});

const getInitialExpenditureHeadFormState = (): ExpenditureHeadFormState => ({
  name: "",
  code: "",
  description: "",
  branchID: ""
});

const getInitialPaymentMethodFormState = (): PaymentMethodFormState => ({
  name: "",
  details: ""
});

// Custom hook for data fetching
const useSystemSettingsData = () => {
  const queryOptions = {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  };

  const revenueHeadsQuery = useQuery({
    queryKey: ["revenueHeads"],
    queryFn: getRevenueHeads,
    ...queryOptions,
  });

  const expenditureHeadsQuery = useQuery({
    queryKey: ["expenditureHeads"],
    queryFn: getExpenditureHeads,
    ...queryOptions,
  });

  const paymentMethodsQuery = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: getPaymentMethods,
    ...queryOptions,
  });

  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
    ...queryOptions,
  });

  return {
    revenueHeads: revenueHeadsQuery.data || [],
    expenditureHeads: expenditureHeadsQuery.data || [],
    paymentMethods: paymentMethodsQuery.data || [],
    branches: branchesQuery.data || [],
    isLoading: revenueHeadsQuery.isLoading || expenditureHeadsQuery.isLoading || 
               paymentMethodsQuery.isLoading || branchesQuery.isLoading,
    error: revenueHeadsQuery.error || expenditureHeadsQuery.error || 
           paymentMethodsQuery.error || branchesQuery.error,
    refetch: () => {
      revenueHeadsQuery.refetch();
      expenditureHeadsQuery.refetch();
      paymentMethodsQuery.refetch();
      branchesQuery.refetch();
    }
  };
};

// Settings Card Component
const SettingsCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  onAdd: () => void;
  children: React.ReactNode;
}> = ({ title, description, icon, count, onAdd, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {count} items
          </span>
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// Data Table Component
const DataTable: React.FC<{
  data: any[];
  columns: string[];
  onEdit: (item: any) => void;
  onDelete: (id: number, name: string) => void;
  getBranchName?: (branchId: number) => string;
  type: 'revenue' | 'expenditure' | 'payment';
}> = ({ data, columns, onEdit, onDelete, getBranchName, type }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {columns.map((column) => (
            <th key={column} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {column}
            </th>
          ))}
          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4">
              <div className="text-sm font-medium text-gray-900">{item.name}</div>
            </td>
            <td className="py-4 px-4">
              <div className="text-sm text-gray-600">{item.code}</div>
            </td>
            <td className="py-4 px-4">
              <div className="text-sm text-gray-600 max-w-xs">
                {item.description || (
                  <span className="text-gray-400">No description</span>
                )}
              </div>
            </td>
            {getBranchName && (
              <td className="py-4 px-4">
                <div className="text-sm text-gray-600">
                  {getBranchName(item.branchID)}
                </div>
              </td>
            )}
            <td className="py-4 px-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                  title={`Edit ${type} head`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id, item.name)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                  title={`Delete ${type} head`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    {data.length === 0 && (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">No data found</p>
        <p className="text-sm mt-1">Get started by adding your first item</p>
      </div>
    )}
  </div>
);

type SystemSettingsPageProps = {
  showModal?: (
    message: string,
    title?: string,
    confirm?: boolean,
    onConfirm?: () => void
  ) => void;
};

const SystemSettingsPage: React.FC<SystemSettingsPageProps> = ({
  showModal,
}) => {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  // Safe showModal function
  const safeShowModal = useCallback((message: string, title: string = "Information", confirm: boolean = false, onConfirm?: () => void) => {
    if (typeof showModal === 'function') {
      showModal(message, title, confirm, onConfirm);
    } else {
      if (confirm) {
        if (window.confirm(`${title}: ${message}\n\nAre you sure?`)) {
          onConfirm?.();
        }
      } else {
        alert(`${title}: ${message}`);
      }
    }
  }, [showModal]);

  // Use the custom hook for data fetching
  const { 
    revenueHeads, 
    expenditureHeads, 
    paymentMethods, 
    branches, 
    isLoading, 
    error, 
    refetch 
  } = useSystemSettingsData();

  // State for active section and forms
  const [activeSection, setActiveSection] = useState<'revenue' | 'expenditure' | 'payment'>('revenue');
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [revenueHeadForm, setRevenueHeadForm] = useState<RevenueHeadFormState>(getInitialRevenueHeadFormState);
  const [expenditureHeadForm, setExpenditureHeadForm] = useState<ExpenditureHeadFormState>(getInitialExpenditureHeadFormState);
  const [paymentMethodForm, setPaymentMethodForm] = useState<PaymentMethodFormState>(getInitialPaymentMethodFormState);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Memoized derived data
  const availableBranches = useMemo(() => branches, [branches]);

  // Filter data based on search term
  const filteredRevenueHeads = useMemo(() => {
    return revenueHeads.filter(head => 
      head.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      head.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      head.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [revenueHeads, searchTerm]);

  const filteredExpenditureHeads = useMemo(() => {
    return expenditureHeads.filter(head => 
      head.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      head.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      head.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenditureHeads, searchTerm]);

  const filteredPaymentMethods = useMemo(() => {
    return paymentMethods.filter(method => 
      method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [paymentMethods, searchTerm]);

  // Get branch name helper
  const getBranchName = (branchId: number) => {
    const branch = availableBranches.find(b => b.id === branchId);
    return branch?.branchName || "N/A";
  };

  // Revenue Heads Mutations
  const createRevenueHeadMutation = useMutation({
    mutationFn: addRevenueHead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenueHeads"] });
      safeShowModal("Revenue head created successfully!");
      resetForms();
    },
    onError: (err: any) => safeShowModal(err.message || "Failed to create revenue head.", "Error"),
  });

  const updateRevenueHeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: RevenueHeadFormState }) => 
      updateRevenueHead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenueHeads"] });
      safeShowModal("Revenue head updated successfully!");
      resetForms();
    },
    onError: (err: any) => safeShowModal(err.message || "Failed to update revenue head.", "Error"),
  });

  const deleteRevenueHeadMutation = useMutation({
    mutationFn: deleteRevenueHead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenueHeads"] });
      safeShowModal("Revenue head deleted successfully.");
    },
    onError: (err: any) => safeShowModal(err.message || "Failed to delete revenue head.", "Error"),
  });

  // Expenditure Heads Mutations
  const createExpenditureHeadMutation = useMutation({
    mutationFn: addExpenditureHead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenditureHeads"] });
      safeShowModal("Expenditure head created successfully!");
      resetForms();
    },
    onError: (err: any) => safeShowModal(err.message || "Failed to create expenditure head.", "Error"),
  });

  const updateExpenditureHeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ExpenditureHeadFormState }) => 
      updateExpenditureHead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenditureHeads"] });
      safeShowModal("Expenditure head updated successfully!");
      resetForms();
    },
    onError: (err: any) => safeShowModal(err.message || "Failed to update expenditure head.", "Error"),
  });

  const deleteExpenditureHeadMutation = useMutation({
    mutationFn: deleteExpenditureHead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenditureHeads"] });
      safeShowModal("Expenditure head deleted successfully.");
    },
    onError: (err: any) => safeShowModal(err.message || "Failed to delete expenditure head.", "Error"),
  });

  // Payment Methods Mutations
  const createPaymentMethodMutation = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      safeShowModal("Payment method created successfully!");
      resetForms();
    },
    onError: (err: any) => safeShowModal(err.message || "Failed to create payment method.", "Error"),
  });

  const updatePaymentMethodMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PaymentMethodFormState }) => 
      updatePaymentMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      safeShowModal("Payment method updated successfully!");
      resetForms();
    },
    onError: (err: any) => safeShowModal(err.message || "Failed to update payment method.", "Error"),
  });

  const deletePaymentMethodMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      safeShowModal("Payment method deleted successfully.");
    },
    onError: (err: any) => safeShowModal(err.message || "Failed to delete payment method.", "Error"),
  });

  // Handler functions
  const handleCreateRevenueHead = () => {
    if (!revenueHeadForm.name.trim() || !revenueHeadForm.code.trim() || !revenueHeadForm.branchID) {
      safeShowModal("Please fill in all required fields", "Validation Error");
      return;
    }
    createRevenueHeadMutation.mutate(revenueHeadForm as any);
  };

  const handleEditRevenueHead = (item: RevenueHead) => {
    setActiveSection('revenue');
    setEditingItem(item);
    setRevenueHeadForm({
      name: item.name,
      code: item.code,
      description: item.description || '',
      branchID: String(item.branchID || '')
    });
    setIsFormVisible(true);
  };

  const handleDeleteRevenueHead = (id: number, name: string) => {
    safeShowModal(
      `Are you sure you want to delete revenue head "${name}"?`,
      "Confirm Deletion",
      true,
      () => deleteRevenueHeadMutation.mutate(id)
    );
  };

  const handleCreateExpenditureHead = () => {
    if (!expenditureHeadForm.name.trim() || !expenditureHeadForm.code.trim() || !expenditureHeadForm.branchID) {
      safeShowModal("Please fill in all required fields", "Validation Error");
      return;
    }
    createExpenditureHeadMutation.mutate(expenditureHeadForm as any);
  };

  const handleEditExpenditureHead = (item: ExpenditureHead) => {
    setActiveSection('expenditure');
    setEditingItem(item);
    setExpenditureHeadForm({
      name: item.name,
      code: item.code,
      description: item.description || '',
      branchID: String(item.branchID || '')
    });
    setIsFormVisible(true);
  };

  const handleDeleteExpenditureHead = (id: number, name: string) => {
    safeShowModal(
      `Are you sure you want to delete expenditure head "${name}"?`,
      "Confirm Deletion",
      true,
      () => deleteExpenditureHeadMutation.mutate(id)
    );
  };

  const handleCreatePaymentMethod = () => {
    if (!paymentMethodForm.name.trim()) {
      safeShowModal("Please fill in the payment method name", "Validation Error");
      return;
    }
    createPaymentMethodMutation.mutate(paymentMethodForm);
  };

  const handleEditPaymentMethod = (item: PaymentMethod) => {
    setActiveSection('payment');
    setEditingItem(item);
    setPaymentMethodForm({
      name: item.name,
      details: item.details || ''
    });
    setIsFormVisible(true);
  };

  const handleDeletePaymentMethod = (id: number, name: string) => {
    safeShowModal(
      `Are you sure you want to delete payment method "${name}"?`,
      "Confirm Deletion",
      true,
      () => deletePaymentMethodMutation.mutate(id)
    );
  };

  const handleFormSubmit = () => {
    if (activeSection === 'revenue') {
      if (editingItem) {
        updateRevenueHeadMutation.mutate({
          id: editingItem.id,
          data: revenueHeadForm
        });
      } else {
        handleCreateRevenueHead();
      }
    } else if (activeSection === 'expenditure') {
      if (editingItem) {
        updateExpenditureHeadMutation.mutate({
          id: editingItem.id,
          data: expenditureHeadForm
        });
      } else {
        handleCreateExpenditureHead();
      }
    } else if (activeSection === 'payment') {
      if (editingItem) {
        updatePaymentMethodMutation.mutate({
          id: editingItem.id,
          data: paymentMethodForm
        });
      } else {
        handleCreatePaymentMethod();
      }
    }
  };

  const resetForms = () => {
    setRevenueHeadForm(getInitialRevenueHeadFormState);
    setExpenditureHeadForm(getInitialExpenditureHeadFormState);
    setPaymentMethodForm(getInitialPaymentMethodFormState);
    setEditingItem(null);
    setIsFormVisible(false);
  };

  // Loading and Error States
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error loading system settings:</p>
        <p>{(error as any).message}</p>
        <button
          onClick={refetch}
          className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-1 mx-auto"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const canManageSettings = hasPermission("settings:manage");

  if (!canManageSettings) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-700">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <p className="text-lg font-semibold">Access Denied</p>
        <p className="text-gray-500 mt-2">
          You do not have permission to access System Settings.
        </p>
      </div>
    );
  }

  // Render form based on active section
  const renderForm = () => {
    if (!isFormVisible) return null;

    const forms = {
      revenue: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name *"
            value={revenueHeadForm.name}
            onChange={(e) => setRevenueHeadForm({ ...revenueHeadForm, name: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Code *"
            value={revenueHeadForm.code}
            onChange={(e) => setRevenueHeadForm({ ...revenueHeadForm, code: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            placeholder="Description"
            value={revenueHeadForm.description}
            onChange={(e) => setRevenueHeadForm({ ...revenueHeadForm, description: e.target.value })}
            rows={3}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2"
          />
          <select
            value={revenueHeadForm.branchID}
            onChange={(e) => setRevenueHeadForm({ ...revenueHeadForm, branchID: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Branch *</option>
            {availableBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>
      ),
      expenditure: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name *"
            value={expenditureHeadForm.name}
            onChange={(e) => setExpenditureHeadForm({ ...expenditureHeadForm, name: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Code *"
            value={expenditureHeadForm.code}
            onChange={(e) => setExpenditureHeadForm({ ...expenditureHeadForm, code: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            placeholder="Description"
            value={expenditureHeadForm.description}
            onChange={(e) => setExpenditureHeadForm({ ...expenditureHeadForm, description: e.target.value })}
            rows={3}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2"
          />
          <select
            value={expenditureHeadForm.branchID}
            onChange={(e) => setExpenditureHeadForm({ ...expenditureHeadForm, branchID: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Branch *</option>
            {availableBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>
      ),
      payment: (
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Payment Method Name *"
            value={paymentMethodForm.name}
            onChange={(e) => setPaymentMethodForm({ ...paymentMethodForm, name: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            placeholder="Details"
            value={paymentMethodForm.details}
            onChange={(e) => setPaymentMethodForm({ ...paymentMethodForm, details: e.target.value })}
            rows={3}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )
    };

    return (
      <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            {editingItem ? `Edit ${activeSection === 'payment' ? 'Payment Method' : `${activeSection} Head`}` : `Add New ${activeSection === 'payment' ? 'Payment Method' : `${activeSection} Head`}`}
          </h4>
          <button
            onClick={resetForms}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {forms[activeSection]}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleFormSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            disabled={
              (activeSection === 'revenue' && (createRevenueHeadMutation.isPending || updateRevenueHeadMutation.isPending)) ||
              (activeSection === 'expenditure' && (createExpenditureHeadMutation.isPending || updateExpenditureHeadMutation.isPending)) ||
              (activeSection === 'payment' && (createPaymentMethodMutation.isPending || updatePaymentMethodMutation.isPending))
            }
          >
            <Save className="w-4 h-4" />
            {createRevenueHeadMutation.isPending || updateRevenueHeadMutation.isPending || 
             createExpenditureHeadMutation.isPending || updateExpenditureHeadMutation.isPending ||
             createPaymentMethodMutation.isPending || updatePaymentMethodMutation.isPending 
              ? "Saving..." 
              : editingItem ? "Update" : "Create"}
          </button>
          <button
            onClick={resetForms}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              System Settings
            </h1>
            <p className="text-gray-600">
              Manage revenue heads, expenditure heads, and payment methods for your organization.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      {renderForm()}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Revenue Heads */}
        <SettingsCard
          title="Revenue Heads"
          description="Manage income categories and revenue streams"
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          count={filteredRevenueHeads.length}
          onAdd={() => {
            setActiveSection('revenue');
            setIsFormVisible(true);
            setEditingItem(null);
            setRevenueHeadForm(getInitialRevenueHeadFormState);
          }}
        >
          <DataTable
            data={filteredRevenueHeads}
            columns={['Name', 'Code', 'Description', 'Branch']}
            onEdit={handleEditRevenueHead}
            onDelete={handleDeleteRevenueHead}
            getBranchName={getBranchName}
            type="revenue"
          />
        </SettingsCard>

        {/* Expenditure Heads */}
        <SettingsCard
          title="Expenditure Heads"
          description="Manage expense categories and cost centers"
          icon={<TrendingDown className="w-6 h-6 text-green-600" />}
          count={filteredExpenditureHeads.length}
          onAdd={() => {
            setActiveSection('expenditure');
            setIsFormVisible(true);
            setEditingItem(null);
            setExpenditureHeadForm(getInitialExpenditureHeadFormState);
          }}
        >
          <DataTable
            data={filteredExpenditureHeads}
            columns={['Name', 'Code', 'Description', 'Branch']}
            onEdit={handleEditExpenditureHead}
            onDelete={handleDeleteExpenditureHead}
            getBranchName={getBranchName}
            type="expenditure"
          />
        </SettingsCard>

        {/* Payment Methods */}
        <SettingsCard
          title="Payment Methods"
          description="Manage payment options and transaction methods"
          icon={<CreditCard className="w-6 h-6 text-purple-600" />}
          count={filteredPaymentMethods.length}
          onAdd={() => {
            setActiveSection('payment');
            setIsFormVisible(true);
            setEditingItem(null);
            setPaymentMethodForm(getInitialPaymentMethodFormState);
          }}
        >
          <DataTable
            data={filteredPaymentMethods}
            columns={['Name', 'Code', 'Details']}
            onEdit={handleEditPaymentMethod}
            onDelete={handleDeletePaymentMethod}
            type="payment"
          />
        </SettingsCard>
      </div>
    </div>
  );
};

export default SystemSettingsPage;