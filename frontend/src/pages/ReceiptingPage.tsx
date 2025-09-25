

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getRevenueHeads, getBranches, getMembers, generateReceipt } from "@/services/api";
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
  const [transaction, setTransaction] = useState<Transaction>({


  id: 0,
  receiptNumber: '',
  revenueHeadCode: '',
  amount: '0.00',
  branchCode: '',
  transactionDate: new Date(),
  createdAt: new Date(),
  currencyCode: '',
  memberId: 0,
  paymentMethodId: 0,
  status: 'completed',
  updatedAt: new Date(),
  userId: 0,
  
  
});
 
const [selectedMember, setSelectedMember] = useState<Member | null>(null);


 interface Member {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  ageCategory: string;
  branchCode: string;
  branch: {
    name: string;
  };
  dateOfBirth: string; // or Date if you parse it
  email: string;
  isActive: boolean;
  joinedDate: string; // or Date
  memberNumber: string;
  phoneNumber: string;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  _count: {
    contributions: number;
    memberProjects: number;
    generalTransactions: number;
  };
}



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
    setSelectedMember(member);
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
 interface Transaction {
  id: number;
  receiptNumber: string;
  revenueHeadCode: string;
  amount: string; // Prisma Decimal is usually returned as string
  branchCode: string;
  transactionDate: Date;
  createdAt: Date;
  currencyCode: string;
  memberId: number;
  notes?: string | null;
  paymentMethodId: number;
  referenceNumber?: string | null;
  status: string;
  updatedAt: Date;
  userId: number;

  
}

const handleGenerateReceipt = async () => {
  if (!isFormComplete)
    return showModal("Please fill in all required fields.", "Validation Error", "error");
  if (!loggedInUser)
    return showModal("User information not found. Please login again.", "Authentication Error", "error");

  if (!selectedMember) 
    return showModal("Please select a member from the dropdown.", "Validation Error", "error");

  // Map payment method to its ID (replace with your actual mapping)
  const paymentMethodMap: Record<string, number> = {
    "Cash": 1,
    "Card - CBZ Bank": 2,
    "Card - Steward Bank": 3,
    "Ecocash": 4,
    "One Money": 5,
    "Telecel": 6,
  };
  const paymentMethodId = paymentMethodMap[receipt.paymentMethod] || 1;

  const transactionPayload = {
    memberId: selectedMember.id,
    revenueHeadCode: receipt.revenueHeadCode,
    amount: parseFloat(receipt.amount),
    currencyCode: receipt.currency,
    paymentMethodId,
    referenceNumber: null,
    notes: null,
    transactionDate: new Date().toISOString(),
  };

  try {
    
    const savedTransaction = await generateReceipt(transactionPayload);

    // Update local state with the saved transaction
    setTransaction(savedTransaction);

    // Trigger client-side printing
    await handlePdfPrint();

    showToast("Receipt generated and saved successfully.");
  } catch (err: any) {
    console.error(err);
    showModal(err.message || "Failed to save transaction", "Error", "error");
  }
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
