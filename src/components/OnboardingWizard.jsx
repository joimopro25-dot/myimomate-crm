// components/OnboardingWizard.jsx - First-time user setup
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { 
  CheckCircle, 
  Users, 
  Target, 
  Calendar,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  Phone,
  Mail,
  Clock,
  Star
} from 'lucide-react';

const OnboardingWizard = () => {
  const { userProfile, completeOnboarding, subscriptionStatus } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const totalSteps = 4;

  if (!userProfile || userProfile.onboardingCompleted) {
    return null;
  }

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeOnboarding();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Welcome to MyImoMate!",
      subtitle: "Your complete real estate CRM solution",
      content: (
        <div className="text-center space-y-6">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-10 h-10 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              You're all set up! 🎉
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We've created your account and added some sample data to help you explore the features. 
              Let's take a quick tour to get you started.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 text-green-800 font-semibold">
              <CheckCircle className="w-5 h-5" />
              {subscriptionStatus?.status === 'trial' && (
                <span>7-Day Free Trial Active ({subscriptionStatus.daysLeft} days left)</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">3 Sample Clients</div>
              <div className="text-gray-600">Ready to explore</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">2 Sample Leads</div>
              <div className="text-gray-600">Follow up ready</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Managing Your Clients",
      subtitle: "Your client database is the heart of your business",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Client Management</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-900">Track All Details</div>
                  <div className="text-sm text-blue-700">
                    Store contact info, preferences, budgets, and communication history
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-900">Status Tracking</div>
                  <div className="text-sm text-blue-700">
                    Mark clients as Active Buyer, Active Seller, or Potential Lead
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-900">Notes & Tags</div>
                  <div className="text-sm text-blue-700">
                    Add detailed notes and organize with custom tags
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Pro Tip:</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Check out your sample clients - John & Mary Smith, Sarah Johnson, and Michael Rodriguez - 
              to see how client profiles work in practice.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Lead Generation & Follow-up",
      subtitle: "Turn prospects into clients with systematic follow-up",
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-green-900">Lead Pipeline</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-green-900">Capture Leads</div>
                  <div className="text-sm text-green-700">
                    Add leads from websites, social media, referrals, and open houses
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-green-900">Track Progress</div>
                  <div className="text-sm text-green-700">
                    Monitor lead status: New → Contacted → Qualified → Client
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-green-900">Convert to Clients</div>
                  <div className="text-sm text-green-700">
                    Seamlessly move qualified leads to your client database
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-semibold text-sm">Emma Wilson</div>
              <div className="text-xs text-gray-600">Facebook Lead</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="font-semibold text-sm">David Park</div>
              <div className="text-xs text-gray-600">Website Contact</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Task Management",
      subtitle: "Never miss a follow-up or deadline",
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-purple-900">Stay Organized</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-purple-900">Task Creation</div>
                  <div className="text-sm text-purple-700">
                    Create tasks for follow-ups, property showings, document preparation
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-purple-900">Priority & Due Dates</div>
                  <div className="text-sm text-purple-700">
                    Set priorities and never miss important deadlines
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-purple-900">Client Linking</div>
                  <div className="text-sm text-purple-700">
                    Connect tasks to specific clients or leads for context
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-gray-900">Sample Tasks Created:</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <Clock className="w-4 h-4 text-red-600" />
                <div className="flex-1">
                  <div className="font-medium text-red-900 text-sm">Call Emma Wilson</div>
                  <div className="text-xs text-red-700">Hot lead from Facebook ad</div>
                </div>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium text-blue-900 text-sm">Follow up with John & Mary Smith</div>
                  <div className="text-xs text-blue-700">Send property listings</div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">High</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-900 mb-2">You're Ready to Go!</h4>
            <p className="text-sm text-blue-700 mb-4">
              Your CRM is set up with sample data. Start exploring and when you're ready, 
              delete the sample data and add your real clients.
            </p>
            <button
              onClick={handleComplete}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Setting up...' : 'Get Started'}
            </button>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{currentStepData.title}</h2>
              <p className="text-blue-100 text-sm">{currentStepData.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Step {currentStep} of {totalSteps}</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-blue-500 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStepData.content}
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between items-center p-6 bg-gray-50 rounded-b-lg">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex gap-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step.id === currentStep
                      ? 'bg-blue-600'
                      : step.id < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;