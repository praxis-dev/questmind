import React from "react";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { Row, Col, Space } from "antd";

import NewPasswordForm from "../../components/NewPasswordForm/NewPasswordForm";

const PasswordRecovery: React.FC = () => {
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });
  return (
    <Row>
      <Col span={24}>
        <Space style={styles.space}>
          <NewPasswordForm />
        </Space>
      </Col>
    </Row>
  );
};

const baseStyles: ViewStyles = {
  space: {
    width: "90%",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid yellow",
    margin: "0 auto",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default PasswordRecovery;
