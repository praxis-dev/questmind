import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Space } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import DialogueMenu from "../../components/DialogueMenu/DialogueMenu";
import SettingsMenu from "../About/SettingsMenu";

import { PlusOutlined } from "@ant-design/icons";

import { setSelectedDialogueId } from "../../store/slices/dialogueIdSlice";
import { clearMessages } from "../../store/slices/chatSlice";

import styled, { keyframes } from "styled-components";

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
      color: #cd7f32; // Change icon color on hover
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
    dispatch(setSelectedDialogueId(""));
    dispatch(clearMessages());
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
        <SettingsMenu />
      </div>
    </div>
  );
};

const baseStyles: ViewStyles = {
  headerContainer: {
    width: "100%",
    minHeight: "3%",
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

const extraSmallScreenStyles: ViewStyles = {};

export default Header;
