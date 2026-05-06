import leadModel from "../models/Lead.js";

// Get Dashboard Stats
const getStats = async (req, res) => {
    try {
        const userId = req.userId;

        const stats = await leadModel.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$dealValue" }
                }
            }
        ]);

        const totalLeads = await leadModel.countDocuments({ userId });
        
        // Sum of all deal values
        const totalDealValueData = await leadModel.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: "$dealValue" } } }
        ]);
        const totalDealValue = totalDealValueData.length > 0 ? totalDealValueData[0].total : 0;

        // Sum of won deals
        const wonDealValueData = await leadModel.aggregate([
            { $match: { status: "Won", userId } },
            { $group: { _id: null, total: { $sum: "$dealValue" } } }
        ]);
        const wonDealValue = wonDealValueData.length > 0 ? wonDealValueData[0].total : 0;

        // Group by status counts
        const statusCounts = {
            New: 0,
            Contacted: 0,
            Qualified: 0,
            "Proposal Sent": 0,
            Won: 0,
            Lost: 0
        };

        stats.forEach(item => {
            if (statusCounts.hasOwnProperty(item._id)) {
                statusCounts[item._id] = item.count;
            }
        });

        // Group by source counts
        const sourceStats = await leadModel.aggregate([
            { $match: { userId } },
            { $group: { _id: "$leadSource", count: { $sum: 1 } } }
        ]);

        const sourceCounts = {
            LinkedIn: 0,
            Referral: 0,
            Website: 0,
            "Cold Email": 0,
            Event: 0
        };

        sourceStats.forEach(item => {
            if (sourceCounts.hasOwnProperty(item._id)) {
                sourceCounts[item._id] = item.count;
            }
        });

        // Get upcoming follow-ups (next 7 days)
        const upcomingFollowUps = await leadModel.find({
            userId,
            nextFollowUp: { $exists: true, $ne: null }
        }).sort({ nextFollowUp: 1 }).limit(5);

        res.json({
            success: true,
            totalLeads,
            totalDealValue,
            wonDealValue,
            statusCounts,
            sourceCounts,
            upcomingFollowUps
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getStats };
