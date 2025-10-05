// src/pages/UserManagementPage.jsx
import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Lock,
  Unlock,
  Plus,
  MinusCircle,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Search,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getBranches,
  getRoles,
  lockUser,
  unlockUser,
  resetPassword,
} from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuth from "../hooks/useAuth";

// --- Type Definitions ---
interface Branch {
  id: number;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  branchEmail: string;
  branchCode: string;
}

interface Role {
  name: string;
  description: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: string[];
  branch: string;
  locked?: boolean;
  isActive?: boolean;
  attempts?: number;
  lastLogin?: string | null;
  createdAt?: string;
  createdBy?: string | null;
}

interface UserFormState {
  username: string;
  password?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
  branch: string;
}

const getInitialFormState = (branch: string): UserFormState => ({
  username: "",
  password: "",
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  roles: [],
  branch: branch,
});

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,}$/;

// Custom hook for optimized data fetching
const useAppData = () => {
  const queryOptions = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  };

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    ...queryOptions,
  });

  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
    ...queryOptions,
  });

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    ...queryOptions,
  });

  return {
    users: usersQuery.data || [],
    branches: branchesQuery.data || [],
    roles: rolesQuery.data || [],
    isLoading: usersQuery.isLoading || branchesQuery.isLoading || rolesQuery.isLoading,
    error: usersQuery.error || branchesQuery.error || rolesQuery.error,
    refetch: () => {
      usersQuery.refetch();
      branchesQuery.refetch();
      rolesQuery.refetch();
    }
  };
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-700 border border-green-200";
      case "inactive":
        return "bg-gray-50 text-gray-700 border border-gray-200";
      case "locked":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

