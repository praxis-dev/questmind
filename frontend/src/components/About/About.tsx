import React, { useState } from "react";
import { Space, Typography, Divider, Tooltip } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";
import { BitcoinIcon } from "@bitcoin-design/bitcoin-icons-react/filled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const About: React.FC = () => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const initialTooltipText = "Support QuestMind";
  const copyText = "BTC address copied!";

  const [tooltipText, setTooltipText] = useState(initialTooltipText);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText("bc1q20rxus5wmfm2wf2q7lrtut3p5ffrp4vw6yvfm6")
      .then(() => {
        setTooltipText(copyText);
        setTimeout(() => setTooltipText(initialTooltipText), 3000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
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
          QuestMind leverages the latest developments in AI to enable you to
          have the combined corpus of human wisdom as your sage advisor.
        </Typography.Text>
        <Typography.Text style={styles.font}>
          v 0.1.1 / by Igor Chesnokov
        </Typography.Text>
        <Divider />
        <Space direction="horizontal" style={styles.iconSpaceWrapper}>
          <div style={styles.iconSpace}>
            <a
              href="https://www.linkedin.com/in/igorchesnokov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faLinkedin}
                size="xl"
                style={{ color: "gray" }}
              />
            </a>
            <a
              href="https://twitter.com/InferenceOne"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faXTwitter}
                size="xl"
                style={{ color: "gray" }}
              />
            </a>
          </div>
          <div style={styles.iconSpace}>
            <Tooltip title={tooltipText} placement="left" color="#cc5612">
              <BitcoinIcon
                onClick={handleCopyClick}
                style={{
                  height: "30px",
                  width: "30px",
                  color: "gray",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </div>
        </Space>
      </Space>
    </div>
  );
};

const baseStyles: ViewStyles = {
  iconSpaceWrapper: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },

  iconSpace: {
    display: "flex",
    flexDirection: "row",
    maxHeight: "24px",
    gap: "10px",
  },

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
