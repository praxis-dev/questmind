import React from "react";
import { useDispatch } from "react-redux";

import { v4 as uuidv4 } from "uuid";

import { Button, Space } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import DialogueMenu from "../../components/DialogueMenu/DialogueMenu";
import SettingsMenu from "../About/SettingsMenu";
import ShareDialogueCheckbox from "../ShareDialogueCheckbox/ShareDialogueCheckbox";

import { PlusOutlined } from "@ant-design/icons";

import { setSelectedDialogueId } from "../../store/slices/dialogueIdSlice";
import { clearMessages } from "../../store/slices/chatSlice";

import styled, { keyframes } from "styled-components";

import messagesConfig from "../../utils/messagesConfig";

import { addMessage } from "../../store/slices/chatSlice";

const pulsate = keyframes`
  0% { border-color: transparent; }
  50% { border-color: #cd7f32; }
  100% { border-color: transparent; }
`;

const LargePlusOutlined = styled(PlusOutlined)`
  font-size: 25px;
  color: grey;
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

const Header: React.FC = () => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const dispatch = useDispatch();

  const handlePlusClick = () => {
    const randomIndex = Math.floor(
      Math.random() * messagesConfig.introductory.length
    );
    const randomIntroductoryMessage = messagesConfig.introductory[randomIndex];

    dispatch(setSelectedDialogueId(""));
    dispatch(clearMessages());
    dispatch(
      addMessage({ id: uuidv4(), type: "ai", text: randomIntroductoryMessage })
    );
  };

  return (
    <div style={styles.headerContainer}>
      <Space>
        <DialogueMenu />
        <PulsatingButton
          type="link"
          style={styles.aboutButton}
          onClick={handlePlusClick}
        >
          <LargePlusOutlined />
        </PulsatingButton>
      </Space>
      <div style={styles.iconsContainer}>
        <ShareDialogueCheckbox />
        <SettingsMenu />
      </div>
    </div>
  );
};

const baseStyles: ViewStyles = {
  headerContainer: {
    width: "100%",
    minHeight: "5vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    padding: "0 10px",
    borderBottom: "1px solid grey",
  },

  aboutIcon: {
    fontSize: 20,
    color: "grey",
  },

  aboutButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
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

export default Header;
