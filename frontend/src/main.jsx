
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />

      <Toaster
        position="top-center"
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#172033",
            padding: "16px 20px",
            borderRadius: "14px",
            border: "1px solid #e8ebf3",
            boxShadow: "0 10px 35px rgba(15, 23, 42, 0.12)",
            fontSize: "14px",
            fontWeight: "600",
            maxWidth: "380px",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
