import React, { useState } from "react";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { useSelector } from "react-redux";
import { RootState } from "../../store";

import styled from "styled-components";

import "./QueryInput.css";
interface StyledIconProps {
  disabled: boolean;
}

const LargeSendOutlined = styled(SendOutlined)<StyledIconProps>`
  font-size: 22px;
  color: ${(props) => (props.disabled ? "grey" : "#cd7f32")};
`;

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

  const [isActive, setIsActive] = useState(false);

  const [isWarningVisible, setWarningVisible] = useState(false);

  let minLengthMessage = "";
  const charsNeeded = 20 - question.length;
  const MAX_LENGTH = 1000;
  const charsLeft = MAX_LENGTH - question.length;
  let counterMessage = "";

  if (charsNeeded > 0) {
    minLengthMessage = `${charsNeeded} more characters`;
  }

  if (charsLeft >= 0) {
    counterMessage = `${charsLeft} characters left`;
  } else {
    const excessChars = Math.abs(charsLeft);
    counterMessage = `Reduce query length by ${excessChars} characters`;
  }

  const isTyping = useSelector((state: RootState) => state.typing.isTyping);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const isDisabled = charsLeft < 0 || charsNeeded > 0 || isTyping || isLoading;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isDisabled) {
        onSubmit();
      }
    }
  };

  return (
    <div style={styles.componentWrapper}>
      <div style={styles.charsLeftContainer}>
        {isActive && (
          <>
            {charsNeeded > 0 && <>{minLengthMessage}</>}
            {charsLeft < 50 && <>{counterMessage}</>}
          </>
        )}
      </div>
      <div style={styles.queryWrapper}>
        <textarea
          onFocus={() => {
            setIsActive(true);
            setWarningVisible(true);
          }}
          onBlur={() => {
            setIsActive(false);
            setWarningVisible(false);
          }}
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
          >
            <LargeSendOutlined disabled={isDisabled} />
          </Button>
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
    height: "100%",
    width: "89%",
    resize: "none",
    lineHeight: "1.5",
    fontSize: "14px",
  },

  buttonArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "10%",
    height: "100%",
  },

  floatButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: "14px",
    paddingLeft: "1rem",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default QueryInput;
