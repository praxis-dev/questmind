import React, { ReactNode } from "react";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

interface MessageCardProps {
  title: string;
  content: string | ReactNode; // <-- Allow both string and JSX elements
}

const MessageCard: React.FC<MessageCardProps> = ({ title, content }) => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  return (
    <div style={styles.cardWrapper}>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardContent}>{content}</div>
    </div>
  );
};

const baseStyles: ViewStyles = {
  cardWrapper: {
    borderRadius: "4px",
    padding: "0.5rem",
    marginBottom: "1rem",
    maxWidth: "100%",
  },
  cardTitle: {
    fontFamily: "monospace",
    marginBottom: "0.5rem",
    textAlign: "left",
  },
  cardContent: {
    fontFamily: "monospace",
    whiteSpace: "pre-line",
    textAlign: "left",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default MessageCard;
