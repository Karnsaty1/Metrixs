import { useEffect, useState } from "react";
import { postData } from "../api";
import { AuroraBackground } from "../components/ui/aurora-background";
import { useNavigate } from "react-router-dom";
const MainLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [fadeIn, setFadeIn] = useState(false);
    const navigate=useNavigate();

    const handleSubmit = async(e) => {
       try {
        e.preventDefault();
      const payload = { email, password, name };
      localStorage.setItem('name',name);
      localStorage.setItem('email',email);
      const response = await postData("/api/auth/login", payload);
      console.log(response.data);

      console.log("Decrypted response:", response.data.token);

      if (response.data.token) {
        sessionStorage.setItem("JWT_Token", response.data.token);
        navigate('/dashboard');
        
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
       
    };

    useEffect(() => {
        setFadeIn(true);    
    }, [])

    return (
        <AuroraBackground>
        <div className={`${fadeIn ? "opacity-100" : "opacity-0"} duration-500 transition-all min-h-screen w-[45%] flex items-center justify-center  font-sans`}>
            <form
                onSubmit={handleSubmit}
                className=" p-10 rounded-3xl  w-full flex flex-col gap-6 relative"
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
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-base transition"
                    />
                </div>
                <div>
                    <label className="font-bold text-gray-800 mb-2 block">
                        Password
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-base transition"
                    />
                </div>
                <div>
                    <label className="font-bold text-gray-800 mb-2 block">
                        UserName
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-base transition"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 transition-all duration-500 ease-in-out rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
                    onClick={handleSubmit}
                >
                    Login
                </button>
                <div className="text-center text-gray-400 text-sm mt-2">
                    Forgot your password? <a href="#" className="text-indigo-500 hover:underline">Reset</a>
                </div>
            </form>
        </div>
        </AuroraBackground>
    );
};

export default MainLogin;
