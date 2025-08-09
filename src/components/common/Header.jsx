import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ className = '' }) => {
  return (
    <header className={`w-full bg-global-10 px-4 sm:px-6 lg:px-[34px] py-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
        {/* Left Section - Logo and Brand */}
        <div className="flex flex-row justify-center items-center w-auto">
          <img 
            src="/images/img_vector.svg" 
            alt="Logo" 
            className="w-[32px] h-[22px]"
          />
          <img 
            src="/images/img_image_me_2.png" 
            alt="Company Image" 
            className="w-[80px] h-[57px] sm:w-[106px] sm:h-[76px] ml-4 sm:ml-[18px]"
          />
          <h1 className="text-[24px] sm:text-[30px] lg:text-[36px] font-josefin font-medium leading-[25px] sm:leading-[32px] lg:leading-[37px] text-center text-header-1 mt-3 sm:mt-[12px] ml-3 sm:ml-[12px]">
            Hari Om Thalassic
          </h1>
        </div>

        {/* Right Section - Status and User Info */}
        <div className="flex flex-col sm:flex-row justify-center items-start sm:items-end w-full sm:w-auto gap-2 sm:gap-0">
          <div className="flex flex-row items-center gap-2 sm:gap-[10px]">
            <img 
              src="/images/img_svg.svg" 
              alt="Calendar" 
              className="w-[24px] h-[24px]"
            />
            <span className="text-[13px] sm:text-[15px] font-inter font-normal leading-[18px] sm:leading-[20px] text-left text-global-3">
              Last Updated: 7/7/2025
            </span>
          </div>

          <div className="flex flex-row items-center gap-2 sm:gap-[10px] sm:ml-[36px]">
            <img 
              src="/images/img_svg_blue_gray_700.svg" 
              alt="Clock" 
              className="w-[24px] h-[24px]"
            />
            <span className="text-[14px] sm:text-[16px] font-inter font-normal leading-[18px] sm:leading-[20px] text-left text-global-3">
              06:27 AM
            </span>
          </div>

          <div className="flex flex-row items-center gap-2 sm:gap-[22px] sm:ml-[36px]">
            <img 
              src="/images/img_svg_blue_gray_700_24x24.svg" 
              alt="Settings" 
              className="w-[24px] h-[24px]"
            />
            <img 
              src="/images/img_button.svg" 
              alt="Notifications" 
              className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]"
            />
            
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
