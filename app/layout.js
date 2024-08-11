// app/layout.js
import "./globals.css";
import ProfileMenu from "./components/ProfileMenu.js";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export const metadata = {
  title: "AI Support Buddy",
  description: "This is a AI Chat Support Assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>{/* Add any custom metadata or link tags here */}</head>
      <body>
        <header className="flex justify-between p-4 bg-gray-800 text-white">
          <Link href="/" className="text-xl font-bold">
            <Typography variant="h6">AI Support Buddy</Typography>
          </Link>

          <ProfileMenu />
        </header>
        {children}
      </body>
    </html>
  );
}
