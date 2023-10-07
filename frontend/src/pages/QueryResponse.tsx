import React, { useState, useEffect } from "react";

import { Button, Input, Card, Typography, Row, Col, Space, Spin } from "antd";
import axios from "axios";

import { useResponsiveStyles } from "../library/hooks";
import { Breakpoint, ViewStyles } from "../library/styles";

import QueryInput from "../components/QueryInput";

const QueryResponse: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    Array<{ type: "user" | "ai"; text: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(response);
  }, [response]);

  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Adjusted type here
    setQuestion(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setChatMessages([...chatMessages, { type: "user", text: question }]);

      setQuestion("");

      setIsLoading(true);

      const result = await axios.post("http://localhost:8081/respond/", {
        question,
      });

      setChatMessages([
        ...chatMessages,
        { type: "user", text: question },
        { type: "ai", text: result.data.response },
      ]);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.mainCol}>
        <div style={styles.contentSpace}>
          <Space direction="vertical" style={styles.chatSpace}>
            {chatMessages.map((message, index) => (
              <Card
                key={index}
                title={message.type === "user" ? "You" : "AI Response"}
                style={styles.responseCard}
              >
                <Typography.Text>{message.text}</Typography.Text>
              </Card>
            ))}
            {isLoading && (
              <Card title="AI is thinking...">
                <Spin />
              </Card>
            )}
          </Space>
          <div style={styles.querySpace}>
            <QueryInput
              question={question}
              onQuestionChange={handleQuestionChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const baseStyles: ViewStyles = {
  mainCol: {
    width: "100%",
    height: "100%",
    border: "1px solid red",
  },

  section: {
    boxSizing: "border-box",
    maxWidth: 1000,
    margin: "0 auto",
    padding: 20,
    border: "1px solid black",
    height: "100%",
  },

  contentSpace: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    border: "1px solid green",
    justifyContent: "space-between",
  },

  chatSpace: {
    width: "100%",
    border: "1px solid blue",
    height: "80%",
    overflowY: "scroll",
  },

  querySpace: {
    width: "100%",
    height: "20%",
    minHeight: 180,
    border: "1px solid red",
  },
  responseCard: {
    whiteSpace: "pre-line",
    textAlign: "left",
    border: "1px solid #d9d9d9",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default QueryResponse;
