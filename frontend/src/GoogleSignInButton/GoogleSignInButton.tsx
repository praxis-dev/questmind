import { Button } from "antd";
import { FcGoogle } from "react-icons/fc";

const GoogleSignInButton = () => {
  const handleSignIn = () => {
    // window.location.href = "http://localhost:3001/api/auth/google";
    window.location.href =
      process.env.REACT_APP_CURRENT_DEPLOYMENT + "/api/auth/google/callback";
  };

  return (
    <Button
      icon={<FcGoogle size="2em" />}
      type="text"
      onClick={handleSignIn}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px 10px",
      }}
    ></Button>
  );
};

export default GoogleSignInButton;
