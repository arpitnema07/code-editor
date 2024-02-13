import React from "react";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className="homepage">
      <div className="video-background">
        <video autoPlay loop muted playsInline className="video">
          <source
            src="/path-to-your-video/coding-background.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="h-content">
        <div className="centered-content">
          <h1>Welcome to Code Hub</h1>
          <p>Your one-stop destination for coding tutorials and practice.</p>
          <button className="try-now-button">
            <Link to="/editor">Try Now!</Link>
          </button>
          <div className="code-editor-text">
            <p>Enhance your coding skills with our interactive code editor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
