import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import FormSection from '../ui/FormSection';

const Document = () => {
  const [passportData, setPassportData] = useState({
    passportNumber: '',
    issueDate: '',
    expiryDate: '',
    placeOfIssue: '',
    country: ''
  });

  const [indosData, setIndosData] = useState({
    indosNumber: '',
    issueDate: '',
    expiryDate: '',
    placeOfIssue: '',
    issueAuthority: ''
  });

  const [cdcData, setCdcData] = useState({
    cdcNumber: '',
    issueDate: '',
    expiryDate: '',
    placeOfIssue: '',
    issueAuthority: ''
  });

  const handlePassportChange = (e) => {
    const { name, value } = e.target;
    setPassportData(prev => ({ ...prev, [name]: value }));
  };

  const handleIndosChange = (e) => {
    const { name, value } = e.target;
    setIndosData(prev => ({ ...prev, [name]: value }));
  };

  const handleCdcChange = (e) => {
    const { name, value } = e.target;
    setCdcData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Document data:', { passportData, indosData, cdcData });
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
            {/* Passport Details */}
            <FormSection
              title="Passport Details"
              icon="📘"
              bgColor="bg-blue-50"
              showUpload={true}
              onUpload={() => console.log('Upload passport')}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <FormInput
                  label="Passport Number"
                  name="passportNumber"
                  value={passportData.passportNumber}
                  onChange={handlePassportChange}
                  required
                />
                <FormInput
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={passportData.issueDate}
                  onChange={handlePassportChange}
                  required
                />
                <FormInput
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={passportData.expiryDate}
                  onChange={handlePassportChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Place of Issue"
                  name="placeOfIssue"
                  value={passportData.placeOfIssue}
                  onChange={handlePassportChange}
                />
                <FormInput
                  label="Country"
                  name="country"
                  value={passportData.country}
                  onChange={handlePassportChange}
                />
              </div>
            </FormSection>

            {/* INDOS Details */}
            <FormSection
              title="INDOS Details"
              icon="⚓"
              bgColor="bg-purple-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <FormInput
                  label="INDOS Number"
                  name="indosNumber"
                  value={indosData.indosNumber}
                  onChange={handleIndosChange}
                  required
                />
                <FormInput
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={indosData.issueDate}
                  onChange={handleIndosChange}
                  required
                />
                <FormInput
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={indosData.expiryDate}
                  onChange={handleIndosChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Place of Issue"
                  name="placeOfIssue"
                  value={indosData.placeOfIssue}
                  onChange={handleIndosChange}
                />
                <FormInput
                  label="Issue of Authority"
                  name="issueAuthority"
                  value={indosData.issueAuthority}
                  onChange={handleIndosChange}
                />
              </div>
            </FormSection>

            {/* CDC Details */}
            <FormSection
              title="CDC Details"
              icon="📋"
              bgColor="bg-green-50"
              showUpload={true}
              onUpload={() => console.log('Upload CDC')}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <FormInput
                  label="CDC Number"
                  name="cdcNumber"
                  value={cdcData.cdcNumber}
                  onChange={handleCdcChange}
                  required
                />
                <FormInput
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={cdcData.issueDate}
                  onChange={handleCdcChange}
                  required
                />
                <FormInput
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={cdcData.expiryDate}
                  onChange={handleCdcChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Place of Issue"
                  name="placeOfIssue"
                  value={cdcData.placeOfIssue}
                  onChange={handleCdcChange}
                />
                <FormInput
                  label="Issue of Authority"
                  name="issueAuthority"
                  value={cdcData.issueAuthority}
                  onChange={handleCdcChange}
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

export default Document;
