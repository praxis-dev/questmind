// messageCard.tsx (frontend component for an individual message card)

import React, { ReactNode } from "react";
import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";
import { SocialIcon } from "react-social-icons";

interface MessageCardProps {
  title: string;
  content: string[];
  type: "user" | "ai";
  onContentUpdate?: () => void;
  showShareButton?: boolean;
  userQuestion?: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  title,
  content,
  type,
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

  const preprocessContent = (
    content: string | ReactNode
  ): string | ReactNode => {
    if (typeof content !== "string") return content;

    let modifiedContent = content.replace(/\[Your\s+Name\]/gi, "QuestMind.AI");

    modifiedContent = modifiedContent.startsWith("\n")
      ? modifiedContent.slice(1)
      : modifiedContent;

    return modifiedContent;
  };

  const processedContent = preprocessContent(content);

  const renderContentChunks = content.map((chunk, index) => (
    <p key={index}>{chunk}</p>
  ));

  const shareToTwitter = (event: React.MouseEvent) => {
    event.preventDefault();
    const aiResponse = title === "QuestMind:" ? contentStr : "";
    const tweetText = encodeURIComponent(
      `Question: ${userQuestion}\n\nQuestMind: ${aiResponse} \n\n#QuestMind \n\nAsk your own question at https://questmind.ai`
    );
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div style={styles.cardWrapper}>
      <div style={styles.topRow}>
        <div style={styles.cardTitle}>{title}</div>
        {type === "ai" && showShareButton && (
          <SocialIcon
            url="www.x.com"
            style={styles.shareIcon}
            fgColor="black"
            bgColor="transparent"
            onClick={(event) => shareToTwitter(event)}
          />
        )}
      </div>
      <div style={styles.cardContent}> {renderContentChunks}</div>
    </div>
  );
};

const baseStyles: ViewStyles = {
  shareIcon: {
    height: "1.5rem",
    width: "1.5rem",
  },

  disabledShareIcon: {
    fontSize: "14px",
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
    textAlign: "left",
    marginRight: "10px",
  },
  cardContent: {
    fontSize: "14px",
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
