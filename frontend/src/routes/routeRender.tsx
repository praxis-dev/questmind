// routeRender.tsx

import React from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Header from "../components/Header/Header";
import QueryResponse from "../pages/QueryResponse/QueryResponse";
import Landing from "../pages/Landing/Landing";
import PasswordRecovery from "../pages/PasswordRecovery/PasswordRecovery";
import Privacy from "../pages/Privacy/Privacy";
import { isAuthenticated } from "../utils/isAuthenticated";

const PrivateRoute = ({
  component: Component,
}: {
  component: React.ComponentType;
}) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/landing" />;
};

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
    if (isAuthenticated()) {
      if (
        window.location.pathname === "/landing" ||
        window.location.pathname === "/password-recovery"
      ) {
        navigate("/");
      }
    }
  }, [navigate]);

  const shouldRenderHeader = ![
    "/landing",
    "/password-recovery",
    "/privacy",
  ].includes(window.location.pathname);

  return (
    <>
      {shouldRenderHeader && <Header />}

      <Routes>
        <Route path="/" element={<PrivateRoute component={QueryResponse} />} />
        <Route path="/landing" element={<PublicRoute component={Landing} />} />
        <Route path="/privacy" element={<PublicRoute component={Privacy} />} />
        <Route
          path="/password-recovery"
          element={<PublicRoute component={PasswordRecovery} />}
        />
      </Routes>
    </>
  );
}
