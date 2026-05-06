import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdBy: { type: String, required: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "lead", required: true },
    createdAt: { type: Date, default: Date.now }
});

const noteModel = mongoose.models.note || mongoose.model("note", noteSchema);

export default noteModel;
