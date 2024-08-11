// app/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupPopup from "./components/SignupPopup.js";
import LoginPopup from "./components/LoginPopup.js";
import AnonymousLoginPopup from "./components/AnonymousLoginPopup.js";
import { Button, Typography, Box, Modal } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isAnonymousLoginPopupOpen, setIsAnonymousLoginPopupOpen] =
    useState(false);
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

  const handleOpenAnonymousLoginPopup = () =>
    setIsAnonymousLoginPopupOpen(true);
  const handleCloseAnonymousLoginPopup = () =>
    setIsAnonymousLoginPopupOpen(false);

  const handleContinue = () => {
    router.push("/Dashboard"); // Redirect to dashboard if continuing with the logged-in account
  };

  const handleUseDifferentAccount = () => {
    setShowContinueOptions(false); // Allow user to log in with a different account
    setIsLoginPopupOpen(true);
  };

  return (
    <div className="relative">
      {showContinueOptions ? (
        <div className="max-w-full h-screen flex justify-center align-middle flex-col gap-5">
          <Typography variant="h5" component="h2" textAlign="center">
            Continue as {user.email == null ? "Guest" : user.email}?
          </Typography>
          <div className="w-[200px] mx-auto flex justify-center align-middle">
            <Button
              variant="contained"
              color="primary"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
          <div className="w-[200px] mx-auto flex justify-center align-middle">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUseDifferentAccount}
            >
              Use a Different Account
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-full h-screen flex justify-center align-middle flex-col gap-5">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            textAlign="center"
          >
            Welcome to Our App
          </Typography>
          <div className="w-[200px] mx-auto flex justify-center align-middle">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenSignupPopup}
              fullWidth="true"
            >
              Sign Up
            </Button>
          </div>
          <div className="w-[200px] mx-auto flex justify-center align-middle">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenLoginPopup}
              fullWidth="true"
            >
              Login
            </Button>
          </div>
          <div className="w-[200px] mx-auto flex justify-center align-middle">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenAnonymousLoginPopup}
              fullWidth="true"
            >
              Login Anonymously
            </Button>
          </div>
        </div>
      )}

      <SignupPopup
        isOpen={isSignupPopupOpen}
        onClose={handleCloseSignupPopup}
      />
      <LoginPopup isOpen={isLoginPopupOpen} onClose={handleCloseLoginPopup} />
      <AnonymousLoginPopup
        isOpen={isAnonymousLoginPopupOpen}
        onClose={handleCloseAnonymousLoginPopup}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white p-4 text-center">
          <Typography variant="h4" >Contributors</Typography>
        <div className="flex justify-around items-center flex-wrap text-white">
          <div className="flex items-center gap-2 h-[60px]">
            <Image
              src="/images/img-iq.jpg"
              alt="MOHAMMED_IQRAMUL"
              width={50}
              height={50}
              style={{ borderRadius: "50%" }}
            />
            <Link
              rel="MOHAMMED-IQRAMUL"
              href="https://github.com/MOHAMMED-IQRAMUl"
            >
              MOHAMMED-IQRAMUL
            </Link>
          </div>
          <div className="flex items-center gap-2 h-[60px]">
            <Image
              src="/images/img-ayan.png"
              alt="Ayyan-Akbar"
              width={50}
              height={50}
              style={{ borderRadius: "50%" }}
            />
            <Link rel="Ayyan-Akbar" href="https://github.com/raoayyan">
              Ayyan-Akbar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
