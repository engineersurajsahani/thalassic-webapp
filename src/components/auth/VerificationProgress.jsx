const VerificationProgress = ({ currentStep }) => {
  const steps = [
    { id: 'email', label: 'Email', completed: false },
    { id: 'phone', label: 'Phone', completed: false },
    { id: 'verified', label: 'Verified', completed: false }
  ];

  // Update step completion based on current step
  const updatedSteps = steps.map((step, index) => {
    if (currentStep === 'email' && index === 0) {
      return { ...step, completed: false, active: true };
    } else if (currentStep === 'phone') {
      if (index === 0) return { ...step, completed: true };
      if (index === 1) return { ...step, completed: false, active: true };
    } else if (currentStep === 'verified') {
      if (index < 2) return { ...step, completed: true };
      if (index === 2) return { ...step, completed: true, active: true };
    }
    return step;
  });

  return (
    <div className="flex items-center justify-center mb-8">
      {updatedSteps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step Circle */}
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${step.completed 
              ? 'bg-green-500 text-white' 
              : step.active 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-500'
            }
          `}>
            {step.completed ? '✓' : index + 1}
          </div>
          
          {/* Step Label */}
          <span className={`
            ml-2 text-sm font-medium
            ${step.completed || step.active ? 'text-gray-800' : 'text-gray-400'}
          `}>
            {step.label}
          </span>
          
          {/* Connector Line */}
          {index < updatedSteps.length - 1 && (
            <div className={`
              w-8 h-0.5 mx-4
              ${step.completed ? 'bg-green-500' : 'bg-gray-200'}
            `} />
          )}
        </div>
      ))}
    </div>
  );
};

export default VerificationProgress;
