import React from "react";
import { Space, Typography, Divider, message } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";

import { BitcoinIcon } from "@bitcoin-design/bitcoin-icons-react/filled";

const About: React.FC = () => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const handleClick = () => {
    const btcAddress = "bc1q20rxus5wmfm2wf2q7lrtut3p5ffrp4vw6yvfm6";

    navigator.clipboard
      .writeText(btcAddress)
      .then(() => {
        message.success("BTC address copied");
      })
      .catch((err) => {
        message.error("Failed to copy BTC address");
        console.error(err);
      });
  };

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

        <Space direction="horizontal" style={styles.iconSpace}>
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
                href="https://twitter.com/InferenceOne"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterOutlined style={{ fontSize: "20px", color: "gray" }} />
              </a>
              <BitcoinIcon
                onClick={handleClick}
                style={{ height: "5px", width: "5px", color: "#F7931A" }}
              />
            </Space>
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

  iconSpace: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default About;
