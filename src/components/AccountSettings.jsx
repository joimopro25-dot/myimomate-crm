// components/AccountSettings.jsx - Account Settings Modal
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { 
  X, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  Database,
  AlertTriangle,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Crown,
  Clock,
  Trash2,
  Download,
  Upload,
  Lock,
  Key
} from 'lucide-react';

const AccountSettings = ({ isOpen, onClose }) => {
  const { user, userProfile, subscriptionStatus } = useAuth();
  const [activeTab, setActiveTab] = useState('security');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    leadAlerts: true,
    taskReminders: true,
    clientUpdates: true,
    marketingEmails: false
  });

  if (!isOpen) return null;

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'data', label: 'Data & Privacy', icon: Database }
  ];

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Implementation for password change
    console.log('Password change logic here');
  };

  const handleNotificationUpdate = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    // Save to database
    console.log('Update notification settings');
  };

  const getSubscriptionStatusBadge = () => {
    if (!subscriptionStatus) return null;

    const statusConfig = {
      trial: { 
        color: 'bg-blue-100 text-blue-800', 
        text: 'Free Trial',
        icon: Clock 
      },
      trial_expired: { 
        color: 'bg-red-100 text-red-800', 
        text: 'Trial Expired',
        icon: AlertTriangle 
      },
      active: { 
        color: 'bg-green-100 text-green-800', 
        text: userProfile?.subscriptionPlan === 'pro' ? 'Pro Plan' : 'Normal Plan',
        icon: Crown 
      },
      inactive: { 
        color: 'bg-gray-100 text-gray-800', 
        text: 'No Active Plan',
        icon: AlertTriangle 
      }
    };

    const config = statusConfig[subscriptionStatus.status];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {config.text}
      </span>
    );
  };

  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Email Verification Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Email Verification</div>
              <div className="text-sm text-gray-500">
                {user?.emailVerified ? 'Your email is verified' : 'Your email is not verified'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user?.emailVerified ? (
              <span className="text-green-600 text-sm font-medium">✓ Verified</span>
            ) : (
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                Verify Email
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Change Password
        </h3>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={securityForm.currentPassword}
                onChange={(e) => setSecurityForm(prev => ({
                  ...prev,
                  currentPassword: e.target.value
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={securityForm.newPassword}
                onChange={(e) => setSecurityForm(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={securityForm.confirmPassword}
              onChange={(e) => setSecurityForm(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Key className="w-4 h-4" />
            Update Password
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
              <div className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </div>
            </div>
          </div>
          <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive notifications via email</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => handleNotificationUpdate('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Push Notifications</div>
              <div className="text-sm text-gray-500">Receive browser push notifications</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={(e) => handleNotificationUpdate('pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Lead Alerts */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">New Lead Alerts</div>
              <div className="text-sm text-gray-500">Get notified when you receive new leads</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.leadAlerts}
                onChange={(e) => handleNotificationUpdate('leadAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Task Reminders */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Task Reminders</div>
              <div className="text-sm text-gray-500">Reminders for upcoming tasks and deadlines</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.taskReminders}
                onChange={(e) => handleNotificationUpdate('taskReminders', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Client Updates */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Client Updates</div>
              <div className="text-sm text-gray-500">Updates about client interactions and changes</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.clientUpdates}
                onChange={(e) => handleNotificationUpdate('clientUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Marketing Emails</div>
              <div className="text-sm text-gray-500">Receive product updates and marketing content</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.marketingEmails}
                onChange={(e) => handleNotificationUpdate('marketingEmails', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const SubscriptionTab = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
          {getSubscriptionStatusBadge()}
        </div>

        <div className="space-y-4">
          {/* Plan Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Plan Status</div>
              <div className="font-medium">
                {subscriptionStatus?.status === 'trial' && 'Free Trial'}
                {subscriptionStatus?.status === 'trial_expired' && 'Trial Expired'}
                {subscriptionStatus?.status === 'active' && 
                  (userProfile?.subscriptionPlan === 'pro' ? 'Pro Plan' : 'Normal Plan')}
                {subscriptionStatus?.status === 'inactive' && 'No Active Plan'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Client Limit</div>
              <div className="font-medium">
                {subscriptionStatus?.clientCount || 0} / {
                  subscriptionStatus?.maxClients === 999999 ? '∞' : (subscriptionStatus?.maxClients || 0)
                } clients
              </div>
            </div>
          </div>

          {/* Trial Info */}
          {subscriptionStatus?.status === 'trial' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                <Clock className="w-4 h-4" />
                Trial Expires In {subscriptionStatus.daysLeft} Days
              </div>
              <p className="text-sm text-blue-700">
                Your free trial ends on {subscriptionStatus.trialEnd?.toLocaleDateString()}. 
                Upgrade to continue managing your clients.
              </p>
            </div>
          )}

          {/* Trial Expired */}
          {subscriptionStatus?.status === 'trial_expired' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertTriangle className="w-4 h-4" />
                Trial Expired
              </div>
              <p className="text-sm text-red-700">
                Your free trial has ended. Your account is now in read-only mode. 
                Upgrade to continue managing your clients and leads.
              </p>
            </div>
          )}

          {/* Upgrade Options */}
          {(subscriptionStatus?.status === 'trial' || 
            subscriptionStatus?.status === 'trial_expired' || 
            subscriptionStatus?.status === 'inactive') && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Available Plans</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Normal Plan */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-center mb-4">
                    <h5 className="font-semibold text-gray-900">Normal Plan</h5>
                    <div className="text-2xl font-bold text-blue-600 mt-1">
                      $29<span className="text-lg text-gray-500">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                      Up to 50 clients
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                      Unlimited leads & tasks
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                      Email support
                    </li>
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Choose Normal
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-white border-2 border-yellow-300 rounded-lg p-4 relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      POPULAR
                    </span>
                  </div>
                  <div className="text-center mb-4">
                    <h5 className="font-semibold text-gray-900">Pro Plan</h5>
                    <div className="text-2xl font-bold text-yellow-600 mt-1">
                      $49<span className="text-lg text-gray-500">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                      Unlimited clients
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                      Unlimited leads & tasks
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                      Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                      Advanced analytics
                    </li>
                  </ul>
                  <button className="w-full bg-yellow-500 text-yellow-900 py-2 rounded-lg hover:bg-yellow-400 font-semibold">
                    Choose Pro
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Subscription Management */}
          {subscriptionStatus?.status === 'active' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Next Billing Date</div>
                  <div className="text-sm text-gray-500">
                    {subscriptionStatus.subscriptionEnd?.toLocaleDateString() || 'Not available'}
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Update Payment Method
                </button>
              </div>
              
              <div className="flex gap-3">
                {userProfile?.subscriptionPlan !== 'pro' && (
                  <button className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg hover:bg-yellow-400 font-semibold">
                    Upgrade to Pro
                  </button>
                )}
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                  Cancel Subscription
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
        <div className="text-center py-8 text-gray-500">
          <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No billing history available</p>
          <p className="text-sm">Your billing history will appear here once you subscribe</p>
        </div>
      </div>
    </div>
  );

  const DataTab = () => (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Your Data
        </h3>
        <p className="text-gray-600 mb-4">
          Download a copy of all your data including clients, leads, and tasks.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Data Import */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import Data
        </h3>
        <p className="text-gray-600 mb-4">
          Import your existing client and lead data from CSV files.
        </p>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Import CSV
        </button>
      </div>

      {/* Storage Usage */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Clients</span>
            <span className="font-medium">{subscriptionStatus?.clientCount || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Storage Used</span>
            <span className="font-medium">2.4 MB</span>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="border border-red-200 rounded-lg p-6 bg-red-50">
        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Delete Account
        </h3>
        <p className="text-red-700 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            </div>
          </div>
          
          <nav className="p-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'subscription' && <SubscriptionTab />}
            {activeTab === 'data' && <DataTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;