"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Plus,
  X,
  Loader2,
  DollarSign,
  Building,
  Calendar,
  FileText,
  CreditCard,
  Tag,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getBranches,
  getExpenditureHeads,
  getPaymentMethods,
  createExpenditure,
} from "@/services/api";
import useAuth from "@/hooks/useAuth";

// Data structures for lookups
interface LookupItem {
  code: string;
  name: string;
  id?: number; // For branches that use ID instead of code
}
interface PaymentMethodItem {
  id: number;
  name: string;
}

// Hardcoded currencies since API is not ready yet
const hardcodedCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$", decimalPlaces: 2 },
  { code: "EUR", name: "Euro", symbol: "€", decimalPlaces: 2 },
  { code: "GBP", name: "British Pound", symbol: "£", decimalPlaces: 2 },
  { code: "ZAR", name: "South African Rand", symbol: "R", decimalPlaces: 2 },
];

// Mock current user ID - in real app, get from auth context
const CURRENT_USER_ID = 1;

export default function ExpensesPage() {
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [branches, setBranches] = useState<LookupItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useAuth();
  console.log(currentUser);

  // Use hardcoded currencies
  const currencies = hardcodedCurrencies;

  // Form State - using backend field names
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [branchId, setBranchId] = useState<string>("");
  const [ExpenditureHeadID, setExpenditureHeadID] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [cats, brs, pay] = await Promise.all([
          getExpenditureHeads(),
          getBranches(),
          getPaymentMethods(),
        ]);

        console.log("🧾 Expenditure heads response:", cats);

        const transformedBranches = Array.isArray(brs)
          ? brs.map((branch) => ({
              id: branch.id, // keep ID
              code: branch.branchCode, // rename properly
              name: branch.branchName, // use for dropdown label
              address: branch.branchAddress,
              email: branch.branchEmail,
              phone: branch.branchPhone,
            }))
          : [];

        setCategories(Array.isArray(cats) ? cats : cats?.data || []);
        setBranches(transformedBranches);
        setPaymentMethods(Array.isArray(pay) ? pay : pay?.data || []);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast.error("Could not load necessary form data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to calculate total amount
  const totalAmount = Number(amount) || 0;

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setBranchId("");
    setExpenditureHeadID("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation - match backend validation requirements
    if (!description || !amount || !ExpenditureHeadID || !branchId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Convert string values to appropriate types for backend
    const expenditureData = {
      description,
      amount: parseFloat(amount),
      date, // LocalDate format (yyyy-MM-dd)
      branchId: parseInt(branchId), // Convert to Long
      ExpenditureHeadID: parseInt(ExpenditureHeadID), // Convert to Long
      userID: parseInt(currentUser.currentUser.id, 10),
    };

    console.log("Sending data to backend:", expenditureData);

    setIsSubmitting(true);

    try {
      await createExpenditure(expenditureData);

      toast.success("Expense recorded successfully!", {
        position: "top-right",
        autoClose: 5000,
      });

      resetForm();
    } catch (error) {
      console.error("Expense creation failed:", error);
      toast.error(
        error.message ||
          "There was an error saving the expense. Please check your inputs and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white rounded-2xl shadow-lg border border-gray-100">
                <DollarSign className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  Record Expense
                </h1>
                <p className="text-gray-600 text-lg">
                  Track and manage organizational expenditures
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-gray-200 bg-gray-50/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Expense Details
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Fill in all required information to record a new expense
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Basic Information
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Expense Date */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4" />
                      Expense Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                    />
                  </div>

                  {/* Category */}
                  {/* Category */}
                  <div className="space-y-3">
                    <label
                      htmlFor="expenditure-category"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      <Tag className="w-4 h-4" />
                      Category *
                    </label>

                    <select
                      id="expenditure-category"
                      value={ExpenditureHeadID}
                      onChange={(e) => setExpenditureHeadID(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl 
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               bg-white transition-all duration-200"
                    >
                      <option value="">Select expenditure head</option>
                      {categories.map((cat: LookupItem) => (
                        <option key={cat.id} value={cat.id?.toString()}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4" />
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe the purpose of the expense..."
                    required
                    rows={3}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              {/* Financial Details Section */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Financial Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Amount *
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                    />
                  </div>

                  {/* Total Amount Display */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Total Amount
                    </label>
                    <div className="p-3.5 border border-gray-300 rounded-xl bg-green-50/50 font-semibold text-green-700 flex items-center justify-between">
                      <span>USD</span>
                      <span>{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  Location & Approval
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Branch */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Building className="w-4 h-4" />
                      Branch *
                    </label>
                    <select
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                    >
                      <option value="">Select branch</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Approved By (Current User) */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="w-4 h-4" />
                      Approved By
                    </label>
                    <div className="p-3.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-700">
                      {currentUser.currentUser.username}
                    </div>
                    <p className="text-xs text-gray-500">
                      Expenses are automatically approved by the submitting user
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-6 py-3.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex items-center gap-2 justify-center disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg flex items-center gap-2 font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100 justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Expense...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Record Expense
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Stats Card */}
      </div>
    </div>
  );
}
