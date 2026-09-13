import { NavItem } from "./navigation";

export const masterSidebarItems: NavItem[] = [
  { label: "Overview", href: "/master/dashboard", icon: "LayoutDashboard" },
  { label: "Courses", href: "/master/courses", icon: "BookOpen" },
  { label: "Seafarers", href: "/master/seafarers", icon: "Users" },
  { label: "Partner Admins", href: "/master/agent-admins", icon: "UserCheck" },
  {
    label: "Company Admins",
    href: "/master/company-admins",
    icon: "Building2",
  },
  { label: "Institutes", href: "/master/institutes", icon: "GraduationCap" },
  { label: "Finance & Invoices", href: "/master/finance", icon: "Receipt" },
  { label: "Reports", href: "/master/reports", icon: "BarChart3" },
  { label: "Settings", href: "/master/settings", icon: "Settings" },
];

export const seafarerSidebarItems: NavItem[] = [
  { label: "Dashboard", href: "/seafarer/dashboard", icon: "LayoutDashboard" },
  {
    label: "Browse Courses",
    href: "/seafarer/browse-courses",
    icon: "Compass",
  },
  { label: "My Courses", href: "/seafarer/my-courses", icon: "BookMarked" },
  { label: "My Documents", href: "/seafarer/documents", icon: "FileText" },
  { label: "Profile & Sea Service", href: "/seafarer/profile", icon: "User" },
  {
    label: "Purchase History",
    href: "/seafarer/purchase-history",
    icon: "Receipt",
  },
  {
    label: "Referral Rewards",
    href: "/seafarer/referral-dashboard",
    icon: "Gift",
  },
  { label: "Support Tickets", href: "/seafarer/support", icon: "HelpCircle" },
];

export const partnerSidebarItems: NavItem[] = [
  { label: "Dashboard", href: "/partner/dashboard", icon: "LayoutDashboard" },
  { label: "Seafarers", href: "/partner/seafarers", icon: "Users" },
  { label: "Purchases", href: "/partner/purchases", icon: "ShoppingCart" },
  { label: "Settlements", href: "/partner/settlements", icon: "CreditCard" },
  { label: "Documents", href: "/partner/documents", icon: "FileText" },
  { label: "Settings & Profile", href: "/partner/profile", icon: "Settings" },
];

export const agentSidebarItems = partnerSidebarItems;
