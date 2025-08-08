// components/SubscriptionStatus.jsx - Shows trial info and upgrade prompts
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { 
  Crown, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Zap,
  Star,
  Shield
} from 'lucide-react';

const SubscriptionStatus = () => {
  const { subscriptionStatus, userProfile } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!subscriptionStatus || subscriptionStatus.status === 'none') {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'trial': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'trial_expired': return 'bg-red-50 border-red-200 text-red-800';
      case 'active': return 'bg-green-50 border-green-200 text-green-800';
      case 'inactive': return 'bg-gray-50 border-gray-200 text-gray-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'trial': return <Clock className="w-4 h-4" />;
      case 'trial_expired': return <AlertTriangle className="w-4 h-4" />;
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'inactive': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDaysLeft = (days) => {
    if (days === 1) return '1 day left';
    if (days === 0) return 'Expires today';
    return `${days} days left`;
  };

  const UpgradeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">Choose Your Plan</h2>
          </div>
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Normal Plan */}
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="text-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Normal Plan</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">$29<span className="text-lg text-gray-500">/month</span></p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Up to 50 clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Unlimited leads & tasks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Email support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Mobile app access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Basic analytics</span>
                </li>
              </ul>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Choose Normal
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-yellow-300 rounded-lg p-6 relative bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  POPULAR
                </span>
              </div>
              
              <div className="text-center mb-4">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Pro Plan</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">$49<span className="text-lg text-gray-500">/month</span></p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 font-medium">Unlimited clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Unlimited leads & tasks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Mobile app access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Advanced analytics & reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Team collaboration</span>
                </li>
              </ul>

              <button className="w-full bg-yellow-500 text-yellow-900 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                Choose Pro
              </button>
            </div>
          </div>

          {/* Payment Security Note */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secure payment processing by Stripe</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Cancel anytime. No long-term contracts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Trial Status Banner
  if (subscriptionStatus.status === 'trial') {
    return (
      <>
        <div className={`border rounded-lg p-4 mb-6 ${getStatusColor(subscriptionStatus.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(subscriptionStatus.status)}
              <div>
                <div className="font-semibold">
                  Free Trial Active - {formatDaysLeft(subscriptionStatus.daysLeft)}
                </div>
                <div className="text-sm opacity-75">
                  {subscriptionStatus.clientCount} of {subscriptionStatus.maxClients} clients used
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
          
          {subscriptionStatus.daysLeft <= 2 && (
            <div className="mt-3 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm">
                <strong>Trial ending soon!</strong> Upgrade now to keep all your clients and data.
              </p>
            </div>
          )}
        </div>

        {showUpgradeModal && <UpgradeModal />}
      </>
    );
  }

  // Trial Expired - Read Only Mode
  if (subscriptionStatus.status === 'trial_expired') {
    return (
      <>
        <div className={`border rounded-lg p-4 mb-6 ${getStatusColor(subscriptionStatus.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(subscriptionStatus.status)}
              <div>
                <div className="font-semibold">Trial Expired - Read Only Mode</div>
                <div className="text-sm opacity-75">
                  {subscriptionStatus.message}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Upgrade to Continue
            </button>
          </div>
        </div>

        {showUpgradeModal && <UpgradeModal />}
      </>
    );
  }

  // Active Subscription
  if (subscriptionStatus.status === 'active') {
    const isProPlan = userProfile?.subscriptionPlan === 'pro';
    
    return (
      <div className={`border rounded-lg p-4 mb-6 ${getStatusColor(subscriptionStatus.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(subscriptionStatus.status)}
            <div>
              <div className="font-semibold flex items-center gap-2">
                {isProPlan ? 'Pro Plan Active' : 'Normal Plan Active'}
                {isProPlan && <Crown className="w-4 h-4 text-yellow-500" />}
              </div>
              <div className="text-sm opacity-75">
                {isProPlan ? 
                  `${subscriptionStatus.clientCount} clients (unlimited)` :
                  `${subscriptionStatus.clientCount} of ${subscriptionStatus.maxClients} clients used`
                }
              </div>
            </div>
          </div>
          {!isProPlan && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
        
        {/* Show upgrade prompt when approaching limit */}
        {!isProPlan && subscriptionStatus.clientCount >= subscriptionStatus.maxClients * 0.8 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              You're approaching your client limit. Consider upgrading to Pro for unlimited clients.
            </p>
          </div>
        )}

        {showUpgradeModal && <UpgradeModal />}
      </div>
    );
  }

  // Inactive/No Subscription
  if (subscriptionStatus.status === 'inactive') {
    return (
      <>
        <div className={`border rounded-lg p-4 mb-6 ${getStatusColor(subscriptionStatus.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(subscriptionStatus.status)}
              <div>
                <div className="font-semibold">No Active Subscription</div>
                <div className="text-sm opacity-75">
                  {subscriptionStatus.message}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Choose Plan
            </button>
          </div>
        </div>

        {showUpgradeModal && <UpgradeModal />}
      </>
    );
  }

  return null;
};

// Client Limit Warning Component (use in add client forms)
export const ClientLimitWarning = ({ onUpgradeClick }) => {
  const { subscriptionStatus, canAddClient } = useAuth();

  if (canAddClient || !subscriptionStatus) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-800">Client Limit Reached</h4>
          <p className="text-sm text-yellow-700 mt-1">
            {subscriptionStatus.status === 'trial_expired' 
              ? 'Your trial has expired. Upgrade to continue adding clients.'
              : `You've reached your limit of ${subscriptionStatus.maxClients} clients. Upgrade to add more.`
            }
          </p>
        </div>
        <button
          onClick={onUpgradeClick}
          className="bg-yellow-600 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-yellow-700 transition-colors"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
};

export default SubscriptionStatus;