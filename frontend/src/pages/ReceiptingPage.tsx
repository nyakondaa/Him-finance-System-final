import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  getRevenueHeads,
  getBranches,
  getMembers,
  generateReceipt,
  getCurrencies,
  getPaymentMethods,
  getProjects,
  createContribution,

} from "@/services/api";
import useAuth from "@/hooks/useAuth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Member } from "@/utils/Types";

const ReceiptingPage = () => {
  const printContentRef = useRef<HTMLDivElement | null>(null);
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
  const [revenueHeads, setRevenueHeads] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // Modal state
  type ModalState = {
    title: string;
    message: string;
    type: "info" | "error" | "success";
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalState>({
    title: "",
    message: "",
    type: "info",
  });

  // Constants

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

  // Fetch data from API
  useEffect(() => {
    setLoggedInUser((currentUser as any)?.currentUser?.username || null);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          revenueData,
          branchesData,
          membersData,
          currenciesData,
          paymentMethodsData,
        ] = await Promise.all([
          getRevenueHeads(),
          getBranches(),
          getMembers(),
          getCurrencies(),
          getPaymentMethods(),
        ]);
        setRevenueHeads(revenueData || []);
        setBranches(branchesData || []);
        const membersArray = Array.isArray(membersData)
          ? membersData
          : (membersData && (membersData as any).members) || [];
        setMembers(membersArray || []);
        setFilteredMembers([]);
        setCurrencies(
          Array.isArray(currenciesData)
            ? currenciesData.map((c: any) => c.code || c).filter(Boolean)
            : []
        );
        setPaymentMethods(
          Array.isArray(paymentMethodsData) ? paymentMethodsData : []
        );
        setIsLoading(false);
      } catch (err: any) {
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
      const term = searchTerm.toLowerCase();
      const filtered = members.filter((member) => {
        const name = `${member.firstName || ""} ${member.lastName || ""}`
          .trim()
          .toLowerCase();
        return name.includes(term);
      });
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowMemberDropdown(true);
  };

  const selectMember = (member: Member) => {
    setReceipt({
      ...receipt,
      payerName: `${member.firstName} ${member.lastName}`,
    });
    setSearchTerm(`${member.firstName} ${member.lastName}`);
    setSelectedMember(member);
    setShowMemberDropdown(false);
  };

  const showModal = (
    message: string,
    title: string,
    type: "info" | "error" | "success"
  ) => {
    setModalContent({ message, title, type });
    setIsModalOpen(true);
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ visible: true, message, type });
    window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2500);
  };

  const handlePdfPrint = useCallback(async () => {
    const element = printContentRef.current;
    if (!element) return;

    setIsPrinting(true);

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 297],
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Create a blob
      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Open in iframe for printing
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
        // Prefer event-based cleanup to avoid closing the dialog prematurely
        const cleanup = () => {
          try {
            document.body.removeChild(iframe);
          } catch {}
          URL.revokeObjectURL(blobUrl);
          setIsPrinting(false);
        };
        // afterprint handler (best-effort; may not fire in all browsers)
        if (cw && "onafterprint" in cw) {
          (cw as any).onafterprint = cleanup;
        }
        // Fallback cleanup in case afterprint doesn't fire
        setTimeout(cleanup, 15000);
        cw?.print();
      };

      showToast("Receipt ready to print.");
      setReceipt({
        payerName: "",
        revenueHeadCode: "",
        amount: "",
        currency: "USD",
        paymentMethod: "Cash",
        branchCode: "",
      });
      setSearchTerm("");
    } catch (err) {
      console.error(err);
      showModal(
        "Failed to generate and print PDF. Please try again.",
        "Printing Error",
        "error"
      );
    }
  }, [receipt]);

  // Handle form submission and transaction creation

  const paymentMethodMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of paymentMethods) {
      const name = (m.name || m.method || "").toString();
      const id = Number(m.id ?? m.paymentMethodId);
      if (name && Number.isFinite(id)) map[name] = id;
    }
    return map;
  }, [paymentMethods]);

  interface ProjectData {
    id: number;
    name: string;
    currentAmount: number;
    targetAmount: number;
    status: string;
    revenueHeadCode?: string;
    totalCollected: number | null;
  }

  // services/api.js
  const getProjectsData = async (): Promise<ProjectData[]> => {
    try {
      console.log("🔄 API: Fetching projects...");

      const response = await getProjects();
      console.log("📦 API: Raw response:", response);

      // Map the API response to match ProjectData interface
      const mappedProjects = response.map((project: any) => ({
        id: project.id,
        name: project.name,
        currentAmount: project.totalCollected || 0, // Use totalCollected from your backend
        targetAmount: parseFloat(project.targetAmount) || 0,
        status: project.status,
        revenueHeadCode: project.revenueHeadCode || undefined,
        totalCollected: project.totalCollected || 0,
      }));

      console.log(" API: Mapped projects:", mappedProjects);
      return mappedProjects;
    } catch (error) {
      console.error("❌ API: Error fetching projects:", error);
      throw error;
    }
  };

  const handleGenerateReceipt = async () => {
    if (!isFormComplete) {
      return showModal(
        "Please fill in all required fields.",
        "Validation Error",
        "error"
      );
    }
    if (!selectedMember) {
      return showModal("Please select a member.", "Validation Error", "error");
    }

    try {
      // Generate the receipt first
      const receiptResult = await generateReceipt({
        memberId: selectedMember.id,
        revenueHeadCode: receipt.revenueHeadCode,
        amount: parseFloat(receipt.amount),
        currencyCode: receipt.currency,
        paymentMethodId: paymentMethodMap[receipt.paymentMethod],
        transactionDate: new Date().toISOString(),
      });

      // Check if the revenue head code is from a project
      const projects = await getProjectsData();
      const project = projects.find(
        (p) => p.revenueHeadCode === receipt.revenueHeadCode
      );

      if (project) {
        console.log(`Receipt is for project: ${project.name}`);

        try {
          // Add to member_contributions table
          const contributionData = {
            memberId: selectedMember.id,
            projectId: project.id,
            amount: parseFloat(receipt.amount),
            currencyCode: receipt.currency,
            paymentMethodId: paymentMethodMap[receipt.paymentMethod],
            referenceNumber: receiptResult.receiptNumber,
            notes: `Contribution for project: ${project.name}`,
            paymentDate: new Date().toISOString(),
          };

          console.log("Creating contribution with data:", contributionData);
          console.log(
            "Payload sent to backend:",
            JSON.stringify(contributionData, null, 2)
          );

          const contributionResult = await createContribution(contributionData);
          console.log(
            "Contribution recorded successfully:",
            contributionResult
          );

          console.log("updated project:", project);
        
          showToast(
            "Receipt generated and contribution recorded successfully."
          );
        } catch (contributionError: any) {
          console.error("Contribution recording error:", contributionError);

          let userMessage =
            contributionError.message || "Failed to record contribution";

          // Handle specific error cases
          if (userMessage.includes("same branch")) {
            userMessage = `Cannot record contribution: The member and project belong to different branches.`;
          } else if (userMessage.includes("inactive projects")) {
            userMessage = `Cannot record contribution: The project is inactive.`;
          } else if (
            userMessage.includes("Member not found") ||
            userMessage.includes("Project not found")
          ) {
            userMessage = `Cannot record contribution: ${userMessage}`;
          } else if (
            userMessage.includes("Currency not found") ||
            userMessage.includes("Payment method not found")
          ) {
            userMessage = `Cannot record contribution: ${userMessage}`;
          }

          showModal(
            `Receipt was generated successfully but contribution recording failed: ${userMessage}`,
            "Partial Success",
            "error"
          );
        }
      } else {
        console.log("Receipt is not for a project.");
        showToast("Receipt generated successfully.");
      }

      await handlePdfPrint();
    } catch (err: any) {
      console.error("Main error:", err);
      showModal(err.message || "Failed to generate receipt", "Error", "error");
    }
  };

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
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-4">Error Loading Data</h2>
        <p className="text-sm mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      {/* Hidden print content for browser printing */}
      <div
        ref={printContentRef}
        className="print-container absolute top-0 left-0 w-[80mm] p-2"
        style={{
          position: "absolute",
          top: -9999,
          left: -9999,
          color: "black",
          backgroundColor: "white",
        }}
      >
        <div className="receipt font-mono text-sm leading-tight text-center">
          <div className="font-bold mb-2">HIM Finance System</div>
          <div>================================</div>
          <div>
            <span className="bold font-bold">Receipt #:</span>{" "}
            {"RC" + Math.floor(100000 + Math.random() * 900000)}
          </div>
          <div>
            <span className="bold font-bold">Payer:</span>{" "}
            {receipt.payerName || "---"}
          </div>
          <div>
            <span className="bold font-bold">Revenue:</span>{" "}
            {revenueHeads.find((r) => r.code === receipt.revenueHeadCode)
              ?.name || "---"}
          </div>
          <div>
            <span className="bold font-bold">Amount:</span> {receipt.currency}{" "}
            {(parseFloat(receipt.amount) || 0).toFixed(2)}
          </div>
          <div>
            <span className="bold font-bold">Payment:</span>{" "}
            {receipt.paymentMethod}
          </div>
          <div>
            <span className="bold font-bold">Branch:</span>{" "}
            {branches.find((b) => b.code === receipt.branchCode)?.name || "---"}
          </div>
          <div>
            <span className="bold font-bold">Operator:</span>{" "}
            {loggedInUser || "---"}
          </div>
          <div>
            <span className="bold font-bold">Date:</span>{" "}
            {new Date().toLocaleString()}
          </div>
          <div
            className="divider border-t border-dashed my-2"
            style={{ borderColor: "black" }}
          ></div>
          <div className="italic mt-2">Thank you for your support!</div>
          <div>May God bless you abundantly.</div>
          <div
            className="divider border-t border-dashed my-2"
            style={{ borderColor: "black" }}
          ></div>
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
            toast.type === "error"
              ? "bg-red-600"
              : toast.type === "info"
              ? "bg-blue-600"
              : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Printing overlay */}
      {isPrinting && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg px-6 py-4 shadow">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-gray-800">Preparing print...</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
            <svg
              className="w-8 h-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Thermal Receipt Printing System
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
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
                    onFocus={() =>
                      searchTerm.trim() !== "" && setShowMemberDropdown(true)
                    }
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
                      setReceipt({
                        ...receipt,
                        revenueHeadCode: e.target.value,
                      })
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
                      {currencies.map((c) => (
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
                        setReceipt({
                          ...receipt,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg"
                    >
                      {paymentMethods.map((m) => {
                        const label = m.name || m.method || String(m);
                        return (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        );
                      })}
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
              <h3 className="text-xl font-semibold mb-6 text-gray-700">
                Receipt Preview
              </h3>
              <div className="border p-4 rounded-lg bg-gray-50 font-mono text-sm leading-tight text-center">
                <div className="font-bold mb-2">HIM Finance System</div>
                <div>================================</div>
                <div>
                  Receipt #:{" "}
                  {"RC" + Math.floor(100000 + Math.random() * 900000)}
                </div>
                <div>Payer: {receipt.payerName || "---"}</div>
                <div>
                  Revenue:{" "}
                  {revenueHeads.find((r) => r.code === receipt.revenueHeadCode)
                    ?.name || "---"}
                </div>
                <div>
                  Amount: {receipt.currency}{" "}
                  {(parseFloat(receipt.amount) || 0).toFixed(2)}
                </div>
                <div>Payment: {receipt.paymentMethod}</div>
                <div>
                  Branch:{" "}
                  {branches.find((b) => b.code === receipt.branchCode)?.name ||
                    "---"}
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

type ModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  type: "info" | "error" | "success";
  onClose: () => void;
};

const Modal = ({ isOpen, title, message, type, onClose }: ModalProps) => {
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
