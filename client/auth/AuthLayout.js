
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

export default function AuthLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);
  const [error, setError] = useState(null);
  const [redirectPath, setRedirectPath] = useState("/signup");
  const [authReady, setAuthReady] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [authAttempt, setAuthAttempt] = useState(0);
  const [authComplete, setAuthComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError("User not authenticated");
        setUserStatus("guest");
        setLoading(false);
        router.push(redirectPath);
      } else {
        setUserProfile(user);
        setUserStatus("authenticated");
        setLoading(false);
        setAuthComplete(true);
      }
    });

    return () => unsubscribe();
  }, [router, redirectPath]);

  useEffect(() => {
    if (authComplete && userStatus === "authenticated") {
      setAuthReady(true);
    }
  }, [authComplete, userStatus]);

  const handleRedirect = (path) => {
    if (authReady) {
      setRedirectPath(path);
      router.push(path);
    }
  };

  const retryAuth = () => {
    setAuthAttempt(authAttempt + 1);
    setLoading(true);
    setUserStatus(null);
    setError(null);
  };

  const renderLoading = () => (
    <div>
      <h2>Loading Authentication...</h2>
      <p>Attempting to authenticate user.</p>
      <button onClick={retryAuth}>Retry Authentication</button>
    </div>
  );

  const renderError = () => (
    <div>
      <h2>Error</h2>
      <p>{error}</p>
      <button onClick={retryAuth}>Retry</button>
    </div>
  );

  const renderAuthenticated = () => (
    <div>
      <h2>Welcome, {userProfile?.displayName || "User"}</h2>
      <p>You are successfully authenticated.</p>
      <button onClick={() => handleRedirect("/dashboard")}>Go to Dashboard</button>
    </div>
  );

  const renderGuest = () => (
    <div>
      <h2>Guest Access</h2>
      <p>Please sign up to continue.</p>
      <button onClick={() => handleRedirect("/signup")}>Sign Up</button>
    </div>
  );

  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  if (authReady && userStatus === "authenticated") {
    return renderAuthenticated();
  }

  if (!authReady && userStatus === "guest") {
    return renderGuest();
  }

  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
  });
  const [signupError, setSignupError] = useState(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError(null);
    auth
      .createUserWithEmailAndPassword(signupForm.email, signupForm.password)
      .then((userCredential) => {
        setSignupSuccess(true);
        setSignupLoading(false);
        setSignupForm({ email: "", password: "" });
      })
      .catch((error) => {
        setSignupError(error.message);
        setSignupLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  };

  const renderSignupForm = () => (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        name="email"
        value={signupForm.email}
        onChange={handleInputChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={signupForm.password}
        onChange={handleInputChange}
        placeholder="Password"
        required
      />
      {signupError && <p>{signupError}</p>}
      <button type="submit" disabled={signupLoading}>
        {signupLoading ? "Signing up..." : "Sign Up"}
      </button>
      {signupSuccess && <p>Signup successful!</p>}
    </form>
  );

  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState(null);

  const handleResetPassword = (e) => {
    e.preventDefault();
    setResetPasswordError(null);
    auth
      .sendPasswordResetEmail(resetPasswordEmail)
      .then(() => {
        setResetPasswordSuccess(true);
        setResetPasswordEmail("");
      })
      .catch((error) => {
        setResetPasswordError(error.message);
      });
  };

  const handleResetInputChange = (e) => {
    setResetPasswordEmail(e.target.value);
  };

  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword}>
      <input
        type="email"
        value={resetPasswordEmail}
        onChange={handleResetInputChange}
        placeholder="Enter your email"
        required
      />
      {resetPasswordError && <p>{resetPasswordError}</p>}
      <button type="submit">Reset Password</button>
      {resetPasswordSuccess && <p>Check your email for reset instructions!</p>}
    </form>
  );

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    auth
      .signInWithEmailAndPassword(loginForm.email, loginForm.password)
      .then((userCredential) => {
        setLoginSuccess(true);
        setLoginLoading(false);
        setLoginForm({ email: "", password: "" });
      })
      .catch((error) => {
        setLoginError(error.message);
        setLoginLoading(false);
      });
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        name="email"
        value={loginForm.email}
        onChange={handleLoginInputChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={loginForm.password}
        onChange={handleLoginInputChange}
        placeholder="Password"
        required
      />
      {loginError && <p>{loginError}</p>}
      <button type="submit" disabled={loginLoading}>
        {loginLoading ? "Logging in..." : "Log In"}
      </button>
      {loginSuccess && <p>Login successful!</p>}
    </form>
  );

  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [verificationEmailError, setVerificationEmailError] = useState(null);

  const handleSendVerificationEmail = () => {
    const user = auth.currentUser;
    if (user) {
      user
        .sendEmailVerification()
        .then(() => {
          setVerificationEmailSent(true);
        })
        .catch((error) => {
          setVerificationEmailError(error.message);
        });
    }
  };

  const renderVerificationEmailSection = () => (
    <div>
      <button onClick={handleSendVerificationEmail}>
        Send Verification Email
      </button>
      {verificationEmailError && <p>{verificationEmailError}</p>}
      {verificationEmailSent && <p>Verification email sent!</p>}
    </div>
  );

  return (
    <>
      {authReady ? (
        <>
          {children}
          {renderAuthenticated()}
        </>
      ) : (
        <>
          {renderLoginForm()}
          {renderSignupForm()}
          {renderResetPasswordForm()}
          {renderVerificationEmailSection()}
        </>
      )}
    </>
  );
}
