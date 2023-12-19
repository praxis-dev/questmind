// GoogleSignInButton (frontend)

const GoogleSignInButton = () => {
  const handleSignIn = () => {
    window.location.href = "http://localhost:3001/api/auth/google";
  };

  return <button onClick={handleSignIn}>Sign in with Google</button>;
};

export default GoogleSignInButton;
