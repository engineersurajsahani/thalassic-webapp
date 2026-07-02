import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import './auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Login attempt:', { email, password: '***' });
      const result = await login(email, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.log('Login failed:', result.error);
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setIsLoading(false);
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
          onClick={() => window.location.href = '/'}
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

            {/* Welcome Back Title */}
            <h2 className="text-black text-2xl font-bold mb-2 leading-tight">
              Welcome Back
            </h2>
          </div>

          {/* Form Section */}
          <div className="space-y-3">
            
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-[#676868] placeholder-[#676868] text-sm font-normal focus:outline-none"
                />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-[#2D68EC] text-sm font-medium hover:underline">
                Forget Password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center mb-3 p-2 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-[#243F42] to-[#5CA0A8] text-white font-bold text-base rounded-[30px] py-3 border border-[#373737] hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
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

            {/* Don't have account */}
            <div className="text-center pt-3">
              <span className="text-[#4B5563] text-sm font-medium">Don't have an account? </span>
              <a 
                href="/signup"
                className="text-[#2D68EC] text-sm font-bold hover:underline"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
