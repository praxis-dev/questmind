import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { Row, Col, Space, Modal, Typography, Button } from "antd";
import AnimateHeight from "react-animate-height";

import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useDispatch } from "react-redux";
import { setFormState } from "../../store/slices/formSlice";

import BasicForm from "../../components/BasicForm/BasicForm";

import PulsatingButtonWithText from "../../components/PulsatingButtonWithText/PulsatingButtonWithText";

import Logo from "../../assets/logo_optimized.png";

const Landing: React.FC = () => {
  const location = useLocation();

  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isSignupModalVisible, setIsSignupModalVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formState = useSelector((state: RootState) => state.form.form);

  useEffect(() => {
    if (formState === "noform") {
      setIsLoginModalVisible(false);
      setIsSignupModalVisible(false);
    }
  }, [formState]);

  const signupModalTitle =
    formState === "signup"
      ? "Sign Up"
      : formState === "recover"
      ? "Recover Password"
      : "Login";

  const loginModalTitle =
    formState === "login"
      ? "Login"
      : formState === "recover"
      ? "Recover Password"
      : "Login";

  const showLoginModal = () => {
    dispatch(setFormState("login"));
    setIsLoginModalVisible(true);
  };

  const showSignupModal = () => {
    dispatch(setFormState("signup"));
    setIsSignupModalVisible(true);
  };

  const handleLoginOk = () => {
    dispatch(setFormState("noform"));
    setIsLoginModalVisible(false);
  };

  const handleSignupOk = () => {
    dispatch(setFormState("noform"));
    setIsSignupModalVisible(false);
  };

  const handlePrivacyClick = () => {
    navigate("/privacy");
  };

  useEffect(() => {
    const getTokenFromUrl = () => {
      const query = new URLSearchParams(location.search);
      return query.get("token");
    };

    const token = getTokenFromUrl();

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [location]);

  const [height, setHeight] = useState(0);

  return (
    <Row>
      <Col span={24} style={styles.mainCol}>
        <Space direction="vertical" size="small" style={styles.contentSpace}>
          <img
            src={Logo}
            width="200"
            alt="QuestMind.AI Logo - AI-Powered mentor and advisor"
            style={styles.alteredMargin}
          />

          <h1 style={styles.alteredMargin}>QuestMind.AI</h1>
          <h2 style={styles.alteredMargin}>
            Your companion in the quest for understanding
          </h2>
          <Space direction="vertical" style={styles.textArea}>
            <button
              aria-expanded={height !== 0}
              aria-controls="example-panel"
              onClick={() => setHeight(height === 0 ? 270 : 0)}
            >
              {height === 0 ? "Open" : "Close"}
            </button>

            <AnimateHeight
              id="example-panel"
              duration={500}
              height={height} // see props documentation below
            >
              <Typography>
                Hi! My name is Igor. I'm building QuestMind.AI to have an
                assistant to think through life situations and produce a
                constructive frame of mind.
              </Typography>
              <Typography>
                Ask it a question, and the collective wisdom of humanity
                responds. But it won't lecture you. Instead, it will try to
                prompt you into finding a solution by yourself.
              </Typography>
              <Typography>
                It's a work in progress. For feedback and suggestions, please{" "}
                <Typography.Link
                  href="https://twitter.com/InferenceOne"
                  target="_blank"
                  style={{ color: "#cd7f32" }}
                >
                  reach out
                </Typography.Link>{" "}
                to me at X.
              </Typography>
            </AnimateHeight>
          </Space>
          <Space direction="horizontal" style={styles.contentSpace}>
            <PulsatingButtonWithText disabled={false} onClick={showLoginModal}>
              Login
            </PulsatingButtonWithText>
            <Modal
              style={{ top: 20 }}
              title={loginModalTitle}
              open={isLoginModalVisible}
              onOk={handleLoginOk}
              onCancel={() => setIsLoginModalVisible(false)}
              footer={[null]}
            >
              <BasicForm />
            </Modal>

            <PulsatingButtonWithText disabled={false} onClick={showSignupModal}>
              Sign Up
            </PulsatingButtonWithText>
            <Modal
              style={{ top: 20 }}
              title={signupModalTitle}
              open={isSignupModalVisible}
              onOk={handleSignupOk}
              onCancel={() => setIsSignupModalVisible(false)}
              footer={[null]}
            >
              <BasicForm />
            </Modal>
          </Space>
          <Space direction="vertical">
            <Typography>v 0.2.1</Typography>
            <Button
              style={{
                padding: 0,
                height: "auto",
                lineHeight: "inherit",
                color: "grey",
              }}
              type="link"
              onClick={handlePrivacyClick}
            >
              Privacy Policy
            </Button>
          </Space>
        </Space>
      </Col>
    </Row>
  );
};

const baseStyles: ViewStyles = {
  alteredMargin: {
    margin: "0 0 0 0",
  },

  mainCol: {
    height: "97vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  contentSpace: {
    margin: "auto auto",
    boxSizing: "border-box",
    padding: "20px",
    maxWidth: "450px",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid red",
  },

  textArea: {
    maxWidth: "400px",
    marginTop: "10px",
    textAlign: "left",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default Landing;
