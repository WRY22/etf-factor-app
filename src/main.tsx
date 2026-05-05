// ============================================================
// main.tsx
// React 應用程式入口點
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "[main.tsx] 找不到 #root 元素，請確認 index.html 中存在 <div id=\"root\"></div>"
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
