import React from "react";
import { Space, Typography, Divider } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";

const About: React.FC = () => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  return (
    <div style={styles.section}>
      <Space direction="vertical" style={styles.contentSpace}>
        <Typography.Title level={2} style={styles.font}>
          About
        </Typography.Title>
        <Divider />
        <Typography.Text style={styles.font}>
          Dive into ancient philosophy to answer today's questions. Using
          classic works, QuestMind.ai gives relevant insights for our modern
          world.
        </Typography.Text>
        <Typography.Text style={styles.font}>By Igor Chesnokov</Typography.Text>
        <Divider />

        <Space direction="horizontal">
          <Space>
            <a
              href="https://www.linkedin.com/in/igorchesnokov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinOutlined style={{ fontSize: "20px", color: "gray" }} />
            </a>
            <a
              href="https://twitter.com/hnwpraxis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterOutlined style={{ fontSize: "20px", color: "gray" }} />
            </a>
          </Space>
        </Space>
      </Space>
    </div>
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

  font: {
    fontFamily: "monospace",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default About;
