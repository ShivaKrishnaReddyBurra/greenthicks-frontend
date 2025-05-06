import React from "react";
import "./login.css"; // Apply login.css specifically for the login page

export default function LoginLayout({ children }) {
  return (
    <div className="login-page">
      {children}
    </div>
  );
}