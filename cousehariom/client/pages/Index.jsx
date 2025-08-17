import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const courses = [
  // Basic Courses - Ordered as per image
  {
    id: 'bst',
    code: 'BST',
    name: 'Basic Safety Training',
    description: 'Basic Safety Training',
    duration: '5 Days',
    level: 'Entry Level',
    icon: '🎯',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹15,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Educational Certificates',
      'Experience Certificate'
    ]
  },
  {
    id: 'stsdsd',
    code: 'STSDSD',
    name: 'Ship to Ship Transfer & Dangerous Goods',
    description: 'Ship to Ship Transfer & Dangerous Goods',
    duration: '3 Days',
    level: 'Entry Level',
    icon: '🚢',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹12,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Previous Course Certificates',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'octco',
    code: 'OCTCO',
    name: 'Oil & Chemical Tanker Cargo Operations',
    description: 'Oil & Chemical Tanker Cargo Operations',
    duration: '5 Days',
    level: 'Entry Level',
    icon: '🎯',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹18,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Educational Certificates',
      'Previous Maritime Experience'
    ]
  },
  {
    id: 'gtfc',
    code: 'GTFC',
    name: 'Gas Tanker Familiarization Course',
    description: 'Gas Tanker Familiarization Course',
    duration: '3 Days',
    level: 'Entry Level',
    icon: '⛽',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹14,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Safety Training Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'pst',
    code: 'PST',
    name: 'Personal Survival Techniques',
    description: 'Personal Survival Techniques',
    duration: '2 Days',
    level: 'Entry Level',
    icon: '🏊',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹10,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Swimming Certificate',
      'Educational Certificates'
    ]
  },
  {
    id: 'efa',
    code: 'EFA',
    name: 'Personal Survival at Sea',
    description: 'Personal Survival at Sea',
    duration: '2 Days',
    level: 'Entry Level',
    icon: '🏊',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹10,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Swimming Certificate',
      'Educational Certificates'
    ]
  },
  {
    id: 'lgtf',
    code: 'LGTF',
    name: 'Gas Tanker Familiarization Course',
    description: 'Gas Tanker Familiarization Course',
    duration: '3 Days',
    level: 'Entry Level',
    icon: '⛽',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹14,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Safety Training Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'octf',
    code: 'OCTF',
    name: 'Training oil and Chemical Tanker',
    description: 'Training oil and Chemical Tanker',
    duration: '2 Days',
    level: 'Entry Level',
    icon: '🚢',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹13,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Safety Training Certificate',
      'Previous Maritime Experience'
    ]
  },
  {
    id: 'psf',
    code: 'PSF',
    name: 'Personal Survival at Sea',
    description: 'Personal Survival at Sea',
    duration: '2 Days',
    level: 'Entry Level',
    icon: '🏊',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹10,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Swimming Certificate',
      'Educational Certificates'
    ]
  },
  {
    id: 'fpff',
    code: 'FPFF',
    name: 'Fire Prevention and Fire Fighting',
    description: 'Fire Prevention and Fire Fighting',
    duration: '3 Days',
    level: 'Entry Level',
    icon: '🔥',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹12,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Educational Certificates',
      'Experience Certificate'
    ]
  },
  {
    id: 'pssr',
    code: 'PSSR',
    name: 'Personal Safety at Sea',
    description: 'Personal Safety at Sea',
    duration: '2 Days',
    level: 'Entry Level',
    icon: '🏊',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹10,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Swimming Certificate',
      'Educational Certificates'
    ]
  },
  {
    id: 'bpw',
    code: 'BPW',
    name: 'Training For Ship Operating in Polar Waters',
    description: 'Training For Ship Operating in Polar Waters',
    duration: '5 Days',
    level: 'Entry Level',
    icon: '❄️',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹22,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Safety Training Certificate',
      'Cold Weather Experience Certificate'
    ]
  },
  // Advanced Courses - Ordered as per image
  {
    id: 'mfa',
    code: 'MFA',
    name: 'Medical First Aid',
    description: 'Medical First Aid',
    duration: '3 Days',
    level: 'Intermediate',
    icon: '🏥',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹10,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Safety Training Certificate',
      'Educational Certificates'
    ]
  },
  {
    id: 'aff',
    code: 'AFF',
    name: 'Advanced Fire Fighting',
    description: 'Advanced Fire Fighting',
    duration: '3 Days',
    level: 'Intermediate',
    icon: '🔥',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹16,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Fire Fighting Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'chemco',
    code: 'CHEMCO/GASCO/TASCO',
    name: 'Chemical/Gas/Tanker Operations',
    description: 'Chemical/Gas/Tanker Operations',
    duration: '5 Days',
    level: 'Advanced',
    icon: '⚗️',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹30,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Tanker Experience Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'apw',
    code: 'APW',
    name: 'Training for Ship Operating',
    description: 'Training for Ship Operating',
    duration: '3 Days',
    level: 'Intermediate',
    icon: '🔥',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹18,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Ship Operating Experience',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'mfa2',
    code: 'MFA',
    name: 'Medical First Aid',
    description: 'Medical First Aid',
    duration: '3 Days',
    level: 'Intermediate',
    icon: '🏥',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹10,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Safety Training Certificate',
      'Educational Certificates'
    ]
  },
  {
    id: 'pfrb',
    code: 'PFRB',
    name: 'Proficiency in Fast Rescue Boat',
    description: 'Proficiency in Fast Rescue Boat',
    duration: '3 Days',
    level: 'Intermediate',
    icon: '🚤',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹18,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Fast Rescue Boat Experience',
      'Sea Service Certificate'
    ]
  },
  // Refresher Courses - Ordered as per image
  {
    id: 'rpst',
    code: 'RPST',
    name: 'Refresher Personal Safety Training',
    description: 'Refresher Personal Safety Training',
    duration: '1 Day',
    level: 'Renewal',
    icon: '🔄',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹8,000',
    documentsRequired: [
      'Passport Copy',
      'Previous Certificate (Expired)',
      'Medical Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'rfpff',
    code: 'RFPFF',
    name: 'Refresher Fire Prevention & Fire Fighting',
    description: 'Refresher Fire Prevention & Fire Fighting',
    duration: '1 Day',
    level: 'Renewal',
    icon: '🔥',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹6,000',
    documentsRequired: [
      'Passport Copy',
      'Previous FPFF Certificate (Expired)',
      'Medical Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'rpscrb',
    code: 'RPSCRB',
    name: 'Refresher Survival Craft & Rescue Boats',
    description: 'Refresher Survival Craft & Rescue Boats',
    duration: '1 Day',
    level: 'Renewal',
    icon: '🚤',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹7,000',
    documentsRequired: [
      'Passport Copy',
      'Previous PSCRB Certificate (Expired)',
      'Medical Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'raff',
    code: 'RAFF',
    name: 'Refresher Advanced Fire Fighting',
    description: 'Refresher Advanced Fire Fighting',
    duration: '1 Day',
    level: 'Renewal',
    icon: '🔥',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹8,000',
    documentsRequired: [
      'Passport Copy',
      'Previous AFF Certificate (Expired)',
      'Medical Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'amfa',
    code: 'AMFA',
    name: 'Advanced Medical First Aid',
    description: 'Advanced Medical First Aid',
    duration: '2 Days',
    level: 'Advanced',
    icon: '🏥',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹12,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Previous MFA Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'rmedicare',
    code: 'R-MEDICARE',
    name: 'Refresher Medical Care',
    description: 'Refresher Medical Care',
    duration: '2 Days',
    level: 'Renewal',
    icon: '⚕️',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹12,000',
    documentsRequired: [
      'Passport Copy',
      'Previous Medicare Certificate (Expired)',
      'Medical Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'ruce',
    code: 'RUC - Engineers',
    name: 'Refresher Updating Course for Engineers',
    description: 'Refresher Updating Course for Engineers',
    duration: '5 Days',
    level: 'Professional',
    icon: '⚙️',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹30,000',
    documentsRequired: [
      'Passport Copy',
      'Engineering Certificate',
      'Sea Service Certificate',
      'Previous RUC Certificate'
    ]
  },
  {
    id: 'rucd',
    code: 'RUC - Deck',
    name: 'Refresher Updating Course for Deck Officers',
    description: 'Refresher Updating Course for Deck Officers',
    duration: '5 Days',
    level: 'Professional',
    icon: '🧭',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹30,000',
    documentsRequired: [
      'Passport Copy',
      'Deck Officer Certificate',
      'Sea Service Certificate',
      'Previous RUC Certificate'
    ]
  },
  {
    id: 'rfrb',
    code: 'R-FRB',
    name: 'Refresher Fast Rescue Boat',
    description: 'Refresher Fast Rescue Boat',
    duration: '1 Day',
    level: 'Renewal',
    icon: '🚁',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹7,000',
    documentsRequired: [
      'Passport Copy',
      'Previous FRB Certificate (Expired)',
      'Medical Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'rucdm',
    code: 'RUCDM',
    name: 'Refresher Updating Course for Deck Officers Management',
    description: 'Refresher Updating Course for Deck Officers Management',
    duration: '5 Days',
    level: 'Professional',
    icon: '🧭',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹30,000',
    documentsRequired: [
      'Passport Copy',
      'Deck Officer Certificate',
      'Management Experience',
      'Previous RUC Certificate'
    ]
  },
  {
    id: 'rucdo',
    code: 'RUCDO',
    name: 'Refresher Updating Course for Deck Officers Operational level',
    description: 'Refresher Updating Course for Deck Officers Operational level',
    duration: '5 Days',
    level: 'Professional',
    icon: '🧭',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹30,000',
    documentsRequired: [
      'Passport Copy',
      'Deck Officer Certificate',
      'Operational Experience',
      'Previous RUC Certificate'
    ]
  },
  {
    id: 'rucm',
    code: 'RUCM',
    name: 'Refresher Updating Course for Engineers -Management Level',
    description: 'Refresher Updating Course for Engineers -Management Level',
    duration: '5 Days',
    level: 'Professional',
    icon: '🧭',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹30,000',
    documentsRequired: [
      'Passport Copy',
      'Engineering Certificate',
      'Management Experience',
      'Previous RUC Certificate'
    ]
  },
  {
    id: 'ruco',
    code: 'RUCO',
    name: 'Refresher Updating Course for Engineers -Operational Level',
    description: 'Refresher Updating Course for Engineers -Operational Level',
    duration: '5 Days',
    level: 'Professional',
    icon: '🧭',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹30,000',
    documentsRequired: [
      'Passport Copy',
      'Engineering Certificate',
      'Operational Experience',
      'Previous RUC Certificate'
    ]
  },
  {
    id: 'rmfa',
    code: 'RMFA',
    name: 'Refresher Medical First Aid',
    description: 'Refresher Medical First Aid',
    duration: '1 Day',
    level: 'Renewal',
    icon: '🏥',
    category: 'refresher',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹5,000',
    documentsRequired: [
      'Passport Copy',
      'Previous MFA Certificate (Expired)',
      'Medical Certificate',
      'Sea Service Certificate'
    ]
  },
  // Additional Courses
  {
    id: 'lgtf',
    code: 'LGTF',
    name: 'Gas Tanker Familiarization Course',
    description: 'Gas Tanker Familiarization Course',
    duration: '3 Days',
    level: 'Entry Level',
    icon: '⛽',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹14,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Safety Training Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'fpff',
    code: 'FPFF',
    name: 'Fire Prevention and Fire Fighting',
    description: 'Fire Prevention and Fire Fighting',
    duration: '3 Days',
    level: 'Entry Level',
    icon: '🔥',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹12,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Educational Certificates',
      'Experience Certificate'
    ]
  },
  {
    id: 'pst',
    code: 'PST',
    name: 'Personal Survival Techniques',
    description: 'Personal Survival Techniques',
    duration: '2 Days',
    level: 'Entry Level',
    icon: '🏊',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹10,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Swimming Certificate',
      'Educational Certificates'
    ]
  },
  {
    id: 'octf',
    code: 'OCTF',
    name: 'Training oil and Chemical Tanker',
    description: 'Training oil and Chemical Tanker',
    duration: '2 Days',
    level: 'Entry Level',
    icon: '🚢',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹13,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Safety Training Certificate',
      'Previous Maritime Experience'
    ]
  },
  {
    id: 'bpw',
    code: 'BPW',
    name: 'Training For Ship Operating in Polar Waters',
    description: 'Training For Ship Operating in Polar Waters',
    duration: '5 Days',
    level: 'Entry Level',
    icon: '❄️',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹22,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Safety Training Certificate',
      'Cold Weather Experience Certificate'
    ]
  },
  {
    id: 'efa',
    code: 'EFA',
    name: 'Personal Survival at Sea',
    description: 'Personal Survival at Sea',
    duration: '2 Days',
    level: 'Entry Level',
    icon: '🏊',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹10,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Swimming Certificate',
      'Educational Certificates'
    ]
  },
  {
    id: 'psf',
    code: 'PSF',
    name: 'Personal Survival at Sea',
    description: 'Personal Survival at Sea',
    duration: '2 Days',
    level: 'Entry Level',
    icon: '🏊',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹10,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Swimming Certificate',
      'Educational Certificates'
    ]
  },
  {
    id: 'pssr',
    code: 'PSSR',
    name: 'Personal Safety at Sea',
    description: 'Personal Safety at Sea',
    duration: '2 Days',
    level: 'Entry Level',
    icon: '🏊',
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹10,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Swimming Certificate',
      'Educational Certificates'
    ]
  },
  {
    id: 'pscrb',
    code: 'PSCRB',
    name: 'Proficiency in Survival Craft & Rescue Boats',
    description: 'Proficiency in Survival Craft & Rescue Boats',
    duration: '3 Days',
    level: 'Intermediate',
    icon: '🚤',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹18,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic Safety Training Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'medicare',
    code: 'MEDICARE',
    name: 'Medical Care on Board Ships',
    description: 'Medical Care on Board Ships',
    duration: '5 Days',
    level: 'Advanced',
    icon: '⚕️',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹25,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Medical First Aid Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'sso',
    code: 'SSO',
    name: 'Ship Security Officer',
    description: 'Ship Security Officer',
    duration: '3 Days',
    level: 'Advanced',
    icon: '🔒',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹20,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Security Training Background',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'frb',
    code: 'FRB',
    name: 'Fast Rescue Boat',
    description: 'Fast Rescue Boat',
    duration: '2 Days',
    level: 'Advanced',
    icon: '🚁',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    fees: '₹15,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Boat Handling Experience',
      'Swimming Certificate'
    ]
  },
  // Additional Specialized Courses - Ordered as per image
  {
    id: 'bigf',
    code: 'B-IGF',
    name: 'Basic IGF Code Training',
    description: 'Basic IGF Code Training',
    duration: '3 Days',
    level: 'Specialized',
    icon: '⛽',
    category: 'additional',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹20,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Gas Tanker Experience Certificate',
      'Basic Safety Training Certificate'
    ]
  },
  {
    id: 'aigf',
    code: 'A-IGF',
    name: 'Advanced IGF Code Training',
    description: 'Advanced IGF Code Training',
    duration: '5 Days',
    level: 'Advanced',
    icon: '⛽',
    category: 'additional',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹35,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Basic IGF Certificate',
      'Advanced Gas Tanker Experience'
    ]
  },
  {
    id: 'vict',
    code: 'VICT',
    name: 'Vessel Inspection & Cargo Technology',
    description: 'Vessel Inspection & Cargo Technology',
    duration: '3 Days',
    level: 'Technical',
    icon: '🔍',
    category: 'additional',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹22,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Technical Background Certificate',
      'Sea Service Certificate'
    ]
  },
  {
    id: 'pssc',
    code: 'PSSC',
    name: 'Port State Security Course',
    description: 'Port State Security Course',
    duration: '2 Days',
    level: 'Security',
    icon: '🔒',
    category: 'additional',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹16,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Security Training Background',
      'Port Experience Certificate'
    ]
  },
  {
    id: 'cso',
    code: 'CSO',
    name: 'Company Security Officer',
    description: 'Company Security Officer',
    duration: '5 Days',
    level: 'Management',
    icon: '🏢',
    category: 'additional',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹28,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Management Experience Certificate',
      'Security Training Background'
    ]
  },
  {
    id: 'hvs',
    code: 'HVS',
    name: 'High Voltage Safety',
    description: 'High Voltage Safety',
    duration: '2 Days',
    level: 'Safety',
    icon: '⚡',
    category: 'additional',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹18,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Electrical Engineering Background',
      'Safety Training Certificate'
    ]
  },
  {
    id: 'mbs',
    code: 'MBS',
    name: 'Maritime Bridge Simulation',
    description: 'Maritime Bridge Simulation',
    duration: '5 Days',
    level: 'Simulation',
    icon: '🌉',
    category: 'additional',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    fees: '₹35,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Navigation Officer Certificate',
      'Bridge Experience Certificate'
    ]
  },
  {
    id: 'etoeto',
    code: 'EO TO ETO-BETO',
    name: 'Electrical Officer to Electro-Technical Officer Bridge',
    description: 'Electrical Officer to Electro-Technical Officer Bridge',
    duration: '10 Days',
    level: 'Bridge',
    icon: '🔌',
    category: 'additional',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    fees: '₹45,000',
    documentsRequired: [
      'Passport Copy',
      'Medical Certificate',
      'Electrical Officer Certificate',
      'Sea Service Certificate'
    ]
  }
];

