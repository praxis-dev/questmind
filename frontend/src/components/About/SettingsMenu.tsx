import React from "react";
import { useDispatch } from "react-redux";

import { Space, Button, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { logoutUser } from "../../services/logoutUser";
import { deleteUser } from "../../services/deleteUser";

import styled, { keyframes } from "styled-components";

import { SettingOutlined } from "@ant-design/icons";

import { clearSelectedCardId } from "../../store/slices/selectedCardSlice";
import { clearMessages } from "../../store/slices/chatSlice";
import { clearSelectedDialogue } from "../../store/slices/dialogueDetailsSlice";
import { setSelectedDialogueId } from "../../store/slices/dialogueIdSlice";

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
      color: #cd7f32;
    }
  }
`;

const LargeSettingOutlined = styled(SettingOutlined)`
  font-size: 25px;
  color: grey;
`;

const SettingsMenu: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const handleLogout = () => {
    dispatch(clearMessages());
    dispatch(clearSelectedCardId());
    dispatch(setSelectedDialogueId(""));
    dispatch(clearSelectedDialogue());
    logoutUser();
    navigate("/landing");
  };

  const renderLogoutButton = () => {
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

  const handlePatreonClick = () => {
    window.open("https://www.patreon.com/questmindai", "_blank");
  };

  const renderPatreonButton = () => (
    <Button
      type="link"
      onClick={handlePatreonClick}
      style={styles.patreonButton}
    >
      Patreon
    </Button>
  );

  const renderDeleteAccountButton = () => {
    const handleDeleteAccount = () => {
      dispatch(clearMessages());
      dispatch(clearSelectedCardId());
      dispatch(setSelectedDialogueId(""));
      dispatch(clearSelectedDialogue());
      deleteUser();
      navigate("/landing");
    };

    return (
      <Space direction="vertical">
        <Button danger type="link" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </Space>
    );
  };

  const items = [
    { label: renderPatreonButton(), key: "item-1" },
    { label: renderLogoutButton(), key: "item-2" },
    { label: renderDeleteAccountButton(), key: "item-3" },
  ];

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

  patreonButton: {
    color: "black",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default SettingsMenu;
