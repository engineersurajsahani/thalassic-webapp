import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

const GetStarted = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const steps = [
    {
      id: 1,
      title: "Welcome to Thalassic",
      subtitle: "Your Complete Seafarer's Home",
      description: "Join thousands of seafarers who trust us with their career journey. Get access to training, certifications, and job opportunities.",
      action: "Create Account",
      actionType: "signup"
    },
    {
      id: 2,
      title: "Complete Your Profile",
      subtitle: "Tell us about your experience",
      description: "Add your sea experience, certifications, and documents to create a comprehensive maritime profile.",
      action: "Complete Profile",
      actionType: "profile"
    },
    {
      id: 3,
      title: "Explore Opportunities",
      subtitle: "Find your next adventure",
      description: "Browse training programs, certification courses, and job opportunities tailored to your experience level.",
      action: "Explore Now",
      actionType: "dashboard"
    }
  ];

  const handleAction = () => {
    const step = steps[currentStep - 1];
    
    switch (step.actionType) {
      case 'signup':
        if (isAuthenticated) {
          navigate('/dashboard');
        } else {
          navigate('/signup');
        }
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleAction();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen w-full relative font-josefin"
         style={{
           background: 'linear-gradient(143deg, #E7F1FD 46.9%, #D0F3F7 73.35%)',
         }}>
      
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-white rounded-[40px] px-4 py-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <svg width="20" height="18" viewBox="0 0 65 56" fill="none">
            <path d="M25.9186 13.8364L9.479 27.9998L25.9186 42.1631" stroke="black" strokeWidth="3.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M55.5207 28H9.93945" stroke="black" strokeWidth="4.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-black font-bold text-sm">Back to Home</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    index + 1 <= currentStep 
                      ? 'bg-[#5CA0A8] text-white' 
                      : 'bg-white text-gray-400 border-2 border-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 ${
                      index + 1 < currentStep ? 'bg-[#5CA0A8]' : 'bg-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-[40px] p-8 shadow-2xl text-center">
            
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/cbf72a23fa175db64760856be14fffc9162e0bd7?width=560"
                alt="Thalassic Logo"
                className="w-20 h-auto"
              />
            </div>

            {/* Step Content */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#243F42] mb-2">
                {currentStepData.title}
              </h1>
              <h2 className="text-xl font-medium text-[#5CA0A8] mb-4">
                {currentStepData.subtitle}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
                {currentStepData.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-[30px] font-medium hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
              )}
              
              <button
                onClick={currentStep === steps.length ? handleAction : nextStep}
                className="px-8 py-3 bg-gradient-to-r from-[#243F42] to-[#5CA0A8] text-white font-bold rounded-[30px] hover:shadow-lg transition-shadow"
              >
                {currentStep === steps.length ? currentStepData.action : 'Next'}
              </button>
            </div>

            {/* Skip Option */}
            <div className="mt-6">
              <button
                onClick={handleAction}
                className="text-[#5CA0A8] font-medium hover:underline"
              >
                Skip and go to {isAuthenticated ? 'Dashboard' : 'Sign Up'}
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-[#5CA0A8] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#243F42] mb-2">Certifications</h3>
              <p className="text-sm text-gray-600">Track and manage all your maritime certifications</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-[#5CA0A8] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-[#243F42] mb-2">Training</h3>
              <p className="text-sm text-gray-600">Access world-class maritime training programs</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-[#5CA0A8] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="font-bold text-[#243F42] mb-2">Opportunities</h3>
              <p className="text-sm text-gray-600">Find the best job opportunities at sea</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
