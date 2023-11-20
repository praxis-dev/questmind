import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Modal, Space } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import Menu from "../../components/Menu/Menu";
import About from "../About/About";

import { InfoCircleOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";

import { setSelectedDialogueId } from "../../store/slices/dialogueIdSlice";
import { clearMessages } from "../../store/slices/chatSlice";

import styled, { keyframes } from "styled-components";

const pulsate = keyframes`
  0% { border-color: transparent; }
  50% { border-color: #cd7f32; }
  100% { border-color: transparent; }
`;

const StyledIcon = styled.span`
  font-size: 25px;
  color: grey; // Default icon color
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

    ${StyledIcon} {
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

  const showAboutModal = () => {
    setIsAboutVisible(true);
  };

  const handlePlusClick = () => {
    dispatch(setSelectedDialogueId(""));
    dispatch(clearMessages());
  };

  const [isAboutVisible, setIsAboutVisible] = useState(false);

  return (
    <div style={styles.headerContainer}>
      <Space>
        <Menu />
        <PulsatingButton
          icon={<StyledIcon as={PlusOutlined} />}
          type="link"
          style={styles.aboutButton}
          onClick={handlePlusClick}
        />
      </Space>
      <div style={styles.iconsContainer}>
        <PulsatingButton
          icon={<StyledIcon as={InfoCircleOutlined} />}
          type="link"
          style={styles.aboutButton}
          onClick={showAboutModal}
        />
      </div>

      <Modal
        open={isAboutVisible}
        onCancel={() => setIsAboutVisible(false)}
        centered
        footer={null}
        width="600px"
      >
        <About />
      </Modal>
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
