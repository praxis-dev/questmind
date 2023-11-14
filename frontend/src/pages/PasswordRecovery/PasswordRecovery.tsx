import React from "react";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { Row, Col, Space } from "antd";

import NewPasswordForm from "../../components/NewPasswordForm/NewPasswordForm";

const SuperPage: React.FC = () => {
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
        <NewPasswordForm />
      </Col>
    </Row>
  );
};

const baseStyles: ViewStyles = {};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default SuperPage;
