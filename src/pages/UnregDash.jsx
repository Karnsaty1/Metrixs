import React, { useEffect, useState } from "react";
import { AuroraBackground } from "../components/ui/aurora-background";
import { postData } from "../api";
import Button from "../components/Button";

export default function Dashboard() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => setFadeIn(true), []);

  const sendMail = async () => {
    try {
      const body = { UPN: localStorage.getItem("UPN") };
      const response = await postData(
        `${import.meta.env.VITE_BASE_URL}/api/email/send-email`,
        body
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const features = [
    { title: "Faster", description: "Experience lightning-fast performance." },
    { title: "Better", description: "Improved UI/UX for better productivity." },
    { title: "Reliable", description: "Stable and dependable platform." },
    { title: "Customizable", description: "Tailor the workspace to your needs." },
  ];

  return (
    <AuroraBackground>
      <div
        className={`transition-opacity duration-500 min-h-screen flex flex-col items-center justify-center p-6 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-8 text-center">
          Welcome to My Fabric 
        </h1>

        <Button onClick={sendMail} className="mb-10 relative z-20">
          Request Access
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-black/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:scale-105 hover:shadow-lg transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold text-black mb-2">
                {feature.title}
              </h2>
              <p className="text-black/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AuroraBackground>
  );
}