const getCategoryColor = (category) => {
  switch (category) {
    case 'basic':
      return 'bg-gradient-to-r from-[#10B981] to-[#059669]';
    case 'advanced':
      return 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]';
    case 'refresher':
      return 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]';
    case 'additional':
      return 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]';
    default:
      return 'bg-gradient-to-r from-[#10B981] to-[#059669]';
  }
};

const getCategoryLabel = (category) => {
  switch (category) {
    case 'basic':
      return 'Basic';
    case 'advanced':
      return 'Advanced';
    case 'refresher':
      return 'Refresher';
    case 'additional':
      return 'Additional';
    default:
      return 'Basic';
  }
};


const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { 
      icon: '/home.png',
      text: 'Home', 
      active: true 
    },
    { 
      icon: '/courese.png',
      text: 'Courses', 
      active: false 
    },
    { 
      icon: '/services.png',
      text: 'Services', 
      active: false
    },
    {
      icon: '/blog.png',
      text: 'Blogs',
      active: false
    },
    {
      icon: '/about.png',
      text: 'About us',
      active: false
    },
    {
      icon: '/contact.png',
      text: 'Contact',
      active: false
    },
    {
      icon: '/logout.png',
      text: 'Login',
      active: false
    },
    {
      icon: '/register.png',
      text: 'Register',
      active: false
    }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar} />
      )}
      <div className={`fixed top-0 left-0 h-full w-[300px] transform transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`} style={{
        background: 'rgba(0, 0, 0, 0.36)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div className="p-4 flex justify-end border-b border-white border-opacity-10">
          <button 
            onClick={toggleSidebar}
            className="text-white text-3xl p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
          >
            ×
          </button>
        </div>
        <nav className="py-4">
          <ul className="list-none p-0 m-0">
            {menuItems.map((item, index) => (
              <li key={index} className="m-0">
                <a 
                  href={`#${item.text.toLowerCase().replace(' ', '')}`}
                  className={`flex items-center px-6 py-4 text-white no-underline transition-all duration-300 border-r-3 ${
                    item.active 
                      ? 'bg-white bg-opacity-10 border-r-[3px] border-[#00bcd4]' 
                      : 'border-r-[3px] border-transparent hover:bg-white hover:bg-opacity-5 hover:pl-8'
                  }`}
                >
                  <img 
                    src={item.icon} 
                    alt={item.text} 
                    className="w-6 h-6 mr-4 brightness-0 invert transition-all duration-300"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <span className="text-base font-normal tracking-wide">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

const Header = ({ toggleSidebar, currentTime, formatTime, formatDate }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-[120px] bg-white flex items-center justify-between px-8 z-30 border-b border-gray-100 shadow-sm">
      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleSidebar}
          className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 1.95768C0 1.38633 0.220785 0.917936 0.662356 0.552502C1.10045 0.184167 1.66198 0 2.34693 0H30.5101C31.1951 0 31.7566 0.184167 32.1947 0.552502C32.6363 0.917936 32.857 1.38633 32.857 1.95768C32.857 2.52904 32.6363 2.99743 32.1947 3.36286C31.7566 3.7312 31.1951 3.91536 30.5101 3.91536H2.34693C1.66198 3.91536 1.10045 3.7312 0.662356 3.36286C0.220785 2.99743 0 2.52904 0 1.95768ZM0 11.7461C0 11.1747 0.220785 10.7063 0.662356 10.3409C1.10045 9.97258 1.66198 9.78841 2.34693 9.78841H30.5101C31.1951 9.78841 31.7566 9.97258 32.1947 10.3409C32.6363 10.7063 32.857 11.1747 32.857 11.7461C32.857 12.3174 32.6363 12.7858 32.1947 13.1513C31.7566 13.5196 31.1951 13.7038 30.5101 13.7038H2.34693C1.66198 13.7038 1.10045 13.5196 0.662356 13.1513C0.220785 12.7858 0 12.3174 0 11.7461ZM32.857 21.5345C32.857 22.1059 32.6363 22.5742 32.1947 22.9397C31.7566 23.308 31.1951 23.4922 30.5101 23.4922H2.34693C1.66198 23.4922 1.10045 23.308 0.662356 22.9397C0.220785 22.5742 0 22.1059 0 21.5345C0 20.9632 0.220785 20.4948 0.662356 20.1293C1.10045 19.761 1.66198 19.5768 2.34693 19.5768H30.5101C31.1951 19.5768 31.7566 19.761 32.1947 20.1293C32.6363 20.4948 32.857 20.9632 32.857 21.5345Z" fill="#243F42"/>
          </svg>
        </button>
        <div className="flex items-center space-x-4">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/d36f89b966d2ba0f2b29fcae06d07532d8c2fb65?width=212"
            alt="Logo"
            className="w-[80px] h-[60px]"
          />
          <h1 className="text-3xl font-semibold text-[#243F42] font-josefin tracking-wide">
            Hari Om Thalassic
          </h1>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        {/* Real-time Clock */}
        <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full">
          <div className="w-8 h-8 rounded-full border-2 border-[#64748B] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#64748B" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="#64748B" strokeWidth="2"/>
            </svg>
          </div>
          <span className="text-lg font-medium text-[#64748B]">
            {formatTime(currentTime)}
          </span>
        </div>
        <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-[#528A91] to-[#2A464B] flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white">
          RK
        </div>
      </div>
    </header>
  );
};

const Bubble = ({ size, left, delay, duration }) => {
  return (
    <div 
      className="absolute rounded-full bg-white/10 backdrop-blur-sm"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        bottom: '-100px',
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
};

const BubbleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary large bubble - top right, framing the content */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-60 transform rotate-[25deg]"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.1) 25%, transparent 50%), radial-gradient(circle at 20% 60%, #243F42 0%, #1B2D30 40%, #0F1C1E 80%, transparent 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 4px 16px rgba(255, 255, 255, 0.2), inset 0 -2px 8px rgba(0, 0, 0, 0.1)',
          top: '-150px',
          right: '-100px',
          filter: 'blur(0.5px)'
        }}
      />

      {/* Secondary medium bubble - left side, smaller and more subtle */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-50 transform rotate-[-15deg]"
        style={{
          background: 'radial-gradient(circle at 40% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%), radial-gradient(circle at 60% 70%, #396369 0%, #294146 50%, #1A2E31 90%, transparent 100%)',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08), inset 0 3px 12px rgba(255, 255, 255, 0.15), inset 0 -1px 6px rgba(0, 0, 0, 0.08)',
          top: '200px',
          left: '-80px',
          filter: 'blur(0.3px)'
        }}
      />

      {/* Accent small bubble - bottom right */}
      <div
        className="absolute w-[180px] h-[180px] rounded-full opacity-40 transform rotate-[45deg]"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%), radial-gradient(circle at 30% 70%, #64B5F6 0%, #42A5F5 60%, #2196F3 90%, transparent 100%)',
          boxShadow: '0 4px 16px rgba(100, 181, 246, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.3)',
          bottom: '100px',
          right: '150px'
        }}
      />

      {/* Very subtle accent bubble - top left */}
      <div
        className="absolute w-[120px] h-[120px] rounded-full opacity-30 transform rotate-[-30deg]"
        style={{
          background: 'radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%), radial-gradient(circle at 40% 60%, #528A91 0%, #2A464B 70%, transparent 100%)',
          boxShadow: '0 3px 12px rgba(82, 138, 145, 0.15), inset 0 1px 6px rgba(255, 255, 255, 0.2)',
          top: '50px',
          left: '200px'
        }}
      />

      {/* Floating particles for depth */}
      <div className="absolute top-[30%] left-[15%] w-3 h-3 rounded-full bg-white/20 animate-pulse"></div>
      <div className="absolute top-[60%] right-[25%] w-2 h-2 rounded-full bg-blue-200/30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-[40%] left-[70%] w-4 h-4 rounded-full bg-teal-100/25 animate-pulse delay-2000"></div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[700px] bg-gradient-to-br from-slate-50 via-white to-gray-50 flex flex-col items-center justify-center px-8 py-24">
      <BubbleBackground />
      <div className="relative z-10 max-w-5xl text-center">
        <div className="inline-flex items-center px-8 py-4 mb-16 rounded-full bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
          <span className="text-sm font-bold tracking-widest uppercase font-josefin">Training Programs</span>
          <div className="w-2 h-2 bg-white rounded-full ml-3 animate-pulse delay-500"></div>
        </div>
        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold mb-12 font-josefin leading-tight">
          <span className="bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31] bg-clip-text text-transparent">
            Maritime Training
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#528A91] via-[#64B5F6] to-[#42A5F5] bg-clip-text text-transparent">
            Excellence
          </span>
        </h1>
        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-xl lg:text-2xl text-[#64748B] leading-relaxed font-inter font-medium">
            Comprehensive STCW certified courses for seafarers at all levels
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#64B5F6] to-[#42A5F5] mx-auto mt-8 rounded-full"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="px-8 py-4 bg-gradient-to-r from-[#243F42] to-[#2A464B] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-josefin tracking-wide">
            Explore Courses
          </button>
          <button className="px-8 py-4 border-2 border-[#243F42] text-[#243F42] font-semibold rounded-full hover:bg-[#243F42] hover:text-white transition-all duration-300 font-josefin tracking-wide">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

const CourseModal = ({ course }) => {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-[#243F42] mb-4">
          {course.name} ({course.code})
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image and Course Info */}
        <div className="space-y-6">
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={course.image} 
              alt={course.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 right-4">
              <div className={`px-4 py-2 rounded-[20px] ${getCategoryColor(course.category)}`}>
                <span className="text-white text-xs font-semibold uppercase tracking-wider">
                  {getCategoryLabel(course.category)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#243F42]">Course Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F1F5F9] rounded-lg p-4">
                <span className="text-[#64748B] text-sm font-medium block">Duration</span>
                <span className="text-[#243F42] font-semibold">{course.duration}</span>
              </div>
              <div className="bg-[#F1F5F9] rounded-lg p-4">
                <span className="text-[#64748B] text-sm font-medium block">Level</span>
                <span className="text-[#243F42] font-semibold">{course.level}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#243F42] to-[#2A464B] rounded-lg p-6 text-center">
              <span className="text-white text-sm font-medium block mb-2">Course Fees</span>
              <span className="text-white text-3xl font-bold">{course.fees}</span>
            </div>
          </div>
        </div>
        
        {/* Right Column - Documents Required */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-[#243F42] mb-4">Documents Required</h3>
            <div className="space-y-3">
              {course.documentsRequired.map((doc, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  <span className="text-[#475569] font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#0369A1] mb-3">Important Notes</h4>
            <ul className="space-y-2 text-[#0369A1] text-sm">
              <li>• All documents must be original or certified copies</li>
              <li>• Medical certificate should be valid and recent</li>
              <li>• Course fees include training materials and certification</li>
              <li>• Registration closes 3 days before course start date</li>
            </ul>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-[#243F42] to-[#2A464B] text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300">
              Enroll Now
            </button>
            <button className="flex-1 border-2 border-[#243F42] text-[#243F42] font-semibold py-3 px-6 rounded-lg hover:bg-[#243F42] hover:text-white transition-all duration-300">
              Download Brochure
            </button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

const CourseCard = ({ course }) => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white rounded-[20px] border border-[rgba(100,181,246,0.10)] shadow-[0_10px_40px_0_rgba(0,0,0,0.08)] p-6 h-[334px] relative overflow-hidden cursor-pointer hover:shadow-[0_15px_50px_0_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-[#243F42] via-[#1A2E31] to-[#64B5F6]"></div>
          <div className="flex items-start justify-between mb-6">
            <div className="w-[37px] h-[77px] bg-gradient-to-br from-[rgba(36,63,66,0.10)] to-[rgba(100,181,246,0.10)] rounded-[12px] flex items-center justify-center">
              <span className="text-2xl">{course.icon}</span>
            </div>
            <div className={`px-4 py-2 rounded-[20px] ${getCategoryColor(course.category)}`}>
              <span className="text-white text-xs font-semibold uppercase tracking-wider">
                {getCategoryLabel(course.category)}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#243F42] mb-4">
            {course.code}
          </h3>
          <p className="text-[#64748B] text-base mb-8 leading-relaxed">
            {course.description}
          </p>
          <div className="flex gap-3 mt-auto">
            <div className="bg-[#F1F5F9] rounded-lg px-3 py-2">
              <span className="text-[#64748B] text-sm font-medium">
                ⏱️ {course.duration}
              </span>
            </div>
            <div className="bg-[#F1F5F9] rounded-lg px-3 py-2">
              <span className="text-[#64748B] text-sm font-medium">
                {course.level}
              </span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <CourseModal course={course} />
    </Dialog>
  );
};

const CourseSection = ({ title, subtitle, icon, courses, bgGradient }) => {
  return (
    <div className="mb-16">
      <div className={`w-full h-[194px] rounded-[20px] ${bgGradient} shadow-[0_10px_40px_0_rgba(36,63,66,0.20)] flex items-center px-8 mb-8`}>
        <div className="bg-gradient-to-br from-[rgba(100,181,246,0.20)] to-[rgba(66,165,245,0.20)] backdrop-blur-[5px] rounded-[15px] w-[96px] h-[96px] flex items-center justify-center mr-8">
          <span className="text-4xl text-white">{icon}</span>
        </div>
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">{title}</h2>
          <p className="text-white/90 text-lg">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const basicCourses = courses.filter(course => course.category === 'basic');
  const advancedCourses = courses.filter(course => course.category === 'advanced');
  const refresherCourses = courses.filter(course => course.category === 'refresher');
  const additionalCourses = courses.filter(course => course.category === 'additional');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Header 
        toggleSidebar={toggleSidebar} 
        currentTime={currentTime} 
        formatTime={formatTime} 
        formatDate={formatDate} 
      />
      <div className="pt-[120px]">
        <HeroSection />
      
        <main className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <CourseSection
              title="Basic Courses - DGS Approved"
              subtitle="Essential foundation courses for maritime careers"
              icon="🎯"
              courses={basicCourses}
              bgGradient="bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31]"
            />
            
            <CourseSection
              title="Advanced Courses - DGS Approved"
              subtitle="Specialized training for experienced maritime professionals"
              icon="🔥"
              courses={advancedCourses}
              bgGradient="bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31]"
            />
            
            <CourseSection
              title="Refresher Courses - DGS Approved"
              subtitle="Update and renew your maritime certifications"
              icon="🔄"
              courses={refresherCourses}
              bgGradient="bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31]"
            />
            
            <CourseSection
              title="Additional Courses - DGS Approved"
              subtitle="Specialized maritime training programs"
              icon="⚡"
              courses={additionalCourses}
              bgGradient="bg-gradient-to-r from-[#243F42] via-[#2A464B] to-[#1A2E31]"
            />
          </div>
        </main>
        
        <SeaServiceSection />
        <Footer />
      </div>
    </div>
  );
};

const SeaServiceSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-[#243F42] to-[#1A2E31] text-white">
            <span className="text-sm font-semibold tracking-wider uppercase">Experience Requirements</span>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#243F42] to-[#1A2E31] bg-clip-text text-transparent">
            Sea Service Experience
          </h2>
          <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
            Master Checker approved sea service experience requirements for maritime certifications
          </p>
        </div>

        {/* Master Checker Notice */}
        <div className="w-full h-[186px] rounded-[20px] bg-gradient-to-r from-[#294146] via-[#48848C] to-[#0F1C1E] shadow-[0_10px_40px_0_rgba(36,63,66,0.20)] flex items-center px-12 mb-12">
          <div className="bg-gradient-to-br from-[rgba(100,181,246,0.20)] to-[rgba(66,165,245,0.20)] backdrop-blur-[5px] rounded-[20px] w-[125px] h-[125px] flex items-center justify-center mr-12">
            <span className="text-5xl text-white">⚓</span>
          </div>
          <div>
            <h3 className="text-white text-3xl font-bold mb-4">Master Checker Approved Experience Only</h3>
            <p className="text-white/90 text-lg leading-relaxed max-w-4xl">
              All sea service experience must be verified and approved by Master Checker for certification purposes. Ensure your experience meets DGS standards.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Documentation Requirements */}
          <div className="bg-white rounded-[20px] border border-[rgba(100,181,246,0.10)] shadow-[0_10px_40px_0_rgba(0,0,0,0.08)] p-8">
            <div className="flex items-center mb-8">
              <div className="w-[78px] h-[78px] bg-gradient-to-br from-[rgba(36,63,66,0.10)] to-[rgba(100,181,246,0.10)] rounded-[12px] flex items-center justify-center mr-6">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold text-[#243F42]">Required Documentation</h3>
            </div>

            <div className="space-y-6">
              {[
                { icon: '📄', title: 'RPSL Details', desc: 'Record of Professional Service at Sea Name & Number' },
                { icon: '🚢', title: 'Vessel Information', desc: 'Name, Type, IMO Number, and specifications' },
                { icon: '👨‍✈️', title: 'Service Details', desc: 'Rank served, sign-on/off dates, duration' },
                { icon: '🏢', title: 'Company Reference', desc: 'Company details and designated person contact' }
              ].map((item, index) => (
                <div key={index} className="bg-[#F8FAFC] border-l-4 border-[#64B5F6] rounded-[12px] p-6">
                  <div className="flex items-start">
                    <div className="w-[47px] h-[47px] bg-gradient-to-br from-[#64B5F6] to-[#42A5F5] rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white text-lg">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#243F42] mb-2">{item.title}</h4>
                      <p className="text-sm text-[#64748B]">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Form */}
          <div className="bg-gradient-to-br from-[#F8FAFC] to-white border border-[rgba(100,181,246,0.10)] rounded-[20px] p-8">
            <h3 className="text-2xl font-bold text-[#243F42] mb-4">Sea Service Record Format</h3>
            <p className="text-[#64748B] mb-8">Sample format for documenting sea service experience</p>

            <div className="space-y-6">
              {[
                { label: 'RPSL Name & Number', placeholder: 'Enter RPSL details' },
                { label: 'Vessel Name & IMO', placeholder: 'Vessel identification' },
                { label: 'Rank & Duration', placeholder: 'Position and service period' },
                { label: 'Company Reference', placeholder: 'Contact information' }
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-[#243F42] mb-2">{field.label}</label>
                  <div className="w-full h-[62px] bg-white border-2 border-[#E2E8F0] rounded-[10px] px-4 flex items-center">
                    <span className="text-[#94A3B8] italic">{field.placeholder}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#243F42] via-[#1A2E31] to-[#0F1C1E] text-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 mr-6 flex-shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="Hari Om Thalassic Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-white font-josefin leading-tight">Hari Om Thalassic</h3>
                  <p className="text-[#64B5F6] text-base font-medium mt-1">Maritime Training Institute</p>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed text-sm max-w-sm">
                Professional maritime education and training services approved by DGS India. Building careers at sea since 2009.
              </p>
              <div className="flex space-x-4 mt-6">
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="white"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="white"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 font-josefin">Quick Links</h4>
              <div className="space-y-3">
                {[
                  { 
                    name: 'Training Courses', 
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="white"/>
                    </svg>
                  },
                  { 
                    name: 'Sea Service', 
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.32-.42-.58-.5L20 10.62V6c0-.55-.45-1-1-1h-1V3c0-.55-.45-1-1-1h-10c-.55 0-1 .45-1 1v2H5c-.55 0-1 .45-1 1v4.62L2.7 11.04c-.26.08-.46.26-.58.5s-.14.52-.06.78L3.95 19z" fill="white"/>
                    </svg>
                  },
                  { 
                    name: 'Contact Us', 
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="white"/>
                    </svg>
                  },
                  { 
                    name: 'About Institute', 
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="white"/>
                    </svg>
                  }
                ].map((link) => (
                  <a key={link.name} href="#" className="flex items-center text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 group">
                    <span className="mr-3 group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span className="text-sm">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Course Categories */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 font-josefin">Course Categories</h4>
              <div className="space-y-3">
                {[
                  { name: 'Basic Courses', color: 'bg-green-500/20 text-green-300' },
                  { name: 'Advanced Training', color: 'bg-orange-500/20 text-orange-300' },
                  { name: 'Refresher Courses', color: 'bg-purple-500/20 text-purple-300' },
                  { name: 'Specialized Programs', color: 'bg-red-500/20 text-red-300' }
                ].map((category) => (
                  <a key={category.name} href="#" className="block group">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${category.color} hover:scale-105 transition-all`}>
                      {category.name}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 font-josefin">Get In Touch</h4>
              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-[#64B5F6]/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-[#64B5F6]/30 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Email</p>
                    <p className="text-white/70 text-sm">info@hariomthalassic.com</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-[#64B5F6]/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-[#64B5F6]/30 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Phone</p>
                    <p className="text-white/70 text-sm">+91 XXX XXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-10 h-10 bg-[#64B5F6]/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-[#64B5F6]/30 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Location</p>
                    <p className="text-white/70 text-sm">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#64B5F6] to-[#42A5F5] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">©</span>
              </div>
              <p className="text-white/80 text-sm">
                2024 Hari Om Thalassic. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              {[
                { name: 'Privacy Policy', icon: '🔒' },
                { name: 'Terms of Service', icon: '📋' },
                { name: 'DGS Approval', icon: '✅' }
              ].map((link) => (
                <a key={link.name} href="#" className="flex items-center text-white/60 hover:text-white text-sm transition-colors group">
                  <span className="mr-2 group-hover:scale-110 transition-transform">{link.icon}</span>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Index;
