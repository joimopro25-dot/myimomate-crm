// components/client/ClientOverview.jsx
// Comprehensive client information display matching your Add New Client structure

import React from 'react';
import { 
  Edit, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Globe, 
  Heart, 
  CreditCard, 
  Briefcase, 
  Building, 
  Home, 
  Users,
  FileText,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const ClientOverview = ({ client, deals, onEditClient, onDeleteClient }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  // Check if a section has any data
  const hasPersonalInfo = client.personalInfo && Object.values(client.personalInfo).some(val => val);
  const hasProfessionalInfo = client.professionalInfo && Object.values(client.professionalInfo).some(val => val);
  const hasSpouseInfo = client.spouseInfo && Object.values(client.spouseInfo).some(val => val);
  const hasFinancialInfo = client.financialInfo && Object.values(client.financialInfo).some(val => val);
  const hasPropertyPreferences = client.propertyPreferences && Object.values(client.propertyPreferences).some(val => val);
  const hasEmergencyContact = client.emergencyContact && Object.values(client.emergencyContact).some(val => val);

  return (
    <div className="space-y-6">
      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{deals.length}</div>
          <div className="text-sm text-blue-600">Total Deals</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {deals.filter(d => d.status === 'completed').length}
          </div>
          <div className="text-sm text-green-600">Completed</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">
            {Object.keys(client.activeRoles || {}).length}
          </div>
          <div className="text-sm text-orange-600">Active Roles</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {client.healthScore || 75}%
          </div>
          <div className="text-sm text-purple-600">Health Score</div>
        </div>
      </div>

      {/* Basic Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Contact Information</h3>
            </div>
            <button
              onClick={() => onEditClient && onEditClient()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-gray-900 font-medium">{client.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{client.email || 'N/A'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{client.phone || 'N/A'}</p>
              </div>
            </div>
            {client.personalInfo?.alternativePhone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Phone</label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{client.personalInfo.alternativePhone}</p>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Since</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{formatDate(client.createdAt)}</p>
              </div>
            </div>
            {client.source && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <p className="text-gray-900 capitalize">{client.source}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal and Family Information */}
      {hasPersonalInfo && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Personal and Family Information</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {client.personalInfo?.birthDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{formatDate(client.personalInfo.birthDate)}</p>
                  </div>
                </div>
              )}
              {client.personalInfo?.nationality && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{client.personalInfo.nationality}</p>
                  </div>
                </div>
              )}
              {client.personalInfo?.placeOfBirth && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{client.personalInfo.placeOfBirth}</p>
                  </div>
                </div>
              )}
              {client.personalInfo?.maritalStatus && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <p className="text-gray-900 capitalize">{client.personalInfo.maritalStatus.replace('_', ' ')}</p>
                </div>
              )}
              {client.personalInfo?.propertyRegime && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Regime</label>
                  <p className="text-gray-900 capitalize">{client.personalInfo.propertyRegime.replace('_', ' ')}</p>
                </div>
              )}
            </div>

            {/* Current Address Section */}
            {client.personalInfo?.currentAddress && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="text-md font-semibold text-gray-900">Current Address</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                    <p className="text-gray-900">{client.personalInfo.currentAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <p className="text-gray-900">{client.personalInfo.postalCode || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <p className="text-gray-900">{client.personalInfo.city || 'N/A'}</p>
                  </div>
                  {client.personalInfo.district && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                      <p className="text-gray-900">{client.personalInfo.district}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents and Identification */}
            {(client.personalInfo?.nif || client.personalInfo?.idNumber || client.personalInfo?.drivingLicense) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <h4 className="text-md font-semibold text-gray-900">Documents and Identification</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {client.personalInfo.nif && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax Number (NIF)</label>
                      <p className="text-gray-900 font-mono">{client.personalInfo.nif}</p>
                    </div>
                  )}
                  {client.personalInfo.idNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID Card Number</label>
                      <p className="text-gray-900 font-mono">{client.personalInfo.idNumber}</p>
                    </div>
                  )}
                  {client.personalInfo.drivingLicense && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Driving License</label>
                      <p className="text-gray-900 font-mono">{client.personalInfo.drivingLicense}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Information */}
      {hasProfessionalInfo && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {client.professionalInfo?.profession && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <p className="text-gray-900">{client.professionalInfo.profession}</p>
                </div>
              )}
              {client.professionalInfo?.employer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{client.professionalInfo.employer}</p>
                  </div>
                </div>
              )}
              {client.professionalInfo?.monthlyIncome && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
                  <p className="text-gray-900 font-semibold text-green-600">
                    {formatCurrency(client.professionalInfo.monthlyIncome)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spouse Information */}
      {hasSpouseInfo && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Spouse Information</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {client.spouseInfo?.name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Name</label>
                  <p className="text-gray-900 font-medium">{client.spouseInfo.name}</p>
                </div>
              )}
              {client.spouseInfo?.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{client.spouseInfo.email}</p>
                  </div>
                </div>
              )}
              {client.spouseInfo?.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{client.spouseInfo.phone}</p>
                  </div>
                </div>
              )}
              {client.spouseInfo?.profession && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Profession</label>
                  <p className="text-gray-900">{client.spouseInfo.profession}</p>
                </div>
              )}
              {client.spouseInfo?.employer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Employer</label>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{client.spouseInfo.employer}</p>
                  </div>
                </div>
              )}
              {client.spouseInfo?.monthlyIncome && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Monthly Income</label>
                  <p className="text-gray-900 font-semibold text-green-600">
                    {formatCurrency(client.spouseInfo.monthlyIncome)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Financial Information */}
      {hasFinancialInfo && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage Pre-Approval</label>
                <div className="flex items-center gap-2">
                  {client.financialInfo?.mortgagePreApproval ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium">Approved</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-gray-600">Not Pre-Approved</span>
                    </>
                  )}
                </div>
              </div>
              {client.financialInfo?.preApprovalAmount && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pre-Approval Amount</label>
                  <p className="text-gray-900 font-semibold text-green-600">
                    {formatCurrency(client.financialInfo.preApprovalAmount)}
                  </p>
                </div>
              )}
              {client.financialInfo?.bankingInfo && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banking/Financial Information</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{client.financialInfo.bankingInfo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Property Preferences */}
      {hasPropertyPreferences && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Property Preferences</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {client.propertyPreferences?.propertyType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <p className="text-gray-900 capitalize">{client.propertyPreferences.propertyType.replace('_', ' ')}</p>
                </div>
              )}
              {client.propertyPreferences?.bedrooms && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Bedrooms</label>
                  <p className="text-gray-900">{client.propertyPreferences.bedrooms}</p>
                </div>
              )}
              {client.propertyPreferences?.bathrooms && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Bathrooms</label>
                  <p className="text-gray-900">{client.propertyPreferences.bathrooms}</p>
                </div>
              )}
            </div>

            {/* Desired Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Desired Features</h4>
              <div className="flex flex-wrap gap-2">
                {client.propertyPreferences?.parking && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Parking
                  </span>
                )}
                {client.propertyPreferences?.elevator && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Elevator
                  </span>
                )}
                {client.propertyPreferences?.balcony && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Balcony
                  </span>
                )}
                {client.propertyPreferences?.garden && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Garden
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      {hasEmergencyContact && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {client.emergencyContact?.name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <p className="text-gray-900 font-medium">{client.emergencyContact.name}</p>
                </div>
              )}
              {client.emergencyContact?.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{client.emergencyContact.phone}</p>
                  </div>
                </div>
              )}
              {client.emergencyContact?.relation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <p className="text-gray-900 capitalize">{client.emergencyContact.relation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {client.notes && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Additional Notes and Observations</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{client.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 shadow-sm">
        <div className="p-6 border-b border-red-200">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Danger Zone</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm mb-4">
              Deleting this client will permanently remove all associated data including deals, communications, and history. This action cannot be undone.
            </p>
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${client.name}? This action cannot be undone.`)) {
                  onDeleteClient(client.id);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;