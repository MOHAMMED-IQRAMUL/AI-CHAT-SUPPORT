// components/LoginPopup.js
"use client";

import { useState } from "react";
import { auth } from "@/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function LoginPopup({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/Dashboard"); // Redirect to dashboard after login
      onClose();
    } catch (error) {
      setError(error.message);
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
        <Typography variant="h4" component="h1">Login</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
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
