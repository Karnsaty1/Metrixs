import { PublicClientApplication } from "@azure/msal-browser";



export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/common`,
    redirectUri: "http://localhost:5173"
  },
  cache: {
    cacheLocation: "sessionStorage", 
    storeAuthStateInCookie: false 
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);
