import React, { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Form, Input, message } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { PASSWORD_REGEX } from "../../utils/constants";

import { resetPassword } from "../../services/resetPassword";

import PulsatingButtonWithText from "../PulsatingButtonWithText/PulsatingButtonWithText";

type FormValues = {
  password: string;
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const NewPasswordForm: React.FC = () => {
  const query = useQuery();
  const token = query.get("token");
  const navigate = useNavigate();

  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const [form] = Form.useForm();
  const [confirmDirty, setConfirmDirty] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const onFinish = async (values: FormValues) => {
    if (token) {
      try {
        await resetPassword({ token, newPassword: values.password });
        message.success("Password reset successfully");
        navigate("/landing");
      } catch (error) {
        // console.error("Error:", error);
        if (typeof error === "string") {
          message.error(error);
        } else if (error instanceof Error) {
          message.error(error.message);
        } else {
          message.error("An error occurred");
        }
      }
    } else {
      message.error("Invalid or expired token");
    }
  };

  const handleConfirmBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const compareToFirstPassword = (_: any, value: string) => {
    const isMatch = value === form.getFieldValue("password");
    setIsPasswordMatch(isMatch);
    if (!isMatch) {
      return Promise.reject("The two passwords that you entered do not match!");
    }
    return Promise.resolve();
  };

  return (
    <Form
      style={styles.wrapper}
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="password"
        style={styles.item}
        rules={[
          {
            required: true,
            message: "Please enter password.",
          },
          {
            message: "8 characters long including at least one number.",
            validator: (_, value) => {
              if (PASSWORD_REGEX.test(value)) {
                return Promise.resolve();
              } else {
                return Promise.reject(
                  "Password must be at least 8 characters long and include at least one number."
                );
              }
            },
          },
        ]}
      >
        <Input style={styles.input} placeholder="New Password" />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={["password"]}
        hasFeedback
        style={styles.item}
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          {
            validator: compareToFirstPassword,
          },
        ]}
      >
        <Input
          style={styles.input}
          onBlur={handleConfirmBlur}
          placeholder="Confirm Password"
        />
      </Form.Item>

      <Form.Item>
        <PulsatingButtonWithText disabled={!isPasswordMatch}>
          Submit
        </PulsatingButtonWithText>
      </Form.Item>
    </Form>
  );
};

const baseStyles: ViewStyles = {
  wrapper: {
    margin: "auto",
    maxWidth: 250,
    width: "100%",
  },

  item: {
    marginBottom: 5,
    width: 250,
  },

  input: {
    width: 250,
  },

  submitButton: {
    marginTop: 10,
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

export default NewPasswordForm;
