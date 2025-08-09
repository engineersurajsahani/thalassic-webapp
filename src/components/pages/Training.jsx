import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import FormSection from '../ui/FormSection';

const Training = () => {
  const [preSeaTraining, setPreSeaTraining] = useState({
    instituteName: '',
    mtiNumber: '',
    dateFrom: '',
    dateTo: '',
    issueDate: '',
    issuePlace: ''
  });

  const [basicCourse, setBasicCourse] = useState({
    courseName: '',
    instituteName: '',
    mtiNumber: '',
    dateFrom: '',
    dateTo: '',
    issueDate: ''
  });

  const [advancedCourse, setAdvancedCourse] = useState({
    courseName: '',
    instituteName: '',
    mtiNumber: ''
  });

  const [refresherCourse, setRefresherCourse] = useState({
    courseName: '',
    instituteName: '',
    mtiNumber: '',
    dateFrom: '',
    dateTo: '',
    issueDate: ''
  });

  const [otherCourse, setOtherCourse] = useState({
    courseName: '',
    instituteName: '',
    mtiNumber: '',
    dateFrom: '',
    dateTo: '',
    issueDate: ''
  });

  const [dgApprovedCourse, setDgApprovedCourse] = useState({
    courseName: '',
    instituteName: '',
    mtiNumber: '',
    dateFrom: '',
    dateTo: '',
    issueDate: '',
    issuePlace: ''
  });

  const handlePreSeaChange = (e) => {
    const { name, value } = e.target;
    setPreSeaTraining(prev => ({ ...prev, [name]: value }));
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleAdvancedChange = (e) => {
    const { name, value } = e.target;
    setAdvancedCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleRefresherChange = (e) => {
    const { name, value } = e.target;
    setRefresherCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleOtherChange = (e) => {
    const { name, value } = e.target;
    setOtherCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleDgApprovedChange = (e) => {
    const { name, value } = e.target;
    setDgApprovedCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Training data:', {
      preSeaTraining,
      basicCourse,
      advancedCourse,
      refresherCourse,
      otherCourse,
      dgApprovedCourse
    });
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
              title="Training & Course Details"
              icon="🎓"
              bgColor="bg-global-10"
            >
              {/* Pre Sea Training */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pre Sea Training</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormInput
                    label="Institute Name"
                    name="instituteName"
                    value={preSeaTraining.instituteName}
                    onChange={handlePreSeaChange}
                  />
                  <FormInput
                    label="MTI Number"
                    name="mtiNumber"
                    value={preSeaTraining.mtiNumber}
                    onChange={handlePreSeaChange}
                  />
                  <FormInput
                    label="Date From"
                    name="dateFrom"
                    type="date"
                    value={preSeaTraining.dateFrom}
                    onChange={handlePreSeaChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Date to"
                    name="dateTo"
                    type="date"
                    value={preSeaTraining.dateTo}
                    onChange={handlePreSeaChange}
                  />
                  <FormInput
                    label="Issue Date"
                    name="issueDate"
                    type="date"
                    value={preSeaTraining.issueDate}
                    onChange={handlePreSeaChange}
                  />
                  <FormInput
                    label="Issue Place"
                    name="issuePlace"
                    value={preSeaTraining.issuePlace}
                    onChange={handlePreSeaChange}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="secondary" size="small" type="button">
                    📤 Upload
                  </Button>
                </div>
              </div>

              {/* Basic Courses (DGS Approved) */}
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Courses (DGS Approved)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormInput
                    label="Course Name"
                    name="courseName"
                    value={basicCourse.courseName}
                    onChange={handleBasicChange}
                  />
                  <FormInput
                    label="Institute Name"
                    name="instituteName"
                    value={basicCourse.instituteName}
                    onChange={handleBasicChange}
                  />
                  <FormInput
                    label="MTI Number"
                    name="mtiNumber"
                    value={basicCourse.mtiNumber}
                    onChange={handleBasicChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Date from"
                    name="dateFrom"
                    type="date"
                    value={basicCourse.dateFrom}
                    onChange={handleBasicChange}
                  />
                  <FormInput
                    label="Date to"
                    name="dateTo"
                    type="date"
                    value={basicCourse.dateTo}
                    onChange={handleBasicChange}
                  />
                  <FormInput
                    label="Issue Date"
                    name="issueDate"
                    type="date"
                    value={basicCourse.issueDate}
                    onChange={handleBasicChange}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="secondary" size="small" type="button">
                    📤 Upload
                  </Button>
                </div>
              </div>

              {/* Advanced Course */}
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Advanced Course</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Course Name"
                    name="courseName"
                    value={advancedCourse.courseName}
                    onChange={handleAdvancedChange}
                  />
                  <FormInput
                    label="Institute Name"
                    name="instituteName"
                    value={advancedCourse.instituteName}
                    onChange={handleAdvancedChange}
                  />
                  <FormInput
                    label="MTI Number"
                    name="mtiNumber"
                    value={advancedCourse.mtiNumber}
                    onChange={handleAdvancedChange}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="secondary" size="small" type="button">
                    📤 Upload
                  </Button>
                </div>
              </div>

              {/* Refresher Course */}
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Refresher Course</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormInput
                    label="Course Name"
                    name="courseName"
                    value={refresherCourse.courseName}
                    onChange={handleRefresherChange}
                  />
                  <FormInput
                    label="Institute Name"
                    name="instituteName"
                    value={refresherCourse.instituteName}
                    onChange={handleRefresherChange}
                  />
                  <FormInput
                    label="MTI Number"
                    name="mtiNumber"
                    value={refresherCourse.mtiNumber}
                    onChange={handleRefresherChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Date from"
                    name="dateFrom"
                    type="date"
                    value={refresherCourse.dateFrom}
                    onChange={handleRefresherChange}
                  />
                  <FormInput
                    label="Date to"
                    name="dateTo"
                    type="date"
                    value={refresherCourse.dateTo}
                    onChange={handleRefresherChange}
                  />
                  <FormInput
                    label="Issue Date"
                    name="issueDate"
                    type="date"
                    value={refresherCourse.issueDate}
                    onChange={handleRefresherChange}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="secondary" size="small" type="button">
                    📤 Upload
                  </Button>
                </div>
              </div>

              {/* Other Additional Course */}
              <div className="bg-green-100 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Additional Course</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormInput
                    label="Course Name"
                    name="courseName"
                    value={otherCourse.courseName}
                    onChange={handleOtherChange}
                  />
                  <FormInput
                    label="Institute Name"
                    name="instituteName"
                    value={otherCourse.instituteName}
                    onChange={handleOtherChange}
                  />
                  <FormInput
                    label="MTI Number"
                    name="mtiNumber"
                    value={otherCourse.mtiNumber}
                    onChange={handleOtherChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Date from"
                    name="dateFrom"
                    type="date"
                    value={otherCourse.dateFrom}
                    onChange={handleOtherChange}
                  />
                  <FormInput
                    label="Date to"
                    name="dateTo"
                    type="date"
                    value={otherCourse.dateTo}
                    onChange={handleOtherChange}
                  />
                  <FormInput
                    label="Issue Date"
                    name="issueDate"
                    type="date"
                    value={otherCourse.issueDate}
                    onChange={handleOtherChange}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="secondary" size="small" type="button">
                    📤 Upload
                  </Button>
                </div>
              </div>

              {/* Any Other Course Issued From DG Approved Institute */}
              <div className="bg-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Any Other Course Issued From DG Approved Institute</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormInput
                    label="Course Name"
                    name="courseName"
                    value={dgApprovedCourse.courseName}
                    onChange={handleDgApprovedChange}
                  />
                  <FormInput
                    label="Institute Name"
                    name="instituteName"
                    value={dgApprovedCourse.instituteName}
                    onChange={handleDgApprovedChange}
                  />
                  <FormInput
                    label="MTI Number"
                    name="mtiNumber"
                    value={dgApprovedCourse.mtiNumber}
                    onChange={handleDgApprovedChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormInput
                    label="Date from"
                    name="dateFrom"
                    type="date"
                    value={dgApprovedCourse.dateFrom}
                    onChange={handleDgApprovedChange}
                  />
                  <FormInput
                    label="Date to"
                    name="dateTo"
                    type="date"
                    value={dgApprovedCourse.dateTo}
                    onChange={handleDgApprovedChange}
                  />
                  <FormInput
                    label="Issue Date"
                    name="issueDate"
                    type="date"
                    value={dgApprovedCourse.issueDate}
                    onChange={handleDgApprovedChange}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <FormInput
                    label="Issue Place"
                    name="issuePlace"
                    value={dgApprovedCourse.issuePlace}
                    onChange={handleDgApprovedChange}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="secondary" size="small" type="button">
                    📤 Upload
                  </Button>
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

export default Training;
