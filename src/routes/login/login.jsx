import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Form, Input, Button } from "antd";

import api from "../../apis/apis-v1";
import { setAccessToken } from "../../auth";

import "./login.css";

export const Login = (props) => {
  const [form] = Form.useForm();
  const [invalid, setInvalid] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const onValuesChange = () => {
    setInvalid("");
  };
  const onFinish = (values) => {
    api
      .post("/login", values)
      .then((res) => {
        setAccessToken(res.data.accessToken);
        props.setAuth(true);
        setError(res.data.message);
        setInvalid("success");
        setTimeout(() => {
          history.push("/");
        }, 1000);
      })
      .catch((err) => {
        setInvalid("error");
        setError(err.response.data.error);
      });
  };

  return (
    <div className="login-container">
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 14 }}
        className="logout-form"
        form={form}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Form.Item wrapperCol={{ offset: 7 }}>
          <h1>Login!</h1>
        </Form.Item>
        <Form.Item
          name={"username"}
          label={"Username"}
          rules={[{ required: true, message: "Username is required!" }]}
          validateStatus={invalid}
          hasFeedback
        >
          <Input placeholder={"Username"} allowClear />
        </Form.Item>
        <Form.Item
          name={"password"}
          label={"Password"}
          rules={[{ required: true, message: "Password is required!" }]}
          validateStatus={invalid}
          hasFeedback
        >
          <Input.Password placeholder={"Password"} allowClear />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 7 }}>
          <h4>{error}</h4>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 7 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
          <Button
            className="login-forgot-button"
            onClick={() => {
              history.push("/forgot");
            }}
            style={{
              background: "#52c41a",
              borderColor: "#52c41a",
              color: "white",
            }}
          >
            Forgot Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
