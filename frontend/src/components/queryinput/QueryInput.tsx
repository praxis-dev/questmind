import React, { useEffect } from "react";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

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

  const isTyping = useSelector((state: RootState) => state.typing.isTyping);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  useEffect(() => {
    console.log("isTyping changed:", isTyping);
  }, [isTyping]);

  useEffect(() => {
    console.log("isLoading changed:", isLoading);
  }, [isLoading]);

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
          disabled={isTyping || isLoading}
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
    lineHeight: "1.5",
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
