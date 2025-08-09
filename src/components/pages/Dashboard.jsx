import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Button from '../ui/Button';

const Dashboard = () => {

  const statsCards = [
    {
      title: 'Sea Experience',
      value: '6 Months',
      icon: '/images/img_background.svg',
      bgColor: 'bg-global-4'
    },
    {
      title: 'Certifications',
      value: '12',
      icon: '/images/img_background_green_700.svg',
      bgColor: 'bg-global-5'
    },
    {
      title: 'Documents',
      value: 'Valid',
      icon: '/images/img_background_deep_purple_a200.svg',
      bgColor: 'bg-global-7'
    },
    {
      title: 'Profile Score',
      value: 'A+',
      icon: '/images/img_background_orange_800.svg',
      bgColor: 'bg-global-9'
    }
  ];

  const documents = [
    { name: 'Passport', id: 'P1234567', status: 'Valid' },
    { name: 'INDOS', id: 'IND123456789', status: 'Valid' },
    { name: 'CDC', id: 'CDC001234', status: 'Valid' }
  ];

  const activities = [
    { text: 'Profile updated', time: '2 hours ago', color: 'bg-global-1' },
    { text: 'New certificate added', time: '1 day ago', color: 'bg-global-2' },
    { text: 'Document expiry reminder', time: '3 days ago', color: 'bg-global-8' }
  ];



  return (
    <div className="min-h-screen bg-[linear-gradient(137deg,#e7f1fd_0%,_#d0f3f7_100%)]">
      {/* Header */}
      <Header />
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 px-4 sm:px-6 lg:px-[50px] py-6 lg:py-[28px]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="w-full lg:w-[74%] flex flex-col gap-6 lg:gap-[38px]">
          {/* Welcome Section */}
          <div className="bg-[linear-gradient(0deg,#49828a_0%,_#2a454a_100%)] rounded-[24px] p-6 sm:p-8 lg:p-[42px]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
              <div className="flex flex-col w-full lg:w-auto">
                <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-josefin font-bold leading-[36px] sm:leading-[44px] lg:leading-[48px] text-global-5 mb-2 lg:mb-4">
                  Welcome back, Rajesh!
                </h1>
                <p className="text-[16px] sm:text-[18px] lg:text-[21px] font-inter font-normal leading-[20px] sm:leading-[23px] lg:leading-[26px] text-global-4 mb-3 lg:mb-[14px]">
                  Maritime Professional Dashboard
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 lg:gap-8">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/img_svg_2.svg"
                      alt="Third Officer"
                      className="w-[18px] h-[18px] lg:w-[20px] lg:h-[20px]"
                    />
                    <span className="text-[16px] lg:text-[18px] font-inter font-normal leading-[20px] lg:leading-[23px] text-global-5">
                      Third Officer
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/img_svg_3.svg"
                      alt="DG Shipping Certified"
                      className="w-[18px] h-[18px] lg:w-[20px] lg:h-[20px]"
                    />
                    <span className="text-[16px] lg:text-[18px] font-inter font-normal leading-[20px] lg:leading-[23px] text-global-5">
                      DG Shipping Certified
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-global-11 rounded-[12px] p-3 lg:p-[14px] shadow-[0px_4px_4px_#888888ff] self-end lg:self-auto">
                <div className="text-center">
                  <div className="text-[32px] sm:text-[36px] lg:text-[42px] font-inter font-bold leading-[40px] sm:leading-[46px] lg:leading-[52px] text-global-5">
                    98%
                  </div>
                  <div className="text-[11px] lg:text-[13px] font-inter font-normal leading-[14px] lg:leading-[16px] text-global-4 mt-1 lg:mt-2">
                    Profile Complete
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[18px]">
            {statsCards?.map((card, index) => (
              <div key={index} className="bg-global-10 rounded-[24px] p-4 sm:p-5 lg:p-[22px]">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col gap-1 lg:gap-[2px]">
                    <p className="text-[16px] lg:text-[18px] font-inter font-normal leading-[20px] lg:leading-[23px] text-global-3">
                      {card?.title}
                    </p>
                    <p className="text-[18px] sm:text-[20px] lg:text-[22px] font-inter font-bold leading-[24px] lg:leading-[28px] text-global-2">
                      {card?.value}
                    </p>
                  </div>
                  <div className={`${card?.bgColor} rounded-[8px] p-3 lg:p-[14px]`}>
                    <img
                      src={card?.icon}
                      alt={card?.title}
                      className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] lg:w-[28px] lg:h-[28px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-[36px]">
            {/* Document Status */}
            <div className="w-full lg:w-[44%] bg-global-10 rounded-[24px] p-6 sm:p-8 lg:p-[40px]">
              <div className="flex items-center gap-3 lg:gap-[8px] mb-6 lg:mb-[46px]">
                <img
                  src="/images/img_svg_blue_a700.svg"
                  alt="Document Status"
                  className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] lg:w-[30px] lg:h-[28px]"
                />
                <h3 className="text-[20px] sm:text-[22px] lg:text-[24px] font-inter font-bold leading-[26px] lg:leading-[30px] text-global-2">
                  Document Status
                </h3>
              </div>
              <div className="flex flex-col gap-3 lg:gap-[16px]">
                {documents?.map((doc, index) => (
                  <div key={index} className="border border-[#f3f4f6] rounded-[8px] p-3 lg:p-[12px]">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-[16px] lg:text-[18px] font-inter font-normal leading-[20px] lg:leading-[22px] text-global-2">
                          {doc?.name}
                        </p>
                        <p className="text-[12px] lg:text-[13px] font-inter font-normal leading-[15px] lg:leading-[17px] text-global-3 mt-1">
                          {doc?.id}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="small"
                        className="!text-[10px] lg:!text-[11px] !px-2 lg:!px-[10px] !py-1 lg:!py-[4px] !rounded-[12px]"
                      >
                        {doc?.status}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="w-full lg:w-[34%] bg-global-10 rounded-[24px] p-6 sm:p-8 lg:p-[40px]">
              <div className="flex items-center gap-2 lg:gap-[8px] mb-6 lg:mb-[28px]">
                <img
                  src="/images/img_svg_blue_a700_20x20.svg"
                  alt="Recent Activity"
                  className="w-[18px] h-[18px] lg:w-[20px] lg:h-[20px]"
                />
                <h3 className="text-[15px] sm:text-[16px] lg:text-[17px] font-inter font-bold leading-[19px] lg:leading-[21px] text-global-2">
                  Recent Activity
                </h3>
              </div>
              <div className="flex flex-col gap-6 lg:gap-[30px]">
                {activities?.map((activity, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-start gap-3 lg:gap-[14px]">
                      <div className={`w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] ${activity?.color} rounded-[5px] mt-2 lg:mt-3 flex-shrink-0`}></div>
                      <div className="flex flex-col">
                        <p className="text-[22px] sm:text-[25px] lg:text-[28px] font-inter font-normal leading-[28px] lg:leading-[34px] text-global-2">
                          {activity?.text}
                        </p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-inter font-normal leading-[17px] lg:leading-[19px] text-global-3 mt-1 lg:mt-2">
                          {activity?.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
