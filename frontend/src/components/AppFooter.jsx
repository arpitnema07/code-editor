import React from "react";

import { Layout } from "antd"; // Import Ant Design components
const { Footer } = Layout;

export default function AppFooter() {
  return (
    <div>
      <Footer className="footer">
        © {new Date().getFullYear()} Code Editor Inc.
      </Footer>
    </div>
  );
}
