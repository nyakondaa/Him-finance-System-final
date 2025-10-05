// src/pages/MembersPage.jsx
import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Plus,
  Trash2,
  Edit,
  Search,
  Mail,
  Phone,
  MapPin,
  User,
  Building,
  AlertTriangle,
  RefreshCw,
  Cake,
  Venus,
  Mars,
  Circle
} from "lucide-react";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getBranches,
} from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuth from "../hooks/useAuth";

// --- Type Definitions ---
interface Branch {
  id: number;
  branchName: string;
  branchCode: string;
}

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  joinedAt?: string;
  branch?: string;
  branchId?: string;
}

interface MemberFormState {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  branchId: string;
}

const getInitialFormState = (): MemberFormState => ({
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: "",
  address: "",
  phone: "",
  email: "",
  branchId: "",
});

// Custom hook for optimized data fetching
const useMembersData = () => {
  const queryOptions = {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  };

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
    ...queryOptions,
  });

  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
    ...queryOptions,
  });

  return {
    members: membersQuery.data || [],
    branches: branchesQuery.data || [],
    isLoading: membersQuery.isLoading || branchesQuery.isLoading,
    error: membersQuery.error || branchesQuery.error,
    refetch: () => {
      membersQuery.refetch();
      branchesQuery.refetch();
    }
  };
};

// Validation function
const validateMemberData = (data: MemberFormState): string[] => {
  const errors: string[] = [];
  
  if (!data.branchId) {
    errors.push("Branch is required");
  }
  
  if (!data.gender || !['Male', 'Female', 'Other'].includes(data.gender)) {
    errors.push("Gender must be Male, Female, or Other");
  }
  
  if (!data.firstName?.trim()) {
    errors.push("First name is required");
  }
  
  if (!data.lastName?.trim()) {
    errors.push("Last name is required");
  }
  
  return errors;
};

// Status Badge Component for Membership
const MembershipBadge: React.FC<{ joinedDate?: string }> = ({ joinedDate }) => {
  if (!joinedDate) {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
        New
      </span>
    );
  }

  const joinDate = new Date(joinedDate);
  const now = new Date();
  const years = now.getFullYear() - joinDate.getFullYear();
  
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
      {years > 0 ? `${years} year${years > 1 ? 's' : ''}` : 'New'}
    </span>
  );
};

