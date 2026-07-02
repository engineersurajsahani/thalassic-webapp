import React from 'react';
import Button from '../ui/Button';
import Navigation from './Navigation';

const Sidebar = () => {
  return (
    <div className="w-full lg:w-[26%] flex flex-col gap-6 lg:gap-[30px]">
      {/* Profile Card */}
      <div className="bg-global-6 rounded-[24px] p-4 sm:p-5 lg:p-[20px]">
        <div className="flex flex-row items-end gap-3 lg:gap-[12px] mb-4 lg:mb-0">
          <Button
            variant="primary"
            className="!w-auto !px-4 !py-4 lg:!px-5 lg:!py-5 !rounded-[10px] !text-[18px] sm:!text-[20px] lg:!text-[22px] font-josefin font-medium"
          >
            Rk
          </Button>
          <div className="flex flex-col">
            <h2 className="text-[20px] sm:text-[21px] lg:text-[23px] font-josefin font-medium leading-[22px] lg:leading-[24px] text-global-1">
              Rajesh Kumar
            </h2>
            <p className="text-[12px] lg:text-[13px] font-inter font-normal leading-[14px] lg:leading-[16px] text-global-3 mt-1 lg:mt-2">
              Maritime Professional
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <Navigation />
    </div>
  );
};

export default Sidebar;
