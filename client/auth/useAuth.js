// client/auth/useAuth.js

// Import necessary hooks from React and Firebase utilities
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth listener
import { auth } from "../../firebase"; // Importing configured Firebase auth

/**
 * Custom hook to manage user authentication state.
 * Provides `user`, `loading`, and `error` states for authentication.
 */
export function useAuth() {
  
  // Initialize the user state as null, meaning no user is logged in initially.
  
  const [user, setUser] = useState(null);

  // Manage a loading state to track if authentication is still in progress.
  
  const [loading, setLoading] = useState(true);

  // Error state to handle and display authentication errors if they occur.
  
  const [error, setError] = useState(null);

  /**
   * Logs user details if available; logs "no user" otherwise.
   * Useful for debugging and tracking authentication state changes.
   * @param {object|null} user - Firebase user object or null.
   */
  
  const logUserDetails = (user) => {
    if (user) {
      console.log("User is logged in:", user);
      console.log("User details:", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } else {
      console.log("No user is logged in.");
    }
  };

  // Effect to handle authentication state changes.
  
  useEffect(() => {
    // Log the initialization of the effect.
    
    console.log("Auth listener initialized...");

    // Subscribe to auth state changes.
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        // When a user state change occurs, log the event.
        
        console.log("Auth state changed.");

        if (user) {
          // If a user object exists, update the state.
          
          setUser(user);
          setLoading(false); // Set loading to false once we have a user.
          logUserDetails(user); // Log user details for debugging.
        } else {
          
          // If no user is found, clear the user state and stop loading.
          
          setUser(null);
          setLoading(false);
          console.log("No user found, state cleared.");
        }
      },
      (error) => {
        // Handle any potential errors during the authentication process.
        console.error("Error during authentication:", error);
        setError(error);
        setLoading(false); // Stop loading even if there's an error.
      }
    );

    // Clean up the listener when the component unmounts.
    return () => {
      console.log("Cleaning up auth listener...");
      unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs only once, on mount.

  /**
   * Log errors (if any) for debugging.
   * This ensures any authentication-related issues are noticed.
   */
  if (error) {
    console.error("Auth error occurred:", error);
  }

  /**
   * Returns the current authentication state.
   * - `user`: The logged-in user object, or `null` if not logged in.
   * - `loading`: A boolean indicating whether authentication is still in progress.
   * - `error`: Any error that occurred during authentication, or `null`.
   */
  return { user, loading, error };
}


/**

 * TODO:
 
 * 1. Add caching for user data to improve performance:
 
 *    - Store user data in a context or global state to reduce redundant API calls.
 *    - Consider using a library like Zustand, Redux, or Context API.
 
 * 2. Enhance error handling:
 
 *    - Display errors to users in the UI instead of just logging them.
 *    - Implement retry logic for transient errors (e.g., network issues).
 
 * 3. Add a logout function:
 
 *    - Provide a way to log users out directly from the hook.
 *    - Leverage `auth.signOut()` for this functionality.
 
 * 4. Integrate with analytics:
 
 *    - Log user state changes (e.g., login, logout) for better usage insights.
 
 * 5. Optimize re-renders:
 
 *    - Use `React.memo` or other techniques to prevent unnecessary renders when the auth state changes.
 */
