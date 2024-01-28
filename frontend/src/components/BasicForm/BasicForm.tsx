import React, { useEffect } from "react";
import { Button, Form, Input, message, Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../store";

import { authenticateUser } from "../../services/authenticateUser";
import { createUser } from "../../services/createUser";
import { resetPasswordRequest } from "../../services/resetPasswordRequest";

import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import type { FormInstance } from "antd";

import { useDispatch } from "react-redux";

import { setFormState } from "../../store/slices/formSlice";

import { PASSWORD_REGEX } from "../../utils/constants";

import PulsatingButtonWithText from "../PulsatingButtonWithText/PulsatingButtonWithText";

import GoogleSignInButton from "../../GoogleSignInButton/GoogleSignInButton";

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
  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const [form] = Form.useForm();
  const formState = useSelector((state: RootState) => state.form.form);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (values: SignupValues) => {
    try {
      await createUser({
        email: values.email,
        password: values.password,
      });
      message.success("Account created successfully");
      dispatch(setFormState("noform"));
      navigate("/");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
          ? error.message
          : "An unknown error occurred.";
      message.error(errorMessage);
    }
  };

  type FormState = "signup" | "login" | "recover" | "noform";

  const formTitles: { [key in FormState]: string } = {
    signup: "Sign Up",
    login: "Login",
    recover: "Recover Password",
    noform: "Sign Up",
  };

  const getFormTitle = (formState: FormState): string =>
    formTitles[formState] || "Sign Up";

  const handleLogin = async (values: LoginValues) => {
    try {
      const response = await authenticateUser({
        email: values.email,
        password: values.password,
      });
      message.success(response.message);
      form.resetFields();
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed: Incorrect email or password";
      message.error(errorMessage);
    }
  };

  const handleRecover = async (values: RecoverValues) => {
    try {
      await resetPasswordRequest({
        email: values.email,
      });
      message.success("Password reset email sent. Please check your inbox.");
      form.resetFields();
      dispatch(setFormState("noform"));
    } catch (error) {
      let errorMessage: string;
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = "Error sending password reset email";
      }
      message.error(errorMessage);
    }
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

  const toggleFormState = () => {
    dispatch(setFormState(formState === "login" ? "signup" : "login"));
  };

  useEffect(() => {
    dispatch(setFormState("signup"));
  }, [dispatch]);

  return (
    <div style={styles.formContainer}>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="on"
        style={styles.form}
      >
        <Typography.Title
          level={4}
          style={{ textAlign: "center", margin: "0 0 20px" }}
        >
          {getFormTitle(formState)}
        </Typography.Title>
        <Form.Item
          style={styles.formItem}
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "The input is not a valid email!" },
          ]}
        >
          <Input style={styles.input} />
        </Form.Item>

        {formState !== "recover" && (
          <>
            <Form.Item
              style={styles.formItem}
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
              <Input.Password style={styles.input} />
            </Form.Item>
          </>
        )}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={styles.formItem}>
          <Space
            align="center"
            direction="horizontal"
            style={{
              justifyContent: "space-between",
            }}
          >
            <SubmitButton form={form} />
            <GoogleSignInButton />
          </Space>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={styles.formItem}>
          <Space direction="horizontal" size="small">
            <Button
              type="link"
              disabled={false}
              onClick={toggleFormState}
              style={{
                padding: 0,
                height: "auto",
                lineHeight: "inherit",
                color: "#cd7f32",
              }}
            >
              {formState === "signup" ? "Login" : "Sign Up"}
            </Button>
            <Button
              type="link"
              onClick={handleRecoverPassword}
              style={{
                padding: 0,
                height: "auto",
                lineHeight: "inherit",
                color: "#cd7f32",
              }}
            >
              Recover password
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

const baseStyles: ViewStyles = {
  formContainer: {
    boxSizing: "border-box",
    margin: "0 0 50px",
  },

  form: {},

  formItem: {
    margin: "0 0 10px",
  },

  input: {},
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {
  headerContainer: {
    minHeight: "6vh",
  },
};

export default BasicForm;
