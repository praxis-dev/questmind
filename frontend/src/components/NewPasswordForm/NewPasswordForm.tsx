import React, { useState } from "react";

import { Form, Input, message, Button } from "antd";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { PASSWORD_REGEX } from "../../utils/constants";

type FormValues = {
  password: string;
};

const NewPasswordForm: React.FC = () => {
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
    console.log("Form Values:", values);
    // Handle form submission
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

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      style={styles.wrapper}
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        wrapperCol={{ offset: 8, span: 16 }}
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
        <Input style={styles.item} placeholder="Password" />
      </Form.Item>

      <Form.Item
        wrapperCol={{ offset: 8, span: 16 }}
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
          style={styles.item}
          onBlur={handleConfirmBlur}
          placeholder="Confirm Password"
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" disabled={!isPasswordMatch}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const baseStyles: ViewStyles = {
  wrapper: {
    margin: "auto",
    border: "1px solid #ccc",
    maxWidth: 600,
  },

  item: {
    marginBottom: 0,
    border: "1px solid #ccc",
  },

  input: {
    border: "1px solid red",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default NewPasswordForm;
