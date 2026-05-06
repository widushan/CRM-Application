import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, MessageSquare, Send, Calendar, User, Briefcase, DollarSign, Activity } from "lucide-react";

const LeadDetail = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const { token, backendUrl } = useAuth();

    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noteContent, setNoteContent] = useState("");
    const [submittingNote, setSubmittingNote] = useState(false);

    const fetchLeadDetail = async () => {
        try {
            const response = await axios.get(backendUrl + `/api/leads/detail/${leadId}`, { headers: { token } });
            if (response.data.success) {
                setLead(response.data.lead);
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

    useEffect(() => {
        fetchLeadDetail();
    }, [leadId]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!noteContent.trim()) return;
        
        setSubmittingNote(true);
        try {
            const response = await axios.post(backendUrl + "/api/notes/add", { leadId, content: noteContent }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                setNoteContent("");
                fetchLeadDetail(); // Refresh notes
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmittingNote(false);
        }
    };

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
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link to="/leads" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Leads
                </Link>
                <Link 
                    to={`/leads/edit/${leadId}`}
                    className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-all shadow-sm"
                >
                    <Edit className="w-4 h-4" />
                    Edit Lead
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Lead Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-indigo-600 px-8 py-8 flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-white">{lead.leadName}</h1>
                                <p className="text-indigo-100 mt-1 text-lg">{lead.companyName}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${getStatusColor(lead.status)}`}>
                                {lead.status}
                            </span>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 rounded-xl">
                                        <Briefcase className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Lead Source</p>
                                        <p className="font-semibold text-slate-800">{lead.leadSource}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 rounded-xl">
                                        <DollarSign className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Deal Value</p>
                                        <p className="font-bold text-slate-800 text-xl">LKR {lead.dealValue.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 rounded-xl">
                                        <User className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Assigned Salesperson</p>
                                        <p className="font-semibold text-slate-800">{lead.assignedTo}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 rounded-xl">
                                        <Calendar className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Created On</p>
                                        <p className="font-semibold text-slate-800">{new Date(lead.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-xl">
                            <MessageSquare className="w-6 h-6 text-indigo-600" />
                            Activity & Notes
                        </div>

                        <form onSubmit={handleAddNote} className="relative">
                            <textarea 
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Add a comment or update after a call..."
                                className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] resize-none pb-12"
                            />
                            <button 
                                type="submit"
                                disabled={submittingNote || !noteContent.trim()}
                                className="absolute right-3 bottom-3 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-slate-300 shadow-md"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="space-y-4">
                            {lead.notes && lead.notes.length > 0 ? (
                                [...lead.notes].reverse().map((note) => (
                                    <div key={note._id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-800">{note.createdBy}</span>
                                            <span className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed">{note.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-400 italic">
                                    No notes added yet. Keep track of your progress here.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Stats or History */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-600" />
                            Pipeline Status
                        </h3>
                        <div className="space-y-4">
                            {["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"].map((s, idx) => (
                                <div key={s} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${lead.status === s ? "bg-indigo-600 ring-4 ring-indigo-100" : "bg-slate-200"}`} />
                                    <span className={`text-sm ${lead.status === s ? "font-bold text-indigo-600" : "text-slate-500"}`}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6">
                        <h3 className="font-bold text-indigo-900 mb-2">Need Help?</h3>
                        <p className="text-indigo-700 text-sm">Update the status as you progress with this lead. Don't forget to log every interaction in the notes section.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;
