import React from "react";
import { Link } from "react-router-dom";
import { Layout, Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function AppHeader() {
  const loggedIn = true;

  return (
    <div>
      <Header className="app-header">
        <div className="app-title">Code Editor</div>
        <div>
          {loggedIn ? (
            <Avatar icon={<UserOutlined />} />
          ) : (
            <Button type="primary">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </Header>
    </div>
  );
}
