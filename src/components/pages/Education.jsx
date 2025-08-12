import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import FormSection from '../ui/FormSection';
import { EducationIcon, UploadIcon, SaveIcon, NextIcon } from '../ui/Icons';

const Education = () => {
  const [tenthStandard, setTenthStandard] = useState({
    board: '',
    year: '',
    percentage: ''
  });

  const [twelfthStandard, setTwelfthStandard] = useState({
    board: '',
    year: '',
    percentage: ''
  });

  const [degree, setDegree] = useState({
    course: '',
    university: '',
    year: '',
    percentage: ''
  });

  const [masters, setMasters] = useState({
    course: '',
    university: '',
    year: '',
    percentage: ''
  });

  const [extraCurricular, setExtraCurricular] = useState('');

  const handleTenthChange = (e) => {
    const { name, value } = e.target;
    setTenthStandard(prev => ({ ...prev, [name]: value }));
  };

  const handleTwelfthChange = (e) => {
    const { name, value } = e.target;
    setTwelfthStandard(prev => ({ ...prev, [name]: value }));
  };

  const handleDegreeChange = (e) => {
    const { name, value } = e.target;
    setDegree(prev => ({ ...prev, [name]: value }));
  };

  const handleMastersChange = (e) => {
    const { name, value } = e.target;
    setMasters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Education data:', { tenthStandard, twelfthStandard, degree, masters, extraCurricular });
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
              title="Educational Details"
              icon={<EducationIcon className="w-5 h-5 text-blue-600" />}
              bgColor="bg-global-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 10th Standard */}
                <div className="bg-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">10th Standard</h3>
                  <div className="space-y-4">
                    <FormInput
                      label="Board"
                      name="board"
                      value={tenthStandard.board}
                      onChange={handleTenthChange}
                    />
                    <FormInput
                      label="Year"
                      name="year"
                      type="number"
                      value={tenthStandard.year}
                      onChange={handleTenthChange}
                    />
                    <FormInput
                      label="Percentage"
                      name="percentage"
                      type="number"
                      step="0.01"
                      value={tenthStandard.percentage}
                      onChange={handleTenthChange}
                    />
                    <Button
                      variant="secondary"
                      size="small"
                      type="button"
                      className="w-full"
                    >
                      <div className="flex items-center gap-2">
                        <UploadIcon className="w-4 h-4" />
                        <span>Upload</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* 12th Standard */}
                <div className="bg-green-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">12th Standard</h3>
                  <div className="space-y-4">
                    <FormInput
                      label="Board"
                      name="board"
                      value={twelfthStandard.board}
                      onChange={handleTwelfthChange}
                    />
                    <FormInput
                      label="Year"
                      name="year"
                      type="number"
                      value={twelfthStandard.year}
                      onChange={handleTwelfthChange}
                    />
                    <FormInput
                      label="Percentage"
                      name="percentage"
                      type="number"
                      step="0.01"
                      value={twelfthStandard.percentage}
                      onChange={handleTwelfthChange}
                    />
                    <Button
                      variant="secondary"
                      size="small"
                      type="button"
                      className="w-full"
                    >
                      <div className="flex items-center gap-2">
                        <UploadIcon className="w-4 h-4" />
                        <span>Upload</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Degree/Diploma */}
                <div className="bg-purple-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Degree/Diploma</h3>
                  <div className="space-y-4">
                    <FormInput
                      label="Course"
                      name="course"
                      value={degree.course}
                      onChange={handleDegreeChange}
                    />
                    <FormInput
                      label="University"
                      name="university"
                      value={degree.university}
                      onChange={handleDegreeChange}
                    />
                    <FormInput
                      label="Year"
                      name="year"
                      type="number"
                      value={degree.year}
                      onChange={handleDegreeChange}
                    />
                    <FormInput
                      label="Percentage"
                      name="percentage"
                      type="number"
                      step="0.01"
                      value={degree.percentage}
                      onChange={handleDegreeChange}
                    />
                    <Button
                      variant="secondary"
                      size="small"
                      type="button"
                      className="w-full"
                    >
                      <div className="flex items-center gap-2">
                        <UploadIcon className="w-4 h-4" />
                        <span>Upload</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Masters Degree */}
                <div className="bg-orange-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Masters Degree</h3>
                  <div className="space-y-4">
                    <FormInput
                      label="Course"
                      name="course"
                      value={masters.course}
                      onChange={handleMastersChange}
                    />
                    <FormInput
                      label="University"
                      name="university"
                      value={masters.university}
                      onChange={handleMastersChange}
                    />
                    <FormInput
                      label="Year"
                      name="year"
                      type="number"
                      value={masters.year}
                      onChange={handleMastersChange}
                    />
                    <FormInput
                      label="Percentage"
                      name="percentage"
                      type="number"
                      step="0.01"
                      value={masters.percentage}
                      onChange={handleMastersChange}
                    />
                    <Button
                      variant="secondary"
                      size="small"
                      type="button"
                      className="w-full"
                    >
                      <div className="flex items-center gap-2">
                        <UploadIcon className="w-4 h-4" />
                        <span>Upload</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Extra Curricular Activity */}
              <div className="mt-6">
                <FormInput
                  label="Extra Curricular Activity"
                  name="extraCurricular"
                  type="textarea"
                  value={extraCurricular}
                  onChange={(e) => setExtraCurricular(e.target.value)}
                  rows={4}
                  placeholder="Describe your extra-curricular activities, achievements, hobbies, etc."
                />
              </div>
            </FormSection>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="!px-8 !py-3 !text-lg font-medium"
            >
              <div className="flex items-center gap-2">
                <SaveIcon className="w-5 h-5" />
                <span>Save & Next</span>
                <NextIcon className="w-4 h-4" />
              </div>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Education;
