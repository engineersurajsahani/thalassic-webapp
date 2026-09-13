export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  roles?: string[];
}

export const publicNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerNavItems = {
  solutions: [
    { label: "For Seafarers", href: "/seafarer/dashboard" },
    { label: "For Partners", href: "/partner/dashboard" },
    { label: "For Shipping Companies", href: "/company-admin/dashboard" },
    { label: "Partner Program", href: "/partner-registration" },
  ],
  support: [
    { label: "Help Center", href: "/faq" },
    { label: "Contact Support", href: "/contact" },
    { label: "Accreditation", href: "/about" },
  ],
};
