import noteModel from "../models/Note.js";
import leadModel from "../models/Lead.js";
import userModel from "../models/User.js";

// Add Note to Lead
const addNote = async (req, res) => {
    try {
        const { leadId, content } = req.body;
        const userId = req.userId;

        // Get user info to store who created the note
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const newNote = new noteModel({
            content,
            createdBy: user.name,
            leadId
        });

        const savedNote = await newNote.save();

        // Add note reference to lead
        await leadModel.findByIdAndUpdate(leadId, {
            $push: { notes: savedNote._id }
        });

        res.json({ success: true, message: "Note Added Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addNote };
