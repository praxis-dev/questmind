import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Menu, Space, Dropdown } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import DialogueMenu from "../../components/DialogueMenu/DialogueMenu";
import About from "../About/About";

import { SettingOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";

import { setSelectedDialogueId } from "../../store/slices/dialogueIdSlice";
import { clearMessages } from "../../store/slices/chatSlice";

import styled, { keyframes } from "styled-components";

import type { MenuProps } from "antd";

const pulsate = keyframes`
  0% { border-color: transparent; }
  50% { border-color: #cd7f32; }
  100% { border-color: transparent; }
`;
const LargePlusOutlined = styled(PlusOutlined)`
  font-size: 25px;
  color: grey;
`;

const LargeSettingOutlined = styled(SettingOutlined)`
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
  const [current, setCurrent] = useState("mail");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

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

  const items = [{ label: <About />, key: "item-1" }];

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
        <Dropdown menu={{ items }}>
          <PulsatingButton type="link" style={styles.aboutButton}>
            <LargeSettingOutlined />
          </PulsatingButton>
        </Dropdown>
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
