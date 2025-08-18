import React from 'react';

export const SeaServiceSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-[#243F42] to-[#1A2E31] text-white">
            <span className="text-sm font-semibold tracking-wider uppercase">Experience Requirements</span>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#243F42] to-[#1A2E31] bg-clip-text text-transparent">
            Sea Service Experience
          </h2>
          <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
            Master Checker approved sea service experience requirements for maritime certifications
          </p>
        </div>

        {/* Master Checker Notice */}
        <div className="w-full h-[186px] rounded-[20px] bg-gradient-to-r from-[#294146] via-[#48848C] to-[#0F1C1E] shadow-[0_10px_40px_0_rgba(36,63,66,0.20)] flex items-center px-12 mb-12">
          <div className="bg-gradient-to-br from-[rgba(100,181,246,0.20)] to-[rgba(66,165,245,0.20)] backdrop-blur-[5px] rounded-[20px] w-[125px] h-[125px] flex items-center justify-center mr-12">
            <span className="text-5xl text-white">⚓</span>
          </div>
          <div>
            <h3 className="text-white text-3xl font-bold mb-4">Master Checker Approved Experience Only</h3>
            <p className="text-white/90 text-lg leading-relaxed max-w-4xl">
              All sea service experience must be verified and approved by Master Checker for certification purposes. Ensure your experience meets DGS standards.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Documentation Requirements */}
          <div className="bg-white rounded-[20px] border border-[rgba(100,181,246,0.10)] shadow-[0_10px_40px_0_rgba(0,0,0,0.08)] p-8">
            <div className="flex items-center mb-8">
              <div className="w-[78px] h-[78px] bg-gradient-to-br from-[rgba(36,63,66,0.10)] to-[rgba(100,181,246,0.10)] rounded-[12px] flex items-center justify-center mr-6">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold text-[#243F42]">Required Documentation</h3>
            </div>

            <div className="space-y-6">
              {[
                { icon: '📄', title: 'RPSL Details', desc: 'Record of Professional Service at Sea Name & Number' },
                { icon: '🚢', title: 'Vessel Information', desc: 'Name, Type, IMO Number, and specifications' },
                { icon: '👨‍✈️', title: 'Service Details', desc: 'Rank served, sign-on/off dates, duration' },
                { icon: '🏢', title: 'Company Reference', desc: 'Company details and designated person contact' }
              ].map((item, index) => (
                <div key={index} className="bg-[#F8FAFC] border-l-4 border-[#64B5F6] rounded-[12px] p-6">
                  <div className="flex items-start">
                    <div className="w-[47px] h-[47px] bg-gradient-to-br from-[#64B5F6] to-[#42A5F5] rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white text-lg">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#243F42] mb-2">{item.title}</h4>
                      <p className="text-sm text-[#64748B]">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Form */}
          <div className="bg-gradient-to-br from-[#F8FAFC] to-white border border-[rgba(100,181,246,0.10)] rounded-[20px] p-8">
            <h3 className="text-2xl font-bold text-[#243F42] mb-4">Sea Service Record Format</h3>
            <p className="text-[#64748B] mb-8">Sample format for documenting sea service experience</p>

            <div className="space-y-6">
              {[
                { label: 'RPSL Name & Number', placeholder: 'Enter RPSL details' },
                { label: 'Vessel Name & IMO', placeholder: 'Vessel identification' },
                { label: 'Rank & Duration', placeholder: 'Position and service period' },
                { label: 'Company Reference', placeholder: 'Contact information' }
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-[#243F42] mb-2">{field.label}</label>
                  <div className="w-full h-[62px] bg-white border-2 border-[#E2E8F0] rounded-[10px] px-4 flex items-center">
                    <span className="text-[#94A3B8] italic">{field.placeholder}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeaServiceSection;
