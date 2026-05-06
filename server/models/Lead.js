import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    leadName: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    leadSource: { 
        type: String, 
        required: true,
        enum: ["LinkedIn", "Referral", "Website", "Cold Email", "Event"]
    },
    assignedTo: { type: String, required: true },
    status: { 
        type: String, 
        required: true,
        enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"],
        default: "New"
    },
    dealValue: { type: Number, required: true, default: 0 },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "note" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt on save
leadSchema.pre("save", function () {
    this.updatedAt = Date.now();
    return Promise.resolve();
});

const leadModel = mongoose.models.lead || mongoose.model("lead", leadSchema);

export default leadModel;
