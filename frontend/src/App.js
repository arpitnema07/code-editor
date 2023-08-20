import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import { Button, Card, Layout, Typography, Select, Row, Col } from "antd"; // Import Ant Design components
import "./styles/antd.css"; // Import the Ant Design CSS file
import axios from "axios";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Option } = Select;

const defaultValues = {
  javascript: "// Welcome to the JavaScript code editor",
  java: "// Welcome to the Java code editor \nclass Solution{\n\tpublic static void main(String[] args){\n\t\t//Code Here\n\t}\n}",
  c: "// Welcome to the C code editor",
  cpp: "// Welcome to the C++ code editor",
  python: "# Welcome to the Python code editor",
  php: "<?php\n// Welcome to the PHP code editor\n\techo 'Hello, World!';\n?>",
};

const supportedLanguages = [
  { id: "javascript", label: "JavaScript" },
  { id: "java", label: "Java" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
  { id: "python", label: "Python" },
  { id: "php", label: "PHP" },
];

function App() {
  const [output, setOutput] = useState(""); // State to store the output text
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [editorValue, setEditorValue] = useState(""); // State to manage editor value
  const editorRef = useRef(null); // Ref to hold the Monaco Editor instance
  let route = "";

  useEffect(() => {
    if (editorRef.current && editorRef.current.editor) {
      console.log(selectedLanguage);
      editorRef.current.editor.setModelLanguage(
        editorRef.current.editor.getModel(),
        selectedLanguage
      );
    }
  }, [selectedLanguage]);

  useEffect(() => {
    // Update the editor value when selected language changes
    setEditorValue(defaultValues[selectedLanguage]);
  }, [selectedLanguage]);

  const handleRunCode = async () => {
    // This is just a placeholder for running the code and updating the output
    // You would implement the actual logic to run the code here
    const code = editorRef.current.getValue();
    try {
      const response = await axios.post(
        `http://localhost:3001/execute/${selectedLanguage}`,
        {
          code,
          language: selectedLanguage,
        }
      );
      if (response.data.output) setOutput(response.data.output);
      else setOutput(response.data.error);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  return (
    <Layout className="layout">
      <Header>
        <Title className="app-title" level={2}>
          Code Editor
        </Title>
      </Header>
      <Select
        defaultValue={selectedLanguage}
        style={{ width: 120 }}
        onChange={handleLanguageChange}
      >
        {supportedLanguages.map((language) => (
          <Option key={language.id} value={language.id}>
            {language.label}
          </Option>
        ))}
      </Select>
      <Content className="content">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className="editor-container">
              <Editor
                height="70vh"
                language={selectedLanguage}
                value={editorValue}
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
              />
              <Button
                className="submit-button"
                type="primary"
                onClick={handleRunCode}
              >
                Run Code
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <Card className="output-card">
              <h2>Output</h2>
              <pre>{output}</pre>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer className="footer">
        © {new Date().getFullYear()} Code Editor Inc.
      </Footer>
    </Layout>
  );
}

export default App;
