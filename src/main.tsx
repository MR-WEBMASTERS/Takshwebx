import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// If you have global CSS (Tailwind or custom)
import "./index.css";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

