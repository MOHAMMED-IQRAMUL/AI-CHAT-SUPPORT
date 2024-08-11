// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Your App Name',
  description: 'Your App Description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add any custom metadata or link tags here */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
