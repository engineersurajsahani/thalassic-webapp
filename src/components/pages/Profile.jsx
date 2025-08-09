import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import FormSection from '../ui/FormSection';

const Profile = () => {
  const [formData, setFormData] = useState({
    givenName: '',
    surname: '',
    dateOfBirth: '',
    birthPlace: '',
    district: '',
    state: '',
    country: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    communicationAddress: '',
    permanentAddress: '',
    emailId: '',
    mobileNumber: '',
    alternateMobile: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile data:', formData);
    // Handle form submission
  };



  return (
    <div className="min-h-screen bg-[linear-gradient(137deg,#e7f1fd_0%,_#d0f3f7_100%)]">
      <Header />
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 px-4 sm:px-6 lg:px-[50px] py-6 lg:py-[28px]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="w-full lg:w-[74%]">
          <form onSubmit={handleSubmit}>
            <FormSection
              title="Basic Details"
              icon="👤"
              bgColor="bg-global-10"
              className="mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <FormInput
                  label="Given Name"
                  name="givenName"
                  value={formData.givenName}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <FormInput
                  label="Birth Place"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <FormInput
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Father's Name"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Mother's Name"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <FormInput
                  label="Spouse Name"
                  name="spouseName"
                  value={formData.spouseName}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Communication Address"
                  name="communicationAddress"
                  type="textarea"
                  value={formData.communicationAddress}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <FormInput
                  label="Permanent Address"
                  name="permanentAddress"
                  type="textarea"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  rows={3}
                />
                <FormInput
                  label="Email ID"
                  name="emailId"
                  type="email"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Mobile Number"
                  name="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Alternate Mobile"
                  name="alternateMobile"
                  type="tel"
                  value={formData.alternateMobile}
                  onChange={handleInputChange}
                />
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

export default Profile;
