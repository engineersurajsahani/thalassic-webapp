import React from 'react';
import PropTypes from 'prop-types';

const baseProps = (className, strokeWidth) => ({
  className,
  strokeWidth,
});

export const OverviewIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 3l9 7.5"/>
    <path d="M5.25 10.5V20.25h5.25v-6h3v6h5.25V10.5"/>
  </svg>
);

export const ProfileIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.5"/>
    <path d="M4.5 20c0-3.5 3.5-6 7.5-6s7.5 2.5 7.5 6"/>
  </svg>
);

export const DocumentIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3h7l4 4v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
    <path d="M15 3v5h5"/>
  </svg>
);

export const EducationIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4l9 5-9 5-9-5 9-5z"/>
    <path d="M5 10v5l7 4 7-4v-5"/>
  </svg>
);

export const TrainingIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v16H6.5A2.5 2.5 0 0 0 4 22V6.5z"/>
    <path d="M20 17H6.5A2.5 2.5 0 0 0 4 19.5"/>
  </svg>
);

export const SeaServiceIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="6" r="2"/>
    <path d="M12 8v9"/>
    <path d="M7 14a5 5 0 0 0 10 0"/>
    <path d="M3 17h4M17 17h4"/>
  </svg>
);

export const CalendarIcon = ({ className = 'w-6 h-6', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="17" rx="2"/>
    <path d="M8 2v4M16 2v4M3 9h18"/>
  </svg>
);

export const ClockIcon = ({ className = 'w-6 h-6', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v6l4 2"/>
  </svg>
);

export const SettingsIcon = ({ className = 'w-6 h-6', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
  </svg>
);

export const BellIcon = ({ className = 'w-8 h-8', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 16V11a6 6 0 10-12 0v5"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

// Dashboard and metric icons
export const SeaExperienceIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3 6 6 1-4.5 4.4L18 20l-6-3-6 3 1.5-6.6L3 9l6-1 3-6z"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

export const CertificationsIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <circle cx="9" cy="12" r="1"/>
    <circle cx="15" cy="12" r="1"/>
    <path d="M7 8h10M7 16h10"/>
  </svg>
);

export const DocumentsIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);

export const ProfileScoreIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

export const ActivityIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

// Form section icons
export const BasicDetailsIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <path d="M9 14h6M9 18h6"/>
  </svg>
);

export const PassportIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <circle cx="9" cy="10" r="2"/>
    <path d="M15 10a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2z"/>
  </svg>
);

export const IndosIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12l2 2 4-4"/>
    <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
    <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
    <path d="M12 3c0 1-1 2-2 2s-2 1-2 2 1 2 2 2 2 1 2 2 1-2 2-2 2-1 2-2-1-2-2-2-2-1-2-2z"/>
  </svg>
);

export const CdcIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

export const UploadIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export const SaveIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
);

export const NextIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
);

// Company and brand icons
export const CompanyIcon = ({ className = 'w-8 h-8', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3 6 6 1-4.5 4.4L18 20l-6-3-6 3 1.5-6.6L3 9l6-1 3-6z"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

// Admin Dashboard Icons
export const ArrowLeftIcon = ({ className = 'w-6 h-6', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12,19 5,12 12,5"/>
  </svg>
);

export const DollarSignIcon = ({ className = 'w-8 h-8', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

export const ExclamationTriangleIcon = ({ className = 'w-8 h-8', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export const CheckCircleIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);

export const EyeIcon = ({ className = 'w-4 h-4', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const PencilIcon = ({ className = 'w-4 h-4', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export const TrashIcon = ({ className = 'w-4 h-4', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
  </svg>
);

export const PlusIcon = ({ className = 'w-4 h-4', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export const FunnelIcon = ({ className = 'w-4 h-4', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
  </svg>
);

export const DownloadIcon = ({ className = 'w-4 h-4', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export const EnvelopeIcon = ({ className = 'w-4 h-4', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

export const UsersIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export const SearchIcon = ({ className = 'w-5 h-5', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
);

export const UserIcon = ({ className = 'w-4 h-4', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export const TagIcon = ({ className = 'w-4 h-4', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

export const ArrowRightIcon = ({ className = 'w-4 h-4', strokeWidth = 1.6 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...baseProps(className, strokeWidth)} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
);

// PropTypes for all icons
const iconPropTypes = {
  className: PropTypes.string,
  strokeWidth: PropTypes.number,
};

OverviewIcon.propTypes = ProfileIcon.propTypes = DocumentIcon.propTypes = 
EducationIcon.propTypes = TrainingIcon.propTypes = SeaServiceIcon.propTypes = 
CalendarIcon.propTypes = ClockIcon.propTypes = SettingsIcon.propTypes = 
BellIcon.propTypes = SeaExperienceIcon.propTypes = CertificationsIcon.propTypes = 
DocumentsIcon.propTypes = ProfileScoreIcon.propTypes = ActivityIcon.propTypes = 
BasicDetailsIcon.propTypes = PassportIcon.propTypes = IndosIcon.propTypes = 
CdcIcon.propTypes = UploadIcon.propTypes = SaveIcon.propTypes = 
NextIcon.propTypes = CompanyIcon.propTypes = ArrowLeftIcon.propTypes = 
DollarSignIcon.propTypes = ExclamationTriangleIcon.propTypes = CheckCircleIcon.propTypes = 
EyeIcon.propTypes = PencilIcon.propTypes = TrashIcon.propTypes = PlusIcon.propTypes = 
FunnelIcon.propTypes = DownloadIcon.propTypes = EnvelopeIcon.propTypes = UsersIcon.propTypes = 
SearchIcon.propTypes = UserIcon.propTypes = TagIcon.propTypes = ArrowRightIcon.propTypes = iconPropTypes;

export default {
  OverviewIcon,
  ProfileIcon,
  DocumentIcon,
  EducationIcon,
  TrainingIcon,
  SeaServiceIcon,
  CalendarIcon,
  ClockIcon,
  SettingsIcon,
  BellIcon,
  SeaExperienceIcon,
  CertificationsIcon,
  DocumentsIcon,
  ProfileScoreIcon,
  ActivityIcon,
  BasicDetailsIcon,
  PassportIcon,
  IndosIcon,
  CdcIcon,
  UploadIcon,
  SaveIcon,
  NextIcon,
  CompanyIcon,
  ArrowLeftIcon,
  DollarSignIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
  DownloadIcon,
  EnvelopeIcon,
  UsersIcon,
  SearchIcon,
  UserIcon,
  TagIcon,
  ArrowRightIcon,
};


