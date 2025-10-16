import { useEffect, useState } from "react";
import { postData } from "../api";
import { AuroraBackground } from "../components/ui/aurora-background";
import { useNavigate } from "react-router-dom";

const InternalLogin = () => {
    const [clientId, setClientId] = useState("");
    const [secret, setSecret] = useState("");
    const [tenantId, setTenantId] = useState("");
    const [fadeIn, setFadeIn] = useState(false);
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const payload = { clientId, secret, tenantId };
            localStorage.setItem('clientId', clientId);
            localStorage.setItem('tenantId', tenantId);
            const response = await postData(`${import.meta.env.VITE_BASE_URL}/unreg/${clientId}/customLogin`, payload);
            console.log(response.data);

            if (response.data.token) {
                sessionStorage.setItem("token", response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Login failed:", err);
        }   
    };

    useEffect(() => {
        setFadeIn(true);
    }, []);

    return (
        <AuroraBackground>
            <div className={`${fadeIn ? "opacity-100" : "opacity-0"} duration-500 transition-all min-h-screen w-[45%] flex items-center justify-center font-sans`}>
                <form
                    onSubmit={handleSubmit}
                    className="p-10 rounded-3xl w-full flex flex-col gap-6 relative"
                >
                    <div className="text-center mb-2">
                        <div className="text-4xl font-extrabold text-indigo-500 tracking-wide mb-2">
                            Login
                        </div>
                        <div className="text-gray-500 text-base">
                            Please login to your account
                        </div>
                    </div>
                    <div>
                        <label className="font-bold text-gray-800 mb-2 block">
                            Client ID
                        </label>
                        <input
                            type="text"
                            required
                            value={clientId}
                            onChange={e => setClientId(e.target.value)}
                            placeholder="Enter your Client ID"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-base transition"
                        />
                    </div>
                    <div>
                        <label className="font-bold text-gray-800 mb-2 block">
                            Client Secret
                        </label>
                        <input
                            type="password"
                            required
                            value={secret}
                            onChange={e => setSecret(e.target.value)}
                            placeholder="Enter your Secret"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-base transition"
                        />
                    </div>
                    <div>
                        <label className="font-bold text-gray-800 mb-2 block">
                            Tenant ID
                        </label>
                        <input
                            type="text"
                            required
                            value={tenantId}
                            onChange={e => setTenantId(e.target.value)}
                            placeholder="Enter your Tenant ID"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-base transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 transition-all duration-500 ease-in-out rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-black font-bold text-lg shadow-md hover:scale-105 hover:shadow-lg"
                    >
                        Login
                    </button>
                    <div className="text-center text-gray-400 text-sm mt-2">
                        Forgot your credentials? <a href="#" className="text-indigo-500 hover:underline">Reset</a>
                    </div>
                </form>
            </div>
        </AuroraBackground>
    );
};

export default InternalLogin;
