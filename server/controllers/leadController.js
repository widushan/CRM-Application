import leadModel from "../models/Lead.js";
import noteModel from "../models/Note.js";

// Add Lead
const addLead = async (req, res) => {
    try {
        const { leadName, companyName, email, phone, leadSource, assignedTo, dealValue } = req.body;

        const newLead = new leadModel({
            leadName,
            companyName,
            email,
            phone,
            leadSource,
            assignedTo,
            dealValue
        });

        await newLead.save();
        res.json({ success: true, message: "Lead Added Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List Leads
const listLeads = async (req, res) => {
    try {
        const leads = await leadModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, leads });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Lead Detail
const getLeadDetail = async (req, res) => {
    try {
        const { leadId } = req.params;
        const lead = await leadModel.findById(leadId).populate("notes");
        
        if (!lead) {
            return res.json({ success: false, message: "Lead not found" });
        }
        
        res.json({ success: true, lead });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Lead Status/Detail
const updateLead = async (req, res) => {
    try {
        const { leadId, leadName, companyName, email, phone, leadSource, assignedTo, status, dealValue } = req.body;
        
        await leadModel.findByIdAndUpdate(leadId, {
            leadName,
            companyName,
            email,
            phone,
            leadSource,
            assignedTo,
            status,
            dealValue
        });

        res.json({ success: true, message: "Lead Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete Lead
const deleteLead = async (req, res) => {
    try {
        const { leadId } = req.body;
        
        // Delete associated notes first
        await noteModel.deleteMany({ leadId });
        
        await leadModel.findByIdAndDelete(leadId);
        res.json({ success: true, message: "Lead Deleted Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addLead, listLeads, getLeadDetail, updateLead, deleteLead };
