// components/AnonymousLoginPopup.js
"use client";

import { Box, Button, Typography } from "@mui/material";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/firebase.js";
import { useRouter } from "next/navigation";

export default function AnonymousLoginPopup({ isOpen, onClose }) {
  const router = useRouter();

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
      router.push("/Dashboard"); // Redirect to dashboard after anonymous login
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      position="fixed" 
      top={0} 
      left={0} 
      width="100%" 
      height="100%" 
      bgcolor="rgba(0, 0, 0, 0.5)" 
      zIndex={1300}
    >
      <Box 
        bgcolor="white" 
        p={4} 
        borderRadius="8px" 
        boxShadow={3}
        position="relative"
      >
        <Typography variant="h4" component="h1">Anonymous Login</Typography>
        <Button variant="contained" color="primary" onClick={handleAnonymousLogin}>
          Login Anonymously
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          style={{ position: 'absolute', top: 10, right: 10 }}
        >
          &times;
        </Button>
      </Box>
    </Box>
  );
}
