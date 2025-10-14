import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import axios from "axios";

export default function InternalDashboard() {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (accounts.length === 0) return;

    const sendApi = async () => {
      try {
        // Acquire token silently
        const responseToken = await instance.acquireTokenSilent({
          scopes: ["User.Read"],
          account: accounts[0],
        });

        const token = responseToken.accessToken;

        const response = await axios.post(
          "http://localhost:5000/api/fabric-data",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    sendApi();
  }, [accounts, instance]);

  const handleLogin = () => {
    instance.loginPopup({ scopes: ["User.Read"] }).catch(console.error);
  };

  if (accounts.length === 0) {
    return <button onClick={handleLogin}>Login</button>;
  }

  return <div>Welcome to the internal dashboard</div>;
}
