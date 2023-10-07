import React, { useState, useEffect } from "react";

import { Button, Input, Card, Typography, Row, Col, Space, Spin } from "antd";
import axios from "axios";

import { useResponsiveStyles } from "../library/hooks";
import { Breakpoint, ViewStyles } from "../library/styles";

const { Title } = Typography;
const { TextArea } = Input;

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
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Space style={styles.chatSpace} direction="vertical">
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
        </Col>
        <Col span={24}>
          <Space direction="vertical" style={styles.querySpace}>
            <TextArea
              rows={4}
              value={question}
              onChange={handleQuestionChange}
              placeholder="Type your question here..."
            />
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ marginTop: "1rem" }}
            >
              Submit
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

const baseStyles: ViewStyles = {
  section: {
    maxWidth: 1000,
    height: "100%",
    margin: "0 auto",
    padding: 30,
    border: "1px solid red",
  },
  chatSpace: {
    width: "100%",
  },
  responseSpace: {
    width: "100%",
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
