import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Building, Users, Shield, ArrowRight } from "lucide-react";

// Account Creation Wizard Component
const AccountCreationWizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    accountType: "",
    organizationName: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    branchCode: "",
    branchName: ""
  });

  const accountTypes = [
    {
      id: "single",
      title: "Single Branch",
      description: "Perfect for small businesses with one location",
      icon: Building,
      features: ["One branch management", "Basic reporting", "Up to 10 users"]
    },
    {
      id: "multi",
      title: "Multi-Branch",
      description: "Ideal for organizations with multiple locations",
      icon: Users,
      features: ["Multiple branches", "Advanced reporting", "Role-based access", "Unlimited users"]
    },
    {
      id: "enterprise",
      title: "Enterprise",
      description: "For large organizations with complex needs",
      icon: Shield,
      features: ["Custom branches", "Advanced analytics", "API access", "Dedicated support"]
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.accountType) {
      alert("Please select an account type");
      return;
    }
    if (currentStep === 2 && (!formData.organizationName || !formData.adminName || !formData.adminEmail)) {
      alert("Please fill in all required fields");
      return;
    }
    if (currentStep === 3 && (!formData.branchCode || !formData.branchName)) {
      alert("Please fill in branch details");
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log("Account creation data:", formData);
    onComplete();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Account Type</h2>
        <p className="text-gray-600 mt-2">Select the plan that best fits your organization's needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accountTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <div
              key={type.id}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                formData.accountType === type.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
              onClick={() => handleInputChange("accountType", type.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <IconComponent className={`w-8 h-8 ${
                  formData.accountType === type.id ? "text-blue-600" : "text-gray-600"
                }`} />
                {formData.accountType === type.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{type.description}</p>
              <ul className="space-y-2">
                {type.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Organization Details</h2>
        <p className="text-gray-600 mt-2">Tell us about your organization</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Name *
          </label>
          <input
            type="text"
            value={formData.organizationName}
            onChange={(e) => handleInputChange("organizationName", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter your organization name"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Name *
            </label>
            <input
              type="text"
              value={formData.adminName}
              onChange={(e) => handleInputChange("adminName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email *
            </label>
            <input
              type="email"
              value={formData.adminEmail}
              onChange={(e) => handleInputChange("adminEmail", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="email@organization.com"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Password *
          </label>
          <input
            type="password"
            value={formData.adminPassword}
            onChange={(e) => handleInputChange("adminPassword", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Create a secure password"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Setup Your First Branch</h2>
        <p className="text-gray-600 mt-2">Configure your main branch details</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch Code *
            </label>
            <input
              type="text"
              value={formData.branchCode}
              onChange={(e) => handleInputChange("branchCode", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="e.g., 01"
            />
            <p className="text-xs text-gray-500 mt-1">Unique identifier for your branch</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch Name *
            </label>
            <input
              type="text"
              value={formData.branchName}
              onChange={(e) => handleInputChange("branchName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="e.g., Main Branch"
            />
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Quick Tip</h4>
          <p className="text-blue-800 text-sm">
            You can add more branches later in the System Settings after your account is created.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <UserPlus className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900">Ready to Create Your Account!</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Review your information below. You'll be able to access the System Settings to configure additional branches and settings after creation.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto text-left">
        <h4 className="font-semibold text-gray-900 mb-4">Account Summary</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Account Type:</span>
            <span className="font-medium">{accountTypes.find(t => t.id === formData.accountType)?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Organization:</span>
            <span className="font-medium">{formData.organizationName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Admin:</span>
            <span className="font-medium">{formData.adminName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Branch:</span>
            <span className="font-medium">{formData.branchName} ({formData.branchCode})</span>
          </div>
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: "Account Type" },
    { number: 2, title: "Organization" },
    { number: 3, title: "Branch Setup" },
    { number: 4, title: "Review" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl">
        {/* Progress Header */}
        <div className="border-b border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                <p className="text-gray-600">Setup your organization in minutes</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Step {currentStep} of 4</div>
              <div className="text-lg font-semibold text-gray-900">
                {steps[currentStep - 1]?.title}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      currentStep >= step.number
                        ? "text-blue-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.number ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        <div className="p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="border-t border-gray-200 p-8">
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Back
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 flex items-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-200 flex items-center gap-2"
              >
                Create Account <UserPlus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component that handles the flow
const AppWithAccountCreation = () => {
  const [accountCreated, setAccountCreated] = useState(false);
  const navigate = useNavigate();

  const handleAccountCreationComplete = () => {
    setAccountCreated(true);
    // In a real app, you might want to set user authentication state here
    // and redirect to the dashboard or system settings
    setTimeout(() => {
      navigate("/system-settings"); // Or wherever your SystemSettingsPage is located
    }, 2000);
  };

  if (accountCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your organization account has been created. You're being redirected to the System Settings...
          </p>
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return <AccountCreationWizard onComplete={handleAccountCreationComplete} />;
};

export default AppWithAccountCreation;