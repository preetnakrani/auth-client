import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Form, Input, Button, Modal } from "antd";
import { SyncOutlined, SmileTwoTone, FrownTwoTone } from "@ant-design/icons";

import api from "../../apis/apis-v1";

import "./resend.css";

export const Resend = (props) => {
  const compleTionMessage = (
    <h3>
      If you have an account, you will receive an email to verify that its you.
      <SmileTwoTone twoToneColor="#52c41a" />
    </h3>
  );
  const [form] = Form.useForm();
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(compleTionMessage);
  const onFinish = (values) => {
    setModalOpen(true);
    setLoading(true);
    api
      .post("/test", values)
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setMessage(
          <h3>
            Something went wrong, please try again! <FrownTwoTone /> <br></br>
            This is what we think went wrong: {err.response.data.error}
          </h3>
        );
        setLoading(false);
      });
  };

  return (
    <div className="resend-container">
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 14 }}
        className="resend-form"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item wrapperCol={{ offset: 7 }}>
          <h1>Resend Verification Email!</h1>
        </Form.Item>
        <Form.Item
          name={"username"}
          label={"Username"}
          rules={[{ required: true, message: "Username is required!" }]}
        >
          <Input placeholder={"Username"} allowClear />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 7 }}>
          <Button type="primary" htmlType="submit">
            Get Verification Email
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Resend Verification Link"
        visible={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setLoading(false);
        }}
        footer={[
          <Button
            onClick={() => {
              setModalOpen(false);
              setLoading(false);
            }}
            disabled={loading}
            key="1"
          >
            Cancel
          </Button>,
          <Button
            type={"primary"}
            onClick={() => history.push("/login")}
            disabled={loading}
            key="2"
          >
            Login
          </Button>,
        ]}
      >
        {loading ? (
          <SyncOutlined
            className={"spinner"}
            spin={true}
            style={{ fontSize: "30px" }}
          />
        ) : (
          message
        )}
      </Modal>
    </div>
  );
};
