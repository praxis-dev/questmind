import React, { useState } from "react";
import { Button, Input, Card, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

const QueryResponse: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);

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
    <div style={{ padding: "2rem" }}>
      <Title level={2}>Ask the AI</Title>
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
      {response && (
        <Card style={{ marginTop: "2rem" }} title="AI Response">
          {response}
        </Card>
      )}
    </div>
  );
};

export default QueryResponse;
