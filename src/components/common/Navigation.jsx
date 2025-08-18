import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { OverviewIcon, ProfileIcon, DocumentIcon, EducationIcon, TrainingIcon, SeaServiceIcon } from '../ui/Icons';

const Navigation = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', Icon: OverviewIcon, path: '/overview' },
    { name: 'Profile', Icon: ProfileIcon, path: '/profile' },
    { name: 'Document', Icon: DocumentIcon, path: '/document' },
    { name: 'Education', Icon: EducationIcon, path: '/education' },
    { name: 'Training', Icon: TrainingIcon, path: '/training' },
    { name: 'Sea Service', Icon: SeaServiceIcon, path: '/sea-service' }
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === '/overview' && location.pathname === '/');
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className={`bg-global-10 rounded-[24px] p-4 sm:p-5 lg:p-[24px] ${className}`}>
      <div className="flex flex-col gap-4 lg:gap-[20px]">
        {menuItems?.map((item, index) => (
          <button
            key={index}
            onClick={() => handleMenuClick(item.path)}
            className={`flex flex-row items-center gap-3 lg:gap-[16px] p-3 lg:p-[16px] rounded-[18px] transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-[linear-gradient(90deg,#284146_0%,#386269_50%,#49848c_100%)]'
                : 'bg-global-10 hover:bg-gray-50'
            }`}
          >
            <div className={`flex items-center justify-center w-[28px] h-[28px] lg:w-[32px] lg:h-[32px] rounded-[6px] bg-global-3`}>
              {item?.Icon ? (
                <item.Icon className="w-[16px] h-[16px] lg:w-[20px] lg:h-[20px] text-global-1" />
              ) : null}
            </div>
            <span className={`text-[20px] sm:text-[22px] lg:text-[24px] font-josefin font-medium leading-[22px] lg:leading-[25px] ${
              isActive(item.path) ? 'text-global-5' : 'text-global-1'
            }`}>
              {item?.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

Navigation.propTypes = {
  className: PropTypes.string,
};

export default Navigation;