// Gender Badge Component
const GenderBadge: React.FC<{ gender?: string }> = ({ gender }) => {
  const getGenderStyles = () => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "female":
        return "bg-pink-50 text-pink-700 border border-pink-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getGenderIcon = () => {
    switch (gender?.toLowerCase()) {
      case "male":
        return <Mars className="w-3 h-3" />;
      case "female":
        return <Venus className="w-3 h-3" />;
      default:
        return <Circle className="w-3 h-3" />;
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getGenderStyles()}`}>
      {getGenderIcon()}
      {gender || "Not specified"}
    </span>
  );
};

// Monogram Avatar Component for Members
const MemberAvatar: React.FC<{
  firstName: string;
  lastName: string;
  gender?: string;
}> = ({ firstName, lastName, gender }) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  
  const getAvatarStyles = () => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "bg-blue-100 text-blue-600";
      case "female":
        return "bg-pink-100 text-pink-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className={`w-10 h-10 rounded-xl ${getAvatarStyles()} flex items-center justify-center text-sm font-semibold shadow-sm`}
    >
      {initials || <User className="w-5 h-5" />}
    </div>
  );
};

type MembersPageProps = {
  showModal?: (
    message: string,
    title?: string,
    confirm?: boolean,
    onConfirm?: () => void
  ) => void;
};

const MembersPage: React.FC<MembersPageProps> = ({
  showModal,
}) => {
  const queryClient = useQueryClient();
  const { currentUser, hasPermission } = useAuth();

  // Safe showModal function
  const safeShowModal = useCallback((message: string, title: string = "Information", confirm: boolean = false, onConfirm?: () => void) => {
    if (typeof showModal === 'function') {
      showModal(message, title, confirm, onConfirm);
    } else {
      // Fallback to browser alert if showModal is not provided
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
    members: membersData, 
    branches, 
    isLoading, 
    error, 
    refetch 
  } = useMembersData();

  const [newMember, setNewMember] = useState<MemberFormState>(getInitialFormState);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [branchFilter, setBranchFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  // Memoized derived data
  const availableBranches = useMemo(() => branches, [branches]);

  // Filter members with memoization
  const filteredMembers = useMemo(() => {
    if (!membersData || membersData.length === 0) return [];

    return membersData.filter((member) => {
      const matchesSearch = 
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        
        member.phone?.includes(searchTerm);

      const matchesBranch = branchFilter === "all" || 
        member.branch === branchFilter;

      const matchesGender = genderFilter === "all" || 
        member.gender?.toLowerCase() === genderFilter.toLowerCase();

        console.log('Member in table:', member); // Debug each member
  console.log('Member ID:', member.id, 'Type:', typeof member.id); // Debug ID

      return matchesSearch && matchesBranch && matchesGender;
    });
  }, [membersData, searchTerm, branchFilter, genderFilter]);

  // Mutations
  const createMemberMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      safeShowModal("Member created successfully!");
      resetMemberForm();
      setIsFormVisible(false);
    },
    onError: (err: any) =>
      safeShowModal(err.message || "Failed to create member.", "Error"),
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MemberFormState> }) => 
      updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      safeShowModal("Member updated successfully!");
      setEditingMember(null);
      setIsFormVisible(false);
    },
    onError: (err: any) =>
      safeShowModal(err.message || "Failed to update member.", "Error"),
  });

  const deleteMemberMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      safeShowModal("Member deleted successfully.");
    },
    onError: (err: any) =>
      safeShowModal(err.message || "Failed to delete member.", "Error"),
  });

  // Helper Functions
  const resetMemberForm = useCallback(() => {
    setNewMember(getInitialFormState());
    setEditingMember(null);
  }, []);

  const handleCreateMember = () => {
    const validationErrors = validateMemberData(newMember);
    if (validationErrors.length > 0) {
      safeShowModal(validationErrors.join(", "), "Validation Error");
      return;
    }

    createMemberMutation.mutate(newMember);
  };

 // In your MembersPage component, update the critical functions:

const handleUpdateMember = () => {
  console.log('Editing member object:', editingMember); // Debug
  console.log('Editing member ID:', editingMember?.id, 'Type:', typeof editingMember?.id); // Debug

  if (!editingMember) {
    safeShowModal("No member selected for editing", "Error");
    return;
  }

  // Validate ID - this is the key fix
  const memberId = editingMember.id;
  if (memberId === undefined || memberId === null || isNaN(Number(memberId))) {
    console.error('Invalid member ID detected:', memberId);
    safeShowModal("Invalid member ID. Please try again.", "Error");
    return;
  }

  const updateData: Partial<MemberFormState> = {
    firstName: editingMember.firstName,
    lastName: editingMember.lastName,
    birthDate: editingMember.birthDate || "",
    gender: editingMember.gender || "",
    address: editingMember.address || "",
    phone: editingMember.phone || "",
    email: editingMember.email || "",
    branchId: editingMember.branchId || "",
  };

  const validationErrors = validateMemberData(updateData as MemberFormState);
  if (validationErrors.length > 0) {
    safeShowModal(validationErrors.join(", "), "Validation Error");
    return;
  }

  // Ensure ID is a number
  updateMemberMutation.mutate({
    id: Number(memberId), // Explicitly convert to number
    data: updateData,
  });
};

const handleDeleteMember = (memberId: number, fullName: string) => {
  // Validate ID before deletion
  if (memberId === undefined || memberId === null || isNaN(memberId)) {
    console.error('Invalid member ID for deletion:', memberId);
    safeShowModal("Invalid member ID. Cannot delete member.", "Error");
    return;
  }

  safeShowModal(
    `Are you sure you want to delete member "${fullName}"? This action cannot be undone.`,
    "Confirm Deletion",
    true,
    () => deleteMemberMutation.mutate(Number(memberId)) // Explicitly convert to number
  );
};
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate age from birth date
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Loading and Error States
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error loading data:</p>
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

  const canReadMembers = hasPermission("members:read");
  const canCreateMembers = hasPermission("members:create");
  const canUpdateMembers = hasPermission("members:update");
  const canDeleteMembers = hasPermission("members:delete");

  if (!canReadMembers) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-700">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <p className="text-lg font-semibold">Access Denied</p>
        <p className="text-gray-500 mt-2">
          You do not have permission to access Member Management.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Member Management
        </h1>
        <p className="text-gray-600">
          Manage church members and their information here.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Branches</option>
                {availableBranches.map((branch) => (
                  <option key={branch.id} value={branch.branchName}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
              <Building className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <User className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Add Member Button */}
        {canCreateMembers && (
          <button
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              if (!isFormVisible) {
                resetMemberForm();
              }
            }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New Member
          </button>
        )}
      </div>

      {/* Conditional Form Block */}
      {((editingMember && canUpdateMembers) || isFormVisible) && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingMember ? `Edit Member: ${editingMember.firstName} ${editingMember.lastName}` : "Add New Member"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="First Name *"
                value={editingMember ? editingMember.firstName : newMember.firstName}
                onChange={(e) =>
                  editingMember
                    ? setEditingMember({ ...editingMember, firstName: e.target.value })
                    : setNewMember({ ...newMember, firstName: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={editingMember ? editingMember.lastName : newMember.lastName}
                onChange={(e) =>
                  editingMember
                    ? setEditingMember({ ...editingMember, lastName: e.target.value })
                    : setNewMember({ ...newMember, lastName: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="date"
                placeholder="Birth Date"
                value={editingMember ? editingMember.birthDate || "" : newMember.birthDate}
                onChange={(e) =>
                  editingMember
                    ? setEditingMember({ ...editingMember, birthDate: e.target.value })
                    : setNewMember({ ...newMember, birthDate: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <select
                value={editingMember ? editingMember.gender || "" : newMember.gender}
                onChange={(e) =>
                  editingMember
                    ? setEditingMember({ ...editingMember, gender: e.target.value })
                    : setNewMember({ ...newMember, gender: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="email"
                placeholder="Email Address"
                value={editingMember ? editingMember.email || "" : newMember.email}
                onChange={(e) =>
                  editingMember
                    ? setEditingMember({ ...editingMember, email: e.target.value })
                    : setNewMember({ ...newMember, email: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={editingMember ? editingMember.phone || "" : newMember.phone}
                onChange={(e) =>
                  editingMember
                    ? setEditingMember({ ...editingMember, phone: e.target.value })
                    : setNewMember({ ...newMember, phone: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <textarea
                placeholder="Address"
                value={editingMember ? editingMember.address || "" : newMember.address}
                onChange={(e) =>
                  editingMember
                    ? setEditingMember({ ...editingMember, address: e.target.value })
                    : setNewMember({ ...newMember, address: e.target.value })
                }
                rows={3}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:col-span-2"
              />
              <select
                value={editingMember ? editingMember.branchId || "" : newMember.branchId}
                onChange={(e) =>
                  editingMember
                    ? setEditingMember({ ...editingMember, branchId: e.target.value })
                    : setNewMember({ ...newMember, branchId: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Branch *</option>
                {availableBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingMember ? handleUpdateMember : handleCreateMember}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                disabled={
                  createMemberMutation.isPending ||
                  updateMemberMutation.isPending
                }
              >
                {createMemberMutation.isPending || updateMemberMutation.isPending ? (
                  editingMember ? (
                    "Updating..."
                  ) : (
                    "Creating..."
                  )
                ) : editingMember ? (
                  <>
                    <Edit className="w-4 h-4" /> Update Member
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add Member
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  resetMemberForm();
                  setIsFormVisible(false);
                }}
                className="bg-gray-500 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personal Info
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => {
                const fullName = `${member.firstName} ${member.lastName}`;
                const age = calculateAge(member.birthDate);

                return (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <MemberAvatar
                          firstName={member.firstName}
                          lastName={member.lastName}
                          gender={member.gender}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {fullName}
                          </div>
                          <GenderBadge gender={member.gender} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {member.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1 text-sm text-gray-600">
                        {member.birthDate && (
                          <div className="flex items-center gap-2">
                            <Cake className="w-4 h-4 text-gray-400" />
                            {formatDate(member.birthDate)}
                            {age && <span className="text-xs text-gray-500">({age} years)</span>}
                          </div>
                        )}
                        {member.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="truncate max-w-xs">{member.address}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {member.branch || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <MembershipBadge joinedDate={member.joinedAt} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {canUpdateMembers && (
                          <button
                            onClick={() => {
                              setEditingMember(member);
                              setIsFormVisible(true);
                            }}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                            title="Edit Member"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canDeleteMembers && (
                          <button
                            onClick={() => handleDeleteMember(member.id, fullName)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
            </div>
            <div className="text-sm text-gray-700">
              1-{filteredMembers.length} of {filteredMembers.length} members
            </div>
          </div>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No members found</p>
            <p className="text-sm mt-1">
              {searchTerm || branchFilter !== "all" || genderFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first member"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;