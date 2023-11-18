import React, { useState, useEffect } from "react";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../../store/slices/loadingSlice";
import { RootState } from "../../store";

import QueryInput from "../../components/QueryInput/QueryInput";
import MessageCard from "../../components/MessageCard/MessageCard";

import { fetchResponse } from "../../services/fetchResponse";

import { ScalingSquaresSpinner } from "react-epic-spinners";

import { Space } from "antd";

import "./QueryResponse.css";

interface ErrorResponse {
  response?: {
    status: number;
  };
}

const QueryResponse: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ type: "user" | "ai"; text: string }>
  >([]);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const dispatch = useDispatch();

  const chatSpaceRef = React.useRef<HTMLDivElement>(null);

  const messagesConfig = {
    introductory:
      "Hi, I am your personal AI mentor specialized in psychology and philosophy. In need of swift, insightful advice? Wrestling with a situation or pondering a thought? Feel free to ask me anything. Let's delve deep and find clarity together.",
    notExpert: "This is not my area of expertise.",
    unexpectedError: "An unexpected error occurred. Please try again later.",
    networkError:
      "We're having trouble reaching our servers. Please check your connection and try again.",
    serverError:
      "Seems like we are experiencing issues on our end, please try with your request a bit later.",
  };
  const selectDialogue = (state: RootState) =>
    state.dialogueDetails.selectedDialogue;

  const dialogue = useSelector(selectDialogue);

  useEffect(() => {
    if (dialogue) {
      console.log("Dialogue updated:", dialogue);
    }
  }, [dialogue]);

  useEffect(() => {
    const introductoryMessage: { type: "ai"; text: string } = {
      type: "ai",
      text: messagesConfig.introductory,
    };
    if (
      chatMessages.length === 0 &&
      (!dialogue || dialogue.messages.length === 0)
    ) {
      setChatMessages([introductoryMessage]);
    }
  }, [chatMessages.length, messagesConfig.introductory, dialogue]);

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
        // Ensure that type is either 'user' or 'ai'
        const messageType: "user" | "ai" =
          msg.sender === "user" || msg.sender === "ai" ? msg.sender : "ai"; // Defaulting to 'ai' in case of mismatch

        return {
          type: messageType,
          text: msg.message,
        };
      });
      setChatMessages(formattedMessages);
    }
  }, [dialogue]);

  const handleSubmit = async () => {
    try {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", text: question },
      ]);

      setQuestion("");
      dispatch(setIsLoading(true));

      const responseText = await fetchResponse(question);

      setIsTyping(true);

      setTimeout(() => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { type: "ai", text: responseText.data },
        ]);
        dispatch(setIsLoading(false));
        setIsTyping(false);
      }, 500);
    } catch (error: unknown) {
      console.error("Error fetching response:", error);
      dispatch(setIsLoading(false));

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

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: errorMessage },
      ]);
    }
  };

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
                content={message.text}
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
                  ![
                    messagesConfig.introductory,
                    messagesConfig.notExpert,
                    messagesConfig.unexpectedError,
                    messagesConfig.networkError,
                    messagesConfig.serverError,
                  ].includes(message.text)
                }
                userQuestion={
                  message.type === "ai"
                    ? chatMessages[index - 1]?.text
                    : undefined
                }
              />
            ))}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ScalingSquaresSpinner color="grey" size={27} />
              </div>
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
    height: "96%",
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

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default QueryResponse;
