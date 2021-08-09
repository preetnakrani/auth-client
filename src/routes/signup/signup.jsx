import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Form, Input, Button, Modal } from "antd";
import { SyncOutlined, SmileTwoTone, FrownTwoTone } from "@ant-design/icons";

import api from "../../apis/apis-v1";
import PasswordValidator from "password-validator";

import "./signup.css";

let passwordValidator = new PasswordValidator()
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols();

export const Signup = (props) => {
  const message = (
    <h3>
      You have succesfully signed up! You will receive a confirmation email.
      Once your email is verified, please go to the login page.
      <SmileTwoTone twoToneColor="#52c41a" />
    </h3>
  );
  const [form] = Form.useForm();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(message);
  const history = useHistory();
  const onFinish = (values) => {
    setLoading(true);
    api
      .post("/signup", values)
      .then((res) => {
        console.log(res);
        setErr(message);
        setSignupSuccess(true);
      })
      .catch((err) => {
        setErr(
          <h3>
            Something went wrong, please try again! <FrownTwoTone /> <br></br>
            This is what we think went wrong: {err.response.data.error}
          </h3>
        );
        setSignupSuccess(true);
      });
  };

  return (
    <div className="signup-container">
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 14 }}
        className="signup-form"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item wrapperCol={{ offset: 7 }}>
          <h1>SignUp!</h1>
        </Form.Item>
        <Form.Item
          name={"username"}
          label={"Username"}
          rules={[
            { required: true, message: "Please input a username!" },
            {
              whitespace: true,
              type: "string",
              message: "Username cannot be blank!",
            },
            {
              validator: async (_, value) => {
                if (!value) {
                  return Promise.resolve();
                }
                if (value.split(" ").length > 1) {
                  return Promise.reject(
                    "Username cannot containe whitespaces!"
                  );
                }
                let res = await api.post("/signup/availability/username", {
                  username: value,
                });
                if (res.data.available) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("Username not available!");
                }
              },
            },
          ]}
          hasFeedback
        >
          <Input placeholder={"Username"} autoComplete={"off"} allowClear />
        </Form.Item>
        <Form.Item
          name={"email"}
          label={"Email"}
          rules={[
            { required: true, message: "Please input an email!" },
            { type: "email", message: "Please input a valid email!" },
          ]}
          hasFeedback
        >
          <Input placeholder={"Email"} allowClear />
        </Form.Item>
        <Form.Item
          name={"password"}
          label={"Password"}
          rules={[
            { required: true, message: "Please input a Password!" },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve();
                }
                let valid = passwordValidator.validate(value, { list: true });
                if (valid.length === 0) {
                  return Promise.resolve();
                }
                const messages = {
                  min: "minimum length of 5 characters",
                  max: "maximum length of 100 characters",
                  uppercase: "atleast 1 uppercase character",
                  digits: "atleast 1 digit",
                  lowercase: "atleast 1 lowercase character",
                  symbols: "atleast 1 symbol",
                };

                let errorMessage = valid
                  .map((val) => {
                    return messages[val];
                  })
                  .reduce(
                    (accum, curr, idx) =>
                      `${accum}${curr}${
                        valid.length >= 2 && idx === valid.length - 2
                          ? ` and `
                          : `, `
                      }`,
                    "The password requires: "
                  );
                return Promise.reject(
                  errorMessage.substring(0, errorMessage.length - 2) + "."
                );
              },
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder={"Password"} allowClear />
        </Form.Item>
        <Form.Item
          name={"confirmpassword"}
          label={"Confirm Password"}
          rules={[
            { required: true, message: "Please re-enter Password!" },
            {
              validator: (rule, value) => {
                if (!value) {
                  return Promise.resolve();
                }
                if (form.getFieldError("password").length !== 0) {
                  return Promise.reject(
                    "You have not met the password conditions!"
                  );
                }
                if (form.getFieldValue("password") !== value) {
                  return Promise.reject("The two password don't match!");
                }
                return Promise.resolve();
              },
            },
          ]}
          dependencies={["password"]}
          hasFeedback
        >
          <Input.Password placeholder={"Confirm Password"} allowClear />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 7 }}>
          <Button type="primary" htmlType="submit">
            SignUp
          </Button>
          <Button
            className="signup-resend-button"
            onClick={() => {
              history.push("/resend");
            }}
            style={{
              background: "#52c41a",
              borderColor: "#52c41a",
              color: "white",
            }}
          >
            Resend Link
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="SignUp"
        visible={loading}
        onCancel={() => {
          setLoading(false);
          setSignupSuccess(false);
        }}
        footer={[
          <Button
            onClick={() => {
              setLoading(false);
              setSignupSuccess(false);
            }}
            disabled={!signupSuccess}
            key="1"
          >
            Cancel
          </Button>,
          <Button
            type={"primary"}
            onClick={() => history.push("/login")}
            disabled={!signupSuccess}
            key="2"
          >
            Login
          </Button>,
        ]}
      >
        {signupSuccess ? (
          err
        ) : (
          <SyncOutlined
            className={"spinner"}
            spin={true}
            style={{ fontSize: "30px" }}
          />
        )}
      </Modal>
    </div>
  );
};
