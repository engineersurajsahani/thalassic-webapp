import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import FormSection from '../ui/FormSection';

const SeaService = () => {
  const [seaServiceData, setSeaServiceData] = useState({
    rpslName: '',
    rpslNumber: '',
    vesselNumber: '',
    vesselType: '',
    imoNumber: '',
    rankedServed: '',
    signOnDate: '',
    signOffDate: ''
  });

  const [referenceData, setReferenceData] = useState({
    name: '',
    contactNumber: '',
    designation: '',
    relation: ''
  });

  const handleSeaServiceChange = (e) => {
    const { name, value } = e.target;
    setSeaServiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleReferenceChange = (e) => {
    const { name, value } = e.target;
    setReferenceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sea Service data:', { seaServiceData, referenceData });
  };



  return (
    <div className="min-h-screen bg-[linear-gradient(137deg,#e7f1fd_0%,_#d0f3f7_100%)]">
      <Header />
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 px-4 sm:px-6 lg:px-[50px] py-6 lg:py-[28px]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="w-full lg:w-[74%] space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection
              title="Sea Service Experience"
              icon="🚢"
              bgColor="bg-global-10"
            >
              {/* Sea Service Experience (Only Master Checker Approved) */}
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Sea Service Experience (Only Master Checker Approved)</h3>
                
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-4">a. First Sea Service</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormInput
                      label="RPSL Name"
                      name="rpslName"
                      value={seaServiceData.rpslName}
                      onChange={handleSeaServiceChange}
                    />
                    <FormInput
                      label="RPSL Number"
                      name="rpslNumber"
                      value={seaServiceData.rpslNumber}
                      onChange={handleSeaServiceChange}
                    />
                    <FormInput
                      label="Vessel Name"
                      name="vesselNumber"
                      value={seaServiceData.vesselNumber}
                      onChange={handleSeaServiceChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormInput
                      label="Vessel type"
                      name="vesselType"
                      value={seaServiceData.vesselType}
                      onChange={handleSeaServiceChange}
                    />
                    <FormInput
                      label="IMO Number"
                      name="imoNumber"
                      value={seaServiceData.imoNumber}
                      onChange={handleSeaServiceChange}
                    />
                    <FormInput
                      label="Rank Served on the Vessel"
                      name="rankedServed"
                      value={seaServiceData.rankedServed}
                      onChange={handleSeaServiceChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <FormInput
                      label="Sign on Date"
                      name="signOnDate"
                      type="date"
                      value={seaServiceData.signOnDate}
                      onChange={handleSeaServiceChange}
                    />
                    <FormInput
                      label="Sign off Date"
                      name="signOffDate"
                      type="date"
                      value={seaServiceData.signOffDate}
                      onChange={handleSeaServiceChange}
                    />
                  </div>

                  {/* Reference Contact */}
                  <div className="border-t pt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-4">• Reference from which you joined that Company</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <FormInput
                        label="Name"
                        name="name"
                        value={referenceData.name}
                        onChange={handleReferenceChange}
                      />
                      <FormInput
                        label="Contact Number"
                        name="contactNumber"
                        type="tel"
                        value={referenceData.contactNumber}
                        onChange={handleReferenceChange}
                      />
                      <FormInput
                        label="Designation"
                        name="designation"
                        value={referenceData.designation}
                        onChange={handleReferenceChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Relation with this Person"
                        name="relation"
                        value={referenceData.relation}
                        onChange={handleReferenceChange}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button variant="secondary" size="small" type="button">
                      📤 Upload
                    </Button>
                  </div>
                </div>
              </div>

              {/* Second Sea Service */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Sea Service Experience (Only Master Checker Approved)</h3>
                
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-4">b. Second Sea Service</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormInput
                      label="RPSL Name"
                      name="rpslName"
                      placeholder="Enter RPSL Name"
                    />
                    <FormInput
                      label="RPSL Number"
                      name="rpslNumber"
                      placeholder="Enter RPSL Number"
                    />
                    <FormInput
                      label="Vessel Name"
                      name="vesselNumber"
                      placeholder="Enter Vessel Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormInput
                      label="Vessel type"
                      name="vesselType"
                      placeholder="Enter Vessel Type"
                    />
                    <FormInput
                      label="IMO Number"
                      name="imoNumber"
                      placeholder="Enter IMO Number"
                    />
                    <FormInput
                      label="Rank Served on the Vessel"
                      name="rankedServed"
                      placeholder="Enter Rank"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <FormInput
                      label="Sign on Date"
                      name="signOnDate"
                      type="date"
                    />
                    <FormInput
                      label="Sign off Date"
                      name="signOffDate"
                      type="date"
                    />
                  </div>

                  {/* Reference Contact */}
                  <div className="border-t pt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-4">• Reference from which you joined that Company</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <FormInput
                        label="Name"
                        name="name"
                        placeholder="Enter Name"
                      />
                      <FormInput
                        label="Contact Number"
                        name="contactNumber"
                        type="tel"
                        placeholder="Enter Contact Number"
                      />
                      <FormInput
                        label="Designation"
                        name="designation"
                        placeholder="Enter Designation"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Relation with this Person"
                        name="relation"
                        placeholder="Enter Relation"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button variant="secondary" size="small" type="button">
                      📤 Upload
                    </Button>
                  </div>
                </div>
              </div>
            </FormSection>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="!px-8 !py-3 !text-lg font-medium"
            >
              Save & Next
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SeaService;
