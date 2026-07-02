import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.userType || !formData.password || !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsCreatingAccount(true);
    
    // Store user data with role in localStorage
    const userData = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      userType: formData.userType,
      profileComplete: true
    };
    
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Simulate account creation process
    setTimeout(() => {
      setIsCreatingAccount(false);
      navigate('/verify-email');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full relative font-josefin"
         style={{
           background: 'linear-gradient(143deg, #E7F1FD 46.9%, #D0F3F7 73.35%)',
           boxShadow: '38px 4px 4px 50px #000'
         }}>

      {/* Back to Home Button - Positioned on background */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-white rounded-[40px] px-4 py-2 shadow-md hover:shadow-lg transition-shadow"
          style={{
            boxShadow: '0 10px 15px 0 rgba(201, 211, 224, 0.50)'
          }}
        >
          <svg width="20" height="18" viewBox="0 0 65 56" fill="none">
            <path d="M25.9186 13.8364L9.479 27.9998L25.9186 42.1631" stroke="black" strokeWidth="3.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M55.5207 28H9.93945" stroke="black" strokeWidth="4.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-black font-bold text-sm">Back to Home</span>
        </button>
      </div>

      {/* Centered Form Card Container */}
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-4">
        <div
          className="bg-[#FDFEFF] rounded-[40px] w-full max-w-sm p-4"
          style={{
            boxShadow: '25px 25px 20px 0 #DDE9EA'
          }}
        >

          {/* Header Section */}
          <div className="text-center mb-3">
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

            {/* Create Account Title */}
            <h2 className="text-black text-2xl font-bold mb-2 leading-tight">
              Create Account
            </h2>

            {/* Subtitle */}
            <p className="text-black text-base font-medium">
              Join our community
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-2">
            
            {/* Full Name Field */}
            <div className="relative">
              <div className="flex items-center bg-[#F9FAFB] border-[3px] border-[#E5E7EB] rounded-[30px] p-3">
                <svg className="w-4 h-4 text-[#6B7280] mr-3 flex-shrink-0" viewBox="0 0 70 70" fill="none">
                  <path d="M34.9998 34.9997C43.054 34.9997 49.5832 28.4705 49.5832 20.4163C49.5832 12.3622 43.054 5.83301 34.9998 5.83301C26.9457 5.83301 20.4165 12.3622 20.4165 20.4163C20.4165 28.4705 26.9457 34.9997 34.9998 34.9997Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M60.0541 64.1667C60.0541 52.8792 48.825 43.75 35 43.75C21.175 43.75 9.9458 52.8792 9.9458 64.1667" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="flex-1 bg-transparent text-[#676868] placeholder-[#676868] text-sm font-normal focus:outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="flex items-center bg-[#F9FAFB] border-[3px] border-[#E5E7EB] rounded-[30px] p-3">
                <svg className="w-4 h-4 text-[#6B7280] mr-3 flex-shrink-0" viewBox="0 0 70 70" fill="none">
                  <path d="M49.5835 59.7913H20.4168C11.6668 59.7913 5.8335 55.4163 5.8335 45.208V24.7913C5.8335 14.583 11.6668 10.208 20.4168 10.208H49.5835C58.3335 10.208 64.1668 14.583 64.1668 24.7913V45.208C64.1668 55.4163 58.3335 59.7913 49.5835 59.7913Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M49.5832 26.25L40.454 33.5417C37.4498 35.9333 32.5207 35.9333 29.5165 33.5417L20.4165 26.25" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="flex-1 bg-transparent text-[#676868] placeholder-[#676868] text-sm font-normal focus:outline-none"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="relative">
              <div className="flex items-center bg-[#F9FAFB] border-[3px] border-[#E5E7EB] rounded-[30px] p-3">
                <svg className="w-4 h-4 text-[#6B7280] mr-3 flex-shrink-0" viewBox="0 0 70 70" fill="none">
                  <path d="M64.0793 53.4622C64.0793 54.5122 63.846 55.5913 63.3502 56.6413C62.8543 57.6913 62.2127 58.683 61.3668 59.6163C59.9377 61.1913 58.3627 62.3288 56.5835 63.058C54.8335 63.7872 52.9377 64.1663 50.896 64.1663C47.921 64.1663 44.7418 63.4663 41.3877 62.0372C38.0335 60.608 34.6793 58.683 31.3543 56.2622C28.0002 53.8122 24.821 51.0997 21.7877 48.0955C18.7835 45.0622 16.071 41.883 13.6502 38.558C11.2585 35.233 9.3335 31.908 7.9335 28.6122C6.5335 25.2872 5.8335 22.108 5.8335 19.0747C5.8335 17.0913 6.1835 15.1955 6.8835 13.4455C7.5835 11.6663 8.69183 10.033 10.2377 8.57467C12.1043 6.73717 14.146 5.83301 16.3043 5.83301C17.121 5.83301 17.9377 6.00801 18.6668 6.35801C19.4252 6.70801 20.096 7.23301 20.621 7.99134L27.3877 17.5288C27.9127 18.258 28.2918 18.9288 28.5543 19.5705C28.8168 20.183 28.9627 20.7955 28.9627 21.3497C28.9627 22.0497 28.7585 22.7497 28.3502 23.4205C27.971 24.0913 27.4168 24.7913 26.7168 25.4913L24.5002 27.7955C24.1793 28.1163 24.0335 28.4955 24.0335 28.9622C24.0335 29.1955 24.0627 29.3997 24.121 29.633C24.2085 29.8663 24.296 30.0413 24.3543 30.2163C24.8793 31.1788 25.7835 32.433 27.0668 33.9497C28.3793 35.4663 29.7793 37.0122 31.296 38.558C32.871 40.1038 34.3877 41.533 35.9335 42.8455C37.4502 44.1288 38.7043 45.0038 39.696 45.5288C39.8418 45.5872 40.0168 45.6747 40.221 45.7622C40.4543 45.8497 40.6877 45.8788 40.9502 45.8788C41.446 45.8788 41.8252 45.7038 42.146 45.383L44.3627 43.1955C45.0918 42.4663 45.7918 41.9122 46.4627 41.5622C47.1335 41.1538 47.8043 40.9497 48.5335 40.9497C49.0877 40.9497 49.671 41.0663 50.3127 41.3288C50.9543 41.5913 51.6252 41.9705 52.3543 42.4663L62.0085 49.3205C62.7668 49.8455 63.2918 50.458 63.6127 51.1872C63.9043 51.9163 64.0793 52.6455 64.0793 53.4622Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1 bg-transparent text-[#676868] placeholder-[#676868] text-sm font-normal focus:outline-none"
                />
              </div>
            </div>

            {/* User Type Dropdown */}
            <div className="relative">
              <div className="flex items-center bg-[#F9FAFB] border-[3px] border-[#E5E7EB] rounded-[30px] p-3 cursor-pointer" onClick={() => document.getElementById('userTypeSelect').focus()}>
                <svg className="w-4 h-4 text-[#E5E7EB] mr-3 flex-shrink-0" viewBox="0 0 60 60" fill="none">
                  <path d="M30 30C36.9036 30 42.5 24.4036 42.5 17.5C42.5 10.5964 36.9036 5 30 5C23.0964 5 17.5 10.5964 17.5 17.5C17.5 24.4036 23.0964 30 30 30Z" fill="currentColor"/>
                  <path d="M29.9999 36.25C17.4749 36.25 7.2749 44.65 7.2749 55C7.2749 55.7 7.8249 56.25 8.5249 56.25H51.4749C52.1749 56.25 52.7249 55.7 52.7249 55C52.7249 44.65 42.5249 36.25 29.9999 36.25Z" fill="currentColor"/>
                </svg>
                <select
                  id="userTypeSelect"
                  value={formData.userType}
                  onChange={(e) => handleInputChange('userType', e.target.value)}
                  className="flex-1 bg-transparent text-[#676868] text-sm font-normal focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select User type</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
                <svg className="w-4 h-4 text-[#6B7280] flex-shrink-0 cursor-pointer" viewBox="0 0 60 60" fill="none" onClick={() => document.getElementById('userTypeSelect').focus()}>
                  <path d="M29.9998 41.9996C28.2498 41.9996 26.4998 41.3246 25.1748 39.9996L8.8748 23.6996C8.1498 22.9746 8.1498 21.7746 8.8748 21.0496C9.5998 20.3246 10.7998 20.3246 11.5248 21.0496L27.8248 37.3496C29.0248 38.5496 30.9748 38.5496 32.1748 37.3496L48.4748 21.0496C49.1998 20.3246 50.3998 20.3246 51.1248 21.0496C51.8498 21.7746 51.8498 22.9746 51.1248 23.6996L34.8248 39.9996C33.4998 41.3246 31.7498 41.9996 29.9998 41.9996Z" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="flex items-center bg-[#F9FAFB] border-[3px] border-[#E5E7EB] rounded-[30px] p-3">
                <svg className="w-4 h-4 text-[#6B7280] mr-3 flex-shrink-0" viewBox="0 0 70 70" fill="none">
                  <path d="M46.5 42.1663V35.833C46.5 23.9163 48.1667 12.833 35 12.833C21.8333 12.833 23.5 23.9163 23.5 35.833V42.1663" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M35 61.8333H23.3333C9.33333 61.8333 5.83333 58.3333 5.83333 44.3333V37.3333C5.83333 23.3333 9.33333 19.8333 23.3333 19.8333H46.6667C60.6667 19.8333 64.1667 23.3333 64.1667 37.3333V44.3333C64.1667 58.3333 60.6667 61.8333 46.6667 61.8333H35Z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="35" cy="40.833" r="5.83333" stroke="black" strokeWidth="1.5"/>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="flex-1 bg-transparent text-[#676868] placeholder-[#676868] text-sm font-normal focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#6B7280] flex-shrink-0 ml-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M30 45C39.3 45 47.82 38.934 53.57 28.554C55.7 24.941 55.7 15.059 53.57 11.446C47.82 1.066 39.3 -5 30 -5C20.7 -5 12.18 1.066 6.43 11.446C4.3 15.059 4.3 24.941 6.43 28.554C12.18 38.934 20.7 45 30 45Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="flex items-center bg-[#F9FAFB] border-[3px] border-[#E5E7EB] rounded-[30px] p-3">
                <svg className="w-4 h-4 text-[#6B7280] mr-3 flex-shrink-0" viewBox="0 0 70 70" fill="none">
                  <path d="M46.5 42.1663V35.833C46.5 23.9163 48.1667 12.833 35 12.833C21.8333 12.833 23.5 23.9163 23.5 35.833V42.1663" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M35 61.8333H23.3333C9.33333 61.8333 5.83333 58.3333 5.83333 44.3333V37.3333C5.83333 23.3333 9.33333 19.8333 23.3333 19.8333H46.6667C60.6667 19.8333 64.1667 23.3333 64.1667 37.3333V44.3333C64.1667 58.3333 60.6667 61.8333 46.6667 61.8333H35Z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="35" cy="40.833" r="5.83333" stroke="black" strokeWidth="1.5"/>
                </svg>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="flex-1 bg-transparent text-[#676868] placeholder-[#676868] text-sm font-normal focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#6B7280] flex-shrink-0 ml-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M30 45C39.3 45 47.82 38.934 53.57 28.554C55.7 24.941 55.7 15.059 53.57 11.446C47.82 1.066 39.3 -5 30 -5C20.7 -5 12.18 1.066 6.43 11.446C4.3 15.059 4.3 24.941 6.43 28.554C12.18 38.934 20.7 45 30 45Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <div className="pt-3">
              <button
                type="submit"
                onClick={handleCreateAccount}
                disabled={isCreatingAccount}
                className="w-full bg-gradient-to-r from-[#243F42] to-[#5CA0A8] text-white font-bold text-base rounded-[30px] py-3 border border-[#373737] hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {isCreatingAccount ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center py-3">
              <div className="flex-1 h-px bg-black"></div>
              <span className="px-4 text-[#717784] text-sm font-medium">Or continue with</span>
              <div className="flex-1 h-px bg-black"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Google Button */}
              <button className="flex items-center justify-center gap-2 bg-white border-[2px] border-[#D1D5DB] rounded-[20px] py-3 px-4 hover:shadow-md transition-shadow">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/6b265c8fedc215c89641d513c6e7404428422905?width=80"
                  alt="Google"
                  className="w-4 h-4"
                />
                <span className="text-[#6B7280] text-sm font-medium">Google</span>
              </button>

              {/* Facebook Button */}
              <button className="flex items-center justify-center gap-2 bg-white border-[2px] border-[#D1D5DB] rounded-[20px] py-3 px-4 hover:shadow-md transition-shadow">
                <svg className="w-4 h-5 text-[#1D40B0]" viewBox="0 0 23 39" fill="none">
                  <path d="M14.3098 8.07148L14.4546 15.2219L22.073 15.1249C22.6234 15.1249 23.0289 15.537 22.942 15.9733L21.9281 20.6029C21.8412 20.9422 21.4937 21.1846 21.0882 21.2088L14.5705 21.3058L14.9181 38.8788L6.22794 39L5.88035 21.427L0.95588 21.4997C0.463437 21.4997 0.0868982 21.1846 0.0868982 20.7725L0 16.1672C0 15.7551 0.376539 15.44 0.868982 15.44L5.79345 15.3673L5.64856 7.48975C5.56166 3.46614 9.38537 0.169673 14.1939 0.0969568L22.015 0C22.5075 0 22.8841 0.31511 22.8841 0.727167L23 6.54445C23 6.9565 22.6234 7.2716 22.1309 7.2716L15.1788 7.36855C14.6864 7.34431 14.3098 7.68366 14.3098 8.07148Z" fill="currentColor"/>
                </svg>
                <span className="text-[#6B7280] text-sm font-medium">Facebook</span>
              </button>
            </div>

            {/* Already have account */}
            <div className="text-center pt-3">
              <span className="text-[#4B5563] text-sm font-medium">Already have an account? </span>
              <button 
                onClick={() => window.location.href = '/login'}
                className="text-[#2D68EC] text-sm font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
