import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { 
  getRevenueHeads, 
  getBranches, 
  getMembers, 
  getPaymentMethods, 
  getProjects, 
  createContribution,
  createTransaction 
} from "@/services/api";
import useAuth from "@/hooks/useAuth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { 
  FileText, 
  User, 
  DollarSign, 
  Building, 
  CreditCard, 
  Search, 
  Printer,
  Loader2,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { Member } from "@/utils/Types";

// Hardcoded currencies
const hardcodedCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "ZAR", name: "South African Rand", symbol: "R" }
];

const ReceiptingPage = () => {
  const printContentRef = useRef<HTMLDivElement | null>(null);
  const { currentUser } = useAuth();

  // Form state
  const [receipt, setReceipt] = useState({
    payerName: "",
    revenueHeadCode: "",
    amount: "",
    currency: "USD",
    paymentMethod: "Cash",
    branchCode: "",
    paymentType: "revenue", // 'revenue' or 'project'
  });

  // UI state
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "info" as "info" | "error" | "success" });

  // Data state
  const [revenueHeads, setRevenueHeads] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Use hardcoded currencies
  const currencies = hardcodedCurrencies;

  // Check if all required fields are filled
  const isFormComplete = useMemo(() => {
    return (
      (receipt.payerName || "").trim() &&
      receipt.revenueHeadCode &&
      receipt.amount &&
      parseFloat(receipt.amount) > 0 &&
      receipt.branchCode
    );
  }, [receipt]);

  // Payment method mapping - FIXED VERSION
  const paymentMethodMap = useMemo(() => {
    // Always start with hardcoded values to ensure they work
    const hardcodedMap: Record<string, number> = {
      'Cash': 1,
      'Card': 2,
      'Bank Transfer': 3,
      'Mobile Money': 4,
      'Check': 5
    };

    // Then try to override with actual API data if available
    if (paymentMethods && paymentMethods.length > 0) {
      console.log('Processing API payment methods:', paymentMethods);
      for (const m of paymentMethods) {
        const name = m.name; // Use 'name' field from your DTO
        const id = Number(m.id);
        
        if (name && Number.isFinite(id) && id > 0) {
          hardcodedMap[name] = id;
          console.log(`Mapped payment method: ${name} -> ${id}`);
        }
      }
    }

    console.log('Final payment method map:', hardcodedMap);
    return hardcodedMap;
  }, [paymentMethods]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [revenueData, branchesData, membersData, paymentMethodsData, projectsData] = await Promise.all([
          getRevenueHeads(),
          getBranches(),
          getMembers(),
          getPaymentMethods(),
          getProjects(),
        ]);

        console.log('Raw revenue data:', revenueData);
        console.log('Raw branches data:', branchesData);
        console.log('Raw payment methods data:', paymentMethodsData);
        console.log('Raw projects data:', projectsData);

        // Process revenue heads data
        setRevenueHeads(revenueData || []);

        // Process branches data
        const processedBranches = Array.isArray(branchesData) ? branchesData : [];
        setBranches(processedBranches);
        
        // Process members data
        const membersArray = Array.isArray(membersData) ? membersData : (membersData && (membersData as any).members) || [];
        setMembers(membersArray);
        
        // Process payment methods
        const paymentMethodsArray = Array.isArray(paymentMethodsData) ? paymentMethodsData : [];
        setPaymentMethods(paymentMethodsArray);
        
        // Transform projects data to ensure consistent structure
        const transformedProjects = Array.isArray(projectsData) ? projectsData.map(project => ({
          id: String(project.id), 
          title: project.title || project.name,
          revenueHeadCode: project.revenueHeadCode,
          branchId: project.branchId 
        })) : [];
        setProjects(transformedProjects);

        // Set a safe default payment method after data is fetched
        let defaultMethod = paymentMethodsArray[0]; 

        if (defaultMethod) {
            const validMethodName = defaultMethod.name; // Use 'name' field
            setReceipt(prev => ({
                ...prev,
                paymentMethod: validMethodName,
            }));
        } else {
            console.warn("No payment methods found from the API. Using default 'Cash'.");
            setReceipt(prev => ({
                ...prev,
                paymentMethod: "Cash",
            }));
        }
        
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        showModal(err.message || "Failed to load system data", "Data Loading Error", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter members based on search term
  useEffect(() => {
    if (!Array.isArray(members)) return;
    if (searchTerm.trim() === "") {
      setFilteredMembers([]);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = members.filter((member) => {
        const name = `${member.firstName || ""} ${member.lastName || ""}`.trim().toLowerCase();
        return name.includes(term);
      });
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  // Debug payment method selection
  useEffect(() => {
    console.log('Payment Method Debug:', {
      selectedPaymentMethod: receipt.paymentMethod,
      paymentMethodMap: paymentMethodMap,
      mappedId: paymentMethodMap[receipt.paymentMethod],
      allPaymentMethods: paymentMethods
    });
  }, [receipt.paymentMethod, paymentMethodMap, paymentMethods]);

  // Get available options based on payment type and branch
  const availableOptions = useMemo(() => {
    console.log('Available Options Debug:', {
      branchCode: receipt.branchCode,
      paymentType: receipt.paymentType,
      projectsCount: projects.length,
      revenueHeadsCount: revenueHeads.length
    });

    if (!receipt.branchCode) {
      return [];
    }

    // Find the branch object to get its ID
    const selectedBranch = branches.find(b => b.branchCode === receipt.branchCode);
    const branchId = selectedBranch?.id;

    console.log('Branch matching:', {
      branchCode: receipt.branchCode,
      selectedBranch: selectedBranch,
      branchId: branchId
    });

    if (receipt.paymentType === 'project') {
      // Filter projects by branchId
      const filteredProjects = projects.filter(project => {
        const projectBranchIdStr = project.branchId?.toString();
        const selectedBranchIdStr = branchId?.toString();
        const matches = projectBranchIdStr === selectedBranchIdStr;
        
        console.log('Project filter:', {
          project: project.title,
          projectBranchId: project.branchId,
          selectedBranchId: branchId,
          matches: matches
        });
        
        return matches;
      });
      
      console.log('Filtered projects:', filteredProjects);
      return filteredProjects;
    } else {
      // For revenue heads, filter by branchId using the new backend data
      const filteredRevenueHeads = revenueHeads.filter(head => {
        // Check if revenue head has branchId or branchCode that matches
        const headBranchId = head.branchId || head.branchID;
        const matches = !headBranchId || headBranchId?.toString() === branchId?.toString();
        
        console.log('Revenue head filter:', {
          head: head.name,
          headBranchId: headBranchId,
          selectedBranchId: branchId,
          matches: matches
        });
        
        return matches;
      });
      
      console.log('Filtered revenue heads:', filteredRevenueHeads);
      return filteredRevenueHeads;
    }
  }, [receipt.paymentType, receipt.branchCode, projects, revenueHeads, branches]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowMemberDropdown(true);
  };

  const selectMember = (member: Member) => {
    console.log('Selected member:', member);
    
    // Get the member's branch - the member has branchID, we need to find the corresponding branch
    const memberBranch = branches.find(b => b.id === member.branchID);
    
    const branchCode = memberBranch?.branchCode || "";
    
    console.log('Member branch match:', {
      memberBranchID: member.branchID,
      foundBranch: memberBranch,
      branchCode: branchCode
    });
    
    setReceipt({ 
      ...receipt, 
      payerName: `${member.firstName} ${member.lastName}`,
      branchCode: branchCode,
      revenueHeadCode: "" // Reset selection when member changes
    });
    setSearchTerm(`${member.firstName} ${member.lastName}`);
    setSelectedMember(member);
    setShowMemberDropdown(false);
  };

  const handlePaymentTypeChange = (type: 'revenue' | 'project') => {
    setReceipt({ 
      ...receipt, 
      paymentType: type,
      revenueHeadCode: "" // Reset selection when changing type
    });
  };

  const showModal = (message: string, title: string, type: "info" | "error" | "success") => {
    setModalContent({ message, title, type });
    setIsModalOpen(true);
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handlePdfPrint = useCallback(async () => {
    const element = printContentRef.current;
    if (!element) return;

    setIsPrinting(true);

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 297] });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.src = blobUrl;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        const cw = iframe.contentWindow;
        cw?.focus();
        const cleanup = () => {
          try { document.body.removeChild(iframe); } catch {}
          URL.revokeObjectURL(blobUrl);
          setIsPrinting(false);
        };
        if (cw && "onafterprint" in cw) {
          (cw as any).onafterprint = cleanup;
        }
        setTimeout(cleanup, 15000);
        cw?.print();
      };

      showToast("Receipt ready for printing");
      
    } catch (err) {
      console.error("Printing error:", err);
      showModal("Failed to generate and print PDF. Please try again.", "Printing Error", "error");
      setIsPrinting(false);
    }
  }, []);

  const resetForm = () => {
    setReceipt({
      payerName: "",
      revenueHeadCode: "",
      amount: "",
      currency: "USD",
      paymentMethod: "Cash",
      branchCode: "",
      paymentType: "revenue",
    });
    setSearchTerm("");
    setSelectedMember(null);
  };

  const handleGenerateReceipt = async () => {
    if (!isFormComplete) {
      return showModal("Please fill in all required fields.", "Validation Error", "error");
    }
    if (!selectedMember) {
      return showModal("Please select a member.", "Validation Error", "error");
    }

    try {
      const selectedBranch = branches.find(b => b.branchCode === receipt.branchCode);
      
      // Debug payment method mapping
      console.log('Payment method debug:', {
        selectedMethod: receipt.paymentMethod,
        paymentMethodMap: paymentMethodMap,
        mappedId: paymentMethodMap[receipt.paymentMethod],
        allPaymentMethods: paymentMethods
      });
      
      let paymentMethodId = paymentMethodMap[receipt.paymentMethod];
      
      // Fallback if payment method ID is not found
      if (isNaN(paymentMethodId) || !paymentMethodId) {
        console.warn('Payment method ID not found, using fallback mapping');
        const fallbackMap: Record<string, number> = {
          'Cash': 1,
          'Card': 2,
          'Bank Transfer': 3,
          'Mobile Money': 4,
          'Check': 5,
          'Credit Card': 6,
          'Debit Card': 7,
          'Online Payment': 8
        };
        paymentMethodId = fallbackMap[receipt.paymentMethod] || 1; // Default to Cash (1)
        console.log('Using fallback payment method ID:', paymentMethodId);
      }

      // Final validation of paymentMethodId
      if (!paymentMethodId || isNaN(paymentMethodId)) {
        throw new Error(`Invalid payment method ID: ${paymentMethodId}. Please check payment method configuration.`);
      }

      if (!selectedBranch) {
        throw new Error("Selected branch not found");
      }

      // Ensure all IDs are properly converted to numbers
      const memberId = Number(selectedMember.id);
      const branchId = Number(selectedBranch.id);

      console.log('ID validation:', {
        memberId,
        branchId,
        paymentMethodId,
        isNaNMemberId: isNaN(memberId),
        isNaNBranchId: isNaN(branchId),
        isNaNPaymentMethodId: isNaN(paymentMethodId)
      });

      if (isNaN(memberId) || isNaN(branchId) || isNaN(paymentMethodId)) {
        throw new Error(`Invalid ID format detected: memberId=${memberId}, branchId=${branchId}, paymentMethodId=${paymentMethodId}`);
      }

      if (receipt.paymentType === 'project') {
        // Handle project contribution
        const selectedProject = projects.find(p => p.id === receipt.revenueHeadCode);

        if (!selectedProject) {
          throw new Error("Selected project not found");
        }

        const projectId = Number(selectedProject.id);

        const contributionData = {
          projectId: projectId,
          memberId: memberId,
          amount: parseFloat(receipt.amount),
          branchId: branchId,
          paymentMethodId: paymentMethodId,
          processedByUserId: currentUser?.id || 1
        };

        console.log("Creating project contribution:", contributionData);
        await createContribution(contributionData);
        showToast(`Contribution to ${selectedProject.title} recorded successfully`);

      } else {
        // Handle revenue head transaction
        const selectedRevenueHead = revenueHeads.find(r => r.code === receipt.revenueHeadCode);

        if (!selectedRevenueHead) {
          throw new Error("Selected revenue head not found");
        }

        const revenueHeadId = Number(selectedRevenueHead.id);

        const transactionData = {
          memberId: memberId,
          revenueHeadId: revenueHeadId,
          amount: parseFloat(receipt.amount),
          currency: receipt.currency,
          branchId: branchId,
          paymentMethodId: paymentMethodId,
          userId: currentUser?.id || 1,
          transactionDate: new Date().toISOString()
        };

        console.log("Creating revenue transaction:", transactionData);
        await createTransaction(transactionData);
        showToast(`Payment for ${selectedRevenueHead.name} recorded successfully`);
      }

      // Generate and print receipt
      await handlePdfPrint();
      
      // Reset form after successful submission
      setTimeout(resetForm, 1000);

    } catch (err: any) {
      console.error("Transaction error:", err);
      showModal(err.message || "Failed to process transaction", "Transaction Error", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading system data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Hidden print content */}
      <div
        ref={printContentRef}
        className="absolute top-0 left-0 w-[80mm] p-2"
        style={{ position: 'absolute', top: -9999, left: -9999, color: 'black', backgroundColor: 'white' }}
      >
        <div className="receipt font-mono text-sm leading-tight text-center">
          <div className="font-bold mb-2">HIM Finance System</div>
          <div>================================</div>
          <div><span className="font-bold">Receipt #:</span> {"RC" + Math.floor(100000 + Math.random() * 900000)}</div>
          <div><span className="font-bold">Payer:</span> {receipt.payerName || "---"}</div>
          <div><span className="font-bold">Type:</span> {receipt.paymentType === 'project' ? 'Project Contribution' : 'Revenue Payment'}</div>
          <div><span className="font-bold">Description:</span> {
            receipt.paymentType === 'project' 
              ? projects.find(p => p.id === receipt.revenueHeadCode)?.title || "---"
              : revenueHeads.find(r => r.code === receipt.revenueHeadCode)?.name || "---"
          }</div>
          <div><span className="font-bold">Amount:</span> {receipt.currency} {(parseFloat(receipt.amount) || 0).toFixed(2)}</div>
          <div><span className="font-bold">Payment:</span> {receipt.paymentMethod}</div>
          <div><span className="font-bold">Branch:</span> {branches.find(b => b.branchCode === receipt.branchCode)?.branchName || "---"}</div>
          <div><span className="font-bold">Operator:</span> {currentUser?.username || "---"}</div>
          <div><span className="font-bold">Date:</span> {new Date().toLocaleString()}</div>
          <div className="border-t border-dashed border-black my-2"></div>
          <div className="italic mt-2">Thank you for your support!</div>
          <div>May God bless you abundantly.</div>
          <div className="border-t border-dashed border-black my-2"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white rounded-2xl shadow-lg border border-gray-100">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  Receipt Generation
                </h1>
                <p className="text-gray-600 text-lg">
                  Process project contributions and revenue payments
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50/80">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Transaction Details
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Select payment type and fill in all required information
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Type Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <TrendingUp className="w-4 h-4" />
                  Payment Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handlePaymentTypeChange('revenue')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                      receipt.paymentType === 'revenue'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Revenue Head</div>
                      <div className="text-sm opacity-75">Tithes, Offerings, etc.</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentTypeChange('project')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                      receipt.paymentType === 'project'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Target className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Project</div>
                      <div className="text-sm opacity-75">Building funds, etc.</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payer Search */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4" />
                  Payer's Name *
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => searchTerm.trim() !== "" && setShowMemberDropdown(true)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                    placeholder="Search for member by name"
                  />
                  {showMemberDropdown && filteredMembers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          onClick={() => selectMember(member)}
                        >
                          {member.firstName} {member.lastName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Revenue Head / Project Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  {receipt.paymentType === 'project' ? <Target className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  {receipt.paymentType === 'project' ? 'Project *' : 'Revenue Head *'}
                </label>
                <select
                  value={receipt.revenueHeadCode}
                  onChange={(e) => setReceipt({ ...receipt, revenueHeadCode: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                >
                  <option value="">
                    {!receipt.branchCode 
                      ? "Select a member first to see available options" 
                      : availableOptions.length === 0
                      ? `No ${receipt.paymentType === 'project' ? 'projects' : 'revenue heads'} available for this branch`
                      : `Select ${receipt.paymentType === 'project' ? 'Project' : 'Revenue Head'}`
                    }
                  </option>
                  {availableOptions.map((option) => (
                    <option 
                      key={receipt.paymentType === 'project' ? option.id : option.code} 
                      value={receipt.paymentType === 'project' ? option.id : option.code}
                    >
                      {receipt.paymentType === 'project' ? option.title : option.name}
                      {receipt.paymentType === 'project' && option.status && ` (${option.status})`}
                    </option>
                  ))}
                </select>
                {!receipt.branchCode && (
                  <p className="text-sm text-yellow-600">
                    Please select a member first to see available {receipt.paymentType === 'project' ? 'projects' : 'revenue heads'}
                  </p>
                )}
                {receipt.branchCode && availableOptions.length === 0 && (
                  <p className="text-sm text-red-600">
                    No {receipt.paymentType === 'project' ? 'projects' : 'revenue heads'} available for the selected branch
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4" />
                  Amount *
                </label>
                <input
                  type="number"
                  value={receipt.amount}
                  onChange={(e) => setReceipt({ ...receipt, amount: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                  placeholder="Enter amount"
                  step="0.01"
                />
              </div>

              {/* Currency & Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <DollarSign className="w-4 h-4" />
                    Currency *
                  </label>
                  <select
                    value={receipt.currency}
                    onChange={(e) => setReceipt({ ...receipt, currency: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CreditCard className="w-4 h-4" />
                    Payment Method *
                  </label>
                  <select
                    value={receipt.paymentMethod}
                    onChange={(e) => setReceipt({ ...receipt, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                  >
                    {paymentMethods.map((m) => {
                      const label = m.name; // Use 'name' field from your DTO
                      return (
                        <option key={m.id} value={label}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Branch Display (Read-only) */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building className="w-4 h-4" />
                  Branch *
                </label>
                <div className="w-full px-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-700">
                  {receipt.branchCode 
                    ? branches.find(b => b.branchCode === receipt.branchCode)?.branchName || "Branch not found"
                    : "Select a member to auto-assign branch"
                  }
                </div>
                <p className="text-sm text-gray-500">
                  Branch is automatically assigned from the selected member's branch
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateReceipt}
                disabled={!isFormComplete || isPrinting}
                className="w-full px-8 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg flex items-center gap-2 font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100 justify-center"
              >
                {isPrinting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    Process & Print Receipt
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50/80">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Receipt Preview
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Live preview of the receipt to be printed
              </p>
            </div>

            <div className="p-6">
              <div className="border-2 border-gray-300 p-6 rounded-xl bg-white font-mono text-sm leading-tight text-center">
                <div className="font-bold text-lg mb-3">HIM Finance System</div>
                <div className="border-b border-dashed border-gray-400 mb-3"></div>
                <div className="space-y-2 text-left">
                  <div><span className="font-semibold">Receipt #:</span> {"RC" + Math.floor(100000 + Math.random() * 900000)}</div>
                  <div><span className="font-semibold">Payer:</span> {receipt.payerName || "---"}</div>
                  <div><span className="font-semibold">Type:</span> {receipt.paymentType === 'project' ? 'Project Contribution' : 'Revenue Payment'}</div>
                  <div><span className="font-semibold">Description:</span> {
                    receipt.paymentType === 'project' 
                      ? projects.find(p => p.id === receipt.revenueHeadCode)?.title || "---"
                      : revenueHeads.find(r => r.code === receipt.revenueHeadCode)?.name || "---"
                  }</div>
                  <div><span className="font-semibold">Amount:</span> {receipt.currency} {(parseFloat(receipt.amount) || 0).toFixed(2)}</div>
                  <div><span className="font-semibold">Payment:</span> {receipt.paymentMethod}</div>
                  <div><span className="font-semibold">Branch:</span> {branches.find(b => b.branchCode === receipt.branchCode)?.branchName || "---"}</div>
                  <div><span className="font-semibold">Operator:</span> {currentUser?.username || "---"}</div>
                  <div><span className="font-semibold">Date:</span> {new Date().toLocaleString()}</div>
                </div>
                <div className="border-t border-dashed border-gray-400 mt-4 pt-3">
                  <div className="italic text-gray-600">Thank you for your support!</div>
                  <div className="text-gray-600">May God bless you abundantly.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-lg text-white font-medium flex items-center gap-3 transition-all duration-300 ${
          toast.type === "error" ? "bg-red-500" : 
          toast.type === "info" ? "bg-blue-500" : "bg-green-500"
        }`}>
          {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Printing Overlay */}
      {isPrinting && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-xl flex items-center gap-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <div className="text-gray-800 font-medium">Processing transaction and printing receipt...</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, title, message, type, onClose }: { isOpen: boolean; title: string; message: string; type: "info" | "error" | "success"; onClose: () => void }) => {
  if (!isOpen) return null;

  const icon = type === "success" ? <CheckCircle className="w-6 h-6 text-green-600" /> :
               type === "error" ? <AlertCircle className="w-6 h-6 text-red-600" /> :
               <AlertCircle className="w-6 h-6 text-blue-600" />;

  const buttonColor = type === "success" ? "bg-green-600 hover:bg-green-700" :
                     type === "error" ? "bg-red-600 hover:bg-red-700" :
                     "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 text-white rounded-xl transition-all duration-200 font-medium ${buttonColor}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptingPage;