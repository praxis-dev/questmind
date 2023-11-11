import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Rule } from "rc-field-form/lib/interface";
import { FieldData } from "rc-field-form/lib/interface";

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const passwordRule: Rule = {
  validator: (_, value) => {
    if (!value || passwordRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "Password must be at least 8 characters long and include digits, letters, and symbols."
      )
    );
  },
};

const BasicForm: React.FC = () => {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormChange = (_: any, allFields: FieldData[]) => {
    const requiredFields = ["username", "password"]; // List of required field names
    const areAllFieldsTouched = requiredFields.every((fieldName) =>
      allFields.some((field) => field.name[0] === fieldName && field.touched)
    );
    const areAllFieldsValid = allFields.every(
      (field) => field.errors?.length === 0
    );

    setIsFormValid(areAllFieldsTouched && areAllFieldsValid);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFieldsChange={handleFormChange}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="username"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "The input is not a valid email!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Please input your password!" },
          passwordRule,
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" disabled={!isFormValid}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BasicForm;
