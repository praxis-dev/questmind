// Landing.tsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { Row, Col, Space, Typography, Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import AnimateHeight from "react-animate-height";

import BasicForm from "../../components/BasicForm/BasicForm";

import { setHeight, selectHeight } from "../../store/slices/heightSlice";

import Logo from "../../assets/logo_optimized.png";

import "./Landing.css";

const Landing: React.FC = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const navigate = useNavigate();

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

  const height = useSelector(selectHeight);

  return (
    <div className="hide-scrollbar">
      <Row>
        <Col span={24} style={styles.mainCol}>
          <Space direction="vertical" size="small" style={styles.contentSpace}>
            <Space direction="vertical" style={styles.alteredMargin}>
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
                <Space direction="vertical" style={styles.animateHeightWrapper}>
                  {height === 0 && (
                    <Space style={styles.expandButtonSpace}>
                      <Button
                        type="link"
                        onClick={() => dispatch(setHeight(200))}
                      >
                        <DownOutlined style={styles.closeAboutIcon} />
                      </Button>
                    </Space>
                  )}
                  <AnimateHeight
                    id="example-panel"
                    duration={500}
                    height={height}
                    style={styles.animateHeight}
                    className="textAreaStyle"
                  >
                    <Space direction="vertical" style={styles.border}>
                      <Typography>
                        Hi! My name is Igor. I'm building QuestMind.AI to have
                        an assistant to think through life situations and
                        produce a constructive frame of mind.
                      </Typography>
                      <Typography>
                        Ask it a question, and the collective wisdom of humanity
                        responds. But it won't lecture you. Instead, it will try
                        to prompt you into finding a solution by yourself.
                      </Typography>
                      <Typography>
                        It's a work in progress. For feedback and suggestions,
                        please{" "}
                        <Typography.Link
                          href="https://twitter.com/InferenceOne"
                          target="_blank"
                          style={{ color: "#cd7f32" }}
                        >
                          reach out
                        </Typography.Link>{" "}
                        to me at X.
                      </Typography>
                      <Typography>
                        If you find it useful, please support the development of
                        QuestMind.AI on{" "}
                        <Typography.Link
                          href="https://www.patreon.com/questmindai"
                          target="_blank"
                          style={{ color: "#cd7f32" }}
                        >
                          Patreon
                        </Typography.Link>
                        .
                      </Typography>

                      <Space
                        direction="horizontal"
                        style={styles.closeAboutSpace}
                      >
                        <Button
                          type="link"
                          onClick={() => dispatch(setHeight(0))}
                        >
                          <UpOutlined style={styles.closeAboutIcon} />
                        </Button>
                      </Space>
                    </Space>
                  </AnimateHeight>
                </Space>
                <Space style={styles.importFormContainer}>
                  <BasicForm />
                </Space>
              </Space>
            </Space>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

const baseStyles: ViewStyles = {
  expandButtonSpace: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  animateHeight: {
    padding: "0px",
    marginBottom: "0px",
    maxHeight: "200px",
    overflowY: "auto",
  },

  animateHeightWrapper: {
    // border: "1px solid #cd7f32",
    // padding: "10px",
    borderRadius: "10px",
    margin: "0 auto",
    maxWidth: "300px",
    transition: "border-width 0.5s ease",
  },

  border: {},

  importFormContainer: {
    marginTop: "0px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  closeAboutIcon: {
    fontSize: "22px",
    color: "#cd7f32",
    borderRadius: "50%",
  },

  closeAboutSpace: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  alteredMargin: {
    margin: "0 0 0 0",
  },

  mainCol: {
    height: "96vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowX: "hidden",
  },

  contentSpace: {
    margin: "auto auto",
    boxSizing: "border-box",
    padding: "20px 20px 20px",
    maxWidth: "450px",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textArea: {
    maxWidth: "400px",
    marginTop: "10px",
    alignItems: "center",
    textAlign: "left",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default Landing;