// 2FA Badge Component
const TwoFABadge: React.FC<{ enabled: boolean }> = ({ enabled }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
    enabled 
      ? "bg-blue-50 text-blue-700 border border-blue-200" 
      : "bg-gray-50 text-gray-500 border border-gray-200"
  }`}>
    {enabled ? "Enabled" : "Disabled"}
  </span>
);

// Monogram Avatar Component
const MonogramAvatar: React.FC<{
  firstName: string;
  lastName: string;
  username: string;
}> = ({ firstName, lastName, username }) => {
  let initials = "";
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-600";

  const first = (firstName?.[0] || "").toUpperCase();
  const last = (lastName?.[0] || "").toUpperCase();

  if (first && last) {
    initials = `${first}${last}`;
    bgColor = "bg-blue-100";
    textColor = "text-blue-600";
  } else if (username) {
    initials = username.slice(0, 2).toUpperCase();
    bgColor = "bg-gray-100";
    textColor = "text-gray-600";
  } else {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-400">
        <Users className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div
      className={`w-8 h-8 rounded-full ${bgColor} ${textColor} flex items-center justify-center mr-3 text-sm font-medium`}
    >
      {initials}
    </div>
  );
};

type UserManagementPageProps = {
  showModal: (
    message: string,
    title?: string,
    confirm?: boolean,
    onConfirm?: () => void
  ) => void;
};

const UserManagementPage: React.FC<UserManagementPageProps> = ({
  showModal,
}) => {
  const queryClient = useQueryClient();
  const { currentUser, hasPermission } = useAuth();

  // Use the custom hook for data fetching
  const { 
    users: usersData, 
    branches, 
    roles, 
    isLoading, 
    error, 
    refetch 
  } = useAppData();

  const [newUser, setNewUser] = useState<UserFormState>(() =>
    getInitialFormState(currentUser?.branch || "")
  );

  const [editingUser, setEditingUser] = useState<
    (User & { password?: string }) | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Memoized derived data for better performance
  const availableBranches = useMemo(() => branches, [branches]);
  const availableRoles = useMemo(() => roles, [roles]);

  // Filter users with memoization
  const filteredUsers = useMemo(() => {
    if (!usersData || usersData.length === 0) return [];

    return usersData.filter((user) => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName || ""} ${user.lastName || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || 
        user.roles.some(role => role === roleFilter);

      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && user.isActive && !user.locked) ||
        (statusFilter === "inactive" && !user.isActive) ||
        (statusFilter === "locked" && user.locked);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersData, searchTerm, roleFilter, statusFilter]);

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showModal("User created successfully!");
      resetUserForm();
      setIsFormVisible(false);
    },
    onError: (err: any) =>
      showModal(err.message || "Failed to create user.", "Error"),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserFormState> }) => 
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showModal("User updated successfully!");
      setEditingUser(null);
      setIsFormVisible(false);
    },
    onError: (err: any) =>
      showModal(err.message || "Failed to update user.", "Error"),
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showModal("User deleted successfully.");
    },
    onError: (err: any) =>
      showModal(err.message || "Failed to delete user.", "Error"),
  });

  const lockUserMutation = useMutation({
    mutationFn: lockUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    onError: (err: any) =>
      showModal(err.message || "Failed to lock user.", "Error"),
  });

  const unlockUserMutation = useMutation({
    mutationFn: unlockUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    onError: (err: any) =>
      showModal(err.message || "Failed to unlock user.", "Error"),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (userId: number) => resetPassword(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    onError: (err: any) =>
      showModal(err.message || "Failed to reset password.", "Error"),
  });

  // Helper Functions
  const resetUserForm = useCallback(() => {
    setNewUser(getInitialFormState(currentUser?.branch || ""));
    setPasswordError("");
    setEditingUser(null);
  }, [currentUser?.branch]);

  const validatePassword = (password: string): string => {
    if (!PASSWORD_REGEX.test(password)) {
      return "Password must be at least 8 characters, contain uppercase, lowercase, a number, and a special character.";
    }
    return "";
  };

  const handleCreateUser = () => {
    const error = validatePassword(newUser.password || "");
    if (error) {
      setPasswordError(error);
      return;
    }

    createUserMutation.mutate(newUser as any);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const updateData: Partial<UserFormState> = {
      username: editingUser.username,
      email: editingUser.email,
      firstName: editingUser.firstName,
      lastName: editingUser.lastName,
      phoneNumber: editingUser.phoneNumber || "",
      roles: editingUser.roles,
      branch: editingUser.branch,
    };

    if (editingUser.password && editingUser.password.trim() !== "") {
      const error = validatePassword(editingUser.password);
      if (error) {
        setPasswordError(error);
        return;
      }
      updateData.password = editingUser.password;
    }

    updateUserMutation.mutate({
      id: editingUser.id,
      data: updateData,
    });
  };

  const handleToggleUserLock = (userId: number, currentLockedStatus: boolean) => {
    if (currentLockedStatus) {
      unlockUserMutation.mutate(userId);
    } else {
      lockUserMutation.mutate(userId);
    }
  };

  const handleResetPassword = (userId: number) => {
    showModal(
      "Are you sure you want to reset this user's password? A new temporary password will be generated.",
      "Confirm Password Reset",
      true,
      () => resetPasswordMutation.mutate(userId)
    );
  };

  const handleDeleteUser = (userId: number, username: string) => {
    showModal(
      `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
      "Confirm Deletion",
      true,
      () => deleteUserMutation.mutate(userId)
    );
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

  const canReadUsers = hasPermission("users:read");
  const canCreateUsers = hasPermission("users:create");
  const canUpdateUsers = hasPermission("users:update");
  const canDeleteUsers = hasPermission("users:delete");
  const canLockUnlockUsers = hasPermission("users:lock_unlock");

  if (!canReadUsers) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-700">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <p className="text-lg font-semibold">Access Denied</p>
        <p className="text-gray-500 mt-2">
          You do not have permission to access User Management.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          User management
        </h1>
        <p className="text-gray-600">
          Manage your team members and their account permissions here.
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                {availableRoles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="locked">Locked</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Add User Button */}
        {canCreateUsers && (
          <button
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              if (!isFormVisible) {
                resetUserForm();
              }
            }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        )}
      </div>

      {/* Conditional Form Block */}
      {((editingUser && canUpdateUsers) || isFormVisible) && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? `Edit User: ${editingUser.username}` : "Create New User"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Username *"
                value={editingUser ? editingUser.username : newUser.username}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({
                        ...editingUser,
                        username: e.target.value,
                      })
                    : setNewUser({ ...newUser, username: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={editingUser ? editingUser.email : newUser.email}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, email: e.target.value })
                    : setNewUser({ ...newUser, email: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="text"
                placeholder="First Name"
                value={editingUser ? editingUser.firstName : newUser.firstName}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({
                        ...editingUser,
                        firstName: e.target.value,
                      })
                    : setNewUser({ ...newUser, firstName: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={editingUser ? editingUser.lastName : newUser.lastName}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({
                        ...editingUser,
                        lastName: e.target.value,
                      })
                    : setNewUser({ ...newUser, lastName: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={editingUser ? editingUser.phoneNumber || "" : newUser.phoneNumber}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({
                        ...editingUser,
                        phoneNumber: e.target.value,
                      })
                    : setNewUser({ ...newUser, phoneNumber: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    editingUser
                      ? "New Password (leave blank to keep current)"
                      : "Password *"
                  }
                  value={
                    editingUser ? editingUser.password || "" : newUser.password
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingUser) {
                      setEditingUser({ ...editingUser, password: value });
                    } else {
                      setNewUser({ ...newUser, password: value });
                    }
                    if (!editingUser || value.length > 0) {
                      setPasswordError(validatePassword(value));
                    } else {
                      setPasswordError("");
                    }
                  }}
                  className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-10 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {/* Dynamic Role Select */}
              <select
                value={editingUser ? (editingUser.roles[0] || "") : (newUser.roles[0] || "")}
                onChange={(e) => {
                  const selectedRole = e.target.value;
                  if (editingUser) {
                    setEditingUser({
                      ...editingUser,
                      roles: selectedRole ? [selectedRole] : []
                    });
                  } else {
                    setNewUser({
                      ...newUser,
                      roles: selectedRole ? [selectedRole] : []
                    });
                  }
                }}
                className="border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Role *</option>
                {availableRoles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>

              {/* Dynamic Branch Select */}
              <select
                value={editingUser ? editingUser.branch : newUser.branch}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({
                        ...editingUser,
                        branch: e.target.value,
                      })
                    : setNewUser({ ...newUser, branch: e.target.value })
                }
                className="border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Branch *</option>
                {availableBranches.map((branch) => (
                  <option key={branch.id} value={branch.branchName}>
                    {branch.branchName} ({branch.branchCode})
                  </option>
                ))}
              </select>
            </div>
            {passwordError && (
              <p className="text-red-600 text-sm mt-3 flex items-center gap-1">
                <MinusCircle className="w-4 h-4" /> {passwordError}
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                disabled={
                  (editingUser
                    ? !editingUser.username ||
                      !editingUser.roles.length ||
                      !editingUser.branch
                    : !newUser.username ||
                      !newUser.password ||
                      !newUser.roles.length ||
                      !newUser.branch) ||
                  passwordError !== "" ||
                  createUserMutation.isPending ||
                  updateUserMutation.isPending
                }
              >
                {createUserMutation.isPending || updateUserMutation.isPending ? (
                  editingUser ? (
                    "Updating..."
                  ) : (
                    "Creating..."
                  )
                ) : editingUser ? (
                  <>
                    <Edit className="w-4 h-4" /> Update User
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Create User
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  resetUserForm();
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

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full name
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  2F Auth
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const isCurrentUser = currentUser?.id === String(user.id);
                const userStatus = user.locked ? "Locked" : user.isActive ? "Active" : "Inactive";
                const fullName = `${user.firstName} ${user.lastName}`;
                const primaryRole = user.roles[0] ? user.roles[0] : "No Role";

                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MonogramAvatar
                          firstName={user.firstName}
                          lastName={user.lastName}
                          username={user.username}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{primaryRole}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={userStatus} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <TwoFABadge enabled={true} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {canUpdateUsers && (
                          <button
                            onClick={() => {
                              const userToEdit = { ...user, password: "" };
                              setEditingUser(userToEdit);
                              setPasswordError("");
                              setIsFormVisible(true);
                            }}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canDeleteUsers && !isCurrentUser && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete User"
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
              Rows per page 15
            </div>
            <div className="text-sm text-gray-700">
              1-{filteredUsers.length} of {filteredUsers.length} rows
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm mt-1">
              {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first user"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;