import { useEffect, useState } from "react";
import { MdElectricBolt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuroraBackground } from "../components/ui/aurora-background";
import { useMsal } from "@azure/msal-react";
import {  getData, postData } from "../api";

function Home() {
  const [loading, setLoading] = useState(true);
  const [videoFade, setVideoFade] = useState(false);
  const [contentFade, setContentFade] = useState(false);
  const navigate = useNavigate();
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup({ scopes: ["User.Read"] });
      instance.setActiveAccount(loginResponse.account);

      const accessToken=await instance.acquireTokenSilent({
        scopes: ["User.Read"],
        account:instance.getActiveAccount()
      });


      const body={idToken:loginResponse.idToken};
      const body2={accessToken:accessToken.accessToken};
      if (instance.getAllAccounts().length > 0) {
        const response2=await postData(`${import.meta.env.VITE_BASE_URL}/api/auth/UPN`,body2);
        const response=await postData(`${import.meta.env.VITE_BASE_URL}/api/auth/microsoft`,body);
        console.log(response2.data.UPN.UPN);
        localStorage.setItem("UPN",response2.data.UPN.UPN);
        console.log(response2.data.exist);
        const isExisting=response2.data.exist
        console.log(response.data);
        if(!isExisting)
        navigate("/dashboard"); // only redirect on success  
        else navigate("/undashboard");    
      }
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoFade(true);
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setContentFade(true), 50);
      }, 1000);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <div
      className={`min-h-screen flex items-center justify-center transition-opacity duration-1000 ${
        videoFade ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        src="/mainloader.mp4"
        autoPlay
        loop={false}
        muted
        playsInline
        className="w-100 h-100 object-contain"
        style={{ filter: "invert(1) brightness(2)" }}
        onEnded={() => {
          setVideoFade(true);
          setTimeout(() => {
            setLoading(false);
            setTimeout(() => setContentFade(true), 50);
          }, 1000);
        }}
      />
    </div>
  ) : (
    <AuroraBackground>
      <div
        className={`transition-opacity duration-1000 min-h-screen flex items-center justify-center p-4 relative ${
          contentFade ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="p-8 md:p-12 flex flex-col items-center text-center animate-fade-in">
          <MdElectricBolt className="w-12 h-12 text-blue-700" />
          <h1 className="text-4xl md:text-6xl font-bold text-grey-900 mb-6 leading-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              Metrixs
            </span>
          </h1>
          <p className="text-lg md:text-xl text-grey-600 mb-10 leading-relaxed max-w-lg">
            Discover a modern, beautiful, and responsive platform built with industry standards.
          </p>
          <button
            onClick={handleLogin}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 transition-all duration-300 ease-out min-w-[200px]"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </AuroraBackground>
  );
}

export default Home;
