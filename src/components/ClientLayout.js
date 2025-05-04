'use client';

import { usePathname } from 'next/navigation';
import '@/app/globals.css';
import '@/app/login.css';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className={isAdmin ? 'login-style' : 'global-style'}>
      {children}
    </div>
  );
}
