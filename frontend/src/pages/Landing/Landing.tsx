import React, { useState } from "react";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { Row, Col, Space, Button, Modal } from "antd";

import { useDispatch } from "react-redux";

import { setFormState } from "../../store/slices/formSlice";

import BasicForm from "../../components/BasicForm/BasicForm";

const Landing: React.FC = () => {
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

  return (
    <div>
      <Row>
        <Col span={24} style={styles.test}>
          <Space direction="vertical" style={styles.contentSpace}>
            <h1>QuestMind.AI</h1>
            <h2>
              Unlock Your Potential with Our AI-Powered Psychological Advisor
            </h2>
            <div style={styles.textArea}>
              Welcome to the forefront of personal growth and mental well-being.
              Our cutting-edge psychological AI advisor is tailored to
              understand and guide you through life's complexities.
            </div>
            <div style={styles.textArea}>
              Experience personalized insights and advice, crafted by the
              synergy of advanced AI and psychological expertise.
            </div>

            <div style={styles.textArea}>
              Join our community today and embark on a transformative journey
              towards a more insightful, balanced you.
            </div>
            <Space direction="horizontal" style={styles.contentSpace}>
              <Button
                type="primary"
                style={styles.buttonStyle}
                onClick={showLoginModal}
              >
                Login
              </Button>
              <Modal
                style={{ top: 20 }}
                title="Login"
                open={isLoginModalVisible}
                onOk={handleLoginOk}
                onCancel={() => setIsLoginModalVisible(false)}
                footer={[null]}
              >
                <BasicForm />
              </Modal>

              <Button
                type="primary"
                style={styles.buttonStyle}
                onClick={showSignupModal}
              >
                Sign Up
              </Button>
              <Modal
                style={{ top: 20 }}
                title="Sign Up"
                open={isSignupModalVisible}
                onOk={handleSignupOk}
                onCancel={() => setIsSignupModalVisible(false)}
                footer={[null]}
              >
                <BasicForm />
              </Modal>
            </Space>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

const baseStyles: ViewStyles = {
  test: {
    border: "1px solid red",
    height: "100vh",
  },

  contentSpace: {
    margin: "auto auto",
    boxSizing: "border-box",
    padding: "20px",
    maxWidth: "800px",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
  },

  textArea: {
    textAlign: "left",
  },

  buttonStyle: {
    width: "100px",
    backgroundColor: "white",
    color: "black",
    borderColor: "black",
    boxShadow: "0 0 0 1px black",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default Landing;
