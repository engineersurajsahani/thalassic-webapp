import { NavItem } from './navigation';

export const masterSidebarItems: NavItem[] = [
  { label: 'Overview', href: '/master/dashboard', icon: 'LayoutDashboard' },
  { label: 'Courses', href: '/master/courses', icon: 'BookOpen' },
  { label: 'Seafarers', href: '/master/seafarers', icon: 'Users' },
  { label: 'Agent Admins', href: '/master/agent-admins', icon: 'UserCheck' },
  { label: 'Company Admins', href: '/master/company-admins', icon: 'Building2' },
  { label: 'Institutes', href: '/master/institutes', icon: 'GraduationCap' },
  { label: 'Finance & Invoices', href: '/master/finance', icon: 'Receipt' },
  { label: 'Reports', href: '/master/reports', icon: 'BarChart3' },
  { label: 'Settings', href: '/master/settings', icon: 'Settings' },
];

export const seafarerSidebarItems: NavItem[] = [
  { label: 'Dashboard', href: '/seafarer/dashboard', icon: 'LayoutDashboard' },
  { label: 'Browse Courses', href: '/seafarer/browse-courses', icon: 'Compass' },
  { label: 'My Courses', href: '/seafarer/my-courses', icon: 'BookMarked' },
  { label: 'My Documents', href: '/seafarer/documents', icon: 'FileText' },
  { label: 'Profile & Sea Service', href: '/seafarer/profile', icon: 'User' },
  { label: 'Purchase History', href: '/seafarer/purchase-history', icon: 'Receipt' },
  { label: 'Referral Rewards', href: '/seafarer/referral-dashboard', icon: 'Gift' },
  { label: 'Support Tickets', href: '/seafarer/support', icon: 'HelpCircle' },
];

export const agentSidebarItems: NavItem[] = [
  { label: 'Dashboard', href: '/agent/dashboard', icon: 'LayoutDashboard' },
  { label: 'Referral Center', href: '/agent/referral-center', icon: 'Share2' },
  { label: 'Referral Leads', href: '/agent/referral-leads', icon: 'UserPlus' },
  { label: 'Referred Purchases', href: '/agent/referred-purchases', icon: 'ShoppingCart' },
  { label: 'Commissions', href: '/agent/commissions', icon: 'DollarSign' },
  { label: 'Invoices', href: '/agent/invoices', icon: 'FileText' },
  { label: 'Settings & Profile', href: '/agent/settings', icon: 'Settings' },
];
