import React from "react";
import { Space, Button, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { logoutUser } from "../../services/logoutUser";

import styled, { keyframes } from "styled-components";

import { SettingOutlined } from "@ant-design/icons";

const pulsate = keyframes`
  0% { border-color: transparent; }
  50% { border-color: #cd7f32; }
  100% { border-color: transparent; }
`;

const PulsatingButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 2px 0;
  border: 1px solid transparent;
  transition: border 0.5s ease-in-out;

  &:hover {
    animation: ${pulsate} 4s infinite;
    border: 1px solid black;

    svg {
      color: #cd7f32; // Change icon color on hover
    }
  }
`;

const LargeSettingOutlined = styled(SettingOutlined)`
  font-size: 25px;
  color: grey;
`;

const SettingsMenu: React.FC = () => {
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

  const renderButton = () => {
    return (
      <>
        <Space direction="vertical">
          <Button danger type="link" onClick={handleLogout}>
            Logout
          </Button>
        </Space>
      </>
    );
  };

  const items = [{ label: renderButton(), key: "item-1" }];

  return (
    <Dropdown menu={{ items }}>
      <PulsatingButton type="link" style={styles.aboutButton}>
        <LargeSettingOutlined />
      </PulsatingButton>
    </Dropdown>
  );
};

const baseStyles: ViewStyles = {
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

export default SettingsMenu;
