import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { TrendingUp, Users, DollarSign, CheckCircle, ArrowUpRight, ArrowRight, BarChart3, PlusCircle, Calendar } from "lucide-react";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token, backendUrl, user } = useAuth();

    const fetchStats = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/dashboard/stats", { headers: { token } });
            if (response.data.success) {
                setStats(response.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [token]);

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const cards = [
        { 
            title: "Total Leads", 
            value: stats.totalLeads, 
            icon: Users, 
            color: "bg-blue-600",
            light: "bg-blue-50",
            text: "text-blue-600"
        },
        { 
            title: "Total Pipeline", 
            value: `LKR ${stats.totalDealValue.toLocaleString()}`, 
            icon: DollarSign, 
            color: "bg-indigo-600",
            light: "bg-indigo-50",
            text: "text-indigo-600"
        },
        { 
            title: "Closed Won", 
            value: `LKR ${stats.wonDealValue.toLocaleString()}`, 
            icon: CheckCircle, 
            color: "bg-emerald-600",
            light: "bg-emerald-50",
            text: "text-emerald-600"
        },
        { 
            title: "Conversion Rate", 
            value: stats.totalLeads > 0 ? `${Math.round((stats.statusCounts.Won / stats.totalLeads) * 100)}%` : "0%", 
            icon: TrendingUp, 
            color: "bg-purple-600",
            light: "bg-purple-50",
            text: "text-purple-600"
        }
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name}!</h1>
                    <p className="text-slate-500">Here's what's happening with your sales pipeline today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/leads/add" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
                        <ArrowUpRight className="w-5 h-5" />
                        New Opportunity
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.light}`}>
                                <card.icon className={`w-6 h-6 ${card.text}`} />
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">{card.title}</p>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">{card.value}</h2>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pipeline Funnel */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                            Pipeline Distribution
                        </h3>
                        <Link to="/leads" className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(stats.statusCounts).map(([status, count]) => {
                            const percentage = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
                            return (
                                <div key={status} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-700">{status}</span>
                                        <span className="text-xs font-semibold text-slate-500">{count} leads ({Math.round(percentage)}%)</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                status === "Won" ? "bg-emerald-500" : 
                                                status === "Lost" ? "bg-rose-500" : 
                                                status === "New" ? "bg-blue-500" : "bg-indigo-500"
                                            }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Tasks / Follow-ups */}
                <div className="space-y-6 flex flex-col justify-between">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-indigo-600" />
                            Upcoming Follow-ups
                        </h3>
                        <div className="space-y-4">
                            {stats.upcomingFollowUps && stats.upcomingFollowUps.length > 0 ? (
                                stats.upcomingFollowUps.map((lead) => (
                                    <Link 
                                        key={lead._id} 
                                        to={`/leads/${lead._id}`}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                {lead.leadName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{lead.leadName}</p>
                                                <p className="text-xs text-slate-500">{lead.companyName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-indigo-600">
                                                {new Date(lead.nextFollowUp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </p>
                                            <p className="text-[10px] text-slate-400">Scheduled</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="p-4 bg-slate-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 italic text-sm">All caught up! No follow-ups scheduled.</p>
                                    <Link to="/leads" className="text-indigo-600 text-xs font-bold hover:underline mt-2 inline-block">Schedule one now</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/leads/add" className="flex flex-col items-center justify-center p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group">
                            <PlusCircle className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold">Add Lead</span>
                        </Link>
                        <Link to="/leads" className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all group">
                            <Users className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-indigo-600" />
                            <span className="text-xs font-bold">All Leads</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
