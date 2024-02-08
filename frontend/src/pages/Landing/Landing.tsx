// Landing.tsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { Row, Col, Space, Typography, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

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
                  <AnimateHeight
                    id="example-panel"
                    duration={500}
                    height={height}
                    style={styles.animateHeight}
                    className="textAreaStyle"
                  >
                    <Space direction="vertical" style={styles.border}>
                      <Typography>
                        The dataset of QuestMind.AI is now enriched with the
                        timeless insights of Seneca, Marcus Aurelius, and
                        Epictetus.
                      </Typography>
                      <Typography>
                        Ask a question, and discover how the stoic wisdom of
                        ages can guide you towards a constructive frame of mind,
                        encouraging you to find solutions within.
                      </Typography>
                      <Typography>
                        Its style is modern to focus on the essence of the Stoic
                        philosophy instead of the archaic language of the
                        original texts.
                      </Typography>
                      <Typography>
                        This is a work in progress. For suggestions please{" "}
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
                        If QuestMind.AI aids you in your journey, consider
                        supporting its development on{" "}
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
                      ></Space>
                    </Space>

                    <Space style={styles.expandButtonSpace}>
                      <Button
                        type="link"
                        onClick={() => dispatch(setHeight(0))}
                      >
                        <DownOutlined
                          style={styles.closeAboutIcon}
                          className={`${height !== 0 ? "rotate" : ""} icon`}
                        />
                      </Button>
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
    padding: "0px 0px 10px",
    marginBottom: "0px",
    maxHeight: "200px",
    overflowY: "auto",
    borderBottom: "1px solid #cd7f32",
    borderRadius: "0px",
  },

  animateHeightWrapper: {
    margin: "0 auto",
    maxWidth: "300px",
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
