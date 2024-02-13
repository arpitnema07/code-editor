import React from "react";
import "./App.css"; // Import Ant Design components
import "./styles/antd.css"; // Import the Ant Design CSS file
import { Layout } from "antd";

import {
  AppHeader,
  AppFooter,
  EditorLayout,
  Home,
  Login,
  Register,
} from "./components";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Layout className="layout">
      <AppHeader />
      <div>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          {/* <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/register" element={<Register />}></Route> */}
          <Route exact path="/editor" element={<EditorLayout />}></Route>
        </Routes>
      </div>
      <AppFooter />
    </Layout>
  );
}

export default App;
