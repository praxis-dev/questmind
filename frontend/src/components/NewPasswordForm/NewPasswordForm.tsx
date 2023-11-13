import React from "react";

import { Form, Input, message } from "antd";

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

  const onFinish = async (values: FormValues) => {
    console.log("Form Values:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="new password"
          name="password"
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
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

const baseStyles: ViewStyles = {};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default NewPasswordForm;
