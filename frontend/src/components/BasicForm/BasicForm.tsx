import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../store";

import { createUser } from "../../services/createUser";
import { authenticateUser } from "../../services/authenticateUser";
import { resetPasswordRequest } from "../../services/resetPasswordRequest";

import type { FormInstance } from "antd";

import { useDispatch } from "react-redux";

import { setFormState } from "../../store/slices/formSlice";

import { PASSWORD_REGEX } from "../../utils/constants";

import PulsatingButtonWithText from "../PulsatingButtonWithText/PulsatingButtonWithText";

const SubmitButton = ({ form }: { form: FormInstance }) => {
  const [submittable, setSubmittable] = React.useState(false);

  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [values, form]);

  return (
    <PulsatingButtonWithText disabled={!submittable}>
      Submit
    </PulsatingButtonWithText>
  );
};

type SignupValues = {
  email: string;
  password: string;
};

type LoginValues = {
  email: string;
  password: string;
};

type RecoverValues = {
  email: string;
};

type FormValues = SignupValues | LoginValues | RecoverValues;

const BasicForm: React.FC = () => {
  const [form] = Form.useForm();
  const formState = useSelector((state: RootState) => state.form.form);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (values: SignupValues) => {
    const response = await createUser({
      email: values.email,
      password: values.password,
    });
    message.success("Account created successfully");
    dispatch(setFormState("noform"));
    navigate("/");
  };

  const handleLogin = async (values: LoginValues) => {
    const response = await authenticateUser({
      email: values.email,
      password: values.password,
    });
    message.success(response.message);
    form.resetFields();
    navigate("/");
  };

  const handleRecover = async (values: RecoverValues) => {
    const response = await resetPasswordRequest({ email: values.email });
    message.success("Password reset email sent. Please check your inbox.");
    form.resetFields();
    dispatch(setFormState("noform"));
  };

  const formActions = {
    noform: async (_values: FormValues) => {},
    signup: (values: FormValues) => handleSignup(values as SignupValues),
    login: (values: FormValues) => handleLogin(values as LoginValues),
    recover: (values: FormValues) => handleRecover(values as RecoverValues),
  };

  const onFinish = async (values: FormValues) => {
    if (values.email) {
      values.email = values.email.toLowerCase();
    }
    try {
      await formActions[formState](values);
    } catch (error) {
      console.error("Error:", error);
      if (typeof error === "string") {
        message.error(error);
      } else if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("An error occurred");
      }
    }
  };

  const handleRecoverPassword = () => {
    dispatch(setFormState("recover"));
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "The input is not a valid email!" },
        ]}
      >
        <Input />
      </Form.Item>

      {formState !== "recover" && (
        <>
          <Form.Item
            label="Password"
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
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="link"
              onClick={handleRecoverPassword}
              style={{ padding: 0, height: "auto", lineHeight: "inherit" }}
            >
              Recover password
            </Button>
          </Form.Item>
        </>
      )}

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <SubmitButton form={form} />
      </Form.Item>
    </Form>
  );
};

export default BasicForm;
