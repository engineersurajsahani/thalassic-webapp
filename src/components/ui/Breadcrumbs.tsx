'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    return {
      label,
      href,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
      <Link href="/" className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {item.isLast ? (
            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-slate-800 dark:hover:text-slate-200">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
