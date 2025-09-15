/*

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getRevenueHeads, getBranches, getMembers } from "@/services/api";
import { listPrinters } from "@/services/api"; // Import the new API function
import { printDocument } from "@/services/api"; // Import the new API function
import useAuth from "@/hooks/useAuth";

const ReceiptingPage = () => {
  // Form state
  const [receipt, setReceipt] = useState({
    payerName: "",
    revenueHeadCode: "",
    amount: "",
    currency: "USD",
    paymentMethod: "Cash",
    branchCode: "",
  });

  const currentUser = useAuth()

  // QZ Tray state

const [printers, setPrinters] = useState<string[]>([]);
const [selectedPrinter, setSelectedPrinter] = useState<string>("");
  const [isPrinting, setIsPrinting] = useState(false);
  const [connectionAttempt, setConnectionAttempt] = useState(null);

  // Data state
  const [revenueHeads, setRevenueHeads] = useState([]);
  const [branches, setBranches] = useState([]);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  
 

  //console.log("Current User:", currentUser.currentUser.username);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });

  // Constants
  const CURRENCIES = ["USD", "ZWL", "ZAR", "GBP"];
  const PAYMENT_METHODS = [
    "Cash",
    "Card - CBZ Bank",
    "Card - Steward Bank",
    "Ecocash",
    "One Money",
    "Telecel",
  ];

  // Check if all required fields are filled
  const isFormComplete = useMemo(() => {
    return (
      (receipt.payerName || '').trim() && // Checks for falsy values and uses '' as a default
      receipt.revenueHeadCode &&
      receipt.amount &&
      parseFloat(receipt.amount) > 0 &&
      receipt.branchCode
    );
  }, [receipt]);

  // Fetch data from API
  useEffect(() => {
    
    setLoggedInUser(currentUser.currentUser.username || null );
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [revenueData, branchesData, membersData] = await Promise.all([
          getRevenueHeads(),
          getBranches(),
          getMembers()
        ]);

        setRevenueHeads(revenueData);
        console.log("Revenue Heads loaded:", revenueData);
        setBranches(branchesData);

        // Ensure membersData is an array
        const membersArray = Array.isArray(membersData) ? membersData : membersData.members || [];
        setMembers(membersArray);
        setFilteredMembers([]); // Start with empty filtered members
        console.log("Members loaded:", membersArray);

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
        setIsLoading(false);
        showModal(err.message, "Data Loading Error", "error");
      }
    };

    fetchData();
  }, []);

  // Filter members based on search term
  useEffect(() => {
    if (!Array.isArray(members)) return; // safeguard

    if (searchTerm.trim() === "") {
      setFilteredMembers([]); // Show no members when search is empty
    } else {
      const filtered = members.filter(member => {
        const name = member.firstName?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();

        // Change from .includes() to .startsWith()
        return name.startsWith(term);
      });

      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);


// fetch available printers
useEffect(() => {
  const fetchPrinters = async () => {
    try {
      const list = await listPrinters();
      setPrinters(list);
      const ipp = list.find((p) => /-IPP$/i.test(p));
      setSelectedPrinter(ipp || list[0] || "");
    } catch (err) {
      console.error("Failed to fetch printers:", err);
      showModal("Failed to fetch printers", "Error", "error");
    }
  };
  fetchPrinters();
}, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowMemberDropdown(true);
  };

  // Select a member from the dropdown
  const selectMember = (member) => {
    setReceipt({ ...receipt, payerName: member.firstName });
    setSearchTerm(member.firstName);
    setShowMemberDropdown(false);
  };


  // Handle form submission and transaction creation
// <-- make sure this matches your api.ts

const handleGenerateReceipt = async () => {
  if (!isFormComplete) return showModal("Please fill in all required fields.", "Validation Error", "error");
  if (!loggedInUser) return showModal("User information not found. Please login again.", "Authentication Error", "error");
  if (!selectedPrinter) return showModal("Please select a printer first.", "Printing Error", "error");

  const revenueHead = revenueHeads.find(r => r.code === receipt.revenueHeadCode);
  const revenueHeadName = revenueHead ? revenueHead.name : receipt.revenueHeadCode;
  


  setIsPrinting(true);  

  try {
    const transactionData = {
      payerName: receipt.payerName.trim(),
      revenueHeadCode: receipt.revenueHeadCode,
      amount: parseFloat(receipt.amount),
      currency: receipt.currency,
      paymentMethod: receipt.paymentMethod,
      branchCode: receipt.branchCode,
      operatorName: loggedInUser || "Unknown Operator",
      receiptNumber: "RC" + Math.floor(100000 + Math.random() * 900000),
      transactionDate: new Date().toISOString(),
    };

    // Generate receipt text  
        const receiptText = `
========================================
           HIM Finance System
========================================
Receipt #: ${transactionData.receiptNumber}
Payer     : ${transactionData.payerName}
Revenue   : ${revenueHeadName}
Amount    : ${transactionData.currency} ${transactionData.amount.toFixed(2)}
Payment   : ${transactionData.paymentMethod}
Branch    : ${transactionData.branchCode}
Operator  : ${transactionData.operatorName}
Date      : ${new Date(transactionData.transactionDate).toLocaleString()}
========================================

       Thank you for your support!
       May God bless you abundantly.

========================================
`;


    const message = await printDocument(selectedPrinter, receiptText, 1);

    showModal(message || "Receipt printed successfully!", "Success", "success");

    setReceipt({
      payerName: "",
      revenueHeadCode: "",
      amount: "",
      currency: "USD",
      paymentMethod: "Cash",
      branchCode: user?.branchCode || "",
    });
    setSearchTerm("");
  } catch (err: any) {
    console.error("Error printing receipt:", err);
    showModal(err.message || "Failed to print receipt.", "Printing Error", "error");
  } finally {
    setIsPrinting(false);
  }
};




  // Filter revenue heads based on selected branch
  const availableRevenueHeads = receipt.branchCode
    ? revenueHeads.filter((r) => r.branchCode === receipt.branchCode)
    : revenueHeads;

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading system data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-4">Error Loading Data</h2>
        <p className="text-sm mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
      <Modal
        isOpen={isModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Thermal Receipt Printing System
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Generate Receipt
              </h3>

              <div className="space-y-5">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payer's Name *
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => searchTerm.trim() !== "" && setShowMemberDropdown(true)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                    placeholder="Search for member by name"
                  />
                  
                  {showMemberDropdown && filteredMembers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selectMember(member)}
                        >
                          <div className="font-medium">{`${member.firstName} ${member.lastName}`}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch *
                  </label>
                  <select
                    value={receipt.branchCode}
                    onChange={(e) =>
                      setReceipt({
                        ...receipt,
                        branchCode: e.target.value,
                        revenueHeadCode: "",
                      })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch.code} value={branch.code}>
                        {branch.code} - {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Revenue Head *
                  </label>
                  <select
                    value={receipt.revenueHeadCode}
                    onChange={(e) =>
                      setReceipt({
                        ...receipt,
                        revenueHeadCode: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                    disabled={!receipt.branchCode}
                  >
                    <option value="">Select Revenue Head</option>
                    {availableRevenueHeads.map((revenue) => (
                      <option key={revenue.code} value={revenue.code}>
                        {revenue.code} - {revenue.name}
                      </option>
                    ))}
                  </select>
                  {!receipt.branchCode && (
                    <p className="text-xs text-gray-500 mt-1">Please select a branch first</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={receipt.currency}
                      onChange={(e) =>
                        setReceipt({ ...receipt, currency: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                    >
                      {CURRENCIES.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount *
                    </label>
                    <input
                      type="number"
                      value={receipt.amount}
                      onChange={(e) =>
                        setReceipt({ ...receipt, amount: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={receipt.paymentMethod}
                    onChange={(e) =>
                      setReceipt({ ...receipt, paymentMethod: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Printer *
                  </label>
                 <select
                  value={selectedPrinter}
                  onChange={(e) => setSelectedPrinter(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                 >
                  <option value="">Select printer</option>
                  {printers.map((printer) => (
                    <option key={printer} value={printer}>{printer}</option>
                  ))}
                </select>

                 
                </div>

                <button
                  onClick={handleGenerateReceipt}
                  disabled={!isFormComplete}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isPrinting ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"></path>
                      </svg>
                      Generate & Print Receipt
                    </>
                  )}
                </button>
              </div>
            </div>

            
            <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">
                Receipt Preview
              </h3>
              {isFormComplete ? (
                <div className="bg-white p-6 border-2 border-dashed border-gray-300 font-mono text-sm rounded-lg max-w-sm mx-auto">
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800">
                      HIM ADMINISTRATION
                    </h3>
                    <p className="text-gray-600 text-xs">
                      {branches.find((b) => b.code === receipt.branchCode)
                        ?.name || "Unknown Branch"}
                    </p>
                  </div>

                  <div className="border-b border-dashed border-gray-300 mb-4"></div>

                  <div className="space-y-1 mb-4 text-gray-700 text-xs">
                    <div className="flex justify-between">
                      <strong>Receipt #:</strong>
                      <span>{"RC" + Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Date:</strong>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Time:</strong>
                      <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Payer:</strong>
                      <span className="truncate ml-2">{receipt.payerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Revenue Head:</strong>
                      <span className="truncate ml-2">
                        {revenueHeads.find(
                          (r) => r.code === receipt.revenueHeadCode
                        )?.name || "Unknown Head"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Payment:</strong>
                      <span>{receipt.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="border-b border-dashed border-gray-300 mb-4"></div>

                  <div className="text-2xl font-bold text-center mt-6 mb-6 p-3 bg-blue-50 text-blue-800 rounded-md border-2 border-solid border-blue-200">
                    {receipt.currency}{" "}
                    {(parseFloat(receipt.amount) || 0).toFixed(2)}
                  </div>

                  <div className="border-b border-dashed border-gray-300 mb-4"></div>

                  <div className="text-center text-xs text-gray-500">
                    <p>Thank you for your contribution!</p>
                    <p className="mt-1">
                      Operator: {loggedInUser || "Current User"}
                    </p>
                    <p className="mt-1">
                      Printed: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p>Fill out all required fields to see receipt preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, title, message, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center mb-4">
          {type === "success" ? (
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ) : (
            <svg className={`w-6 h-6 ${type === "error" ? "text-red-500" : "text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
          <h3 className="text-xl font-bold ml-3 text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptingPage;

*/

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getRevenueHeads, getBranches, getMembers } from "@/services/api";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReceiptingPage = () => {
  const navigate = useNavigate();
  const printContentRef = useRef();
  const currentUser = useAuth();

  // Form state
  const [receipt, setReceipt] = useState({
    payerName: "",
    revenueHeadCode: "",
    amount: "",
    currency: "USD",
    paymentMethod: "Cash",
    branchCode: "",
  });

  // Printing state
  const [isPrinting, setIsPrinting] = useState(false);

  // Data state
  const [revenueHeads, setRevenueHeads] = useState([]);
  const [branches, setBranches] = useState([]);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });

  // Constants
  const CURRENCIES = ["USD", "ZWL", "ZAR", "GBP"];
  const PAYMENT_METHODS = [
    "Cash",
    "Card - CBZ Bank",
    "Card - Steward Bank",
    "Ecocash",
    "One Money",
    "Telecel",
  ];

  // Check if all required fields are filled
  const isFormComplete = useMemo(() => {
    return (
      (receipt.payerName || '').trim() &&
      receipt.revenueHeadCode &&
      receipt.amount &&
      parseFloat(receipt.amount) > 0 &&
      receipt.branchCode
    );
  }, [receipt]);

  // Fetch data from API
  useEffect(() => {
    setLoggedInUser(currentUser.currentUser.username || null);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [revenueData, branchesData, membersData] = await Promise.all([
          getRevenueHeads(),
          getBranches(),
          getMembers()
        ]);
        setRevenueHeads(revenueData);
        setBranches(branchesData);
        const membersArray = Array.isArray(membersData) ? membersData : membersData.members || [];
        setMembers(membersArray);
        setFilteredMembers([]);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
        setIsLoading(false);
        showModal(err.message, "Data Loading Error", "error");
      }
    };
    fetchData();
  }, [currentUser]);

  // Filter members based on search term
  useEffect(() => {
    if (!Array.isArray(members)) return;
    if (searchTerm.trim() === "") {
      setFilteredMembers([]);
    } else {
      const filtered = members.filter(member => {
        const name = member.firstName?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();
        return name.startsWith(term);
      });
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowMemberDropdown(true);
  };

  const selectMember = (member) => {
    setReceipt({ ...receipt, payerName: `${member.firstName} ${member.lastName}` });
    setSearchTerm(`${member.firstName} ${member.lastName}`);
    setShowMemberDropdown(false);
  };

  const showModal = (message, title, type) => {
    setModalContent({ message, title, type });
    setIsModalOpen(true);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type });
    window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2500);
  };

  // Client-side printing function using html2canvas and jspdf
  const handlePdfPrint = useCallback(async () => {
    const element = printContentRef.current;
    if (!element) {
      console.error("Print content element not found.");
      showModal("Failed to generate and print PDF. Please try again.", "Printing Error", "error");
      return;
    }

    setIsPrinting(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 297],
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
      showToast("Receipt ready to print.");
      // Do not show blocking modal on success to avoid dark overlay during printing
      // Consider replacing with a non-blocking toast in the future

      setTimeout(() => {
        setReceipt({
          payerName: "",
          revenueHeadCode: "",
          amount: "",
          currency: "USD",
          paymentMethod: "Cash",
          branchCode: "",
        });
        setSearchTerm("");
      }, 500);

    } catch (err) {
      console.error("Error generating PDF for printing:", err);
      showModal("Failed to generate and print PDF. Please try again.", "Printing Error", "error");
    } finally {
      setIsPrinting(false);
    }
  }, [receipt, revenueHeads, branches, loggedInUser]);

  // Handle form submission and transaction creation
  const handleGenerateReceipt = async () => {
    if (!isFormComplete) return showModal("Please fill in all required fields.", "Validation Error", "error");
    if (!loggedInUser) return showModal("User information not found. Please login again.", "Authentication Error", "error");
    
    // Trigger the client-side printing process
    await handlePdfPrint();
  };

  // Filter revenue heads based on selected branch
  const availableRevenueHeads = receipt.branchCode
    ? revenueHeads.filter((r) => r.branchCode === receipt.branchCode)
    : revenueHeads;

  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading system data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-4">Error Loading Data</h2>
        <p className="text-sm mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      {/* Hidden print content for browser printing */}
      <div ref={printContentRef} className="print-container absolute top-0 left-0 w-[80mm] p-2" style={{ position: 'absolute', top: -9999, left: -9999, color: 'black', backgroundColor: 'white' }}>
        <div className="receipt font-mono text-sm leading-tight text-center">
          <div className="font-bold mb-2">HIM Finance System</div>
          <div>================================</div>
          <div><span className="bold font-bold">Receipt #:</span> {"RC" + Math.floor(100000 + Math.random() * 900000)}</div>
          <div><span className="bold font-bold">Payer:</span> {receipt.payerName || "---"}</div>
          <div><span className="bold font-bold">Revenue:</span> {revenueHeads.find(r => r.code === receipt.revenueHeadCode)?.name || "---"}</div>
          <div><span className="bold font-bold">Amount:</span> {receipt.currency} {(parseFloat(receipt.amount) || 0).toFixed(2)}</div>
          <div><span className="bold font-bold">Payment:</span> {receipt.paymentMethod}</div>
          <div><span className="bold font-bold">Branch:</span> {branches.find(b => b.code === receipt.branchCode)?.name || "---"}</div>
          <div><span className="bold font-bold">Operator:</span> {loggedInUser || "---"}</div>
          <div><span className="bold font-bold">Date:</span> {new Date().toLocaleString()}</div>
          <div className="divider border-t border-dashed my-2" style={{ borderColor: 'black' }}></div>
          <div className="italic mt-2">Thank you for your support!</div>
          <div>May God bless you abundantly.</div>
          <div className="divider border-t border-dashed my-2" style={{ borderColor: 'black' }}></div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Toast */}
      {toast.visible && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white transition-opacity duration-200 ${
            toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-blue-600' : 'bg-green-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Thermal Receipt Printing System
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Generate Receipt
              </h3>

              <div className="space-y-5">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payer's Name *
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => searchTerm.trim() !== "" && setShowMemberDropdown(true)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                    placeholder="Search for member by name"
                  />
                  
                  {showMemberDropdown && filteredMembers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selectMember(member)}
                        >
                          {member.firstName} {member.lastName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Revenue Head *
                  </label>
                  <select
                    value={receipt.revenueHeadCode}
                    onChange={(e) =>
                      setReceipt({ ...receipt, revenueHeadCode: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  >
                    <option value="">Select Revenue Head</option>
                    {availableRevenueHeads.map((head) => (
                      <option key={head.code} value={head.code}>
                        {head.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={receipt.amount}
                    onChange={(e) =>
                      setReceipt({ ...receipt, amount: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency *
                    </label>
                    <select
                      value={receipt.currency}
                      onChange={(e) =>
                        setReceipt({ ...receipt, currency: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method *
                    </label>
                    <select
                      value={receipt.paymentMethod}
                      onChange={(e) =>
                        setReceipt({ ...receipt, paymentMethod: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch *
                  </label>
                  <select
                    value={receipt.branchCode}
                    onChange={(e) =>
                      setReceipt({ ...receipt, branchCode: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  >
                    <option value="">Select Branch</option>
                    {branches.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generate Receipt button */}
                <button
                  disabled={!isFormComplete || isPrinting}
                  onClick={handleGenerateReceipt}
                  className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center ${
                    !isFormComplete || isPrinting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isPrinting && <LoadingSpinner />}
                  {!isPrinting && "Generate Receipt"}
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Receipt Preview</h3>
              <div className="border p-4 rounded-lg bg-gray-50 font-mono text-sm leading-tight text-center">
                <div className="font-bold mb-2">HIM Finance System</div>
                <div>================================</div>
                <div>Receipt #: {"RC" + Math.floor(100000 + Math.random() * 900000)}</div>
                <div>Payer: {receipt.payerName || "---"}</div>
                <div>
                  Revenue:{" "}
                  {revenueHeads.find((r) => r.code === receipt.revenueHeadCode)?.name ||
                    "---"}
                </div>
                <div>
                  Amount: {receipt.currency}{" "}
                  {(parseFloat(receipt.amount) || 0).toFixed(2)}
                </div>
                <div>Payment: {receipt.paymentMethod}</div>
                <div>
                  Branch:{" "}
                  {branches.find((b) => b.code === receipt.branchCode)?.name || "---"}
                </div>
                <div>Operator: {loggedInUser || "---"}</div>
                <div>Date: {new Date().toLocaleString()}</div>
                <div className="mt-2 italic">Thank you for your support!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, title, message, type, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2
          className={`text-lg font-bold mb-4 ${
            type === "error"
              ? "text-red-600"
              : type === "success"
              ? "text-green-600"
              : "text-blue-600"
          }`}
        >
          {title}
        </h2>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReceiptingPage;

