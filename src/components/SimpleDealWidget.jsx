// SimpleDealWidget.jsx - A minimal widget for each role
import React, { useState } from 'react';
import { Plus, Target, Euro, MapPin, Calendar, X } from 'lucide-react';

const SimpleDealWidget = ({ client, roleType, onSaveDeal, existingDeals = [] }) => {
  const [showForm, setShowForm] = useState(false);
  const [dealData, setDealData] = useState({
    title: '',
    value: '',
    location: '',
    notes: '',
    expectedCloseDate: ''
  });

  const roleDeals = existingDeals.filter(deal => 
    deal.clientId === client.id && deal.roleType === roleType
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newDeal = {
      ...dealData,
      clientId: client.id,
      roleType: roleType,
      status: 'active',
      stage: 'initial',
      createdAt: new Date().toISOString()
    };

    onSaveDeal(client.id, roleType, newDeal);
    
    // Reset form
    setDealData({
      title: '',
      value: '',
      location: '',
      notes: '',
      expectedCloseDate: ''
    });
    setShowForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            {roleType.charAt(0).toUpperCase() + roleType.slice(1)} Deals
          </span>
          {roleDeals.length > 0 && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {roleDeals.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-green-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Existing Deals List */}
      {roleDeals.length > 0 && (
        <div className="space-y-2 mb-3">
          {roleDeals.slice(0, 2).map(deal => ( // Show only first 2 deals
            <div key={deal.id} className="bg-gray-50 rounded p-2 text-xs">
              <div className="font-medium text-gray-800 truncate">
                {deal.title || deal.propertyAddress || 'Untitled Deal'}
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600">
                  {deal.value ? formatCurrency(deal.value) : 
                   deal.propertyPrice ? formatCurrency(deal.propertyPrice) : 
                   'No value set'}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  deal.status === 'active' ? 'bg-green-100 text-green-800' :
                  deal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {deal.status || 'active'}
                </span>
              </div>
            </div>
          ))}
          {roleDeals.length > 2 && (
            <div className="text-xs text-gray-500 text-center py-1">
              +{roleDeals.length - 2} more deals
            </div>
          )}
        </div>
      )}

      {/* No Deals Message */}
      {roleDeals.length === 0 && !showForm && (
        <div className="text-center py-4 text-gray-500">
          <Target className="w-8 h-8 mx-auto mb-1 text-gray-300" />
          <p className="text-xs">No deals yet</p>
          <p className="text-xs text-gray-400">Click + to add first deal</p>
        </div>
      )}

      {/* Quick Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 border-t pt-3">
          <div>
            <input
              type="text"
              placeholder="Deal title (e.g., 3BR House on Main St)"
              value={dealData.title}
              onChange={(e) => setDealData({...dealData, title: e.target.value})}
              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="Value (€)"
                value={dealData.value}
                onChange={(e) => setDealData({...dealData, value: e.target.value})}
                className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Location"
                value={dealData.location}
                onChange={(e) => setDealData({...dealData, location: e.target.value})}
                className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <textarea
              placeholder="Notes (optional)"
              value={dealData.notes}
              onChange={(e) => setDealData({...dealData, notes: e.target.value})}
              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="2"
            />
          </div>

          <div>
            <input
              type="date"
              value={dealData.expectedCloseDate}
              onChange={(e) => setDealData({...dealData, expectedCloseDate: e.target.value})}
              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <label className="text-xs text-gray-500">Expected close date</label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Deal
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SimpleDealWidget;
