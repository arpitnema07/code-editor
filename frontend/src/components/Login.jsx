import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
const { Title, Text } = Typography;
export default function Login() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true); // Set loading state while waiting for response

    try {
      const response = await axios.post(
        "http://localhost:3001/api/login",
        values
      ); // Send POST request to the login route
      console.log("Login response:", response.data);
    } catch (error) {
      console.error("Login error:", error.data.response);
    }

    setLoading(false); // Reset loading state after the request is complete
  };
  return (
    <div className="auth-block">
      <Title level={2}>Login</Title>
      <Form form={form} name="login" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
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
            Login
          </Button>
          <Text>
            <Link to="/register">Register?</Link>
          </Text>
        </Form.Item>
      </Form>
    </div>
  );
}
