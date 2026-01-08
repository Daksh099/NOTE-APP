import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Notes App',
  description: 'A beautiful notes application built with Next.js and MongoDB',
  openGraph: {
    title: 'Notes App',
    description: 'A beautiful notes application built with Next.js and MongoDB',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
