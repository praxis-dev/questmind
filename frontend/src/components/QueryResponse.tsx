import React, { useState, useEffect } from "react";

import { Button, Input, Card, Typography, Row, Col, Space } from "antd";
import axios from "axios";

import { useResponsiveStyles } from "../library/hooks";
import { Breakpoint, ViewStyles } from "../library/styles";

const { Title } = Typography;
const { TextArea } = Input;

const QueryResponse: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);

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
      const result = await axios.post("http://localhost:8081/respond/", {
        question,
      });
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div style={styles.section}>
      <Row>
        <Col span={24}>
          <Space direction="vertical" style={styles.mainSpace}>
            {response && (
              <Card style={styles.responseCard} title="AI Response">
                <Typography.Text>{response}</Typography.Text>
              </Card>
            )}
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
  mainSpace: {
    width: "100%",
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
