import React, { useState } from "react";
import { Button, Modal, Space } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import Menu from "../../components/Menu/Menu";
import About from "../About/About";

import { InfoCircleOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";

const Header: React.FC = () => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const showAboutModal = () => {
    setIsAboutVisible(true);
  };

  const [isAboutVisible, setIsAboutVisible] = useState(false);

  return (
    <div style={styles.headerContainer}>
      <Space>
        <Menu />
        <Button
          icon={<PlusOutlined style={styles.aboutIcon} />}
          type="link"
          style={styles.aboutButton}
          onClick={showAboutModal}
        />
      </Space>
      <div style={styles.iconsContainer}>
        <Button
          icon={<InfoCircleOutlined style={styles.aboutIcon} />}
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
