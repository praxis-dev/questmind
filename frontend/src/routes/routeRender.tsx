import React from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Header from "../components/Header/Header";
import QueryResponse from "../pages/QueryResponse/QueryResponse";
import Landing from "../pages/Landing/Landing";
import PasswordRecovery from "../pages/PasswordRecovery/PasswordRecovery";
import { isAuthenticated } from "../utils/isAuthenticated";

const PrivateRoute = ({
  component: Component,
}: {
  component: React.ComponentType;
}) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/landing" />;
};

// Public Route Wrapper
const PublicRoute = ({
  component: Component,
}: {
  component: React.ComponentType;
}) => {
  return !isAuthenticated() ? <Component /> : <Navigate to="/" />;
};

export function RouteRender() {
  let navigate = useNavigate();

  React.useEffect(() => {
    // Redirect authenticated users away from landing and password recovery pages
    if (isAuthenticated()) {
      if (
        window.location.pathname === "/landing" ||
        window.location.pathname === "/password-recovery"
      ) {
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <>
      {window.location.pathname !== "/landing" &&
        window.location.pathname !== "/password-recovery" && <Header />}

      <Routes>
        <Route path="/" element={<PrivateRoute component={QueryResponse} />} />
        <Route path="/landing" element={<PublicRoute component={Landing} />} />
        <Route
          path="/password-recovery"
          element={<PublicRoute component={PasswordRecovery} />}
        />
      </Routes>
    </>
  );
}
