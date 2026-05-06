import leadModel from "../models/Lead.js";
import noteModel from "../models/Note.js";

// Add Lead
const addLead = async (req, res) => {
    try {
        const { leadName, companyName, email, phone, leadSource, assignedTo, dealValue, nextFollowUp } = req.body;

        const newLead = new leadModel({
            leadName,
            companyName,
            email,
            phone,
            leadSource,
            assignedTo,
            dealValue,
            nextFollowUp,
            userId: req.userId
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
        const leads = await leadModel.find({ userId: req.userId }).sort({ createdAt: -1 });
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
        const lead = await leadModel.findOne({ _id: leadId, userId: req.userId }).populate("notes");
        
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
        const { leadId, leadName, companyName, email, phone, leadSource, assignedTo, status, dealValue, nextFollowUp } = req.body;
        const userId = req.userId;
        
        await leadModel.findOneAndUpdate({ _id: leadId, userId }, {
            leadName,
            companyName,
            email,
            phone,
            leadSource,
            assignedTo,
            status,
            dealValue,
            nextFollowUp
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
        const userId = req.userId;
        
        // Delete associated notes first
        await noteModel.deleteMany({ leadId });
        
        await leadModel.findOneAndDelete({ _id: leadId, userId });
        res.json({ success: true, message: "Lead Deleted Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addLead, listLeads, getLeadDetail, updateLead, deleteLead };
