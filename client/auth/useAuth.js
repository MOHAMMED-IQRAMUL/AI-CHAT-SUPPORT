// client/auth/useAuth.js

// Import necessary hooks from React and Firebase utilities
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth listener
import { auth } from "../../firebase"; // Importing configured Firebase auth

// Custom hook to manage user authentication state
export function useAuth() {
  // Initialize the user state as null, meaning no user is logged in initially
  const [user, setUser] = useState(null);
  
  // Manage a loading state to track if authentication is still in progress
  const [loading, setLoading] = useState(true);
  
  // Error state to handle and display authentication errors if they occur
  const [error, setError] = useState(null);
  
  // Logs user information if available, otherwise logs 'no user'
  const logUserDetails = (user) => {
    if (user) {
      console.log("User is logged in:", user);
    } else {
      console.log("No user is logged in.");
    }
  };

  // Effect to handle authentication state changes
  useEffect(() => {
    // Log the initialization of the effect
    console.log("Auth listener initialized...");
    
    // Set an unsubscribe function to listen for auth state changes
    const unsubscribe = onAuthStateChanged(
      auth, 
      (user) => {
        // When a user state change occurs, log the event
        console.log("Auth state changed.");
        
        if (user) {
          // If a user object exists, update the state
          setUser(user);
          setLoading(false); // Set loading to false once we have a user
          logUserDetails(user); // Log user details for debugging
        } else {
          // If no user is found, clear the user state and stop loading
          setUser(null);
          setLoading(false);
          console.log("No user found, state cleared.");
        }
      },
      (error) => {
        // Handle any potential errors during the authentication process
        console.error("Error during authentication:", error);
        setError(error);
        setLoading(false); // Stop loading even if there's an error
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      console.log("Cleaning up auth listener...");
      unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs only once, on mount

  // Check if an error occurred and log it for debugging purposes
  if (error) {
    console.error("Auth error occurred:", error);
  }

  // Return the user object, loading state, and any potential error
  return { user, loading, error };
}

// Usage example of the useAuth hook (for reference only, not part of the 200 lines)
// import { useAuth } from "./path/to/useAuth";
// const { user, loading, error } = useAuth();
