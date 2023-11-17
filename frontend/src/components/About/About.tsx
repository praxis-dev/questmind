import React, { useState } from "react";
import { Space, Button } from "antd";
import { useNavigate } from "react-router-dom";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { logoutUser } from "../../services/logoutUser";

const About: React.FC = () => {
  const navigate = useNavigate();
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const handleLogout = () => {
    logoutUser();
    navigate("/landing");
  };

  return (
    <div style={styles.section}>
      <Space direction="vertical" style={styles.contentSpace}>
        <Button
          type="primary"
          danger
          onClick={() => {
            handleLogout();
          }}
        >
          Log out of QuestMind
        </Button>
      </Space>
    </div>
  );
};

const baseStyles: ViewStyles = {
  aboutText: {
    fontSize: "14px",
  },

  iconSpaceWrapper: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },

  iconSpace: {
    display: "flex",
    flexDirection: "row",
    maxHeight: "24px",
    gap: "10px",
  },

  section: {
    boxSizing: "border-box",
    maxWidth: 1000,
    margin: "0 auto",
    padding: 20,
    height: "96%",
  },

  contentSpace: {
    maxWidth: 500,
    width: "100%",
    height: "100%",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default About;
