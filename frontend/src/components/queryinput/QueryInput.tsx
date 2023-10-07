import React from "react";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

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

  return (
    <div style={styles.queryWrapper}>
      <textarea
        value={question}
        onChange={onQuestionChange}
        placeholder="Type your question here..."
        style={styles.textArea}
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
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  textArea: {
    boxSizing: "border-box",
    padding: "0.5rem",
    height: "100%",
    width: "90%",
    resize: "none",
    border: "none",
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
