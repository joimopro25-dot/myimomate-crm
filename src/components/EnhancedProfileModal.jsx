// components/EnhancedProfileModal.jsx
const handleEditSubmit = (updatedData) => {
    onUpdateClient(client.id, updatedData);
    setShowEditForm(false);
    onClose();
  };

  const handleDelete = () => {
    if (onDeleteClient) {
      onDeleteClient(client.id);
      onClose();
    }
  };// components/EnhancedProfileModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Users, 
  Heart, 
  Home, 
  FileText, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  Edit,
  Building,
  CreditCard,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import ExpandedClientForm from './ExpandedClientForm';

const EnhancedProfileModal = ({ client, isOpen, onClose, onUpdateClient, onDeleteClient }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !client) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date);
    } else if (date.toDate && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    } else {
      return 'N/A';
    }
    
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  };

  const getMaritalStatusLabel = (status) => {
    const statusMap = {
      'single': 'Single',
      'married': 'Married',
      'divorced': 'Divorced',
      'widowed': 'Widowed',
      'civil_union': 'Civil Union',
      'separated': 'Separated'
    };
    return statusMap[status] || status;
  };

  const getPropertyRegimeLabel = (regime) => {
    const regimeMap = {
      'community_property': 'Community Property',
      'separate_property': 'Separate Property',
      'community_acquired': 'Community of Acquired Property'
    };
    return regimeMap[regime] || regime;
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    if (isNaN(birth.getTime())) return null;
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDelete = () => {
    if (onDeleteClient) {
      onDeleteClient(client.id);
      onClose();
    }
  };

  // Convert client data to form format for editing
  const convertClientToFormData = () => {
    return {
      // Basic fields
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      type: client.type || 'buyer',
      source: client.source || 'website',
      budget: client.budget || '',
      location: client.location || '',
      notes: client.notes || '',
      urgency: client.urgency || 'medium',
      
      // Personal info
      birthDate: client.personalInfo?.birthDate || '',
      nationality: client.personalInfo?.nationality || '',
      placeOfBirth: client.personalInfo?.placeOfBirth || '',
      currentAddress: client.personalInfo?.currentAddress || '',
      postalCode: client.personalInfo?.postalCode || '',
      city: client.personalInfo?.city || '',
      district: client.personalInfo?.district || '',
      maritalStatus: client.personalInfo?.maritalStatus || 'single',
      propertyRegime: client.personalInfo?.propertyRegime || '',
      nif: client.personalInfo?.nif || '',
      idNumber: client.personalInfo?.idNumber || '',
      drivingLicense: client.personalInfo?.drivingLicense || '',
      alternativePhone: client.personalInfo?.alternativePhone || '',
      
      // Spouse info
      spouseName: client.spouseInfo?.name || '',
      spouseEmail: client.spouseInfo?.email || '',
      spousePhone: client.spouseInfo?.phone || '',
      spouseBirthDate: client.spouseInfo?.birthDate || '',
      spouseNationality: client.spouseInfo?.nationality || '',
      spousePlaceOfBirth: client.spouseInfo?.placeOfBirth || '',
      spouseProfession: client.spouseInfo?.profession || '',
      spouseEmployer: client.spouseInfo?.employer || '',
      spouseMonthlyIncome: client.spouseInfo?.monthlyIncome || '',
      
      // Professional info
      profession: client.professionalInfo?.profession || '',
      employer: client.professionalInfo?.employer || '',
      monthlyIncome: client.professionalInfo?.monthlyIncome || '',
      
      // Financial info
      bankingInfo: client.financialInfo?.bankingInfo || '',
      mortgagePreApproval: client.financialInfo?.mortgagePreApproval || false,
      preApprovalAmount: client.financialInfo?.preApprovalAmount || '',
      
      // Property preferences
      propertyType: client.propertyPreferences?.propertyType || '',
      bedrooms: client.propertyPreferences?.bedrooms || '',
      bathrooms: client.propertyPreferences?.bathrooms || '',
      parking: client.propertyPreferences?.parking || false,
      elevator: client.propertyPreferences?.elevator || false,
      balcony: client.propertyPreferences?.balcony || false,
      garden: client.propertyPreferences?.garden || false,
      
      // Emergency contact
      emergencyContactName: client.emergencyContact?.name || '',
      emergencyContactPhone: client.emergencyContact?.phone || '',
      emergencyContactRelation: client.emergencyContact?.relation || ''
    };
  };

  if (showEditForm) {
    return (
      <ExpandedClientForm
        isOpen={true}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleEditSubmit}
        formType="client"
        setFormType={() => {}} // Not needed for edit
        initialData={convertClientToFormData()}
        isEditMode={true}
        title={`Edit ${client.name}`}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {client.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{client.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.type === 'buyer' ? 'bg-blue-100 text-blue-800' :
                  client.type === 'seller' ? 'bg-green-100 text-green-800' :
                  client.type === 'landlord' ? 'bg-purple-100 text-purple-800' :
                  client.type === 'tenant' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {client.type === 'buyer' ? 'Buyer' :
                   client.type === 'seller' ? 'Seller' :
                   client.type === 'landlord' ? 'Landlord' :
                   client.type === 'tenant' ? 'Tenant' :
                   client.type === 'investor' ? 'Investor' : client.type}
                </span>
                {client.isExpanded && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Complete Profile
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          
          {/* Basic Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-600">{client.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Primary Phone:</span>
                <p className="text-gray-600">{client.phone}</p>
              </div>
              {client.personalInfo?.alternativePhone && (
                <div>
                  <span className="font-medium text-gray-700">Alternative Phone:</span>
                  <p className="text-gray-600">{client.personalInfo.alternativePhone}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Client Since:</span>
                <p className="text-gray-600">{formatDate(client.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          {client.personalInfo && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {client.personalInfo.birthDate && (
                  <div>
                    <span className="font-medium text-gray-700">Birth Date:</span>
                    <p className="text-gray-600">
                      {formatDate(client.personalInfo.birthDate)}
                      {calculateAge(client.personalInfo.birthDate) && (
                        <span className="text-gray-500 ml-1">
                          (Age: {calculateAge(client.personalInfo.birthDate)})
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {client.personalInfo.nationality && (
                  <div>
                    <span className="font-medium text-gray-700">Nationality:</span>
                    <p className="text-gray-600">{client.personalInfo.nationality}</p>
                  </div>
                )}
                {client.personalInfo.placeOfBirth && (
                  <div>
                    <span className="font-medium text-gray-700">Place of Birth:</span>
                    <p className="text-gray-600">{client.personalInfo.placeOfBirth}</p>
                  </div>
                )}
                {client.personalInfo.maritalStatus && (
                  <div>
                    <span className="font-medium text-gray-700">Marital Status:</span>
                    <p className="text-gray-600">{getMaritalStatusLabel(client.personalInfo.maritalStatus)}</p>
                  </div>
                )}
                {client.personalInfo.propertyRegime && (
                  <div>
                    <span className="font-medium text-gray-700">Property Regime:</span>
                    <p className="text-gray-600">{getPropertyRegimeLabel(client.personalInfo.propertyRegime)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Address Information */}
          {client.personalInfo?.currentAddress && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Home className="w-5 h-5 mr-2 text-purple-600" />
                Address
              </h4>
              <div className="text-sm">
                <p className="text-gray-600">
                  {client.personalInfo.currentAddress}
                  {client.personalInfo.postalCode && <br />}
                  {client.personalInfo.postalCode && `${client.personalInfo.postalCode}`}
                  {client.personalInfo.city && ` ${client.personalInfo.city}`}
                  {client.personalInfo.district && `, ${client.personalInfo.district}`}
                </p>
              </div>
            </div>
          )}

          {/* Documents */}
          {(client.personalInfo?.nif || client.personalInfo?.idNumber || client.personalInfo?.drivingLicense) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                Documents & Identification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {client.personalInfo.nif && (
                  <div>
                    <span className="font-medium text-gray-700">Tax Number (NIF):</span>
                    <p className="text-gray-600">{client.personalInfo.nif}</p>
                  </div>
                )}
                {client.personalInfo.idNumber && (
                  <div>
                    <span className="font-medium text-gray-700">ID Card Number:</span>
                    <p className="text-gray-600">{client.personalInfo.idNumber}</p>
                  </div>
                )}
                {client.personalInfo.drivingLicense && (
                  <div>
                    <span className="font-medium text-gray-700">Driving License:</span>
                    <p className="text-gray-600">{client.personalInfo.drivingLicense}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Spouse Information */}
          {client.spouseInfo?.name && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-pink-600" />
                Spouse/Partner Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-600">{client.spouseInfo.name}</p>
                </div>
                {client.spouseInfo.email && (
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{client.spouseInfo.email}</p>
                  </div>
                )}
                {client.spouseInfo.phone && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-600">{client.spouseInfo.phone}</p>
                  </div>
                )}
                {client.spouseInfo.birthDate && (
                  <div>
                    <span className="font-medium text-gray-700">Birth Date:</span>
                    <p className="text-gray-600">{formatDate(client.spouseInfo.birthDate)}</p>
                  </div>
                )}
                {client.spouseInfo.profession && (
                  <div>
                    <span className="font-medium text-gray-700">Profession:</span>
                    <p className="text-gray-600">{client.spouseInfo.profession}</p>
                  </div>
                )}
                {client.spouseInfo.employer && (
                  <div>
                    <span className="font-medium text-gray-700">Employer:</span>
                    <p className="text-gray-600">{client.spouseInfo.employer}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional Information */}
          {client.professionalInfo?.profession && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Building className="w-5 h-5 mr-2 text-indigo-600" />
                Professional Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Profession:</span>
                  <p className="text-gray-600">{client.professionalInfo.profession}</p>
                </div>
                {client.professionalInfo.employer && (
                  <div>
                    <span className="font-medium text-gray-700">Employer:</span>
                    <p className="text-gray-600">{client.professionalInfo.employer}</p>
                  </div>
                )}
                {client.professionalInfo.monthlyIncome && (
                  <div>
                    <span className="font-medium text-gray-700">Monthly Income:</span>
                    <p className="text-gray-600">€{client.professionalInfo.monthlyIncome}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CRM Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              CRM Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {client.budget && (
                <div>
                  <span className="font-medium text-gray-700">Budget:</span>
                  <p className="text-gray-600">{client.budget}</p>
                </div>
              )}
              {client.location && (
                <div>
                  <span className="font-medium text-gray-700">Preferred Location:</span>
                  <p className="text-gray-600">{client.location}</p>
                </div>
              )}
              {client.source && (
                <div>
                  <span className="font-medium text-gray-700">Source:</span>
                  <p className="text-gray-600 capitalize">{client.source}</p>
                </div>
              )}
              {client.urgency && (
                <div>
                  <span className="font-medium text-gray-700">Urgency:</span>
                  <p className="text-gray-600 capitalize">{client.urgency}</p>
                </div>
              )}
            </div>
          </div>

          {/* Property Preferences */}
          {client.propertyPreferences && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Home className="w-5 h-5 mr-2 text-green-600" />
                Property Preferences
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {client.propertyPreferences.propertyType && (
                  <div>
                    <span className="font-medium text-gray-700">Property Type:</span>
                    <p className="text-gray-600 capitalize">{client.propertyPreferences.propertyType}</p>
                  </div>
                )}
                {client.propertyPreferences.bedrooms && (
                  <div>
                    <span className="font-medium text-gray-700">Bedrooms:</span>
                    <p className="text-gray-600">T{client.propertyPreferences.bedrooms}</p>
                  </div>
                )}
                {client.propertyPreferences.bathrooms && (
                  <div>
                    <span className="font-medium text-gray-700">Bathrooms:</span>
                    <p className="text-gray-600">{client.propertyPreferences.bathrooms}</p>
                  </div>
                )}
                {(client.propertyPreferences.parking || client.propertyPreferences.elevator || 
                  client.propertyPreferences.balcony || client.propertyPreferences.garden) && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Desired Features:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {client.propertyPreferences.parking && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Parking</span>}
                      {client.propertyPreferences.elevator && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Elevator</span>}
                      {client.propertyPreferences.balcony && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Balcony</span>}
                      {client.propertyPreferences.garden && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Garden</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Financial Information */}
          {client.financialInfo && (client.financialInfo.bankingInfo || client.financialInfo.mortgagePreApproval) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
                Financial Information
              </h4>
              <div className="space-y-3 text-sm">
                {client.financialInfo.mortgagePreApproval && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      ✓ Mortgage Pre-approved
                    </span>
                    {client.financialInfo.preApprovalAmount && (
                      <span className="text-gray-600">
                        Amount: €{client.financialInfo.preApprovalAmount}
                      </span>
                    )}
                  </div>
                )}
                {client.financialInfo.bankingInfo && (
                  <div>
                    <span className="font-medium text-gray-700">Banking Information:</span>
                    <p className="text-gray-600 mt-1">{client.financialInfo.bankingInfo}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {client.emergencyContact?.name && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-600">{client.emergencyContact.name}</p>
                </div>
                {client.emergencyContact.phone && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-600">{client.emergencyContact.phone}</p>
                  </div>
                )}
                {client.emergencyContact.relation && (
                  <div>
                    <span className="font-medium text-gray-700">Relationship:</span>
                    <p className="text-gray-600 capitalize">{client.emergencyContact.relation}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {client.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                Notes
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Client</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{client.name}</strong>? 
              This action cannot be undone and will permanently remove all client data, 
              including deals, communications, and history.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProfileModal;