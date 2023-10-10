import React, { useState, useEffect } from "react";

import { Space } from "antd";
import axios from "axios";

import { useResponsiveStyles } from "../library/hooks";
import { Breakpoint, ViewStyles } from "../library/styles";

import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../store/slices/loadingSlice";
import { RootState } from "../store";

import QueryInput from "../components/QueryInput/QueryInput";
import MessageCard from "../components/MessageCard/MessageCard";

import { ScalingSquaresSpinner } from "react-epic-spinners";

import "./QueryResponse.css";

const QueryResponse: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    Array<{ type: "user" | "ai"; text: string }>
  >([]);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const dispatch = useDispatch();

  const chatSpaceRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const introductoryMessage: { type: "ai"; text: string } = {
      type: "ai",
      text: "Hello, I'm an AI trained in philosophy. Ask me for sage advice.",
    };

    if (chatMessages.length === 0) {
      setChatMessages([introductoryMessage]);
    }
  }, []);

  useEffect(() => {
    if (isTyping && chatSpaceRef.current) {
      const element = chatSpaceRef.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isTyping]);

  const handleSubmit = async () => {
    try {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", text: question },
      ]);

      setQuestion("");
      dispatch(setIsLoading(true));

      const result = await axios.post("http://localhost:8081/respond/", {
        question,
      });

      setIsTyping(true);

      setTimeout(() => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { type: "ai", text: result.data.response },
        ]);
        dispatch(setIsLoading(false));
        setIsTyping(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching response:", error);
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (chatSpaceRef.current) {
        const element = chatSpaceRef.current;
        const isAtBottom =
          element.scrollHeight - element.clientHeight <= element.scrollTop + 5;

        setHasUserScrolled(!isAtBottom);
      }
    };

    if (chatSpaceRef.current) {
      chatSpaceRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatSpaceRef.current) {
        chatSpaceRef.current.removeEventListener("scroll", handleScroll);
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
                title={message.type === "user" ? "You" : "Sage AI"}
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
