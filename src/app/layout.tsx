import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrintoSpec - Tunisia Solar Panel Market Dashboard',
  description: 'Real-time AI-powered dashboard for tracking solar panel prices, news, reviews, and market trends in Tunisia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
