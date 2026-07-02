import React from 'react';
import PropTypes from 'prop-types';
import { CalendarIcon, ClockIcon, SettingsIcon, BellIcon, CompanyIcon } from '../ui/Icons';

const Header = ({ className = '' }) => {
  return (
    <header className={`w-full bg-global-10 px-4 sm:px-6 lg:px-[34px] py-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
        {/* Left Section - Logo and Brand */}
        <div className="flex flex-row justify-center items-center w-auto">
          <span className="w-[32px] h-[32px] flex items-center justify-center rounded-md bg-global-3 text-header-1">
            {/* Simple brand mark */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
              <path d="M12 2l3 6 6 1-4.5 4.4L18 20l-6-3-6 3 1.5-6.6L3 9l6-1 3-6z" />
            </svg>
          </span>
          <div className="flex items-center justify-center w-[80px] h-[57px] sm:w-[106px] sm:h-[76px] ml-4 sm:ml-[18px] bg-global-6 rounded-lg p-2">
            <CompanyIcon className="w-full h-full text-header-1" />
          </div>
          <h1 className="text-[24px] sm:text-[30px] lg:text-[36px] font-josefin font-medium leading-[25px] sm:leading-[32px] lg:leading-[37px] text-center text-header-1 mt-3 sm:mt-[12px] ml-3 sm:ml-[12px]">
            Hari Om Thalassic
          </h1>
        </div>

        {/* Right Section - Status and User Info */}
        <div className="flex flex-col sm:flex-row justify-center items-start sm:items-end w-full sm:w-auto gap-2 sm:gap-0">
          <div className="flex flex-row items-center gap-2 sm:gap-[10px]">
            <CalendarIcon className="w-[24px] h-[24px] text-global-3" />
            <span className="text-[13px] sm:text-[15px] font-inter font-normal leading-[18px] sm:leading-[20px] text-left text-global-3">
              Last Updated: 7/7/2025
            </span>
          </div>

          <div className="flex flex-row items-center gap-2 sm:gap-[10px] sm:ml-[36px]">
            <ClockIcon className="w-[24px] h-[24px] text-global-3" />
            <span className="text-[14px] sm:text-[16px] font-inter font-normal leading-[18px] sm:leading-[20px] text-left text-global-3">
              06:27 AM
            </span>
          </div>

          <div className="flex flex-row items-center gap-2 sm:gap-[22px] sm:ml-[36px]">
            <SettingsIcon className="w-[24px] h-[24px] text-global-3" />
            <BellIcon className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] text-global-3" />
            
            {/* User Avatar */}
            <div className="flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] bg-[linear-gradient(135deg,#528990_0%,_#2a464b_100%)] rounded-[24px] shadow-[0px_2px_4px_#00000019]">
              <span className="text-[12px] sm:text-[14px] font-inter font-bold leading-[15px] sm:leading-[17px] text-center text-global-5">
                RK
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  className: PropTypes?.string,
};

export default Header;
