// ExpenditurePage.tsx
import React, { useEffect, useState } from "react";
import { Plus, Save, Edit, Trash2, Search } from "lucide-react";
import { format } from "date-fns";
import {
  getExpenditureHeads,
  getExpenditures,
  getPaymentMethods,
  updateExpenditure,
  createExpenditure,
  deleteExpenditure,
} from "@/services/api";
import type { Expenditure } from "@/utils/Types";

const ExpenditurePage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);

  const [formData, setFormData] = useState<Partial<Expenditure>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, payRes, expRes] = await Promise.all([
          getExpenditureHeads(),
          getPaymentMethods(),
          getExpenditures(),
        ]);
        setCategories(Array.isArray(catRes?.data || catRes) ? (catRes?.data || catRes) : []);
        setPaymentMethods(Array.isArray(payRes?.data || payRes) ? (payRes?.data || payRes) : []);
        setExpenditures(Array.isArray(expRes?.data || expRes) ? (expRes?.data || expRes) : []);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: string, value: any) =>
    setFormData({ ...formData, [field]: value });

  const resetForm = () => {
    setFormData({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing && editingId) await updateExpenditure(editingId, formData);
      else await createExpenditure(formData);

      const updated = await getExpenditures();
      setExpenditures(Array.isArray(updated?.data || updated) ? (updated?.data || updated) : []);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (exp: Expenditure) => {
    setFormData(exp);
    setEditingId(exp.id);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expenditure?")) return;
    try {
      await deleteExpenditure(id);
      setExpenditures(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredExpenditures = Array.isArray(expenditures)
    ? expenditures.filter(exp => {
        const matchesSearch =
          exp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.voucherNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || exp.approvalStatus === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  const totalAmount = filteredExpenditures.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { color: string; label: string }> = {
      APPROVED: { color: "bg-green-100 text-green-800", label: "Approved" },
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };
    const c = config[status] || { color: "bg-gray-100 text-gray-800", label: status };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${c.color}`}>{c.label}</span>;
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-[Inter]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-1">Track and manage church financial expenditures</p>
        </div>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-md"
        >
          <Plus size={18} />
          {isFormVisible ? "Hide Form" : "Add New Expense"}
        </button>
      </div>

      {/* Form */}
      {isFormVisible && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 transition-all">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{isEditing ? "Edit Expense" : "Record New Expense"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Description */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium mb-1">Expense Description *</label>
              <input
                type="text"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={formData.expenditureHeadCode || ""}
                onChange={(e) => handleChange("expenditureHeadCode", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">Amount *</label>
              <input
                type="number"
                value={formData.amount || ""}
                onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method *</label>
              <select
                value={formData.paymentMethodId || ""}
                onChange={(e) => handleChange("paymentMethodId", parseInt(e.target.value))}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Method</option>
                {paymentMethods.map(pm => <option key={pm.id} value={pm.id}>{pm.name}</option>)}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input
                type="date"
                value={formData.expenseDate?.substring(0, 10) || ""}
                onChange={(e) => handleChange("expenseDate", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Person Approving */}
            <div>
              <label className="block text-sm font-medium mb-1">Person Approving</label>
              <input
                type="text"
                value={formData.reimbursementTo || ""}
                onChange={(e) => handleChange("reimbursementTo", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                disabled={isSubmitting}
              />
            </div>

            {/* Disbursed By */}
            <div>
              <label className="block text-sm font-medium mb-1">Person Paying / Disbursing</label>
              <input
                type="text"
                value={formData.disbursedBy || ""}
                onChange={(e) => handleChange("disbursedBy", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                disabled={isSubmitting}
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium mb-1">Supplier / Company</label>
              <input
                type="text"
                value={formData.supplier || ""}
                onChange={(e) => handleChange("supplier", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-md transition"
              >
                <Save size={18} />
                {isEditing ? "Update Expense" : "Save Expense"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search expenses..."
            className="px-2 py-1 outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-xl shadow-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Expenditures Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Voucher","Description","Category","Amount","Date","Payment Method","Status","Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-sm font-medium text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredExpenditures.map((exp, i) => (
              <tr key={exp.id} className={`transition hover:bg-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="px-6 py-4">{exp.voucherNumber}</td>
                <td className="px-6 py-4">{exp.description}</td>
                <td className="px-6 py-4">{categories.find(c => c.code === exp.expenditureHeadCode)?.name || exp.expenditureHeadCode}</td>
                <td className="px-6 py-4">{exp.amount?.toFixed(2)} {exp.currencyCode}</td>
                <td className="px-6 py-4">{exp.expenseDate ? format(new Date(exp.expenseDate), "yyyy-MM-dd") : ""}</td>
                <td className="px-6 py-4">{paymentMethods.find(pm => pm.id === exp.paymentMethodId)?.name || ""}</td>
                <td className="px-6 py-4"><StatusBadge status={exp.approvalStatus || ""} /></td>
                <td className="px-6 py-4 flex gap-2 justify-end">
                  <button onClick={() => handleEdit(exp)} className="text-blue-600 hover:text-blue-800 transition"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:text-red-800 transition"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td colSpan={3} className="px-6 py-3 text-left">Total</td>
              <td className="px-6 py-3">{totalAmount.toFixed(2)}</td>
              <td colSpan={4}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ExpenditurePage;
