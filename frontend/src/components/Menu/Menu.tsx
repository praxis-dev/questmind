import React, { useState } from "react";
import type { DrawerProps, RadioChangeEvent } from "antd";
import { Button, Drawer, Radio, Space } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false);

  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Space>
        <Button
          type="link"
          onClick={showDrawer}
          icon={<UnorderedListOutlined style={styles.listIcon} />}
          style={styles.buttonStyle}
        ></Button>
      </Space>
      <Drawer
        title="My Dialogues "
        placement="left"
        closable={true}
        onClose={onClose}
        open={open}
        key={"left"}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};

const baseStyles: ViewStyles = {
  test: {
    height: "100vh",
  },

  contentSpace: {
    margin: "auto auto",
    boxSizing: "border-box",
    padding: "20px",
    maxWidth: "800px",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  textArea: {
    textAlign: "left",
  },

  buttonStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },

  listIcon: {
    fontSize: 20,
    color: "grey",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default Menu;
