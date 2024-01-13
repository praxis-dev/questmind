// QueryResponse.tsx (frontend main page)

import React, { useState, useEffect, useRef } from "react";

import { v4 } from "uuid";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "redux";

import { setIsLoading } from "../../store/slices/loadingSlice";
import { fetchDialogues } from "../../store/slices/dialogueIndexSlice";
import {
  addMessage,
  selectChatMessages,
  setMessages,
} from "../../store/slices/chatSlice";

import { addChunk, resetChunks } from "../../store/slices/currentMessageSlice";

import { setSelectedDialogueId } from "../../store/slices/dialogueIdSlice";

import { RootState } from "../../store";

import QueryInput from "../../components/QueryInput/QueryInput";
import MessageCard from "../../components/MessageCard/MessageCard";

import { fetchResponse } from "../../services/fetchResponse";

import { ScalingSquaresSpinner } from "react-epic-spinners";

import { Space } from "antd";

import "./QueryResponse.css";

import messagesConfig from "../../utils/messagesConfig";

interface ErrorResponse {
  response?: {
    status: number;
  };
}

const QueryResponse: React.FC = () => {
  const [question, setQuestion] = useState<string>("");

  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

  const chatSpaceRef = React.useRef<HTMLDivElement>(null);
  const selectedDialogueId = useSelector(
    (state: RootState) => state.dialogue.selectedDialogueId
  );

  const chatMessages = useSelector(selectChatMessages);

  const accumulatedChunks = useSelector(
    (state: RootState) => state.currentMessage.chunks
  );

  const handleSubmit = () => {
    try {
      dispatch(addMessage({ id: v4(), type: "user", text: question }));

      setQuestion("");
      dispatch(setIsLoading(true));
      setIsTyping(true);

      fetchResponse(
        question,
        selectedDialogueId,
        (chunk) => {
          dispatch(addChunk(chunk));
        },
        () => {
          dispatch(setIsLoading(false));
          setIsTyping(false);
          if (!selectedDialogueId) {
            dispatch(fetchDialogues());
          }
        },
        (newDialogueId) => {
          console.log("Received newDialogueId:", newDialogueId);
          dispatch(setSelectedDialogueId(newDialogueId));
        }
      );
    } catch (error: unknown) {
      console.error("Error setting up response stream:", error);
      dispatch(setIsLoading(false));
      setIsTyping(false);

      let errorMessage: string;
      if (typeof error === "object" && error !== null && "response" in error) {
        const typedError = error as ErrorResponse;
        if (typedError.response?.status === 500) {
          errorMessage = messagesConfig.serverError;
        } else {
          errorMessage = messagesConfig.unexpectedError;
        }
      } else {
        errorMessage = messagesConfig.networkError;
      }

      dispatch(addMessage({ id: v4(), type: "ai", text: errorMessage }));
    }
  };

  useEffect(() => {
    if (accumulatedChunks.length > 0 && !isLoading) {
      const completeMessage = accumulatedChunks.join(" ");
      dispatch(addMessage({ id: v4(), type: "ai", text: completeMessage }));
      dispatch(resetChunks());
    }
  }, [accumulatedChunks, isLoading, dispatch]);

  const selectDialogue = (state: RootState) =>
    state.dialogueDetails.selectedDialogue;

  const dialogue = useSelector(selectDialogue);

  const isFirstRender = useRef(true);

  useEffect(() => {
    console.log("Updated selectedDialogueId:", selectedDialogueId);
  }, [selectedDialogueId]);

  useEffect(() => {
    if (
      isFirstRender.current &&
      chatMessages.length === 0 &&
      (!dialogue || dialogue.messages.length === 0)
    ) {
      const randomIndex = Math.floor(
        Math.random() * messagesConfig.introductory.length
      );
      const randomIntroductoryMessage =
        messagesConfig.introductory[randomIndex];

      dispatch(
        addMessage({
          id: v4(),
          type: "ai",
          text: randomIntroductoryMessage,
        })
      );
      isFirstRender.current = false;
    }
  }, [chatMessages.length, dialogue, dispatch]);

  useEffect(() => {
    if (isTyping && chatSpaceRef.current) {
      const element = chatSpaceRef.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isTyping]);

  useEffect(() => {
    if (dialogue && dialogue.messages) {
      const formattedMessages = dialogue.messages.map((msg) => {
        const messageType: "user" | "ai" =
          msg.sender === "user" || msg.sender === "ai" ? msg.sender : "ai";

        return {
          id: v4(),
          type: messageType,
          text: msg.message,
        };
      });
      dispatch(setMessages(formattedMessages));
    }
  }, [dialogue, dispatch]);

  useEffect(() => {
    const element = chatSpaceRef.current;

    const handleScroll = () => {
      if (element) {
        const isAtBottom =
          element.scrollHeight - element.clientHeight <= element.scrollTop + 5;

        setHasUserScrolled(!isAtBottom);
      }
    };

    if (element) {
      element.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasUserScrolled && chatSpaceRef.current) {
      const element = chatSpaceRef.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, hasUserScrolled]);

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

  return (
    <div style={styles.section}>
      <div style={styles.mainCol}>
        <div style={styles.contentSpace}>
          <Space
            direction="vertical"
            style={styles.chatSpace}
            className="chatSpace"
            ref={chatSpaceRef}
          >
            {chatMessages.map((message, index) => (
              <MessageCard
                key={index}
                title={message.type === "user" ? "You:" : "QuestMind:"}
                content={[message.text]}
                type={message.type}
                onContentUpdate={() => {
                  if (!hasUserScrolled && chatSpaceRef.current) {
                    const element = chatSpaceRef.current;
                    setTimeout(() => {
                      element.scrollTo({
                        top: element.scrollHeight,
                      });
                    }, 0);
                  }
                }}
                showShareButton={
                  !(
                    messagesConfig.introductory.includes(message.text) ||
                    messagesConfig.notExpert === message.text ||
                    messagesConfig.unexpectedError === message.text ||
                    messagesConfig.networkError === message.text ||
                    messagesConfig.serverError === message.text
                  )
                }
                userQuestion={
                  message.type === "ai"
                    ? chatMessages[index - 1]?.text
                    : undefined
                }
              />
            ))}
            {isLoading && (
              <Space style={{ display: "flex", justifyContent: "center" }}>
                <ScalingSquaresSpinner color="#cd7f32" size={27} />
              </Space>
            )}
            {isLoading && accumulatedChunks.length > 0 && (
              <MessageCard
                key="ongoing-message"
                title="QuestMind:"
                content={accumulatedChunks}
                type="ai"
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
    height: "95vh",
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
    height: "90%",
    overflowY: "auto",
    marginBottom: 20,
  },

  querySpace: {
    width: "100%",
    height: "10%",
    minHeight: 100,
  },
  responseCard: {
    whiteSpace: "pre-line",
    textAlign: "left",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {
  section: {
    height: "93.2vh",
  },
};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {
  section: {
    height: "93.5vh",
  },
};

const extraSmallScreenStyles: ViewStyles = {
  section: {
    height: "93.5vh",
  },
};

export default QueryResponse;
