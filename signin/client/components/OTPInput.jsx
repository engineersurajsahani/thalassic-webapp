import { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const pasteValues = pasteData.slice(0, length).split('');
    
    if (pasteValues.every(val => !isNaN(Number(val)))) {
      const newOtp = new Array(length).fill('');
      pasteValues.forEach((val, index) => {
        if (index < length) newOtp[index] = val;
      });
      setOtp(newOtp);
      
      if (pasteValues.length === length) {
        onComplete(pasteValues.join(''));
      }
    }
  };

  return (
    <div className="flex gap-3 justify-center mb-6">
      {otp.map((value, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg font-medium border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-all duration-300"
          maxLength={1}
        />
      ))}
    </div>
  );
};

export default OTPInput;
