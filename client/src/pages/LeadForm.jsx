import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

const LeadForm = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const { token, backendUrl } = useAuth();

    const [loading, setLoading] = useState(leadId ? true : false);
    const [formData, setFormData] = useState({
        leadName: "",
        companyName: "",
        email: "",
        phone: "",
        leadSource: "LinkedIn",
        assignedTo: "",
        dealValue: "",
        status: "New"
    });

    useEffect(() => {
        if (leadId) {
            fetchLeadData();
        }
    }, [leadId]);

    const fetchLeadData = async () => {
        try {
            const response = await axios.get(backendUrl + `/api/leads/detail/${leadId}`, { headers: { token } });
            if (response.data.success) {
                const { lead } = response.data;
                setFormData({
                    leadName: lead.leadName,
                    companyName: lead.companyName,
                    email: lead.email,
                    phone: lead.phone,
                    leadSource: lead.leadSource,
                    assignedTo: lead.assignedTo,
                    dealValue: lead.dealValue,
                    status: lead.status
                });
            } else {
                toast.error(response.data.message);
                navigate("/leads");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                ...formData,
                dealValue: Number(formData.dealValue) || 0
            };
            const endpoint = leadId ? "/api/leads/update" : "/api/leads/add";
            const payload = leadId ? { ...formattedData, leadId } : formattedData;
            
            const response = await axios.post(backendUrl + endpoint, payload, { headers: { token } });
            
            if (response.data.success) {
                toast.success(response.data.message);
                navigate(leadId ? `/leads/${leadId}` : "/leads");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this lead?")) return;
        try {
            const response = await axios.post(backendUrl + "/api/leads/delete", { leadId }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/leads");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
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
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link to={leadId ? `/leads/${leadId}` : "/leads"} className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5" />
                    Back to {leadId ? "Detail" : "Leads"}
                </Link>
                {leadId && (
                    <button 
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all font-medium"
                    >
                        <Trash2 className="w-5 h-5" />
                        Delete Lead
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-indigo-600 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">{leadId ? "Edit Lead" : "Add New Lead"}</h1>
                    <p className="text-indigo-100 mt-1">Provide the details of your potential customer</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Primary Info</h3>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Lead Name</label>
                                <input 
                                    type="text" 
                                    name="leadName"
                                    value={formData.leadName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. John Silva"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Company Name</label>
                                <input 
                                    type="text" 
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. TechCorp"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="john@techcorp.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="+1 234 567 890"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Sales Info</h3>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Assigned Salesperson</label>
                                <input 
                                    type="text" 
                                    name="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Sarah"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Lead Source</label>
                                <select 
                                    name="leadSource"
                                    value={formData.leadSource}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                >
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Website">Website</option>
                                    <option value="Cold Email">Cold Email</option>
                                    <option value="Event">Event</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Deal Value (LKR)</label>
                                <input 
                                    type="number" 
                                    name="dealValue"
                                    value={formData.dealValue}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="5000"
                                    required
                                />
                            </div>
                            {leadId && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Current Status</label>
                                    <select 
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-bold"
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Proposal Sent">Proposal Sent</option>
                                        <option value="Won">Won</option>
                                        <option value="Lost">Lost</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                    >
                        <Save className="w-6 h-6" />
                        {leadId ? "Save Changes" : "Create Lead"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LeadForm;
