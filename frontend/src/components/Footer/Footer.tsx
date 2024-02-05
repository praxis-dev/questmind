import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setHeight, selectHeight } from "../../store/slices/heightSlice";

import { Button, Space, Divider, Typography } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

const Footer: React.FC = () => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const { Link } = Typography;

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handlePrivacyClick = () => {
    navigate("/privacy");
  };

  const height = useSelector(selectHeight);

  return (
    <div style={styles.footerContainer}>
      <Space direction="horizontal">
        <Button
          type="text"
          style={styles.lowerButton}
          aria-expanded={height !== 0}
          aria-controls="example-panel"
          onClick={() => dispatch(setHeight(height === 0 ? 421 : 0))}
        >
          v 0.2.5 Progress notes
        </Button>
        <Divider type="vertical" />
        <Button
          style={styles.lowerButton}
          type="link"
          onClick={handlePrivacyClick}
        >
          Privacy Policy
        </Button>
      </Space>
    </div>
  );
};

const baseStyles: ViewStyles = {
  versionText: {
    color: "black",
  },

  footerContainer: {
    width: "100%",
    height: "4vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    padding: "0 10px",
    borderBottom: "1px solid grey",
    backgroundColor: "grey",
    position: "relative",
    zIndex: 1000,
  },

  lowerButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    backgroundColor: "transparent",
    padding: 0,
    height: "auto",
    lineHeight: "inherit",
    color: "black",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {
  headerContainer: {
    minHeight: "6vh",
  },
};

export default Footer;
