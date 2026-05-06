import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Search, Filter, Plus, ChevronRight, Mail, Phone, Building2 } from "lucide-react";

const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    
    const { token, backendUrl } = useAuth();

    const fetchLeads = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/leads/list", { headers: { token } });
            if (response.data.success) {
                setLeads(response.data.leads);
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
        fetchLeads();
    }, [token]);

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.leadName.toLowerCase().includes(search.toLowerCase()) || 
                             lead.companyName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "New": return "bg-blue-100 text-blue-700";
            case "Contacted": return "bg-amber-100 text-amber-700";
            case "Qualified": return "bg-purple-100 text-purple-700";
            case "Proposal Sent": return "bg-indigo-100 text-indigo-700";
            case "Won": return "bg-emerald-100 text-emerald-700";
            case "Lost": return "bg-rose-100 text-rose-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Leads</h1>
                    <p className="text-slate-500">Track and manage your potential customers</p>
                </div>
                <Link 
                    to="/leads/add" 
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus className="w-5 h-5" />
                    Add New Lead
                </Link>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search by name or company..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Filter className="text-slate-400 w-5 h-5" />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Lead Info</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Company</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Value</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Assigned To</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                                <tr key={lead._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-800">{lead.leadName}</div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Mail className="w-3 h-3" />
                                                {lead.email}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Phone className="w-3 h-3" />
                                                {lead.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Building2 className="w-4 h-4" />
                                            {lead.companyName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-700">
                                        LKR {lead.dealValue.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {lead.assignedTo}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            to={`/leads/${lead._id}`}
                                            className="inline-flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                                        >
                                            View Details
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        No leads found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeadList;
