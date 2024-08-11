// app/layout.js
import './globals.css';
import ProfileMenu from './components/ProfileMenu.js';
import Typography from '@mui/material/Typography';


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
        <header className="flex justify-between p-4 bg-gray-800 text-white">
          <Typography variant="h6">Your App Name</Typography>
          <ProfileMenu />
        </header>
        {children}
      </body>
    </html>
  );
}
