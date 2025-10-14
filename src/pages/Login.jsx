// Login.jsx
import { useMsal } from "@azure/msal-react";
import axios from "axios";
/* eslint-disable react-refresh/only-export-components */

export const triggerMsalLogin = async (instance) => {
  try {
    const loginResponse = await instance.loginPopup({
      scopes: ["openid", "profile", "email"]
    });

    const idToken = loginResponse.idToken;
    const res = await axios.post(`${import.meta.env.VITE_AZURE_BASE}/api/auth/microsoft`, { idToken });
    return res.data.appToken;
  } catch (err) {
    console.error("MSAL login failed", err);
  }
};

export default function LoginButton({ onLogin }) {
  const { instance } = useMsal();

  const handleLogin = async () => {
    const appToken = await triggerMsalLogin(instance);
    if (onLogin) onLogin(appToken);
  };

  return <button onClick={handleLogin}>Login with Microsoft</button>;
}
