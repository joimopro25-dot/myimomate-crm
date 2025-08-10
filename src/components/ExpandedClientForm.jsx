// components/ExpandedClientForm.jsx
import React, { useState } from 'react';
import { X, User, Users, Heart, Home, FileText, Calendar, MapPin, Phone, Mail, BarChart3 } from 'lucide-react';

const ExpandedClientForm = ({ isOpen, onClose, onSubmit, formType, setFormType, initialData = null, isEditMode = false, title = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic CRM fields
    name: '',
    email: '',
    phone: '',
    alternativePhone: '',
    type: 'buyer',
    source: 'website',
    budget: '',
    location: '',
    urgency: 'medium',
    notes: '',
    
    // Personal information
    birthDate: '',
    nationality: '',
    placeOfBirth: '',
    currentAddress: '',
    postalCode: '',
    city: '',
    district: '',
    
    // Civil status
    maritalStatus: 'single',
    
    // Spouse data (if married)
    spouseName: '',
    spouseEmail: '',
    spousePhone: '',
    spouseBirthDate: '',
    spouseNationality: '',
    spousePlaceOfBirth: '',
    
    // Property regime
    propertyRegime: '',
    
    // Professional data
    profession: '',
    employer: '',
    monthlyIncome: '',
    spouseProfession: '',
    spouseEmployer: '',
    spouseMonthlyIncome: '',
    
    // Property preferences
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    parking: false,
    elevator: false,
    balcony: false,
    garden: false,
    
    // Documents and financial info
    nif: '',
    idNumber: '',
    drivingLicense: '',
    bankingInfo: '',
    mortgagePreApproval: false,
    preApprovalAmount: '',
    
    // Emergency contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });

  // Initialize form data with existing client data if in edit mode
  React.useEffect(() => {
    if (isEditMode && initialData) {
      setFormData(initialData);
    }
  }, [isEditMode, initialData]);

  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'civil_union', label: 'Civil Union' },
    { value: 'separated', label: 'Separated' }
  ];

  const propertyRegimeOptions = [
    { value: 'community_property', label: 'Community Property' },
    { value: 'separate_property', label: 'Separate Property' },
    { value: 'community_acquired', label: 'Community of Acquired Property' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {title || (isEditMode ? 'Edit Client' : 'Add New Client')}
            </h3>
            {!isEditMode && (
              <div className="flex gap-2">
                <button
                  onClick={() => setFormType('client')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    formType === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Client
                </button>
                <button
                  onClick={() => setFormType('lead')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    formType === 'lead' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Lead
                </button>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="ml-2 text-sm font-medium text-gray-700">
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Personal Data'}
                  {step === 3 && 'CRM Info'}
                  {step === 4 && 'Preferences'}
                </div>
                {step < 4 && <div className="w-12 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Basic Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="text-lg font-semibold">Basic Contact Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Client full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+351 912 345 678"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alternative Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.alternativePhone}
                      onChange={(e) => handleInputChange('alternativePhone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+351 912 345 679"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal and Family Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="text-lg font-semibold">Personal and Family Information</h4>
                </div>

                {/* Basic Personal Data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Portuguese"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Place of Birth
                    </label>
                    <input
                      type="text"
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="City of birth"
                    />
                  </div>
                </div>

                {/* Current Address */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Current Address
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Address
                      </label>
                      <input
                        type="text"
                        value={formData.currentAddress}
                        onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Street, number, floor, door"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="4000-000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Porto"
                      />
                    </div>
                  </div>
                </div>

                {/* Marital Status */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Marital Status
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marital Status
                      </label>
                      <select
                        value={formData.maritalStatus}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {maritalStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(formData.maritalStatus === 'married' || formData.maritalStatus === 'civil_union') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Property Regime
                        </label>
                        <select
                          value={formData.propertyRegime}
                          onChange={(e) => handleInputChange('propertyRegime', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          {propertyRegimeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Spouse Data */}
                  {(formData.maritalStatus === 'married' || formData.maritalStatus === 'civil_union') && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h6 className="font-medium text-gray-800 mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Spouse/Partner Information
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formData.spouseName}
                            onChange={(e) => handleInputChange('spouseName', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Spouse name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Birth Date
                          </label>
                          <input
                            type="date"
                            value={formData.spouseBirthDate}
                            onChange={(e) => handleInputChange('spouseBirthDate', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.spouseEmail}
                            onChange={(e) => handleInputChange('spouseEmail', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="email@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.spousePhone}
                            onChange={(e) => handleInputChange('spousePhone', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="+351 912 345 678"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Documents */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Documents and Identification</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Number (NIF)
                      </label>
                      <input
                        type="text"
                        value={formData.nif}
                        onChange={(e) => handleInputChange('nif', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="123456789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Card Number
                      </label>
                      <input
                        type="text"
                        value={formData.idNumber}
                        onChange={(e) => handleInputChange('idNumber', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="12345678 9 ZX1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driving License
                      </label>
                      <input
                        type="text"
                        value={formData.drivingLicense}
                        onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="License number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: CRM and Business Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="text-lg font-semibold">CRM and Business Information</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="landlord">Landlord</option>
                      <option value="tenant">Tenant</option>
                      <option value="investor">Investor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) => handleInputChange('source', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="social">Social Media</option>
                      <option value="advertising">Advertising</option>
                      <option value="walk_in">Walk-in</option>
                      <option value="phone">Phone Call</option>
                      <option value="email">Email</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget
                    </label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="€250,000 - €350,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Porto, Vila Nova de Gaia..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Urgency
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low (6+ months)</option>
                      <option value="medium">Medium (3-6 months)</option>
                      <option value="high">High (1-3 months)</option>
                      <option value="urgent">Urgent (&lt; 1 month)</option>
                    </select>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Professional Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profession
                      </label>
                      <input
                        type="text"
                        value={formData.profession}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Engineer, Teacher..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employer
                      </label>
                      <input
                        type="text"
                        value={formData.employer}
                        onChange={(e) => handleInputChange('employer', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Income (approx)
                      </label>
                      <input
                        type="text"
                        value={formData.monthlyIncome}
                        onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="€2,000"
                      />
                    </div>
                  </div>

                  {/* Spouse Professional Information */}
                  {(formData.maritalStatus === 'married' || formData.maritalStatus === 'civil_union') && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h6 className="font-medium text-gray-800 mb-3">Spouse Professional Information</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profession
                          </label>
                          <input
                            type="text"
                            value={formData.spouseProfession}
                            onChange={(e) => handleInputChange('spouseProfession', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Employer
                          </label>
                          <input
                            type="text"
                            value={formData.spouseEmployer}
                            onChange={(e) => handleInputChange('spouseEmployer', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monthly Income
                          </label>
                          <input
                            type="text"
                            value={formData.spouseMonthlyIncome}
                            onChange={(e) => handleInputChange('spouseMonthlyIncome', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial Information */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Financial Information</h5>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mortgagePreApproval"
                        checked={formData.mortgagePreApproval}
                        onChange={(e) => handleInputChange('mortgagePreApproval', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="mortgagePreApproval" className="ml-2 text-sm text-gray-700">
                        Has mortgage pre-approval
                      </label>
                    </div>

                    {formData.mortgagePreApproval && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pre-approved Amount
                        </label>
                        <input
                          type="text"
                          value={formData.preApprovalAmount}
                          onChange={(e) => handleInputChange('preApprovalAmount', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="€300,000"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banking/Financial Information
                      </label>
                      <textarea
                        value={formData.bankingInfo}
                        onChange={(e) => handleInputChange('bankingInfo', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Main bank, financial situation, other credits..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preferences and Contacts */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Home className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="text-lg font-semibold">Preferences and Contacts</h4>
                </div>

                {/* Property Preferences */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Property Preferences</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => handleInputChange('propertyType', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="duplex">Duplex</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="land">Land</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Bedrooms
                      </label>
                      <select
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Any</option>
                        <option value="0">T0</option>
                        <option value="1">T1</option>
                        <option value="2">T2</option>
                        <option value="3">T3</option>
                        <option value="4">T4</option>
                        <option value="5+">T5+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Bathrooms
                      </label>
                      <select
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Any</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4+">4+</option>
                      </select>
                    </div>
                  </div>

                  {/* Desired Features */}
                  <div className="mt-4">
                    <h6 className="font-medium text-gray-800 mb-3">Desired Features</h6>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.parking}
                          onChange={(e) => handleInputChange('parking', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Parking</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.elevator}
                          onChange={(e) => handleInputChange('elevator', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Elevator</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.balcony}
                          onChange={(e) => handleInputChange('balcony', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Balcony</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.garden}
                          onChange={(e) => handleInputChange('garden', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Garden</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Contact
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Contact name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="+351 912 345 678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </label>
                      <select
                        value={formData.emergencyContactRelation}
                        onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        <option value="spouse">Spouse</option>
                        <option value="father">Father</option>
                        <option value="mother">Mother</option>
                        <option value="child">Child</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes and Observations
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Relevant information, special observations, restrictions, specific preferences..."
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer with Navigation */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            Step {currentStep} of 4
          </div>
          
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Create Client
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedClientForm;