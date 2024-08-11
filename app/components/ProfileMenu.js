// components/ProfileMenu.js
"use client"

import { useAuth } from '../../client/auth/useAuth.js';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase.js';
import { Menu, MenuItem, IconButton, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home or login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <div>
      <IconButton onClick={handleClick} color="inherit">
        <AccountCircleIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {user && (
          <>
            <MenuItem disabled>
              <Typography variant="body1">{user.email}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
}
