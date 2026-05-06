import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const Login = () => {
    const [state, setState] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const { setToken, setUser, backendUrl } = useAuth();
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const endpoint = state === "Login" ? "/api/auth/login" : "/api/auth/register";
            const data = state === "Login" ? { email, password } : { name, email, password };
            
            const response = await axios.post(backendUrl + endpoint, data);
            
            if (response.data.success) {
                setToken(response.data.token);
                setUser(response.data.user);
                toast.success(state === "Login" ? "Welcome back!" : "Account created!");
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <form onSubmit={onSubmitHandler} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-indigo-100 rounded-full mb-4">
                        <LogIn className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">{state}</h2>
                    <p className="text-slate-500 mt-2">Manage your leads effectively</p>
                </div>

                <div className="space-y-4">
                    {state === "Sign Up" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                placeholder="John Doe"
                                required 
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                            placeholder="name@company.com"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold mt-8 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    {state === "Login" ? "Sign In" : "Create Account"}
                </button>

                <p className="text-center text-slate-600 mt-6">
                    {state === "Login" ? "New here?" : "Already have an account?"}
                    <button 
                        type="button"
                        onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}
                        className="text-indigo-600 font-semibold ml-2 hover:underline"
                    >
                        {state === "Login" ? "Create an account" : "Sign in instead"}
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;
