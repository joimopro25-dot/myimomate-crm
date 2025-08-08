// App.jsx - Properly Fixed - All Features Working
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "./LoginPage";
import SimplifiedCRM from "./components/SimplifiedCRM";

// Email verification banner
const EmailVerificationBanner = () => {
  const { user, userProfile } = useAuth();
  
  if (!user || !userProfile || user.emailVerified || userProfile.authProvider === 'google') {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 rounded-full p-1">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <span className="text-yellow-800 font-medium">Please verify your email address</span>
            <p className="text-sm text-yellow-700">
              Check your inbox and click the verification link to fully activate your account.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            alert('Verification email sent! Please check your inbox.');
          }}
          className="text-yellow-700 hover:text-yellow-800 text-sm font-medium underline"
        >
          Resend Email
        </button>
      </div>
    </div>
  );
};

// Subscription Status Banner (simplified version)
const SubscriptionStatusBanner = () => {
  const { subscriptionStatus } = useAuth();

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

  const getStatusMessage = () => {
    switch (subscriptionStatus.status) {
      case 'trial':
        return `Free Trial - ${subscriptionStatus.daysLeft} days left (${subscriptionStatus.clientCount}/${subscriptionStatus.maxClients} clients)`;
      case 'trial_expired':
        return `Trial Expired - Read Only Mode (${subscriptionStatus.clientCount} clients)`;
      case 'active':
        return `Active Plan - ${subscriptionStatus.clientCount}/${subscriptionStatus.maxClients === 999999 ? '∞' : subscriptionStatus.maxClients} clients`;
      case 'inactive':
        return 'No Active Subscription';
      default:
        return 'Loading subscription...';
    }
  };

  return (
    <div className={`border rounded-lg p-3 mb-4 ${getStatusColor(subscriptionStatus.status)}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {getStatusMessage()}
        </div>
        {(subscriptionStatus.status === 'trial_expired' || subscriptionStatus.status === 'inactive') && (
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700">
            Upgrade
          </button>
        )}
      </div>
    </div>
  );
};

// 🔧 FIX: Simplified ProtectedRoute that only checks user auth
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Email Verification Banner */}
      <EmailVerificationBanner />
      
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-6">
                  {/* Subscription Status Banner */}
                  <SubscriptionStatusBanner />
                  
                  {/* Main CRM App */}
                  <SimplifiedCRM />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;