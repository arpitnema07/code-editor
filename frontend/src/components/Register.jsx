import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import axios from "axios";
const { Title } = Typography;

export default function Register() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true); // Set loading state while waiting for response

    try {
      const response = await axios.post(
        "http://localhost:3001/api/register",
        values
      ); // Send POST request to the registration route
      console.log("Registration response:", response.data);

      // Handle the response as needed, e.g., show a success message or redirect to the login page
    } catch (error) {
      console.error("Registration error:", error);
    }

    setLoading(false); // Reset loading state after the request is complete
  };

  return (
    <div className="auth-block">
      <Title level={2}>Register</Title>
      <Form form={form} name="register" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
