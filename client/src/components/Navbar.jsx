import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, PlusCircle, LogOut } from "lucide-react";
import logo from "../assets/leadly.png";

const Navbar = () => {
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();

    if (!token) return null;

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="Leadly Logo" className="h-20 w-auto" />
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium">
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link to="/leads" className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium">
                            <Users className="w-5 h-5" />
                            Leads
                        </Link>
                        <Link to="/leads/add" className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium">
                            <PlusCircle className="w-5 h-5" />
                            Add Lead
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Logout"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
