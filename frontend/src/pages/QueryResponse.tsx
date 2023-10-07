import React, { useState, useEffect } from "react";

import { Button, Input, Card, Typography, Row, Col, Space, Spin } from "antd";
import axios from "axios";

import { useResponsiveStyles } from "../library/hooks";
import { Breakpoint, ViewStyles } from "../library/styles";

import QueryInput from "../components/queryinput/QueryInput";
import MessageCard from "../components/MessageCard/MessageCard";

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
              <MessageCard
                key={index}
                title={message.type === "user" ? "You" : "AI Response"}
                content={message.text}
              />
            ))}
            {isLoading && (
              <MessageCard
                title="AI is thinking..."
                content={
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div
                      style={{
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        borderTop: "4px solid #555",
                        width: "20px",
                        height: "20px",
                      }}
                    ></div>
                  </div>
                }
              />
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
  },

  section: {
    boxSizing: "border-box",
    maxWidth: 1000,
    margin: "0 auto",
    padding: 20,
    height: "100%",
  },

  contentSpace: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },

  chatSpace: {
    width: "100%",
    height: "80%",
    overflowY: "scroll",
  },

  querySpace: {
    width: "100%",
    height: "20%",
    minHeight: 180,
  },
  responseCard: {
    whiteSpace: "pre-line",
    textAlign: "left",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default QueryResponse;
