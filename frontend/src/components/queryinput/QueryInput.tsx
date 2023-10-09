import React from "react";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import "./QueryInput.css";

interface QueryInputProps {
  question: string;
  onQuestionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}

const QueryInput: React.FC<QueryInputProps> = ({
  question,
  onQuestionChange,
  onSubmit,
}) => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div style={styles.queryWrapper}>
      <textarea
        autoFocus
        value={question}
        onChange={onQuestionChange}
        placeholder="Type your question here..."
        className="textAreaStyle"
        style={styles.textArea}
        onKeyDown={handleKeyDown}
      />
      <div style={styles.buttonArea}>
        <Button
          style={styles.floatButton}
          onClick={onSubmit}
          icon={<SendOutlined />}
        />
      </div>
    </div>
  );
};

const baseStyles: ViewStyles = {
  queryWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  textArea: {
    boxSizing: "border-box",
    padding: "0.5rem",
    height: "100%",
    width: "89%",
    resize: "none",
  },
  buttonArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "10%",
    height: "100%",
  },
  floatButton: {
    width: "100%",
    height: "100%",
    border: "none",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default QueryInput;
