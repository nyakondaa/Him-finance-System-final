import type { Transaction,ContributionCreateRequest,ContributionResponse } from "@/utils/Types";

let BASE_URL = "http://localhost:8080/api";
 



const apiClient = async (
  endpoint: string,
  method: string = "GET",
  data: any = null,
  options?: { isBlob?: boolean }
) => {
  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // First try to get the response as text
      const errorText = await response.text();
      let errorMessage = "An unexpected error occurred.";
      
      if (errorText) {
        try {
          // Try to parse as JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorText;
        } catch {
          // If not JSON, use the text as error message
          errorMessage = errorText;
        }
      } else {
        errorMessage = `API request failed with status ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    if (options?.isBlob) {
      return await response.blob();
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};



// --- AUTHENTICATION ---
export const login = (username: string, password: string) =>
  apiClient("/auth/login", "POST", { username, password });
export const logout = (refreshToken: string) =>
  apiClient("/logout", "POST", { refreshToken });
export const refreshToken = (refreshToken: string) =>
  apiClient("/refresh-token", "POST", { refreshToken });
export const requestPasswordReset = (username: any) =>
  apiClient("/password-reset/request", "POST", { username });
export const resetPassword = (token: any, newPassword: any) =>
  apiClient("/password-reset/reset", "POST", { token, newPassword });

// --- USER MANAGEMENT ---
export const getUsers = () => apiClient("/users");
export const getUserById = (id: any) => apiClient(`/users/${id}`);
export const createUser = (userData: any) =>
  apiClient("/users", "POST", userData);
export const updateUser = (id: any, userData: any) =>
  apiClient(`/users/${id}`, "PUT", userData);
export const deleteUser = (id: any) => apiClient(`/users/${id}`, "DELETE");
export const lockUser = (id: any) => apiClient(`/users/${id}/lock`, "POST");
export const unlockUser = (id: any) => apiClient(`/users/${id}/unlock`, "POST");
export const checkPermission = (
  user: { permissions: { [x: string]: string | any[] } },
  module: string,
  action: string
) => {
  if (!user || !user.permissions[module]) {
    return false;
  }
  return user.permissions[module].includes(action);
};

//printing

// --- ROLE MANAGEMENT ---
export const getRoles = () => apiClient("/roles");
export const createRole = (roleData: any) =>
  apiClient("/roles", "POST", roleData);
export const updateRole = (id: any, roleData: any) =>
  apiClient(`/roles/${id}`, "PUT", roleData);
export const deleteRole = (id: any) => apiClient(`/roles/${id}`, "DELETE");

// --- BRANCH MANAGEMENT ---
export const getBranches = () => apiClient("/branches");
export const addBranch = (branchData: any) =>
  apiClient("/branches", "POST", branchData);
export const updateBranch = (code: any, branchData: any) =>
  apiClient(`/branches/${code}`, "PUT", branchData);
export const deleteBranch = (code: any) =>
  apiClient(`/branches/${code}`, "DELETE");

// --- MEMBER MANAGEMENT ---

export const getMembers = (params = {}) =>
  apiClient(`/members?${new URLSearchParams(params)}`);
export const getMemberById = (id: any) => apiClient(`/members/${id}`);





// src/services/api.ts
export const createMember = (memberData: any) => {
  // Transform the data to match what the backend expects
  const transformedData = {
    firstName: memberData.firstName,
    lastName: memberData.lastName,
    birthDate: memberData.birthDate || null,
    gender: memberData.gender ? memberData.gender.charAt(0).toUpperCase() + memberData.gender.slice(1).toLowerCase() : null,
    address: memberData.address || null,
    phone: memberData.phone || null,
    email: memberData.email || null,
    branchId: memberData.branchId ? parseInt(memberData.branchId) : null
  };
  
  return apiClient("/members", "POST", transformedData);
};

// src/services/api.ts
export const updateMember = (id: number, memberData: any) => {
  // Validate that id is a valid number
  if (!id || isNaN(id)) {
    throw new Error(`Invalid member ID: ${id}`);
  }

  // Transform the data for update
  const transformedData = {
    firstName: memberData.firstName,
    lastName: memberData.lastName,
    birthDate: memberData.birthDate || null,
    gender: memberData.gender ? memberData.gender.charAt(0).toUpperCase() + memberData.gender.slice(1).toLowerCase() : null,
    address: memberData.address || null,
    phone: memberData.phone || null,
    email: memberData.email || null,
    branchId: memberData.branchId ? parseInt(memberData.branchId) : null
  };
  
  console.log('Updating member with ID:', id, 'Type:', typeof id); // Debug
  return apiClient(`/members/${id}`, "PUT", transformedData);
};

export const deleteMember = (id: number) => {
  // Validate that id is a valid number
  if (!id || isNaN(id)) {
    throw new Error(`Invalid member ID: ${id}`);
  }
  
  console.log('Deleting member with ID:', id, 'Type:', typeof id); // Debug
  return apiClient(`/members/${id}`, "DELETE");
};

// --- PROJECT MANAGEMENT ---
export const getProjects = () => apiClient("/projects");
export const getProjectById = (id: any) => apiClient(`/projects/${id}`);
export const createProject = (projectData: any) =>
  apiClient("/projects", "POST", projectData);
export const updateProject = (id: any, projectData: any) =>
  apiClient(`/projects/${id}`, "PUT", projectData);
export const deleteProject = (id: any) =>
  apiClient(`/projects/${id}`, "DELETE");
export const getProjectMembers = (projectId: any) =>
  apiClient(`/projects/${projectId}/members`);
export const getProjectContributions = (projectId: any) =>
  apiClient(`/projects/${projectId}/contributions`);
export const getBranchMemberStats = (branchCode: any) =>
  apiClient(`/dashboard/stats?branchCode=${branchCode}`);

// --- ASSET MANAGEMENT ---
export const getAssets = (params = {}) =>
  apiClient(`/assets?${new URLSearchParams(params)}`);
export const getAssetById = (id: any) => apiClient(`/assets/${id}`);
export const createAsset = (assetData: any) =>
  apiClient("/assets", "POST", assetData);
export const updateAsset = (id: any, assetData: any) =>
  apiClient(`/assets/${id}`, "PUT", assetData);
export const deleteAsset = (id: any) => apiClient(`/assets/${id}`, "DELETE");

export const getExpenditureHeads = () => apiClient("/expenditure-heads");
export const addExpenditureHead = (headData: any) =>
  apiClient("/expenditure-heads", "POST", headData);
export const updateExpenditureHead = (code: any, headData: any) =>
  apiClient(`/expenditure-heads/${code}`, "PUT", headData);
export const deleteExpenditureHead = (code: any) =>
  apiClient(`/expenditure-heads/${code}`, "DELETE");


//contrubutions
export const createContribution = (
  contributionData: ContributionCreateRequest
): Promise<ContributionResponse> =>
  apiClient("/contributions", "POST", contributionData);

export const updateContribution = (id: string | number, contributionData: any) =>
  apiClient(`/contributions/${id}`, "PUT", contributionData);

export const deleteContribution = (id: string | number) =>
  apiClient(`/contributions/${id}`, "DELETE");

export const getMemberContributions = (memberId: string | number, params = {}) =>
  apiClient(`/members/${memberId}/contributions?${new URLSearchParams(params)}`);




// --- EXPENDITURE MANAGEMENT ---
export const getExpenditures = (params = {}) =>
  apiClient(`/expenditures?${new URLSearchParams(params)}`);
export const getExpenditureById = (id: any) => apiClient(`/expenditures/${id}`);
export const createExpenditure = (expenditureData: any) =>
  apiClient("/expenditures", "POST", expenditureData);
export const updateExpenditure = (id: any, expenditureData: any) =>
  apiClient(`/expenditures/${id}`, "PUT", expenditureData);
export const deleteExpenditure = (id: any) =>
  apiClient(`/expenditures/${id}`, "DELETE");
export const approveExpenditure = (id: any) =>
  apiClient(`/expenditures/${id}/approve`, "POST");




// --- SUPPLIER MANAGEMENT ---
export const getSuppliers = (params = {}) =>
  apiClient(`/suppliers?${new URLSearchParams(params)}`);
export const getSupplierById = (id: any) => apiClient(`/suppliers/${id}`);
export const createSupplier = (supplierData: any) =>
  apiClient("/suppliers", "POST", supplierData);
export const updateSupplier = (id: any, supplierData: any) =>
  apiClient(`/suppliers/${id}`, "PUT", supplierData);
export const deleteSupplier = (id: any) =>
  apiClient(`/suppliers/${id}`, "DELETE");

// --- CONTRACT MANAGEMENT ---
export const getContracts = (params = {}) =>
  apiClient(`/contracts?${new URLSearchParams(params)}`);
export const getContractById = (id: any) => apiClient(`/contracts/${id}`);
export const createContract = (contractData: any) =>
  apiClient("/contracts", "POST", contractData);
export const updateContract = (id: any, contractData: any) =>
  apiClient(`/contracts/${id}`, "PUT", contractData);
export const deleteContract = (id: any) =>
  apiClient(`/contracts/${id}`, "DELETE");

// --- BUDGET MANAGEMENT ---
export const getBudgets = (params = {}) =>
  apiClient(`/budget-periods?${new URLSearchParams(params)}`);
export const getBudgetById = (id: any) => apiClient(`/budget-periods/${id}`);
export const createBudget = (budgetData: any) =>
  apiClient("/budget-periods", "POST", budgetData);
export const updateBudget = (id: any, budgetData: any) =>
  apiClient(`/budget-periods/${id}`, "PUT", budgetData);
export const deleteBudget = (id: any) =>
  apiClient(`/budget-periods/${id}`, "DELETE");
export const getBudgetLines = (budgetId: any) =>
  apiClient(`/budget-periods/${budgetId}/lines`);
export const updateBudgetLine = (budgetId: any, lineData: any) =>
  apiClient(`/budget-periods/${budgetId}/lines`, "POST", lineData);

// --- TRANSACTIONS AND RECEIPTS ---
export const getTransactions = (params = {}) =>
  apiClient(`/transactions?${new URLSearchParams(params)}`);
export const getTransactionById = (id: string) =>
  apiClient(`/transactions/${id}`);
export const createTransaction = (transactionData: {
  memberId: number;
  revenueHeadCode: string;
  amount: number;
  currencyCode: string;
  paymentMethodId: number;
  notes?: string;
  referenceNumber?: string;
  transactionDate?: string;
}): Promise<Transaction> => apiClient("/transactions", "POST", transactionData);

export const generateReceipt = (transactionData: {
  memberId: number;
  revenueHeadCode: string;
  amount: number;
  currencyCode: string;
  paymentMethodId: number;
  notes?: string;
  referenceNumber?: string;
  transactionDate?: string;
}): Promise<Transaction> =>
  apiClient("/generate-receipt", "POST", transactionData);

export const refundTransaction = (
  id: string,
  refundData: { reason: string; processedBy: string }
) => apiClient(`/transactions/${id}/refund`, "POST", refundData);

// --- CURRENCY AND PAYMENT METHODS ---
export const getCurrencies = () => apiClient("/currencies");
export const createCurrency = (currencyData: any) =>
  apiClient("/currencies", "POST", currencyData);
export const updateCurrency = (code: any, currencyData: any) =>
  apiClient(`/currencies/${code}`, "PUT", currencyData);
export const deleteCurrency = (code: any) =>
  apiClient(`/currencies/${code}`, "DELETE");
export const getPaymentMethods = () => apiClient("/payment-methods");
export const createPaymentMethod = (paymentMethodData: any) =>
  apiClient("/payment-methods", "POST", paymentMethodData);
export const updatePaymentMethod = (id: any, paymentMethodData: any) =>
  apiClient(`/payment-methods/${id}`, "PUT", paymentMethodData);
export const deletePaymentMethod = (id: any) =>
  apiClient(`/payment-methods/${id}`, "DELETE");
export const getCurrencyPaymentMethods = (currencyCode: any) =>
  apiClient(`/currencies/${currencyCode}/payment-methods`);
export const getPaymentMethodCurrencies = (paymentMethodId: any) =>
  apiClient(`/payment-methods/${paymentMethodId}/currencies`);
export const updateCurrencyPaymentMethod = (
  currencyCode: any,
  paymentMethodId: any,
  data: any
) =>
  apiClient(
    `/currencies/${currencyCode}/payment-methods/${paymentMethodId}`,
    "PUT",
    data
  );
export const deleteCurrencyPaymentMethod = (
  currencyCode: any,
  paymentMethodId: any
) =>
  apiClient(
    `/currencies/${currencyCode}/payment-methods/${paymentMethodId}`,
    "DELETE"
  );
export const updatePaymentMethodCurrency = (
  paymentMethodId: any,
  currencyCode: any,
  data: any
) =>
  apiClient(
    `/payment-methods/${paymentMethodId}/currencies/${currencyCode}`,
    "PUT",
    data
  );
export const deletePaymentMethodCurrency = (
  paymentMethodId: any,
  currencyCode: any
) =>
  apiClient(
    `/payment-methods/${paymentMethodId}/currencies/${currencyCode}`,
    "DELETE"
  );

// --- REVENUE HEADS ---
export const getRevenueHeads = () => apiClient("/revenue-heads");
export const addRevenueHead = (headData: any) =>
  apiClient("/revenue-heads", "POST", headData);
export const updateRevenueHead = (code: any, headData: any) =>
  apiClient(`/revenue-heads/${code}`, "PUT", headData);
export const deleteRevenueHead = (code: any) =>
  apiClient(`/revenue-heads/${code}`, "DELETE");

// --- EXPENDITURE HEADS ---

// --- REPORTS ---
export const getReport = (params = {}) =>
  apiClient(`/reports?${new URLSearchParams(params)}`);
export const exportReport = (params = {}) =>
  apiClient(`/reports/export?${new URLSearchParams(params)}`);

// --- EXCHANGE RATES ---
export const getExchangeRates = () => apiClient("/exchange-rates");
export const createExchangeRate = (rateData: any) =>
  apiClient("/exchange-rates", "POST", rateData);
export const updateExchangeRate = (id: any, rateData: any) =>
  apiClient(`/exchange-rates/${id}`, "PUT", rateData);
export const deleteExchangeRate = (id: any) =>
  apiClient(`/exchange-rates/${id}`, "DELETE");
export const getExchangeRateById = (id: any) =>
  apiClient(`/exchange-rates/${id}`);

// --- QZ TRAY ---
export const getQZCertificate = () => apiClient("/qz/certificate");
export const signQZData = (dataToSign: any) =>
  apiClient("/qz/sign", "POST", { dataToSign });

// --- ORGANIZATION MANAGEMENT ---
export const getOrganizations = () => apiClient("/organizations");
export const getOrganizationById = (id: any) =>
  apiClient(`/organizations/${id}`);
export const createOrganization = (organizationData: any) =>
  apiClient("/organizations", "POST", organizationData);
export const updateOrganization = (id: any, organizationData: any) =>
  apiClient(`/organizations/${id}`, "PUT", organizationData);
export const deleteOrganization = (id: any) =>
  apiClient(`/organizations/${id}`, "DELETE");
export const getOrganizationStats = (id: any, period = "month") =>
  apiClient(`/organizations/${id}/stats?period=${period}`);
export const switchOrganization = (id: any) =>
  apiClient(`/organizations/${id}/switch`, "POST");

// --- STUDENT MANAGEMENT (School-specific) ---
export const getStudents = (params = {}) =>
  apiClient(`/students?${new URLSearchParams(params)}`);
export const getStudentById = (id: any) => apiClient(`/students/${id}`);
export const createStudent = (studentData: any) =>
  apiClient("/students", "POST", studentData);
export const updateStudent = (id: any, studentData: any) =>
  apiClient(`/students/${id}`, "PUT", studentData);
export const deleteStudent = (id: any) =>
  apiClient(`/students/${id}`, "DELETE");
export const getStudentFeePayments = (id: any, params = {}) =>
  apiClient(`/students/${id}/fee-payments?${new URLSearchParams(params)}`);
export const getStudentBalances = (id: any) =>
  apiClient(`/students/${id}/balances`);
export const createStudentFeePayment = (id: any, paymentData: any) =>
  apiClient(`/students/${id}/fee-payments`, "POST", paymentData);

// --- FEE MANAGEMENT (School-specific) ---
export const getAcademicYears = () => apiClient("/fees/academic-years");
export const createAcademicYear = (academicYearData: any) =>
  apiClient("/fees/academic-years", "POST", academicYearData);
export const getFeeCategories = () => apiClient("/fees/categories");
export const createFeeCategory = (categoryData: any) =>
  apiClient("/fees/categories", "POST", categoryData);
export const getFeeStructures = (params = {}) =>
  apiClient(`/fees/structures?${new URLSearchParams(params)}`);
export const getFeeStructureById = (id: any) =>
  apiClient(`/fees/structures/${id}`);
export const createFeeStructure = (structureData: any) =>
  apiClient("/fees/structures", "POST", structureData);
export const getFeeCollectionReport = (params = {}) =>
  apiClient(`/fees/reports/collection?${new URLSearchParams(params)}`);
export const getOutstandingFeesReport = (params = {}) =>
  apiClient(`/fees/reports/outstanding?${new URLSearchParams(params)}`);
