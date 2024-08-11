// components/SignupPopup.js
import { useState } from 'react';
import Signup from '../signup.js'; // Adjust the path based on your structure
import { Box, Button } from '@mui/material';

export default function SignupPopup({ isOpen, onClose }) {
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
        <Signup />
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
