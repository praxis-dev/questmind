import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { format } from "date-fns";
import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { Space, Typography } from "antd";

import { Dialogue } from "../../services/fetchDialogueById";
import { fetchSharedDialogue } from "../../services/sharedDialogueService";

const SharedDialoguePage = () => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const { shareIdentifier } = useParams<{ shareIdentifier: string }>();
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const preprocessSender = (sender: string) => {
    switch (sender) {
      case "ai":
        return "QuestMind.AI";
      case "user":
        return "User";
      default:
        return sender;
    }
  };

  useEffect(() => {
    const fetchDialogue = async () => {
      if (typeof shareIdentifier === "string") {
        try {
          const response = await fetchSharedDialogue(shareIdentifier);
          setDialogue(response);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid dialogue identifier");
        setLoading(false);
      }
    };

    fetchDialogue();
  }, [shareIdentifier]);

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Space direction="horizontal" style={styles.contentWrapper}>
      {dialogue ? (
        <Space direction="vertical">
          <Typography.Title level={2}>
            Dialogue from {format(new Date(dialogue.createdAt), "PPpp")}
          </Typography.Title>
          {dialogue.messages.map((message, index) => (
            <Typography.Paragraph key={index}>
              <strong>{preprocessSender(message.sender)}: </strong>
              <span>{message.message}</span>
            </Typography.Paragraph>
          ))}
        </Space>
      ) : (
        <Space>No dialogue found</Space>
      )}
    </Space>
  );
};

const baseStyles: ViewStyles = {
  contentWrapper: {
    maxWidth: "800px",
    padding: "1rem",
    textAlign: "left",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default SharedDialoguePage;
