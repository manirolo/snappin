import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/chrome-extension";
import { extensionEnv } from "@snappin/env/extension";
import "./style.css";

const PUBLISHABLE_KEY = extensionEnv.clerk.publishableKey;
const EXTENSION_URL = chrome.runtime.getURL('.')

if (!PUBLISHABLE_KEY) {
  throw new Error('Please add the WXT_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env.development file')
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl={`${EXTENSION_URL}/popup.html`}
      signInFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
      signUpFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
      routerPush={(to) => chrome.tabs.create({ url: to })}
      routerReplace={(to) => chrome.tabs.update({ url: to })}
      syncHost={extensionEnv.app.appUrl}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
