import React, { useEffect, useState } from 'react';
import { Calendar, Save } from 'lucide-react';
import { getExpenditureHeads, getPaymentMethods } from '@/services/api';

const App = () => {
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [dateOfPayment, setDateOfPayment] = useState('');
  const [personApproving, setPersonApproving] = useState('');
  const [personDisbursing, setPersonDisbursing] = useState('');
  const [companyVendor, setCompanyVendor] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);

  const handleSave = (e) => {
    e.preventDefault();
    const formData = {
      expenseDescription,
      expenseCategory,
      amountPaid,
      paymentMethod,
      dateOfPayment,
      personApproving,
      personDisbursing,
      companyVendor,
    };
    console.log('Form data submitted:', formData);
    // Here you would typically send this data to a backend API
  };

  useEffect(() => {
    // Fetch initial data if needed
    const fetchData = async () => {
      const expenditures = await getExpenditureHeads();
      const payments = await getPaymentMethods();
      setPaymentOptions(payments);
      setCategoryOptions(expenditures);
      console.log('Fetched expenditures:', payments);
    };
    fetchData();
  }, []);


 

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start font-[Inter]">
      <style jsx global>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
      <div className="w-full max-w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Expenses Management</h1>
          <p className="text-gray-500 text-lg">
            Record a new expense to keep your church's finances in order.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Expense Description
              </label>
              <input
                type="text"
                id="description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Sunday School Supplies"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
              />
            </div>

            {/* Expense Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Expense Category / Account
              </label>
              <select
                id="category"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-8"
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
              >
                {categoryOptions.map((head) => (
                  <option key={head.code} value={head.code}>
                    {head.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Paid */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount Paid
              </label>
              <input
                type="text"
                id="amount"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$ 0.00"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                id="method"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-8"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {paymentOptions.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date of Payment */}
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Payment
              </label>
              <input
                type="text" // Using text to allow placeholder and then handle date input logic
                id="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="mm/dd/yyyy"
                value={dateOfPayment}
                onChange={(e) => setDateOfPayment(e.target.value)}
              />
              <Calendar className="absolute right-3 top-1/2 mt-2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* Person Approving */}
            <div>
              <label htmlFor="approving" className="block text-sm font-medium text-gray-700 mb-1">
                Person Approving
              </label>
              <input
                type="text"
                id="approving"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Pastor John Doe"
                value={personApproving}
                onChange={(e) => setPersonApproving(e.target.value)}
              />
            </div>

            {/* Person Disbursing */}
            <div>
              <label htmlFor="disbursing" className="block text-sm font-medium text-gray-700 mb-1">
                Person Paying / Disbursing
              </label>
              <input
                type="text"
                id="disbursing"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Jane Smith, Treasurer"
                value={personDisbursing}
                onChange={(e) => setPersonDisbursing(e.target.value)}
              />
            </div>

            {/* Company / Vendor Paid To */}
            <div className="md:col-span-2">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company / Vendor Paid To
              </label>
              <input
                type="text"
                id="company"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Office Supply Depot"
                value={companyVendor}
                onChange={(e) => setCompanyVendor(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Save size={20} />
              <span>Save / Submit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
