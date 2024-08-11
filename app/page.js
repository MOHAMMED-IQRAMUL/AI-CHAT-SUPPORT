"use client"
import { useState } from 'react';
import SignupPopup from './components/SignupPopup.js'; // Adjust the path based on your structure
import { Button, Typography } from '@mui/material';

export default function HomePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  return (
    <div className="relative">
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Our App
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenPopup}
      >
        Sign Up
      </Button>
      <SignupPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </div>
  );
}
