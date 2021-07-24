import React, { useState } from "react";
import { Form, Button, Input } from "antd";

const Signup = (props) => {
  const [form] = Form.useForm();
  const submit = (values) => {
    console.log(values);
  };

  return <div className="singup-container"></div>;
};

export { Signup };
