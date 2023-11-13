import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import { createUser } from "../../services/createUser";
import { authenticateUser } from "../../services/authenticateUser";
import { resetPasswordRequest } from "../../services/resetPasswordRequest";

import type { FormInstance } from "antd";

import { useDispatch } from "react-redux";

import { setFormState } from "../../store/slices/formSlice";

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
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      Submit
    </Button>
  );
};

const BasicForm: React.FC = () => {
  const [form] = Form.useForm();
  const formState = useSelector((state: RootState) => state.form.form);

  const dispatch = useDispatch();

  const passwordRegex = /^(?=.*\d)[A-Za-z\d]{8,}$/;

  useEffect(() => {
    console.log("Form State:", formState);
  }, [formState]);

  const onFinish = async (values: any) => {
    console.log("Form Values:", values);

    try {
      let response;

      if (formState === "signup") {
        response = await createUser({
          email: values.email,
          password: values.password,
        });
        console.log("User created successfully:", response);
        message.success("Account created successfully");
      } else if (formState === "login") {
        response = await authenticateUser({
          email: values.email,
          password: values.password,
        });
        console.log("Login successful:", response);
        message.success(response.message);
      } else if (formState === "recover") {
        response = await resetPasswordRequest({ email: values.email });
        console.log("Password reset request successful:", response);
        message.success("Password reset email sent. Please check your inbox.");
      }
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

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
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
                  if (passwordRegex.test(value)) {
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
            <a onClick={handleRecoverPassword}>Recover password</a>
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
