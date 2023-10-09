import React, { ReactNode, useState, useEffect } from "react";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

interface MessageCardProps {
  title: string;
  content: string | ReactNode;
  type: "user" | "ai";
}

const MessageCard: React.FC<MessageCardProps> = ({ title, content, type }) => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const isStringContent = typeof content === "string";
  const contentStr = isStringContent ? content : "";

  const [displayedContent, setDisplayedContent] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxTypingDelay = 100;

  useEffect(() => {
    if (!isStringContent) return;

    if (type === "user") {
      setDisplayedContent(contentStr.split(""));
      return;
    }

    const typingEffect = setInterval(() => {
      if (currentIndex < contentStr.length) {
        setDisplayedContent((prev) => [...prev, contentStr[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
        const event = new Event("contentUpdated");
        window.dispatchEvent(event);
      } else {
        clearInterval(typingEffect);
      }
    }, Math.random() * maxTypingDelay);

    return () => clearInterval(typingEffect);
  }, [type, contentStr, currentIndex, isStringContent]);

  return (
    <div style={styles.cardWrapper}>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardContent}>
        {isStringContent ? displayedContent.join("") : content}
      </div>
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
