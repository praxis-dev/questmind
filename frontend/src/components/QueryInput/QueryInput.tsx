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

  const MAX_LENGTH = 550;
  const charsLeft = MAX_LENGTH - question.length;
  let counterMessage = "";

  if (charsLeft >= 0) {
    counterMessage = `${charsLeft} characters left`;
  } else {
    const excessChars = Math.abs(charsLeft);
    counterMessage = `Reduce query length by ${excessChars} characters`;
  }

  const isTyping = useSelector((state: RootState) => state.typing.isTyping);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const isDisabled = charsLeft < 0 || isTyping || isLoading;

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
    <div style={styles.componentWrapper}>
      <div style={styles.charsLeftContainer}>
        {charsLeft < 50 && <>{counterMessage}</>}
      </div>
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
            disabled={isDisabled}
            style={styles.floatButton}
            onClick={onSubmit}
            icon={<SendOutlined />}
          />
        </div>
      </div>
    </div>
  );
};

const baseStyles: ViewStyles = {
  componentWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "20px",
  },

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

  charsLeftContainer: {
    height: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    lineHeight: "1.5",
    fontSize: "0.8rem",
    paddingLeft: "1rem",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default QueryInput;
