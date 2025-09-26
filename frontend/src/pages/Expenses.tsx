import React, { useState, useEffect } from "react";
import { Plus, Save, Calendar, DollarSign, User, Building, Edit, Trash2, Search, Download } from "lucide-react";
import { getExpenditureHeads, getPaymentMethods } from "@/services/api";

// Mock data and functions
const getExpenditures = async () =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          id: 1,
          voucherNumber: "VOUCHER-001",
          expenditureHeadCode: "SUPPLIES",
          description: "Monthly office supplies",
          amount: 150,
          currencyCode: "USD",
          paymentMethodId: 1,
          expenseDate: new Date().toISOString().substring(0, 10),
          reimbursementTo: "Pastor John Doe",
          disbursedBy: "Jane Smith",
          supplier: "Office Supply Depot",
          approvalStatus: "APPROVED",
          isRecurring: false,
        },
        {
          id: 2,
          voucherNumber: "VOUCHER-002",
          expenditureHeadCode: "RENT",
          description: "Rent for head office",
          amount: 1200,
          currencyCode: "USD",
          paymentMethodId: 2,
          expenseDate: new Date().toISOString().substring(0, 10),
          reimbursementTo: null,
          disbursedBy: "Jane Smith",
          supplier: "Landlord Inc.",
          approvalStatus: "PENDING",
          isRecurring: true,
        },
      ]);
    }, 500)
  );

const addExpenditure = async (data) => console.log("Adding:", data);
const updateExpenditure = async (id, data) => console.log("Updating:", id, data);
const deleteExpenditure = async (id) => console.log("Deleting:", id);

const StatusBadge = ({ status }) => {
  const config = {
    APPROVED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${config[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
};

const ExpenditurePage = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    voucherNumber: "",
    expenditureHeadCode: "",
    description: "",
    amount: "",
    paymentMethodId: "",
    expenseDate: new Date().toISOString().substring(0, 10),
    reimbursementTo: "",
    disbursedBy: "",
    supplier: "",
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isFormExpanded, setIsFormExpanded] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cats, pays, exps] = await Promise.all([getExpenditureHeads(), getPaymentMethods(), getExpenditures()]);
        setCategoryOptions(cats);
        setPaymentOptions(pays);
        setExpenditures(exps);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing && formData.id) {
        await updateExpenditure(formData.id, formData);
        setExpenditures((prev) => prev.map((exp) => (exp.id === formData.id ? formData : exp)));
        alert("Expenditure updated!");
      } else {
        const newId = Math.max(...expenditures.map((e) => e.id)) + 1;
        const newExp = { ...formData, id: newId };
        await addExpenditure(newExp);
        setExpenditures((prev) => [...prev, newExp]);
        alert("Expenditure added!");
      }
      setFormData({
        id: null,
        voucherNumber: "",
        expenditureHeadCode: "",
        description: "",
        amount: "",
        paymentMethodId: "",
        expenseDate: new Date().toISOString().substring(0, 10),
        reimbursementTo: "",
        disbursedBy: "",
        supplier: "",
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (exp) => {
    setFormData(exp);
    setIsEditing(true);
    setIsFormExpanded(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this expenditure?")) {
      await deleteExpenditure(id);
      setExpenditures((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const filteredExpenditures = expenditures.filter(
    (exp) =>
      (exp.description.toLowerCase().includes(searchTerm.toLowerCase()) || exp.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "ALL" || exp.approvalStatus === statusFilter)
  );

  const totalAmount = filteredExpenditures.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Expense Management</h1>
          <button
            onClick={() => setIsFormExpanded(!isFormExpanded)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>{isFormExpanded ? "Hide Form" : "Show Form"}</span>
          </button>
        </div>

        {/* Form */}
        {isFormExpanded && (
          <div className="bg-white p-8 rounded-2xl shadow-md mb-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">{isEditing ? "Edit Expense" : "Add New Expense"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Description *</label>
                <input
                  type="text"
                  className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.expenditureHeadCode}
                  onChange={(e) => handleChange("expenditureHeadCode", e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Amount Paid *</label>
                <div className="relative">
                  <DollarSign className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method *</label>
                <select
                  className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.paymentMethodId}
                  onChange={(e) => handleChange("paymentMethodId", e.target.value)}
                  required
                >
                  <option value="">Select Payment Method</option>
                  {paymentOptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Expense Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Date of Payment *</label>
                <div className="relative">
                  <Calendar className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="date"
                    className="w-full pl-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.expenseDate}
                    onChange={(e) => handleChange("expenseDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Approving Person */}
              <div>
                <label className="block text-sm font-medium mb-2">Person Approving</label>
                <div className="relative">
                  <User className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.reimbursementTo}
                    onChange={(e) => handleChange("reimbursementTo", e.target.value)}
                  />
                </div>
              </div>

              {/* Disbursed By */}
              <div>
                <label className="block text-sm font-medium mb-2">Person Paying / Disbursing</label>
                <div className="relative">
                  <User className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.disbursedBy}
                    onChange={(e) => handleChange("disbursedBy", e.target.value)}
                  />
                </div>
              </div>

              {/* Supplier */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Company / Vendor Paid To</label>
                <div className="relative">
                  <Building className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.supplier}
                    onChange={(e) => handleChange("supplier", e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors space-x-2 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <Save size={18} />
                  <span>{isEditing ? "Update Expense" : "Save Expense"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Table */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="outline-none border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <button className="flex items-center gap-1 px-3 py-2 border rounded-xl hover:bg-gray-100 transition-colors">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-medium text-gray-700">Voucher</th>
                <th className="p-3 font-medium text-gray-700">Description</th>
                <th className="p-3 font-medium text-gray-700">Amount</th>
                <th className="p-3 font-medium text-gray-700">Status</th>
                <th className="p-3 font-medium text-gray-700">Date</th>
                <th className="p-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenditures.map((exp) => (
                <tr key={exp.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3">{exp.voucherNumber}</td>
                  <td className="p-3">{exp.description}</td>
                  <td className="p-3">${exp.amount.toFixed(2)}</td>
                  <td className="p-3"><StatusBadge status={exp.approvalStatus} /></td>
                  <td className="p-3">{exp.expenseDate}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition-colors"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredExpenditures.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">No expenses found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="text-right mt-4 font-semibold">Total Amount: ${totalAmount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default ExpenditurePage;
