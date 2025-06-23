import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

ReactDOM.render(
  <TonConnectUIProvider manifestUrl="https://your-app-url/tonconnect-manifest.json">
    <App />
  </TonConnectUIProvider>,
  document.getElementById("root")
);
