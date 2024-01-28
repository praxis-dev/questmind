import React from "react";
import {
  Route,
  Routes,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useResponsiveStyles } from "../library/hooks";
import { Breakpoint, ViewStyles } from "../library/styles";

import Header from "../components/Header/Header";
import QueryResponse from "../pages/QueryResponse/QueryResponse";
import Landing from "../pages/Landing/Landing";
import PasswordRecovery from "../pages/PasswordRecovery/PasswordRecovery";
import Privacy from "../pages/Privacy/Privacy";
import Footer from "../components/Footer/Footer";
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
  let location = useLocation();

  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

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
  ].includes(location.pathname);

  const isLandingPage = location.pathname === "/landing";

  return (
    <div style={styles.pageContainer}>
      {shouldRenderHeader && <Header />}
      <div style={styles.contentWrap}>
        <Routes>
          <Route
            path="/"
            element={<PrivateRoute component={QueryResponse} />}
          />
          <Route
            path="/landing"
            element={<PublicRoute component={Landing} />}
          />
          <Route
            path="/privacy"
            element={<PublicRoute component={Privacy} />}
          />
          <Route
            path="/password-recovery"
            element={<PublicRoute component={PasswordRecovery} />}
          />
        </Routes>
      </div>
      <div style={styles.footerWrap}>{isLandingPage && <Footer />}</div>
    </div>
  );
}

const baseStyles: ViewStyles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },

  contentWrap: {
    minHeight: "96vh",
  },

  footerWrap: {
    minHeight: "4vh",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};
