// components/EnhancedCRMHeader.jsx - Add to your SimplifiedCRM
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { 
  Plus, 
  User, 
  LogOut, 
  Settings, 
  Crown, 
  Clock,
  ChevronDown,
  Bell
} from 'lucide-react';

const EnhancedCRMHeader = ({ onAddNew }) => {
  const { user, userProfile, subscriptionStatus, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getSubscriptionBadge = () => {
    if (!subscriptionStatus) return null;

    const badgeConfig = {
      trial: {
        color: 'bg-blue-100 text-blue-800',
        text: `Trial (${subscriptionStatus.daysLeft}d left)`,
        icon: Clock
      },
      trial_expired: {
        color: 'bg-red-100 text-red-800',
        text: 'Trial Expired',
        icon: Clock
      },
      active: {
        color: 'bg-green-100 text-green-800',
        text: userProfile?.subscriptionPlan === 'pro' ? 'Pro Plan' : 'Normal Plan',
        icon: Crown
      },
      inactive: {
        color: 'bg-gray-100 text-gray-800',
        text: 'No Plan',
        icon: Clock
      }
    };

    const config = badgeConfig[subscriptionStatus.status];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="bg-white border-b">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">MyImoMate CRM</h1>
            {getSubscriptionBadge()}
          </div>

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Client Usage */}
            {subscriptionStatus && (
              <div className="text-sm text-gray-600">
                {subscriptionStatus.clientCount}/{subscriptionStatus.maxClients === 999999 ? '∞' : subscriptionStatus.maxClients} clients
              </div>
            )}

            {/* Add New Button */}
            <button
              onClick={onAddNew}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {userProfile?.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-700">
                      {userProfile?.name || user?.displayName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {userProfile?.company || 'Real Estate Agent'}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  
                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-20">
                    {/* User Info */}
                    <div className="p-4 border-b">
                      <div className="flex items-center space-x-3">
                        {userProfile?.photoURL ? (
                          <img 
                            src={userProfile.photoURL} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {userProfile?.name || user?.displayName || 'User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user?.email}
                          </div>
                          {userProfile?.company && (
                            <div className="text-xs text-gray-500">
                              {userProfile.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subscription Status */}
                    {subscriptionStatus && (
                      <div className="p-3 border-b bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              {subscriptionStatus.status === 'trial' && 'Free Trial'}
                              {subscriptionStatus.status === 'trial_expired' && 'Trial Expired'}
                              {subscriptionStatus.status === 'active' && (userProfile?.subscriptionPlan === 'pro' ? 'Pro Plan' : 'Normal Plan')}
                              {subscriptionStatus.status === 'inactive' && 'No Active Plan'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {subscriptionStatus.status === 'trial' && `${subscriptionStatus.daysLeft} days left`}
                              {subscriptionStatus.status === 'trial_expired' && 'Upgrade to continue'}
                              {subscriptionStatus.status === 'active' && 'Active subscription'}
                              {subscriptionStatus.status === 'inactive' && 'Choose a plan'}
                            </div>
                          </div>
                          {(subscriptionStatus.status === 'trial_expired' || subscriptionStatus.status === 'inactive') && (
                            <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                              Upgrade
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className="p-2">
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                        <User className="w-4 h-4 mr-3" />
                        Profile Settings
                      </button>
                      
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Settings className="w-4 h-4 mr-3" />
                        Account Settings
                      </button>

                      {subscriptionStatus && (subscriptionStatus.status === 'trial' || subscriptionStatus.status === 'trial_expired') && (
                        <button className="w-full flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Crown className="w-4 h-4 mr-3" />
                          Upgrade Plan
                        </button>
                      )}

                      <hr className="my-2" />
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCRMHeader;