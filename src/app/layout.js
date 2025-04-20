import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'GreenThickss',
  description: 'GreenThickss Frontend',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}