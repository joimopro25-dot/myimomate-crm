// components/EnhancedClientForm.jsx
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Heart, 
  Home,
  FileText,
  UserPlus,
  Save
} from 'lucide-react';

const EnhancedClientForm = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Information
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    type: initialData.type || 'buyer',
    
    // Portuguese Legal Information
    nif: initialData.nif || '',
    cartaoCidadao: initialData.cartaoCidadao || '',
    birthday: initialData.birthday || '',
    placeOfBirth: initialData.placeOfBirth || '',
    nationality: initialData.nationality || 'Portuguese',
    
    // Civil Status
    maritalStatus: initialData.maritalStatus || 'single',
    
    // Address Information
    address: {
      street: initialData.address?.street || '',
      number: initialData.address?.number || '',
      floor: initialData.address?.floor || '',
      postalCode: initialData.address?.postalCode || '',
      city: initialData.address?.city || '',
      district: initialData.address?.district || '',
      country: initialData.address?.country || 'Portugal'
    },
    
    // Spouse Information (if married)
    spouse: {
      name: initialData.spouse?.name || '',
      nif: initialData.spouse?.nif || '',
      cartaoCidadao: initialData.spouse?.cartaoCidadao || '',
      birthday: initialData.spouse?.birthday || '',
      placeOfBirth: initialData.spouse?.placeOfBirth || '',
      propertyRegime: initialData.spouse?.propertyRegime || 'community_of_property'
    },
    
    // Additional Information
    notes: initialData.notes || '',
    budget: initialData.budget || '',
    preferredLocation: initialData.preferredLocation || ''
  });

  const [errors, setErrors] = useState({});

  // Options
  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'civil_union', label: 'Civil Union' },
    { value: 'separated', label: 'Separated' }
  ];

  const propertyRegimeOptions = [
    { value: 'community_of_property', label: 'Community of Property' },
    { value: 'community_of_acquired', label: 'Community of Acquired Property' },
    { value: 'separation_of_property', label: 'Separation of Property' }
  ];

  const districtOptions = [
    'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra',
    'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre',
    'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu',
    'Azores', 'Madeira'
  ];

  const clientTypeOptions = [
    { value: 'buyer', label: 'Buyer' },
    { value: 'seller', label: 'Seller' },
    { value: 'landlord', label: 'Landlord' },
    { value: 'tenant', label: 'Tenant' },
    { value: 'investor', label: 'Investor' }
  ];

  // Validation functions
  const validateNIF = (nif) => {
    if (!nif) return true;
    const nifRegex = /^[0-9]{9}$/;
    return nifRegex.test(nif);
  };

  const validateCartaoCidadao = (cc) => {
    if (!cc) return true;
    const ccRegex = /^[0-9]{8}[0-9A-Z]{1}[A-Z]{2}[0-9]{1}$/;
    return ccRegex.test(cc);
  };

  const validatePostalCode = (code) => {
    if (!code) return true;
    const postalRegex = /^[0-9]{4}-[0-9]{3}$/;
    return postalRegex.test(code);
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.nif && !validateNIF(formData.nif)) {
      newErrors.nif = 'NIF must have 9 digits';
    }

    if (formData.cartaoCidadao && !validateCartaoCidadao(formData.cartaoCidadao)) {
      newErrors.cartaoCidadao = 'Invalid Portuguese ID Card format';
    }

    if (formData.address.postalCode && !validatePostalCode(formData.address.postalCode)) {
      newErrors.postalCode = 'Postal code must have format XXXX-XXX';
    }

    if (['married', 'civil_union'].includes(formData.maritalStatus)) {
      if (!formData.spouse.name.trim()) {
        newErrors.spouseName = 'Spouse name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const cleanedData = { ...formData };
      if (!['married', 'civil_union'].includes(formData.maritalStatus)) {
        cleanedData.spouse = {
          name: '',
          nif: '',
          cartaoCidadao: '',
          birthday: '',
          placeOfBirth: '',
          propertyRegime: 'community_of_property'
        };
      }
      
      onSave(cleanedData);
      onClose();
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'legal', label: 'Legal Info', icon: FileText },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'spouse', label: 'Spouse', icon: Heart, 
      disabled: !['married', 'civil_union'].includes(formData.maritalStatus) }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData.name ? 'Edit Client' : 'New Client'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : tab.disabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="João Silva Santos"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange(null, 'email', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="joao@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+351 912 345 678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange(null, 'type', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {clientTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange(null, 'birthday', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Place of Birth
                    </label>
                    <input
                      type="text"
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange(null, 'placeOfBirth', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Lisboa, Portugal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange(null, 'nationality', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Portuguese"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marital Status
                    </label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => handleInputChange(null, 'maritalStatus', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {maritalStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Legal Information Tab */}
            {activeTab === 'legal' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-sm font-medium text-blue-900">
                      Portuguese Legal Information
                    </h3>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    Required for real estate transactions in Portugal
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIF (Tax Identification Number)
                    </label>
                    <input
                      type="text"
                      value={formData.nif}
                      onChange={(e) => handleInputChange(null, 'nif', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.nif ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123456789"
                      maxLength="9"
                    />
                    {errors.nif && <p className="text-red-500 text-sm mt-1">{errors.nif}</p>}
                    <p className="text-gray-500 text-xs mt-1">9 digits required</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portuguese ID Card (Cartão de Cidadão)
                    </label>
                    <input
                      type="text"
                      value={formData.cartaoCidadao}
                      onChange={(e) => handleInputChange(null, 'cartaoCidadao', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.cartaoCidadao ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="12345678 9 ZZ4"
                      maxLength="12"
                    />
                    {errors.cartaoCidadao && <p className="text-red-500 text-sm mt-1">{errors.cartaoCidadao}</p>}
                    <p className="text-gray-500 text-xs mt-1">Format: 12345678 9 ZZ4</p>
                  </div>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street/Avenue
                    </label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Rua das Flores"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number
                    </label>
                    <input
                      type="text"
                      value={formData.address.number}
                      onChange={(e) => handleInputChange('address', 'number', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor/Apartment
                    </label>
                    <input
                      type="text"
                      value={formData.address.floor}
                      onChange={(e) => handleInputChange('address', 'floor', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="2º Dto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.address.postalCode}
                      onChange={(e) => handleInputChange('address', 'postalCode', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1000-001"
                    />
                    {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Lisboa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <select
                      value={formData.address.district}
                      onChange={(e) => handleInputChange('address', 'district', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select district</option>
                      {districtOptions.map(district => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.address.country}
                      onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Portugal"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Spouse Tab */}
            {activeTab === 'spouse' && ['married', 'civil_union'].includes(formData.maritalStatus) && (
              <div className="space-y-6">
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-pink-600 mr-2" />
                    <h3 className="text-sm font-medium text-pink-900">
                      Spouse Information
                    </h3>
                  </div>
                  <p className="text-pink-700 text-sm mt-1">
                    Required for real estate transactions when married
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.spouse.name}
                      onChange={(e) => handleInputChange('spouse', 'name', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.spouseName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Maria Silva Santos"
                    />
                    {errors.spouseName && <p className="text-red-500 text-sm mt-1">{errors.spouseName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse NIF
                    </label>
                    <input
                      type="text"
                      value={formData.spouse.nif}
                      onChange={(e) => handleInputChange('spouse', 'nif', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="987654321"
                      maxLength="9"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse ID Card
                    </label>
                    <input
                      type="text"
                      value={formData.spouse.cartaoCidadao}
                      onChange={(e) => handleInputChange('spouse', 'cartaoCidadao', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="87654321 8 YY3"
                      maxLength="12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.spouse.birthday}
                      onChange={(e) => handleInputChange('spouse', 'birthday', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse Place of Birth
                    </label>
                    <input
                      type="text"
                      value={formData.spouse.placeOfBirth}
                      onChange={(e) => handleInputChange('spouse', 'placeOfBirth', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Porto, Portugal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Regime
                    </label>
                    <select
                      value={formData.spouse.propertyRegime}
                      onChange={(e) => handleInputChange('spouse', 'propertyRegime', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {propertyRegimeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-gray-500 text-xs mt-1">Legal marriage property regime</p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Additional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => handleInputChange(null, 'budget', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="€300,000 - €500,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    value={formData.preferredLocation}
                    onChange={(e) => handleInputChange(null, 'preferredLocation', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Lisboa, Porto, Aveiro..."
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange(null, 'notes', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Additional information about the client..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {initialData.name ? 'Update Client' : 'Create Client'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedClientForm;