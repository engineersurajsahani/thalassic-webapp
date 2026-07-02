import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerificationProgress from './VerificationProgress.jsx';
import OTPInput from './OTPInput.jsx';

const VerifyPhone = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [userPhone, setUserPhone] = useState('+91 98765 43210'); // Default phone or get from props/context

  const handleOTPComplete = (otp) => {
    setIsVerifying(true);
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      navigate('/account-verified');
    }, 1500);
  };

  const handleResendCode = () => {
    console.log('Resending phone verification code...');
  };

  return (
    <div className="min-h-screen w-full relative font-josefin"
         style={{
           background: 'linear-gradient(143deg, #E7F1FD 46.9%, #D0F3F7 73.35%)',
           boxShadow: '38px 4px 4px 50px #000'
         }}>

      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate('/verify-email')}
          className="flex items-center gap-2 bg-white rounded-[40px] px-4 py-2 shadow-md hover:shadow-lg transition-shadow"
          style={{
            boxShadow: '0 10px 15px 0 rgba(201, 211, 224, 0.50)'
          }}
        >
          <svg width="20" height="18" viewBox="0 0 65 56" fill="none">
            <path d="M25.9186 13.8364L9.479 27.9998L25.9186 42.1631" stroke="black" strokeWidth="3.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M55.5207 28H9.93945" stroke="black" strokeWidth="4.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-black font-bold text-sm">Back</span>
        </button>
      </div>

      {/* Centered Form Card Container */}
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-4">
        <div
          className="bg-[#FDFEFF] rounded-[40px] w-full max-w-sm p-6"
          style={{
            boxShadow: '25px 25px 20px 0 #DDE9EA'
          }}
        >

          {/* Header Section */}
          <div className="text-center mb-4">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-3">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/cbf72a23fa175db64760856be14fffc9162e0bd7?width=560"
                alt="Seafarer's Home Logo"
                className="w-16 h-auto"
              />
            </div>

            {/* Main Heading */}
            <h1 className="text-black text-lg font-medium mb-2 leading-tight">
              A Complete Seafarer's Home
            </h1>

            {/* Verify Account Title */}
            <h2 className="text-black text-2xl font-bold mb-4 leading-tight">
              Verify Your Account
            </h2>
          </div>

          {/* Progress */}
          <VerificationProgress currentStep="phone" />

          {/* Verification Section */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Verify Your Phone</h3>
            <p className="text-sm text-gray-600 mb-6">
              We've sent a 6-digit code to<br />
              <span className="font-medium">{userPhone || '+91*******'}</span>
            </p>

            <OTPInput length={6} onComplete={handleOTPComplete} />

            <button 
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-[#243F42] to-[#5CA0A8] text-white font-bold text-base rounded-[30px] py-3 border border-[#373737] hover:shadow-lg transition-shadow disabled:opacity-50 mb-4"
            >
              {isVerifying ? 'Verifying...' : 'Verify Code'}
            </button>

            <button 
              onClick={handleResendCode}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Didn't receive the code?<br />Resend in 45s
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
