import React, { ReactNode, useState, useEffect } from "react";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { useDispatch, useSelector } from "react-redux";
import { setIsTyping } from "../../store/slices/typingSlice";

import { SocialIcon } from "react-social-icons";
import { Button } from "antd";
import { HourglassOutlined } from "@ant-design/icons";

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
  const [isCurrentMessageTyping, setIsCurrentMessageTyping] = useState(false);

  const maxTypingDelay = 100;

  const dispatch = useDispatch();

  const shareToTwitter = (event: React.MouseEvent) => {
    event.preventDefault();

    const aiResponse = title === "QuestMind:" ? contentStr : "";

    const tweetText = encodeURIComponent(
      `Question: ${userQuestion}\n\nQuestMind: ${aiResponse} \n\n#QuestMind \n\nAsk your own question at https://questmind.ai`
    );

    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

    window.open(twitterUrl, "_blank");
  };

  useEffect(() => {
    if (!isStringContent) return;

    if (type === "ai") {
      setIsCurrentMessageTyping(true);

      const typingEffect = setInterval(() => {
        if (currentIndex < contentStr.length) {
          setDisplayedContent((prev) => [...prev, contentStr[currentIndex]]);
          setCurrentIndex((prev) => prev + 1);
          if (typeof onContentUpdate === "function") {
            onContentUpdate();
          }
        } else {
          setIsCurrentMessageTyping(false);
          clearInterval(typingEffect);
        }
      }, Math.random() * maxTypingDelay);

      return () => clearInterval(typingEffect);
    } else {
      setDisplayedContent(contentStr.split(""));
    }
  }, [type, contentStr, currentIndex, isStringContent, onContentUpdate]);

  return (
    <div style={styles.cardWrapper}>
      <div style={styles.topRow}>
        <div style={styles.cardTitle}>{title}</div>
        {type === "ai" &&
          showShareButton &&
          (isCurrentMessageTyping ? (
            <HourglassOutlined style={styles.disabledShareIcon} />
          ) : (
            <SocialIcon
              url="www.x.com"
              style={styles.shareIcon}
              fgColor="black"
              bgColor="transparent"
              onClick={(event) => shareToTwitter(event)}
            />
          ))}
      </div>
      <div style={styles.cardContent}>
        {isStringContent ? displayedContent.join("") : content}
      </div>
    </div>
  );
};

const baseStyles: ViewStyles = {
  shareIcon: {
    height: "1.5rem",
    width: "1.5rem",
  },

  disabledShareIcon: {
    fontSize: "1rem",
    color: "grey",
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
    paddingRight: "15px",
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
