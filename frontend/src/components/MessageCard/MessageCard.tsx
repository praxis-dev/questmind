import React, { ReactNode, useState, useEffect } from "react";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { useDispatch, useSelector } from "react-redux";
import { setIsTyping } from "../../store/slices/typingSlice";

import { ShareAltOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { RootState } from "../../store";

interface MessageCardProps {
  title: string;
  content: string | ReactNode;
  type: "user" | "ai";
  onContentUpdate?: () => void;
  showShareButton?: boolean;
  userQuestion?: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  title,
  content,
  type,
  onContentUpdate,
  showShareButton,
  userQuestion,
}) => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const isStringContent = typeof content === "string";
  const contentStr = isStringContent ? content : "";

  const isTyping = useSelector((state: RootState) => state.typing.isTyping);

  const [displayedContent, setDisplayedContent] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxTypingDelay = 100;

  const dispatch = useDispatch();

  const shareToTwitter = () => {
    const aiResponse = title === "Sage AI" ? contentStr : "";

    const tweetText = encodeURIComponent(
      `Question: ${userQuestion}\n\nAI Response: ${aiResponse}`
    );

    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

    window.open(twitterUrl, "_blank");
  };

  useEffect(() => {
    if (!isStringContent) return;

    if (type === "ai") {
      dispatch(setIsTyping(true));

      const typingEffect = setInterval(() => {
        if (currentIndex < contentStr.length) {
          setDisplayedContent((prev) => [...prev, contentStr[currentIndex]]);
          setCurrentIndex((prev) => prev + 1);
          if (typeof onContentUpdate === "function") {
            onContentUpdate();
          }
        } else {
          dispatch(setIsTyping(false));
          clearInterval(typingEffect);
        }
      }, Math.random() * maxTypingDelay);

      return () => clearInterval(typingEffect);
    } else {
      setDisplayedContent(contentStr.split(""));
    }
  }, [
    type,
    contentStr,
    currentIndex,
    isStringContent,
    onContentUpdate,
    dispatch,
  ]);

  return (
    <div style={styles.cardWrapper}>
      <div style={styles.topRow}>
        <div style={styles.cardTitle}>{title}</div>
        {type === "ai" && showShareButton && (
          <Button
            type="link"
            icon={<ShareAltOutlined style={styles.shareIcon} />}
            size="small"
            disabled={isTyping}
            onClick={shareToTwitter}
          />
        )}
      </div>
      <div style={styles.cardContent}>
        {isStringContent ? displayedContent.join("") : content}
      </div>
    </div>
  );
};

const baseStyles: ViewStyles = {
  shareIcon: {
    color: "gray",
  },

  cardWrapper: {
    padding: "0.5rem",
    marginBottom: "1rem",
    maxWidth: "100%",
  },

  topRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "100%",
    height: "1.5rem",
    marginBottom: "0.5rem",
  },

  cardTitle: {
    fontFamily: "monospace",
    textAlign: "left",
    marginRight: "10px",
  },
  cardContent: {
    fontFamily: "monospace",
    whiteSpace: "pre-line",
    textAlign: "left",
    lineHeight: "1.5",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default MessageCard;
