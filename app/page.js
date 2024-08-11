// app/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignupPopup from './components/SignupPopup.js';
import LoginPopup from './components/LoginPopup.js';
import AnonymousLoginPopup from './components/AnonymousLoginPopup.js';
import { Button, Typography, Box, Modal } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function HomePage() {
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isAnonymousLoginPopupOpen, setIsAnonymousLoginPopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showContinueOptions, setShowContinueOptions] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setShowContinueOptions(true);
      } else {
        setUser(null);
        setShowContinueOptions(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleOpenSignupPopup = () => setIsSignupPopupOpen(true);
  const handleCloseSignupPopup = () => setIsSignupPopupOpen(false);

  const handleOpenLoginPopup = () => setIsLoginPopupOpen(true);
  const handleCloseLoginPopup = () => setIsLoginPopupOpen(false);

  const handleOpenAnonymousLoginPopup = () => setIsAnonymousLoginPopupOpen(true);
  const handleCloseAnonymousLoginPopup = () => setIsAnonymousLoginPopupOpen(false);

  const handleContinue = () => {
    router.push('/Dashboard'); // Redirect to dashboard if continuing with the logged-in account
  };

  const handleUseDifferentAccount = () => {
    setShowContinueOptions(false); // Allow user to log in with a different account
    setIsLoginPopupOpen(true);
  };

  return (
    <div className="relative">
      {showContinueOptions ? (
        <Box>
          <Typography variant="h5" component="h2">
            Continue as {user.email}?
          </Typography>
          <Button variant="contained" color="primary" onClick={handleContinue}>
            Continue
          </Button>
          <Button variant="contained" color="secondary" onClick={handleUseDifferentAccount}>
            Use a Different Account
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Our App
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpenSignupPopup}>
            Sign Up
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenLoginPopup}>
            Login
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenAnonymousLoginPopup}>
            Login Anonymously
          </Button>
        </>
      )}
      <SignupPopup isOpen={isSignupPopupOpen} onClose={handleCloseSignupPopup} />
      <LoginPopup isOpen={isLoginPopupOpen} onClose={handleCloseLoginPopup} />
      <AnonymousLoginPopup isOpen={isAnonymousLoginPopupOpen} onClose={handleCloseAnonymousLoginPopup} />
    </div>
  );
}
